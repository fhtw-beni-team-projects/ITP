<template>
  <!--<div id="app">-->
    <div class="container">
    <div v-if="!showChessboard" class="menu">
      <button class="menu-button" @click="createNewGame()">New Game</button>
      <button class="menu-button" @click="openJoinGamePopup()">Join Game</button>
      <button class="menu-button" @click="openSpectateGamePopup()">Spectate Game</button>
      <JoinGamePopup ref="joinRef" @gameIdEntered="joinGame"/>
      <SpectateGamePopup ref="spectateRef" @gameIdEntered="spectateGame"/>
    </div>
    <Chessboard v-else :gameId="gameId" :player="player"/>
    </div>
    
  <!---</div>-->
  </template>

<script>
import Chessboard from './components/Chessboard.vue';
import { Chess } from 'chess.js'
import { GameService } from './services/game-service'
import { HttpService } from './services/http-service'

import JoinGamePopup from './components/popups/JoinGamePopup.vue'
import SpectateGamePopup from './components/popups/SpectateGamePopup.vue'


export default {
  name: 'App',
  components: {
    Chessboard,
    JoinGamePopup,
    SpectateGamePopup,
  },
  data() {
    return {
      showChessboard: false,
      gameId: this.gameId,
      player: this.player,
    
    };
  },
  
  methods: {
    async createNewGame() {
      this.gameId = await HttpService.createGameAsync();
      this.player = await HttpService.joinGameAsync(this.gameId);

      this.showChessboard = true
      this.gameStarted = true;
    },
    async joinGame(gameIdEntered) {
      this.gameId = gameIdEntered;
      this.player = await HttpService.joinGameAsync(gameIdEntered);

      this.showChessboard = true
      this.gameStarted = true;
    },
    async spectateGame(gameIdEntered) {
      this.gameId = gameIdEntered;
      this.player = "viewer"

      this.showChessboard = true
      this.gameStarted = true;
    },
    openJoinGamePopup() {
      this.$refs.joinRef.isOpen = true;
    },
    openSpectateGamePopup() {
      this.$refs.spectateRef.isOpen = true;
    },
 
  }
}
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  margin-top: 150px;
  height: 100vh;
}

.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 50px;
}

.menu-button {
  background-color: #4ab0d5bb;
  border: none;
  color: white;
  padding: 20px 30px;
  margin: 10px;
  border-radius: 10px;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
  font-size: 28px;
}
.menu-button:hover {
  background-color: #02cccc;
  box-shadow: 0 0 10px rgba(0, 180, 180, 0.6);
}
</style>
