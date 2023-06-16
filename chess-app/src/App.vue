<template>
  <div id="app">
    <div v-if="!showChessboard" class="menu">
      <button class="menu-button" @click="createNewGame()">New Game</button>
      <button class="menu-button" @click="showChessboard = true">//Join Game</button>
    </div>
    <Chessboard v-else :gameId="gameId" :player="player"/>
  </div>
</template>

<script>
import Chessboard from './components/Chessboard.vue';
import { Chess } from 'chess.js'
import { GameService } from './services/game-service'
import { HttpService } from './services/http-service'

export default {
  name: 'App',
  components: {
    Chessboard,
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
    async joinGame(gameId) {
      this.player = await HttpService.joinGameAsync(gameId);

      this.showChessboard = true
      this.gameStarted = true;
    },
  }
};
</script>

<style>
  #app {
    display: flex;
    justify-content: center;
  }

  .menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 50px;
}

.menu-button {
  background-color: #84A98C;
  color: white;
  border: none;
  padding: 15px 25px;
  
  margin: 10px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1.5rem;
  box-shadow: 0px 3px 0px rgba(0, 0, 0, 0.3);
  transition: background-color 0.2s ease-in-out;
}

.menu-button:hover {
  background-color: #52796F;
  box-shadow: 0px 6px 0px rgba(0, 0, 0, 0.3);
}
</style>

