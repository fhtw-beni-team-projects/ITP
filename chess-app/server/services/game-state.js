
class GameState {
    static #PENDING = "pending"
    static #RUNNING = "running"
    static #END_WHITE = "end white"
    static #END_BLACK = "end black"
    static #END_DRAW = "end draw"
    static #INVALID = "invalid"

    constructor(gameId, state, players, board /* in FEN-Notation */, last_move /* SAN-Notation */) {
        this.gameId = gameId
        this.state = state
        this.players = players
        this.board = board
        this.last_move = last_move
    }

    static Pending(gameId, players, board, last_move) { return new GameState(gameId, GameState.#PENDING, players, board, last_move) }
    static Running(gameId, players, board, last_move) { return new GameState(gameId, GameState.#RUNNING, players, board, last_move) }
    static WhiteWon(gameId, players, board, last_move) { return new GameState(gameId, GameState.#END_WHITE, players, board, last_move) }
    static BlackWon(gameId, players, board, last_move) { return new GameState(gameId, GameState.#END_BLACK, players, board, last_move) }
    static Draw(gameId, players, board, last_move) { return new GameState(gameId, GameState.#END_DRAW, players, board, last_move) }
    static Invalid(gameId, players, board, last_move) { return new GameState(gameId, GameState.#INVALID, players, board, last_move) }
}

class PlayerState {
    static BLACK = "black"
    static WHITE = "white"
    static VIEWER = "viewer"

    constructor(time /* in seconds */) {
        this.time = time
    }
}

module.exports = {GameState, PlayerState}