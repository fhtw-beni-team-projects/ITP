<template>
  <div>
    <p class="gameId-display">Game ID: {{ gameId }}</p>
  </div>
  <div class="chessboard"
    :style="{ transform: this.player === 'black' ? 'rotate(180deg)' : 'none' }">
    <div v-for="row in 8" class="row" :key="row">
      <div v-for="col in 8" 
        :class="getSquareClass(9 - row, col) + (isSelected(9 - row, col) ? ' selected' : '') + (isLastMove(9 - row, col) ? ' move' : '') + ' ' + (isKingInCheck(9 - row, col) ? ' check' : '')" 
        :key="`${9 - row}${col}`"
        :id="`${9 - row}-${col}`"
        :style="{ transform: this.player === 'black' ? 'rotate(180deg)' : 'none' }"
        @click="selectSquare(`${9 - row}`, `${col}`)">
        <font-awesome-icon v-if="getPieceIcon(9 - row, col)" :icon="getPieceIcon(9 - row, col)" :style="getPieceStyle(9 - row, col)" />
      </div>
    </div>
  </div>
  <div class="timer-container">
    <div :class="{ timer1: this.player !== 'black', timer2: this.player === 'black'}">
      <span>{{ formatTime(timeBlack) }}</span>
    </div>
    <div :class="{ timer1: this.player === 'black', timer2: this.player !== 'black'}">
      <span>{{ formatTime(timeWhite) }}</span>
    </div>
  </div>
  <div v-if="showCheckmate" class="popup">
    <div class="popup-content">
      <h2>Checkmate!</h2>
      <button @click="dismissCheckmate">Close</button>
    </div>
  </div>
  <div>
    <PromotionComponent :is-open="showPopup" @promote="handlePromotion" />
  </div>

</template>

<script>
import { Chess } from 'chess.js';
import PromotionComponent from './popups/PromotionComponent.vue';
import { GameService } from '../services/game-service'

var greyTiles = [];
const game = new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");


