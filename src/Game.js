import React, { Component } from "react";
import { useParams } from 'react-router-dom';
import PropTypes from "prop-types";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { Box, Container, Button } from '@chakra-ui/react'
import RandomAI from "./Players/RandomAI";

const chess = new Chess();

class Game extends Component {
  static propTypes = { children: PropTypes.func };

  constructor(props) {
    super(props);
    this.state = {
      fen: "start",
      // square styles for active drop square
      dropSquareStyle: {},
      // custom square styles
      squareStyles: {squareStyles: [{}, {}]},
      // square with the currently clicked piece
      pieceSquare: "",
      // currently clicked square
      square: "",
      // array of past game moves
      history: [],
      // Colour
      playerColour: props.playerColour,
      // Opponent
      opponent: props.opponent,
    };

    if (props.playerColour === "b") {
      // Execute opponent's move first if the player's colour is black
      this.executeOpponentMove();
    }
  }

  executeOpponentMove = () => {
    return new Promise(resolve => {
      resolve();
    }).then(() => {
      // Execute opponent's move
      let newChess = this.state.opponent.executeMove(chess);
      this.setState(({ history, pieceSquare }) => ({
        fen: newChess.fen(),
        history: newChess.history({ verbose: true }),
        squareStyles: squareStyling({ pieceSquare, history }),
      }));
    });
  }

  executeMove = (sourceSquare, targetSquare) => {
    // Check if the move is legal
    if (sourceSquare === "" || targetSquare === "") return;
    try {
      // Attempt to construct the move
      let move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q" // always promote to a queen for example simplicity
      });        

      // Illegal move
      if (move === null) return;
      
      // Update the board
      this.setState(({ history, pieceSquare }) => ({
        fen: chess.fen(),
        history: chess.history({ verbose: true }),
        squareStyles: squareStyling({ pieceSquare, history }),
      }));

      this.executeOpponentMove();
    } catch (error) {
      // Illegal move
      return;
    }
  }

  onDrop = ({ sourceSquare, targetSquare }) => this.executeMove(sourceSquare, targetSquare);

  // Keep clicked square style and remove hint squares
  onMouseOutSquare = square => this.setState(({ pieceSquare, history }) => ({
      squareStyles: squareStyling({ pieceSquare, history })
    }));

  // Yellow box around squares
  onDragOverSquare = square => {
    this.setState({
      dropSquareStyle:
        { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
    });
  };

  onSquareClick = square => {
    // Check if there is a piece on this square
    if (chess.get(square)) {
      // There is a piece on this square
      // Enusre that the piece is the player's colour
      if (chess.get(square).color !== this.state.playerColour) return;
      // Check if the square is already highlighted
      if (this.state.pieceSquare === square) {
        // The square is already highlighted, so unhiglight it
        delete this.state.squareStyles[square];
        this.setState(() => ({
          pieceSquare: "",
        }));
      }
      else {
        // The square is not highlighted, so highlight it
        this.setState(({ history }) => ({
          squareStyles: squareStyling({ pieceSquare: square, history }),
          pieceSquare: square
        }));
      }
    }

    // Execute the move
    this.executeMove(this.state.pieceSquare, square);
  };

  render() {
    const { fen, dropSquareStyle, squareStyles } = this.state;

    return this.props.children({
      squareStyles,
      position: fen,
      onMouseOutSquare: this.onMouseOutSquare,
      onDrop: this.onDrop,
      dropSquareStyle,
      onDragOverSquare: this.onDragOverSquare,
      onSquareClick: this.onSquareClick,
    });
  }
}

export default function PlayGame() {
  const { colour, opponent } = useParams();

  // Set the orientation of the board
  const orientation = colour === "w" ? "white" : "black";

  // Set the opponent
  let opponentInstance;
  switch (opponent) {
    case "random":
      opponentInstance = new RandomAI();
      break;
    default:
  }

  return (
    <Box>
      <Container>
        <Box sx={{mb: 2}}>
          <Game
            playerColour={colour}
            opponent={opponentInstance}
          >
            {({
              position,
              onDrop,
              onMouseOutSquare,
              squareStyles,
              dropSquareStyle,
              onDragOverSquare,
              onSquareClick,
            }) => (
              <Chessboard
                id="humanVsHuman"
                width={600}
                position={position} // fen
                onDrop={onDrop}
                onMouseOutSquare={onMouseOutSquare}
                boardStyle={{
                  borderRadius: "5px",
                  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
                }}
                squareStyles={squareStyles}
                dropSquareStyle={dropSquareStyle}
                onDragOverSquare={onDragOverSquare}
                onSquareClick={onSquareClick}
                orientation={orientation}
                transitionDuration={300}
              />
            )}
          </Game>
        </Box>
        <Button
          onClick={() => {window.location.href = "/"}}
          bg="blue.100"
          _hover={{ bg: "blue.200" }}
        >
          Back
        </Button>
      </Container>
    </Box>
  );
}

const squareStyling = ({ pieceSquare, history }) => {
  const sourceSquare = history.length && history[history.length - 1].from;
  const targetSquare = history.length && history[history.length - 1].to;

  return {
    [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
    ...(history.length && {
      [sourceSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)"
      }
    }),
    ...(history.length && {
      [targetSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)"
      }
    })
  };
};
