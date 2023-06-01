const express = require("express")
const cors = require("cors")
const http = require('http')
const WebSocket = require('ws')
const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server });

const GameService = require("./services/game-service")
const gameService = new GameService()

app.use(cors())

const processMessage = function (data) {
    const gameId = data.gameId
    const who = data.who

    switch (data.method) {
        case "move":
            return gameService.move(gameId, who, data.data)
        case "surrender":
            return gameService.surrender(gameId, who)
    }
    
    return "Invalid message!"
}

app.get('/games/create', (req, res) => {
    const gameId = gameService.createGame()

    return res.status(200).send(gameId)
})

app.get('/games/:gameId/join', (req, res) => {
    const gameId = req.params.gameId

    const who = gameService.join(gameId)

    return res.status(200).send(who)
})


// Websocket
wss.on('connection', function (ws) {
    ws.on('message', (buffer) => {
        const data = JSON.parse(buffer.toString())
        const gameState = processMessage(data)

        ws.send(JSON.stringify(gameState))
    });
})

// REST
server.listen(3000)
