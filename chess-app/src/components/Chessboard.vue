
<template>
    <div class="chessboard">
      <div v-for="row in 8" class="row" :key="row">
        <div v-for="col in 8" 
          :class="getSquareClass(row, col) + (isSelected(row, col) ? ' selected' : '')" 
          :key="`${row}${col}`"
          :id="`${row}-${col}`"
          @click="selectSquare(`${row}-${col}`)">
          
          <font-awesome-icon v-if="row === 2" :icon="['fass', 'chess-pawn']" style="color: #000000; height: 90%;"/>
          <font-awesome-icon v-if="row === 7" :icon="['fass', 'chess-pawn']" style="color: #ffffff; height: 90%;"/>
          <font-awesome-icon v-if="(row===1 && col ===1) || (row===1 && col ===8) " :icon="['fass', 'chess-rook']" style="color: #000000; height: 90%;"/>
          <font-awesome-icon v-if="(row===8 && col ===1) || (row===8 && col ===8) " :icon="['fass', 'chess-rook']" style="color: #ffffff; height: 90%;"/>
          <font-awesome-icon v-if="(row===1 && col ===2) || (row===1 && col ===7) " :icon="['fass', 'chess-knight']" style="color: #000000; height: 90%;" />
          <font-awesome-icon v-if="(row===8 && col ===2) || (row===8 && col ===7) " :icon="['fass', 'chess-knight']" style="color: #ffffff; height: 90%;" />
          <font-awesome-icon v-if="(row===1 && col ===3) || (row===1 && col ===6) " :icon="['fass', 'chess-bishop']" style="color: #000000; height: 90%;" />
          <font-awesome-icon v-if="(row===8 && col ===3) || (row===8 && col ===6) " :icon="['fass', 'chess-bishop']" style="color: #ffffff; height: 90%;" />
          <font-awesome-icon v-if="row === 1 && col === 4" :icon="['fass', 'chess-queen']"  style="color: #000000; height: 90%;"/>
          <font-awesome-icon v-if="row === 8 && col === 4" :icon="['fass', 'chess-queen']"  style="color: #ffffff; height: 90%;"/>
          <font-awesome-icon v-if="row === 1 && col === 5" :icon="['fass', 'chess-king']"  style="color: #000000; height: 90%;"/>
          <font-awesome-icon v-if="row === 8 && col === 5" :icon="['fass', 'chess-king']"  style="color: #ffffff; height: 90%;"/>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Chess-board',
    data() {
      return {
        selectedSquare: ''
      }
    },
    methods: {
      getSquareClass(row, col) {
        return (row + col) % 2 === 0 ? 'square white' : 'square black';
      },
      isSelected(row, col) {
        return `${row}-${col}` === this.selectedSquare;
      },
      selectSquare(squareId) {
        this.selectedSquare = squareId;
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
  