export default {
  name: 'ChessBoard',
  props: {
    gameId: {
      type: String,
      required: true
    },
    player: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      game,
      selectedSquare: '',
      showPopup: false,
      promotionType: null,
      promotionFrom: null,
      promotionTo: null,
      last_move: {
        from: null,
        to: null,
        san: null
      },
      move_verify: null,
      showCheckmate: false,
      startTime: null,
      timerInterval: null,
      timeWhite: null,
      timeBlack: null
  
    };
  },
  mounted() {
    this.gameService = new GameService(this.gameId, this.player, this.handleUpdate)
    // console.log(game.ascii());
    this.startTime = Date.now();
  },
  beforeMount() {
    clearInterval(this.timerInterval);
  },
  methods: {
    startTimer(color) {
      this.startTime = Math.trunc(Date.now() / 1000);
      if (color != 'black') {
        this.timerInterval = setInterval(() => { this.updateTimer('white') }, 1000);
      } else {
        this.timerInterval = setInterval(() => { this.updateTimer('black') }, 1000);
      }
    },
    updateTimer(color) {
      if (color != 'black') {
        this.timeWhite -= 1
      } else {
        this.timeBlack -= 1
      }
      if ((color != 'black' ? this.timeWhite : this.timeBlack) <= 0) {
        clearInterval(this.timerInterval);
      }
    },
    formatTime(time) {
      return time == null ? '--:--' : String(Math.trunc(time / 60)).padStart(2, '0') + ':' + String(time % 60).padStart(2, '0');
    },
    handleUpdate(GameState) {
      clearInterval(this.timerInterval);

      // todo: which player can move
      // TODO: validation did the board change?
      const remote_game = new Chess(GameState.board)

      this.last_move.from = GameState.last_move.from
      this.last_move.to = GameState.last_move.to
      debugger;

      this.timeWhite = GameState.players.white.time
      this.timeBlack = GameState.players.black.time

      this.startTimer(remote_game.turn() == 'w' ? 'white' : 'black')

      if (this.move_verify == GameState.last_move.san) {
        this.game.undo()
        return
      }
      this.move_verify = game.history().at(-1)
      if (this.game.history().at(-1) != GameState.last_move.san)
        this.moveChessPiece(GameState.last_move.san)
    },
    openPopup(from, to) {
      this.showPopup = true;
      this.promotionFrom = from;
      this.promotionTo = to;
    },
    async handlePromotion(pieceType) {
      //console.log('Selected type: ', pieceType);
      this.promotionType = pieceType;
      this.showPopup = false;

      this.game.move({ from: this.promotionFrom, to: this.promotionTo, promotion: this.promotionType });
      this.gameService.move(game.history().at(-1));

      console.log(game.ascii());

      if (game.isCheckmate()) {
        console.log('Checkmate!');
        this.showCheckmate = true;
      } else if (game.isGameOver()) {
        console.log('Draw!');
      } else if (game.inCheck()) {
        console.log('Check!');
      }

      this.removeHighlightedTile();
    },
    getSquareClass(row, col) {
      return (row + col) % 2 === 0 ? 'square black' : 'square white';
    },
    isSelected(row, col) {
      return `${row}-${col}` === this.selectedSquare;
    },
    isKingInCheck(row, col) {
      if (!this.game.isCheck())
        return false;

      let piece = this.game.get(this.translateToChessId(row, col));

      if (piece.type != 'k')
        return false

      if (piece.color != this.game.turn())
        return false

      return true
    },
    isLastMove(row, col) {
      let field = this.translateToChessId(row, col);
      return (field == this.last_move.to || field == this.last_move.from);
    },
    selectSquare(row, col) {
      const piece = this.translateToChessId(row, col);
      this.highlightTiles(row + '-' + col, piece);
    },
    highlightTiles(id, chessId) {
      const { game } = this;
      const piece = game.get(chessId);

      if (this.player.at(0) == game.turn() && piece && piece.color === game.turn()) {
        this.removeHighlightedTile(greyTiles);
        const possibleMoves = game.moves({ square: chessId, verbose: true });

        if (possibleMoves.length === 0) return;
        for (const move of possibleMoves) {
          const temp = this.reverseTranslation(move.to);
          const tile = document.getElementById(temp);
          if (tile) {
            tile.style.boxShadow = '0 0 5px rgba(0, 180, 180, 0.8), 0 0 10px rgba(0, 180, 180, 0.8), 0 0 15px rgba(0, 180, 180, 0.8), 0 0 20px rgba(0, 180, 180, 0.8)';
            tile.style.border = '3px solid #02cccc';
            tile.style.filter = 'brightness(125%)';
            tile.addEventListener('click', this.moveUserInput);
          }
        }
        this.selectedSquare = chessId;
      }
    },
    moveUserInput(event) {
      const newTile = event.target.id;
      const moveTo = this.translateToChessId(newTile[0], newTile[2]);
      const { game } = this;

      const pieceType = game.get(this.selectedSquare).type;
      var moveToRow = newTile.split('-');
      moveToRow = moveToRow[0];

      if(pieceType == 'p') 
        if(moveToRow == 1 || moveToRow == 8) {
          this.openPopup(this.selectedSquare, moveTo);
          return;
        }

      this.moveChessPiece({ from: this.selectedSquare, to: moveTo });

      this.gameService.move(game.history().at(-1))

      this.selectedSquare = '';
      this.removeHighlightedTile();   
    },
    moveChessPiece(move) {
      
      this.game.move(move);

      console.log(game.ascii());

      if (game.isCheckmate()) {
        console.log('Checkmate!');
        this.showCheckmate = true;
      } else if (game.isGameOver()) {
        console.log('Draw!');
      } else if (game.inCheck()) {
        console.log('Check!');
        this.showCheck=true;
      }
    },
    dismissCheckmate(){
      this.showCheckmate = false;
    },

    removeHighlightedTile() {
      const tiles = document.getElementsByClassName('square');
      for (const tile of tiles) {
        tile.style.removeProperty('box-shadow');
        tile.style.removeProperty('border');
        tile.style.removeProperty('filter');
        tile.removeEventListener('click', this.moveUserInput);
      }
    },
    reverseTranslation(chessTile) {
      const temp = chessTile.charCodeAt(0) - 96;
      return chessTile[1] + '-' + temp;
    },
    translateToChessId(row, col) {
      const letterMap = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      return letterMap[col - 1] + row;
    },
    getPieceIcon(row, col) {
      const chessId = this.translateToChessId(row, col);
      const piece = this.game.get(chessId);

      if (piece) {
        switch (piece.type) {
          case 'p':
          case 'P':
            return ['fass', 'chess-pawn'];
          case 'r':
          case 'R':
            return ['fass', 'chess-rook'];
          case 'n':
          case 'N':
            return ['fass', 'chess-knight'];
          case 'b':
          case 'B':
            return ['fass', 'chess-bishop'];
          case 'q':
          case 'Q':
            return ['fass', 'chess-queen'];
          case 'k':
          case 'K':
            return ['fass', 'chess-king'];
          default:
            break;
        }
      }
      return null;
    },

    getPieceStyle(row, col) {
      const chessId = this.translateToChessId(row, col);
      const piece = this.game.get(chessId);
      const style = {};

      if (piece) {
        style.color = piece.color === 'w' ? '#ffffff' : '#000000';
        style.height = '90%';
        style.pointerEvents = 'none';
        style.zIndex = '2';
      }

      return style;
    },
    //moves the pieces 
    moveIcons(fen) {
      console.log(fen)
      const piecePlacement = fen.split(' ')[0];
      const rows = piecePlacement.split('/');

      for (let row = 0; row < rows.length; row++) {
        let col = 1;

        for (let i = 0; i < rows[row].length; i++) {
          const char = rows[row][i];

          if (isNaN(char)) {
            const square = this.translateToChessId(8 - row, col);
            const iconElement = document.getElementById(square)?.querySelector('svg');

            if (iconElement) {
              
              // Set the piece icon based on the FEN notation
              var piece;
              switch (char.toLower()) {
              case "p":
                piece = "chess-pawn";
                break;
              case "r":
                piece = "chess-rook";
                break;
              case "n":
                piece = "chess-knight";
                break;
              case "b":
                piece = "chess-bishop";
                break;
              case "q":
                piece = "chess-queen";
                break;
              case "k":
                piece = "chess-king";
                break;
              }

              iconElement.setAttribute("icon", ['fass', piece]);


              iconElement.style.color = "#ffffff";
              if (char.toLower() === char) {
                iconElement.style.color = "#000000";
              }
            }
            col++;
          } else {
            col += parseInt(char);
          }
        }
      }
    },
  },
  components: {
    PromotionComponent,
  }
};
</script>

