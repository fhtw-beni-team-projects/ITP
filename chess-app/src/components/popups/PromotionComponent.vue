<template>
    <div class="popup" v-show="isOpen">
      <div class="popup-content">
        <h2>Select Promotion Type</h2>
        <button v-for="pieceType in promotionTypes" :key="pieceType" @click="selectPromotion(pieceType)">{{ pieceType }}</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isOpen: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        promotionTypes: ['Queen', 'Rook', 'Bishop', 'Knight'],
      };
    },
    methods: {
      selectPromotion(pieceType) {
        // Emit an event with the selected piece type
        var promoteType = pieceType.charAt(0).toLowerCase();
        //console.log(promoteType);
        this.$emit('promote', promoteType);
      },
    },
  };
  </script>
  
  <style>
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  }
  
  .popup-content {
    background-color: rgba(30, 30, 30, 1);
    padding: 20px;
    border-radius: 8px;
  }
  
  .popup h2 {
    margin-top: 0;
  }
  
  .popup button {
    margin-right: 10px;
  }
  </style>