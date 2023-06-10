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
    const possibleMoves = chess.moves();
    const possibleMoveScores = possibleMoves.reduce((acc, move) => {
      acc[move] = [];
      return acc;
    }, {});
    let noScoresEvaluated = true;
    
    const colour = chess.turn();

    const initialScore = evaluateFen(chess.fen(), colour);

    // Iterate through possible moves
    for (let idx in possibleMoves) {
      let newChess = new Chess(chess.fen());
      newChess.move(possibleMoves[idx]);

      let scoreAfterMove = evaluateFen(newChess.fen(), colour);

      const possibleOpponentMoves = newChess.moves();
      // Iterate through opponent's possible moves
      for (let idx2 in possibleOpponentMoves) {
        let newChess2 = new Chess(newChess.fen());
        newChess2.move(possibleOpponentMoves[idx2]);

        let scoreAfterOpponentMove = evaluateFen(newChess2.fen(), colour);

        if (scoreAfterOpponentMove > scoreAfterMove) {
          // The position after the opponent's move is better than before they made their move
          // i.e. they made a terrible move, so don't consider this move
          continue;
        }
        if (scoreAfterOpponentMove < initialScore) {
          if (noScoresEvaluated) {
            // Consider this move just in case this is a zugzwang (i.e. every move is bad for us)
            possibleMoveScores[possibleMoves[idx]].push(scoreAfterOpponentMove);
            noScoresEvaluated = false;
          }
          // Things are looking bad for us, so don't consider this move
          continue;
        }



        let score = recurseEvaluate(newChess2.fen(), colour, 1);
        
        possibleMoveScores[possibleMoves[idx]].push(score);
      }
    }

    console.log(possibleMoveScores);

    // Best move is the move with the best worst score - the maximum of the worst case scenarios
    // i.e. Assume the opponent will make the best move every time
    let bestMove = null;
    let bestMoveScore = Number.NEGATIVE_INFINITY;

    for (let move in possibleMoveScores) {
      if (possibleMoveScores[move].length !== 0) {
        // Find the worst score for this move
        let worstScore = Math.min(...possibleMoveScores[move]);
  
        // If this move has the best worst score, then it is the best move
        if (worstScore > bestMoveScore) {
          bestMove = move;
          bestMoveScore = worstScore;
        }        
      }
    }

    console.log(`Best move: ${bestMove} with score ${bestMoveScore}`);

    chess.move(bestMove);

    console.log(`Evaluations made: ${evaluationsMade}`)
    return chess;
  }
}



/*
* @param {string} fen - The FEN string of the Chess board to evaluate
* @param {str} colour of the player - "w" or "b"
* @param {number} depth - The depth to recurse to
* @returns {array} - An array of all the scores of the possible moves
*/
function recurseEvaluate(fen, colour, depth) {
  if (depth === 0) {
    // No more recursing to do, so evaluate the board
    return evaluateFen(fen, colour);
  }

  let chess = new Chess(fen);

  const possibleMoves = chess.moves();
  let scores = [];

  // Iterate through possible moves
  for (let idx in possibleMoves) {
    let newChess = new Chess(chess.fen());
    newChess.move(possibleMoves[idx]);

    const possibleOpponentMoves = newChess.moves();
    // Iterate through opponent's possible moves
    for (let idx2 in possibleOpponentMoves) {
      let newChess2 = new Chess(newChess.fen());
      newChess2.move(possibleOpponentMoves[idx2]);

      // Keep recursing
      let score = recurseEvaluate(newChess2.fen(), colour, depth - 1);
      scores.push(score);
    }
  }

  // Find the worst score for this move
  let worstScore = Math.min(...scores);
  return worstScore;
}

/*
* @param {string} fen - The FEN string of the Chess board to evaluate
* @param {str} colour of the player - "w" or "b"
* @returns {number} - The evaluation of the FEN string (White's value vs Black's value)
*/
function evaluateFen(fen, colour) {
  evaluationsMade += 1;
  const chess = new Chess(fen);
  const board = chess.board();

  // Evaluate White's position
  const whiteScore = evaluateColour(board, "w");

  // Board flipped is the board from Black's perspective
  const boardFlipped = [];
  for (let i = board.length - 1; i >= 0; i--) {
    boardFlipped.push(board[i]);
  }

  // Evaluate Black's position
  const blackScore = evaluateColour(boardFlipped, "b");

  let timeEnd = new Date();

  if (colour === "w") {
    return whiteScore - blackScore;
  } else {
    return blackScore - whiteScore;
  }
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
