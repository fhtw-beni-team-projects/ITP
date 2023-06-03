const { Chess } = require('chess.js')

class Game
{
	game;
	time;
	increment;

	constructor(time, increment, fen) {
		this.time['w'] = time * 1000;
		this.time['b'] = time * 1000;
		this.increment = increment * 1000;
		this.game = new Chess(fen);
	}

	start_timer() {
		this.timestamp = Date.now();
	}

	move(san) {
		try {
			var result = this.game.move(san);
			this.time[result.color] -= (Date.now() - this.last_time);
			this.timestamp = Date.now();
		} catch (err) {
			return false
		}
		return true
	}
}

module.exports = { Game }