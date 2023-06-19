<template>
    <div class="popup-container" v-if="isOpen" @click="closeJoinPopup">
      <div class="popup-content">
        <h2>Enter Game ID</h2>
        <input type="text" v-model="gameId" placeholder="Game ID" />
        <button @click="submitGameId">Submit</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isOpen: false,
        gameId: '',
      };
    },
    methods: {
      openSpectatePopup() {
        this.isOpen = true;
      },
      closeSpectatePopup() {

        if(event.target.closest('.popup-content')) return;
        
        this.isOpen = false;
      },
      submitGameId() {
        this.$emit('gameIdEntered', this.gameId);
        this.closeSpectatePopup();
      },
    },
  };
  </script>
  
  <style scoped>
  .popup-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .popup-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
  }
  
  input {
    margin-bottom: 10px;
  }
  
  button {
    padding: 5px 10px;
  }
  </style>