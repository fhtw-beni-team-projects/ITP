<template>
  <div class="chessboard">
    <div v-for="row in 8" class="row" :key="row">
      <div v-for="col in 8" 
        :class="getSquareClass(9 - row, col) + (isSelected(9 - row, col) ? ' selected' : '')" 
        :key="`${9 - row}${col}`"
        :id="`${9 - row}-${col}`"
        @click="selectSquare(`${9 - row}`, `${col}`)">
        <font-awesome-icon v-if="getPieceIcon(9 - row, col)" :icon="getPieceIcon(9 - row, col)" :style="getPieceStyle(9 - row, col)" />
      </div>
    </div>
  </div>
  <div v-if="showCheckmate" class="popup">
      <div class="popup-content">
        <h2>Checkmate!</h2>
        <button @click="dismissCheckmate">Close</button>
      </div>
    </div>
    <div v-if="showCheck" class="popup">
      <div class="popup-content">
        <h2>Check!</h2>
        <button @click="dismissCheck">Close</button>
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
    }
  },
  data() {
    return {
        game,
        selectedSquare: '',
        showPopup: false,
        promotionType: null,
        promotionFrom: null,
        promotionTo: null,
        showCheckmate: false,
        showCheck: false
    };
  },
  mounted() {
    this.gameService = new GameService(this.gameId, this.player, this.handleUpdate)
    // console.log(game.ascii());
  },
  methods: {
    handleUpdate(GameState) {
      // todo: which player can move
      // TODO: validation did the board change?
      const { game } = this
      const remote_game = new Chess(GameState.board)

      if (this.last_move == GameState.last_move) {
        game.undo()
        return
      }

      this.last_move = game.history().at(-1)

      if (game.history().at(-1) != GameState.last_move)
        this.moveChessPiece(GameState.last_move)
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
    },
    getSquareClass(row, col) {
      return (row + col) % 2 === 0 ? 'square white' : 'square black';
    },
    isSelected(row, col) {
      return `${row}-${col}` === this.selectedSquare;
    },
    selectSquare(row, col) {
      const piece = this.translateToChessId(row, col);
      this.highlightTiles(row + '-' + col, piece);
    },
    highlightTiles(id, chessId) {
      const { game } = this;
      const piece = game.get(chessId);

      if (piece && piece.color === game.turn()) {
        this.removeHighlightedTile(greyTiles);
        const possibleMoves = game.moves({ square: chessId, verbose: true });

        if (possibleMoves.length === 0) return;
        for (const move of possibleMoves) {
          const temp = this.reverseTranslation(move.to);
          const tile = document.getElementById(temp);
          if (tile) {
            tile.style.boxShadow = '0 0 5px rgba(0, 180, 180, 0.8), 0 0 10px rgba(0, 180, 180, 0.8), 0 0 15px rgba(0, 180, 180, 0.8), 0 0 20px rgba(0, 180, 180, 0.8)';
            tile.style.border = '3px solid #02cccc';
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
      
      game.move(move);

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

    dismissCheck(){
      this.showCheck = false;
    },

    removeHighlightedTile() {
      const tiles = document.getElementsByClassName('square');
      for (const tile of tiles) {
        tile.removeAttribute('style');
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
          if (char === "p") {
            iconElement.setAttribute("icon", ['fass', 'chess-pawn']);
            iconElement.style.color = "#000000";
          } else if (char === "P") {
            iconElement.setAttribute("icon", ['fass', 'chess-pawn']);
            iconElement.style.color = "#ffffff";
          } else if (char === "r") {
            iconElement.setAttribute("icon", ['fass', 'chess-rook']);
            iconElement.style.color = "#000000";
          } else if (char === "R") {
            iconElement.setAttribute("icon", ['fass', 'chess-rook']);
            iconElement.style.color = "#ffffff";
          } else if (char === "n") {
            iconElement.setAttribute("icon", ['fass', 'chess-knight']);
            iconElement.style.color = "#000000";
          } else if (char === "N") {
            iconElement.setAttribute("icon", ['fass', 'chess-knight']);
            iconElement.style.color = "#ffffff";
          } else if (char === "b") {
            iconElement.setAttribute("icon", ['fass', 'chess-bishop']);
            iconElement.style.color = "#000000";
          } else if (char === "B") {
            iconElement.setAttribute("icon", ['fass', 'chess-bishop']);
            iconElement.style.color = "#ffffff";
          } else if (char === "q") {
            iconElement.setAttribute("icon", ['fass', 'chess-queen']);
            iconElement.style.color = "#000000";
          } else if (char === "Q") {
            iconElement.setAttribute("icon", ['fass', 'chess-queen']);
            iconElement.style.color = "#ffffff";
          } else if (char === "k") {
            iconElement.setAttribute("icon", ['fass', 'chess-king']);
            iconElement.style.color = "#000000";
          } else if (char === "K") {
            iconElement.setAttribute("icon", ['fass', 'chess-king']);
            iconElement.style.color = "#ffffff"; 
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
 
  background-color: rgb(224, 229, 237);
}

.square.black {
  background-color: #4ab0d5bb
}

</style>