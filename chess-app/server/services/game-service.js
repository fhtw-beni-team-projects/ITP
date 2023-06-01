const { GameState, PlayerState } = require("./game-state")

class GameService {
    static ID_LENGTH = 6

    createGame() {
        return this.generateGameId()
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

    move(gameId, who, move /* in FEN notation */) {
        const players = this.#getPlayerStates(gameId)
        const board = this.#getBoard(gameId)

        /* Your logic here */

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
        return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    }
}

module.exports = GameService