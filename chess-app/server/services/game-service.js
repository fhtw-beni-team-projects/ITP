const { GameState, PlayerState } = require("./game-state")
const { Game } = require("./game")

class GameService {
    static ID_LENGTH = 6;
    games = new Map();

    createGame() {
        let gameId = this.generateGameId();
        let time = 900;
        let increment = 10;

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
        if (this.games[gameId].black_joined == true && this.games[gameId].white_joined == true) {
            return PlayerState.VIEWER
        }

        var color;

        var rand2 = Math.floor(Math.random() * 2);
        if (this.games[gameId].black_joined == true || (rand2 == 0 && this.games[gameId].white_joined == false)) {
            this.games[gameId].white_joined = true;
            color = PlayerState.WHITE
        } else {
            this.games[gameId].black_joined = true;
            color = PlayerState.BLACK
        }

        if (this.games[gameId].black_joined == true && this.games[gameId].white_joined == true) {
            this.games[gameId].startTimer()
        }

        return color
    }

    move(gameId, who, move /* in SAN notation */) {
        let game = this.games[gameId];
        if (this.games[gameId].state == "concluded") {
            return this.games[gameId].stateObj
        }

        if ((Date.now() - game.last_time) > game.time[game.game.turn()]) {
            this.games[gameId].state = "concluded"
            this.games[gameId].stateObj = game.game.turn() == 'w' ? GameState.BlackWon(this.#getPlayerStates(gameId), players, this.#getBoard(gameId), this.#getLastMove(gameId)) : GameState.WhiteWon(this.#getPlayerStates(gameId), players, this.#getBoard(gameId), this.#getLastMove(gameId))
            return this.games[gameId].stateObj
        }

        this.games[gameId].move(move);

        const players = this.#getPlayerStates(gameId)
        const board = this.#getBoard(gameId)
        const last_move = this.#getLastMove(gameId)

        if (this.games[gameId].isCheckmate()) {
            this.games[gameId].state = "concluded"
            this.games[gameId].stateObj = this.games[gameId].turn() == 'w' ? GameState.BlackWon(gameId, players, board, last_move) : GameState.WhiteWon(gameId, players, board, last_move)
            return this.games[gameId].stateObj
        }
        if (this.games[gameId].isDraw()) {
            this.games[gameId].state = "concluded"
            this.games[gameId].stateObj = GameState.Draw(gameId, players, board, last_move)
            return this.games[gameId].stateObj
        }

        return GameState.Running(gameId, players, board, last_move)
    }

    surrender(gameId, who) {        
        const players = this.#getPlayerStates(gameId)
        const board = this.#getBoard(gameId)
        const last_move = this.#getLastMove(gameId)

        switch (who) {
            case PlayerState.WHITE:
                return GameState.WhiteWon(gameId, players, board, last_move)
            case PlayerState.BLACK:
                return GameState.BlackWon(gameId, players, board, last_move)
            default:
                return GameState.Invalid(gameId, players, board, last_move)
        }
    }

    #getPlayerStates(gameId) {
        return {
            white: new PlayerState(this.games[gameId].getSecondsWhite()),
            black: new PlayerState(this.games[gameId].getSecondsBlack())
        }
    }

    #getBoard(gameId) {
        return this.games[gameId].game.fen();
    }

    #getLastMove(gameId) {
        return this.games[gameId].last_move;
    }
}

module.exports = GameService