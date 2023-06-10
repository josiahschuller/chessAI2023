import Player from "./Player.js";

export default class RandomAI extends Player {
  constructor() {
    super("Random AI");
  }

  /*
  * @param {Chess} chess - The Chess instance to execute the move on
  * @returns {Chess} - The Chess instance after the move has been executed
  */
  executeMove = (chess) => {
    let possibleMoves = chess.moves();

    let randomIdx = Math.floor(Math.random() * possibleMoves.length)
    chess.move(possibleMoves[randomIdx])

    return chess;
  }
}