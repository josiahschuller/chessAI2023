
export default class Player {
  constructor(name) {
    this.name = name;
  }

  /*
  * @returns {string} - The name of the player
  */
  getName = () => this.name;

  /*
  * @param {Chess} chess - The Chess instance to execute the move on
  * @returns {Chess} - The Chess instance after the move has been executed
  */
  executeMove = (chess) => {}; // Abstract method
}