import type { Player } from "./game-service"

export class HttpService {
    static async createGameAsync(): Promise<string> {
        const response = await fetch("http://localhost:3000/games/create")
        const gameId = await response.text()

        return gameId
    }

    static async joinGameAsync(gameId: string): Promise<Player> {
        const response = await fetch(`http://localhost:3000/games/${gameId}/join`)
        const who = await response.text() as Player

        return who
    }
}