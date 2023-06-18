export type State = "pending" | "running" | "end white" | "end black" | "end draw" | "invalid"
export type PlayerState = "black" | "white" | "viewer"

export type GameState = {
    gameId: string
    state: State
    players: {
        black: {
            time: number // In seconds
        },
        white: {
            time: number // In seconds
        }
    }
    board: string
    last_move: string
}


export class GameService {
    private webSocket: WebSocket = new WebSocket("ws://localhost:3000")
    constructor(private gameId: string, private who: PlayerState, private callback?: (state: GameState) => void) {
        this.webSocket.addEventListener('message', (ev) => this.receivedMessage(ev))
    }

    move(move: string) {
        const data = {
            ...this.getBaseData(),
            method: 'move',
            data: move
        }

        this.send(data)
    }
    surrender() {
        const data = this.getBaseData()
        this.send(data)
    }
    private send(obj: any) {
        this.webSocket.send(JSON.stringify(obj))
    }


    private receivedMessage(data: MessageEvent) {
        if (this.callback) {
            let gameData = JSON.parse(data.data)
            if (this.gameId == gameData.gameId) {
                this.callback(gameData as GameState)
            }
        }
    }
    
    private getBaseData() {
        return {
            gameId: this.gameId,
            who: this.who
        }
    }
}