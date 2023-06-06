
<template>
    <div class="chessboard">
      <div v-for="row in 8" class="row" :key="row">
        <!-- 9-row cause rows were inverted -->
        <div v-for="col in 8" 
          :class="getSquareClass(9-row, col) + (isSelected(9-row, col) ? ' selected' : '')" 
          :key="`${9-row}${col}`"
          :id="`${9-row}-${col}`"
          @click="selectSquare(`${9-row}`,`${col}`)">
          
          <font-awesome-icon v-if="row === 2" :icon="['fass', 'chess-pawn']" style="color: #000000; height: 90%; pointer-events: none; z-index: 2;"/>
          <font-awesome-icon v-if="row === 7" :icon="['fass', 'chess-pawn']" style="color: #ffffff; height: 90%; pointer-events: none; z-index: 2;"/>
          <font-awesome-icon v-if="(row===1 && col ===1) || (row===1 && col ===8) " :icon="['fass', 'chess-rook']" style="color: #000000; height: 90%; pointer-events: none; z-index: 2;"/>
          <font-awesome-icon v-if="(row===8 && col ===1) || (row===8 && col ===8) " :icon="['fass', 'chess-rook']" style="color: #ffffff; height: 90%; pointer-events: none; z-index: 2;"/>
          <font-awesome-icon v-if="(row===1 && col ===2) || (row===1 && col ===7) " :icon="['fass', 'chess-knight']" style="color: #000000; height: 90%; pointer-events: none; z-index: 2;"/>
          <font-awesome-icon v-if="(row===8 && col ===2) || (row===8 && col ===7) " :icon="['fass', 'chess-knight']" style="color: #ffffff; height: 90%; pointer-events: none; z-index: 2;"/>
          <font-awesome-icon v-if="(row===1 && col ===3) || (row===1 && col ===6) " :icon="['fass', 'chess-bishop']" style="color: #000000; height: 90%; pointer-events: none; z-index: 2;"/>
          <font-awesome-icon v-if="(row===8 && col ===3) || (row===8 && col ===6) " :icon="['fass', 'chess-bishop']" style="color: #ffffff; height: 90%; pointer-events: none; z-index: 2;"/>
          <font-awesome-icon v-if="row === 1 && col === 4" :icon="['fass', 'chess-queen']"  style="color: #000000; height: 90%; pointer-events: none; z-index: 2;"/>
          <font-awesome-icon v-if="row === 8 && col === 4" :icon="['fass', 'chess-queen']"  style="color: #ffffff; height: 90%; pointer-events: none; z-index: 2;"/>
          <font-awesome-icon v-if="row === 1 && col === 5" :icon="['fass', 'chess-king']"  style="color: #000000; height: 90%; pointer-events: none; z-index: 2;"/>
          <font-awesome-icon v-if="row === 8 && col === 5" :icon="['fass', 'chess-king']"  style="color: #ffffff; height: 90%; pointer-events: none; z-index: 2;"/>
        </div>
      </div>
    </div>
  </template>
  
<script>

  import { Chess } from 'chess.js';

  var greyTiles = [];
  const game = new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

  var currentPiece = "";

  function highlightTiles(id, chessId) {

      if(game.get(chessId)) removeHighlightedTile(greyTiles);

      var tile = document.getElementById(id);
      var possibleMoves = game.moves({square: chessId, verbose: true});

      var piece = game.get(chessId);
      
      if(possibleMoves.length === 0) return;
      //console.log(possibleMoves);

      for(const object of possibleMoves)
      {
        var temp = reverseTranslation(object.to);
        greyTiles.push(temp);
        var tile = document.getElementById(temp);
        tile.style.backgroundColor = "#FF0000";
        console.log("yeet " + temp)
        tile.addEventListener("click", moveChessPiece);
        currentPiece = chessId;
      }

      console.log(greyTiles);
  }

  const moveChessPiece = (event) => {
    
    var newTile = "";
    newTile = event.target.id;
    var moveTo = translateToChessId(newTile[0], newTile[2]);
    console.log(moveTo);
    console.log(currentPiece);
    game.move({ from: currentPiece, to: moveTo });
    console.log(game.ascii());
    currentPiece = "";
    removeHighlightedTile(greyTiles);
  }

  function removeHighlightedTile(tiles) {
    for(const element of tiles) {
      var tile = document.getElementById(element);
      tile.removeAttribute('style');
      tile.removeEventListener("click", moveChessPiece);
    }
    greyTiles = [];
  };

  function reverseTranslation(chessTile) {
    var temp = chessTile.charCodeAt(0) - 96;
    return chessTile[1] + "-" + temp;
  }

  function translateToChessId(row, col) {
    const letterMap = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return letterMap[col-1] + row;
  }

  export default {
    name: 'Chess-board',
    data() {
      return {
        selectedSquare: ''
      }
    },
    mounted() {

    console.log(game.ascii());

    },
    methods: {
      getSquareClass(row, col) {
        return (row + col) % 2 === 0 ? 'square white' : 'square black';
      },
      isSelected(row, col) {
        return `${row}-${col}` === this.selectedSquare;
      },
      selectSquare(row, col) {
        var piece = translateToChessId(row, col);
        highlightTiles(row + '-' + col, piece);
      }      
    },
  };
  </script>
  
  <style scoped>
  .chessboard {
    display: flex;
    flex-wrap: wrap;
    width: 600px;
    height: 600px;
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
  }
  
  .white {
    background-color: #CAD2C5;
  }
  
  .black {
    background-color: #52796F;
  }
  
  .selected {
    background-color: #354F52;
  }
  .icon{
    width: 100%;
    height: 100%;
    
  }
  </style>
  
