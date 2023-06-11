import Player from "./Player.js";
import { Chess } from "chess.js";
import { pieceValues, squareValues } from "./Values.js"

let evaluationsMade = 0;

export default class DevinAI extends Player {
  constructor() {
    super("Devin AI");
  }

  /*
  * @param {Chess} chess - The Chess instance to execute the move on
  * @returns {Chess} - The Chess instance after the move has been executed
  */
  executeMove = (chess) => {
    evaluationsMade = 0;
    const colour = chess.turn();
    
    let startTime = Date.now();
    let result = minimax(chess.fen(), colour, 4, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    let endTime = Date.now();

    console.log(`Best move: ${result[0].san} with score ${result[1]} (time taken: ${(endTime - startTime)/1000} seconds})`);

    chess.move(result[0]);

    console.log(`Evaluations made: ${evaluationsMade}`)
    return chess;
  }
}

/*
* @param {string} fen - The FEN string of the Chess board to evaluate
* @param {string} colour - The colour to evaluate for
* @param {number} depth - The depth to evaluate to
* @param {number} alpha - The alpha value for alpha-beta pruning
* @param {number} beta - The beta value for alpha-beta pruning
* @returns {array} - [bestMove, bestScore]
*/
function minimax(fen, colour, depth, alpha, beta) {
  const chess = new Chess(fen);
  if (depth === 0 || chess.isGameOver()) {
    return [null, evaluateFen(fen)];
  }

  // Get all possible moves reordered (to improve performance for alpha-beta pruning)
  let possibleMoves = getOrderedPossibleMoves(fen);

  if (colour === "w") {
    // White is the maximising player
    let maxMove = null;
    let maxScore = Number.NEGATIVE_INFINITY;
    for (let idx in possibleMoves) {
      let newChess = new Chess(chess.fen());
      newChess.move(possibleMoves[idx]);

      let result = minimax(newChess.fen(), "b", depth - 1, alpha, beta);
      let score = result[1];
      if (score > maxScore) {
        maxMove = possibleMoves[idx];
        maxScore = score;
      }

      // Apply alpha-beta pruning
      alpha = Math.max(alpha, score);
      if (beta <= alpha) {
        break;
      }
    }
    return [maxMove, maxScore];
  } else if (colour === "b") {
    // Black is the minimising player
    let minMove = null;
    let minScore = Number.POSITIVE_INFINITY;
    for (let idx in possibleMoves) {
      let newChess = new Chess(chess.fen());
      newChess.move(possibleMoves[idx]);

      let result = minimax(newChess.fen(), "w", depth - 1, alpha, beta);
      let score = result[1];
      if (score < minScore) {
        minMove = possibleMoves[idx];
        minScore = score;
      }

      // Apply alpha-beta pruning
      beta = Math.min(beta, score);
      if (beta <= alpha) {
        break;
      }
    }
    return [minMove, minScore];
  } else {
    throw new Error("Invalid colour");
  }
}


/*
* @param {string} fen - The FEN string of the Chess board to evaluate
* @returns {array} - The reordered moves
*/
function getOrderedPossibleMoves(fen) {
  const chess = new Chess(fen);

  let moves = chess.moves({ verbose: true });
  
  let goodTakes = [];
  let promotionMoves = [];
  let equalTakes = [];
  let otherMoves = [];
  let badTakes = [];

  const pieceOrderings = ["p", "nb", "r", "q"];

  for (let idx in moves) {
    let move = moves[idx];

    if (move.flags.includes("p")) {
      // Move is a promotion
      promotionMoves.push(move);
    } else if (move.flags.includes("c")) {
      // Move is a capture
      const movePieceIndex = pieceOrderings.findIndex(item => item.includes(move.piece));
      const takePieceIndex = pieceOrderings.findIndex(item => item.includes(move.captured));

      if (movePieceIndex < takePieceIndex) {
        // Move is a good take
        goodTakes.push(move);
      } else if (movePieceIndex === takePieceIndex) {
        // Move is an equal take
        equalTakes.push(move);
      } else {
        // Move is a bad take
        badTakes.push(move);
      }
    } else {
      // Move is neither a check nor a take
      otherMoves.push(move);
    }
  }
  
  // Recombine lists
  moves = goodTakes.concat(promotionMoves, equalTakes, otherMoves, badTakes);
  
  return moves;
}

/*
* @param {string} fen - The FEN string of the Chess board to evaluate
* @returns {number} - The evaluation of the FEN string (White's value vs Black's value)
*/
function evaluateFen(fen) {
  evaluationsMade += 1;
  const chess = new Chess(fen);
  const board = chess.board();

  // Check for checkmate
  if (chess.isCheckmate()) {
    if (chess.turn() === "w") {
      // Black wins
      return -99999999;
    } else {
      // White wins
      return 99999999;
    }
  }
  // Check for draw
  if (chess.isDraw()) {
    return 0;
  }

  // Evaluate White's position
  let whiteScore = evaluateColour(board, "w");

  // Board flipped is the board from Black's perspective
  const boardFlipped = [];
  for (let i = board.length - 1; i >= 0; i--) {
    boardFlipped.push(board[i]);
  }

  // Evaluate Black's position
  let blackScore = evaluateColour(boardFlipped, "b");

  // Give points if one side checks the other side
  const checkScore = 10;
  if (chess.inCheck()) {
    if (chess.turn() === "w") {
      blackScore += checkScore;
    } else {
      whiteScore += checkScore;
    }
  }

  return whiteScore - blackScore;
}

/*
* @param {array} board - The board as returned by chess.board() (and possibly flipped)
* @param {str} colour - "w" or "b"
* @returns {number} - The evaluation of one side
*/
function evaluateColour(board, colour) {
  let score = 0;
  for (let row in board) {
    for (let col in board[row]) {
      // Evaluate the position at a square
      if (board[row][col] !== null) {
        let piece = board[row][col];
        if (piece.color === colour) {
          // Only evaluate pieces for one colour
          score += pieceValues[piece.type]; // Value of that type of piece
          score += squareValues[piece.type][row][col]; // Value for that piece being in this square
        }
      }
    }
  }
  return score;
}