<style scoped>

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border: 3px solid #02cccc;
  box-shadow: 0 0 10px rgba(0, 180, 180, 0.6);
  z-index: 9999;
}

.popup-content {
  text-align: center;
}

.popup button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #02cccc;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.popup button:hover {
  background-color: #00e6e6;
}

.chessboard {
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
  width: 600px;
  min-width: 600px;
  height: 600px;
  justify-content: center;
}

.row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 75px;
}

.square {
  width: 75px;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.square.white {
  background-color: #9ed0e2ff; /*rgb(224, 229, 237);*/
}

.square.black {
  background-color: #4ab0d5bb
}

.square.white.move {
  background-color: #f6fc4edd;
}

.square.black.move {
  background-color: #e9ee27bb
}

.square.white.check {
  background-color: #e07d76ff;
}

.square.black.check {
  background-color: #dd5045bb
}

.game-id {
  text-align: center;
  margin: 0;
  width: 100%;
}

.gameId-display {
  position: fixed;
  top: 1%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4ab0d5bb;
  color: white;
  padding: 5px 10px;
  font-size: 28px;
  border-radius: 10px; 
  box-shadow: 0 0 10px rgba(0, 180, 180, 0.6); 
 
}

.timer-container {
  display: flex;
  justify-content: flex-end;
  margin-left: 100px;
}
 
 
.timer2 {
  position: absolute;
  bottom: 0;
  right: 0;
  top:73%;
}

.timer1{
  margin-top: 10px;
}

.timer1, .timer2 {  
  text-align: center;
  font-size: 24px;
  height: 50px;
  width: 90px;
  background-color: #4ab0d5bb;
  color: white;
  padding: 5px 10px;
  border-radius: 10px; 
  box-shadow: 0 0 10px rgba(0, 180, 180, 0.6); 
}

</style>