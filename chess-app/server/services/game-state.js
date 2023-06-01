
class GameState {
    static #PENDING = "pending"
    static #RUNNING = "running"
    static #END_WHITE = "end white"
    static #END_BLACK = "end black"
    static #INVALID = "invalid"

    constructor(gameId, state, players, board /* in FEN-Notation */) {
        this.gameId = gameId
        this.state = state
        this.players = players
        this.board = board
    }

    static Pending(gameId, players, board) { return new GameState(gameId, GameState.#PENDING, players, board) }
    static Running(gameId, players, board) { return new GameState(gameId, GameState.#RUNNING, players, board) }
    static WhiteWon(gameId, players, board) { return new GameState(gameId, GameState.#END_WHITE, players, board) }
    static BlackWon(gameId, players, board) { return new GameState(gameId, GameState.#END_BLACK, players, board) }
    static Invalid(gameId, players, board) { return new GameState(gameId, GameState.#INVALID, players, board) }
}

class PlayerState {
    static BLACK = "black"
    static WHITE = "white"

    constructor(time /* in seconds */) {
        this.time = time
    }
}

module.exports = {GameState, PlayerState}