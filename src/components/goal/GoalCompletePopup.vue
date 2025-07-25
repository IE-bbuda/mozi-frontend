<script setup>
// const closePopup = () => {
//   showCompletePopup.value = false
// }

</script>

<template>
  <!-- <div style="border: 1px solid gray;">
    <h1>목표 달성 팝업</h1>
  </div> -->
  <div class="popup-overlay" @click.self="$emit('close')">
    <div class="popup-content">
      <p class="popup-title">🎉 목표 달성 축하합니다! 🎉</p>
      <p>열심히 달려오신 만큼, 큰 성과를 이루셨어요!</p>
      <button class="close-btn" @click="$emit('close')">닫기</button>
    </div>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.popup-content {
  background: white;
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  max-width: 300px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  animation: popup-fadein 0.3s ease-out;

  margin-right: 15px;
}

.popup-title{
  font-size: 20px;
  font-weight: bolder;
}

.close-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.close-btn:hover {
  background: #43a047;
}

@keyframes popup-fadein {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}
</style>
