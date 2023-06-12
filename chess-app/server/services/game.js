const { Chess } = require('chess.js')
const { GameState } = require('./game-state')

class Game
{	
	constructor(time, increment, fen) {
		this.state = "pending";
		this.stateObj;

		this.black_joined = false;
		this.white_joined = false;

		this.time = {
			'w': time * 1000,
			'b': time * 1000,
		}
		this.increment = increment * 1000;
		this.game = new Chess(fen);
	}

	startTimer() {
		this.state = "running";
		this.timestamp = Date.now();
	}

	move(san) {
		try {
			var result = this.game.move(san)
			this.time[result.color] -= (Date.now() - this.timestamp)
			this.timestamp = Date.now();
		} catch (err) {
			return false
		}
		return true
	}

	isCheckmate() {
		return this.game.isCheckmate()
	}

	isDraw() {
		return !this.game.isCheckmate() && this.game.isGameOver()
	}

	turn() {
		return this.game.turn()
	}

	getSecondsBlack() {
		return Math.floor(this.time['b'] / 1000)
	}

	getSecondsWhite() {
		return Math.floor(this.time['w'] / 1000)
	}
}

module.exports = { Game }