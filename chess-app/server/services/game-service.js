const { GameState, PlayerState } = require("./game-state")
const { Game } = require("./game")

class GameService {
    static ID_LENGTH = 6;
    games = new Map();

    createGame() {
        gameId = this.generateGameId();
        time = 900;
        increment = 10;

        this.games[gameId] = new Game(time, increment, "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        return gameId;
    }

    generateGameId() {
        let result = '';
        const characters = 'abcdefghijklmnopqrstuvwx0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < GameService.ID_LENGTH) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }

        return result;
    }

    join(gameId) {
        // Return either white or black, this will let the user know which color they are

        /* Your logic here */

        return PlayerState.WHITE // PlayerState.BLACK
    }

    move(gameId, who, move /* in SAN notation */) {
        game = this.games[gameId];
        if ((Date.now() - game.last_time) > game.time[game.game.turn()]) {
            return game.game.turn() == 'w' ? GameState.BlackWon(this.#getPlayerStates(gameId), players, this.#getBoard(gameId)) : GameState.WhiteWon(this.#getPlayerStates(gameId), players, this.#getBoard(gameId))
        }

        this.games[gameId].move(move);

        const players = this.#getPlayerStates(gameId)
        const board = this.#getBoard(gameId)

        if (this.games[gameId].game.isCheckmate()) {
            return this.games[gameId].game.turn() == 'w' ? GameState.BlackWon(gameId, players, board) : GameState.WhiteWon(gameId, players, board)
        }
        if (this.games[gameId].game.isGameOver()) {
            return GameState.Draw(gameId, players, board)
        }

        return GameState.Running(gameId, players, board)
    }

    surrender(gameId, who) {        
        const players = this.#getPlayerStates(gameId)
        const board = this.#getBoard(gameId)

        switch (who) {
            case PlayerState.WHITE:
                return GameState.WhiteWon(gameId, players, board)
            case PlayerState.BLACK:
                return GameState.BlackWon(gameId, players, board)
            default:
                return GameState.Invalid(gameId, players, board)
        }
    }

    #getPlayerStates(gameId) {
        return {
            white: new PlayerState(60, false),
            black: new PlayerState(40, false)
        }
    }
    #getBoard(gameId) {
        return this.games[gameId].game.fen();
    }
}

module.exports = GameService