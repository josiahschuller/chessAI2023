import React, { Component } from "react";
import PropTypes from "prop-types";
import { Chess } from "chess.js";

import Chessboard from "chessboardjsx";

class HumanVsHuman extends Component {
  static propTypes = { children: PropTypes.func };

  state = {
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
    history: []
  };

  componentDidMount() {
    this.game = new Chess();
  }

  executeMove = (sourceSquare, targetSquare) => {
    // Check if the move is legal
    if (sourceSquare == "" || targetSquare == "") return;
    try {
      // Attempt to construct the move
      let move = this.game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q" // always promote to a queen for example simplicity
      });        

      // Illegal move
      if (move === null) return;

      this.setState(({ history, pieceSquare }) => ({
        fen: this.game.fen(),
        history: this.game.history({ verbose: true }),
        squareStyles: squareStyling({ pieceSquare, history })
      }));
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
    if (this.game.get(square)) {
      // There is a piece on this square
      // Check if the square is already highlighted
      if (this.state.pieceSquare == square) {
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

export default function WithMoveValidation() {
  return (
    <div>
      <HumanVsHuman>
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
          />
        )}
      </HumanVsHuman>
    </div>
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
