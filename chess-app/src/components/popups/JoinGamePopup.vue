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
      openJoinPopup() {
        this.isOpen = true;
      },
      closeJoinPopup() {

        if(event.target.closest('.popup-content')) return;

        this.isOpen = false;
      },
      submitGameId() {
        this.$emit('gameIdEntered', this.gameId);
        this.closeJoinPopup();
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
    background-color: #4ab0d5dd;
    box-shadow: 0 0 10px rgba(0, 180, 180, 0.6); 
    color: white;
    font-size: 28px;
    padding: 20px;
    border-radius: 5px;
    border: 3px solid #02cccc;
  
  }
  
  input {
    margin-bottom: 10px;
  }
  
  button {
    padding: 5px 10px;
    border-radius: 10px; 
    color: gray
  }
  button:hover{
    box-shadow: 0 0 5px rgba(0, 180, 180, 0.8), 0 0 10px rgba(0, 180, 180, 0.8), 0 0 15px rgba(0, 180, 180, 0.8), 0 0 20px rgba(0, 180, 180, 0.8);
  }
  </style>