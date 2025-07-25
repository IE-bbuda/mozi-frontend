<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import RecommendSection from '@/components/goal/RecommendSection.vue';
import GoalCompletePopup from '@/components/goal/GoalCompletePopup.vue';
import ProgressBar from '@/components/goal/ProgressBar.vue';

import db from '@/data/db.json';

import { useRoute } from 'vue-router';

const route = useRoute();
const goalId = route.params.goalId;

// props로 goalId 받기
const props = defineProps({
  goalId: [String, Number],
});

const goal = ref(null);

// goalId가 변경될 때마다 데이터 갱신
const loadGoal = (id) => {
  const numericId = Number(id);
  // goal.value = db.goals.find(g => g.goal_id === numericId) || null
  const foundGoal = db.goals.find((g) => g.goal_id === numericId) || null;
  goal.value = foundGoal;

  //달성 여부에 따라 팝업 띄우기 (goal_status === false → 달성됨)
  if (foundGoal && foundGoal.goal_status === false) {
    showCompletePopup.value = true;
  }
};

// 초기 로드와 goalId 변경 감지
onMounted(() => loadGoal(props.goalId));
watch(
  () => props.goalId,
  (newId) => {
    loadGoal(newId);
  }
);

// 날짜
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(d.getDate()).padStart(2, '0')}`;
}

// 토글
const isExpanded = ref(false);
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

// 삭제 버튼
const showDeleteModal = ref(false);

const confirmDelete = () => {
  // 실제 삭제 로직은 이 안에 구현 (예: emit 이벤트 or API 호출 등)
  console.log(`Deleting goal with id: ${goal.value?.goal_id}`);
  showDeleteModal.value = false;
};

// 목표 달성시 팝업
const showCompletePopup = ref(false);

// 팝업 닫기
const closePopup = () => {
  showCompletePopup.value = false;
};

// 목표 달성 여부 (goal_status === false가 '달성 완료')
const goalAchieved = computed(() => goal.value?.goal_status === false);

</script>

<template>
  <!-- <h1>목표 상세 페이지</h1> -->

  <!-- 상단-->
  <div class="top">
    <!-- 뒤로가기 -->
    <div class="top-backbtn">
      <router-link to="/goal">
        <i class="fa-solid fa-chevron-left"></i>
      </router-link>
    </div>
    <!-- 제목 -->
    <div class="top-title">
      <h3 style="text-align: center">목표 상세보기</h3>
    </div>
  </div>

  <!-- 내용 시작 -->
  <div v-if="goal" class="goal-detail">
    <!-- 목표 정보 영역 -->
    <div class="goal-info">
      <div class="goal-top">

        <div class="mygoal">
          <h3>나의 목표 : {{ goal.goal_name }}</h3>
        </div>

        <div class="icon">
          <!-- 수정 -->
          <router-link :to="`/goal/${goalId}/edit`">
            <i class="fa-solid fa-pen-to-square update"></i>
          </router-link>

          <!-- 삭제 -->
          <!-- <i class="fa-solid fa-trash"></i> -->
          <button
            class="delete-btn"
            @click.stop="showDeleteModal = true"
            aria-label="목표 삭제"
          >
            <i class="fas fa-trash"></i>
          </button>

          <!-- 삭제 확인 모달 -->
          <div
            v-if="showDeleteModal"
            class="modal-overlay"
            @click="showDeleteModal = false"
          >
            <div class="modal-content" @click.stop>
              <div class="modal-header">
                <h3>목표 삭제</h3>
              </div>

              <div class="modal-body">
                <p>'{{ goal.goal_name }}' 목표를 정말 삭제하시겠습니까?</p>
                <p class="warning-text">삭제된 목표는 복구할 수 없습니다.</p>
              </div>

              <div class="modal-footer">
                <button class="cancel-btn" @click="showDeleteModal = false">
                  취소
                </button>
                <button class="confirm-btn" @click="confirmDelete">삭제</button>
              </div>
            </div>
          </div>
          <!-- end modal-overlay -->
        </div>
        <!-- end icon -->
      </div>
      <!-- end goal-top -->

      <!-- 진행률 바 -->
      <!-- <ProgressBar/> -->
      <!-- 진행률 바 삽입 -->
      <ProgressBar
        style="width: 270px;"
        :current="goal.current_amount"
        :target="goal.target_amount"
      />
      <!-- 금액 정보 표시 -->
      <!-- <div class="amount-text">
        <p>
          <span class="amount-label">현재:</span>
          <span class="amount-value">{{ goal.current_amount.toLocaleString() }}원</span>
        </p>
        <p>
          <span class="amount-label">목표:</span>
          <span class="amount-value">{{ goal.target_amount.toLocaleString() }}원</span>
        </p>
      </div> -->

      <!-- <p>목표 금액: {{ goal.target_amount.toLocaleString() }} 원</p> -->

      <!-- 키워드 -->
      <div class="goal-keyword">
        <p>#{{ goal.keyword }}</p>
      </div>

      <!-- 목표 달성 여부에 따라 다른 안내 메시지 -->
      <!-- 달성o : 축하 메세지 -->
      <div v-if="goalAchieved" class="goal-complete">
        <p>🎉 목표를 모두 달성했어요!</p>
      </div>
      <!-- 달성x : 목표 달성 가이드 -->
      <div v-else class="goal-guide">
        <p class="guide">💡목표 달성 가이드</p>
        <p class="comment">조금씩 꾸준히, 목표 자산에 가까워지고 있어요. 오늘도 한 발짝!</p>        
      </div>

      <!-- 토글 버튼 (펼치기)-->
      <div v-if="!isExpanded" class="toggle-arrow" @click="toggleExpand">
        <i class="fa-solid fa-chevron-down"></i>
      </div>

      <!-- 토글 아래 부분 -->
      <div class="toggle-down" v-if="isExpanded">
        <!-- 날짜 -->
        <div class="goal-date">
          <div class="goal-date-target">
            <p><span class="label">목표 달성일</span></p>
            <p>{{ formatDate(goal.goal_date) }}</p>
          </div>
          <div class="goal-date-expect">
            <p><span class="label">예상 달성일</span></p>
            <p>2030-12-31</p>
          </div>
        </div>

        <!-- 메모 -->
        <div class="goal-memo">
          <p><span class="label">메모</span></p>
          <p>{{ goal.memo }}</p>
        </div>

        <!-- 선택 계좌 -->
        <div class="goal-account">
          <p><span class="label">선택계좌</span></p>

          <div style="margin-bottom: 20px">
            <div>
              <input type="checkbox" checked />
              KB국민은행<br />
              ****-****-1234<br />
              100,000원
            </div>
            <div>
              <input type="checkbox" checked />
              신한은행<br />
              ****-****-5678<br />
              500,000원
            </div>
          </div>
        </div>

        <!-- 토글 버튼 (접기)-->
        <div class="toggle-arrow" @click="toggleExpand">
          <i class="fa-solid fa-chevron-up"></i>
        </div>
      </div>
      <!-- end toggle-down -->
    </div>
    <!-- end goal-info -->

    <!-- 목표 달성 여부에 따라 다른 추천 영역 -->
    <!-- 달성o : 자산관리 사이트 -->
    <div v-if="goalAchieved" class="asset-management">
      <h3>목표 달성! 자산 성장 모드 ON</h3>
      <p><a href="#">자산관리 사이트</a></p>
    </div>
    <!-- 달성x : 맞춤형 추천 영역-->
    <div v-else>
      <RecommendSection />
    </div>

    <!-- 목표달성팝업 -->
    <GoalCompletePopup v-if="showCompletePopup" @close="closePopup" />
  </div>
  <!-- section -->

  <!-- 목표 데이터 찾을 수 없을 때 -->
  <div v-else>
    <p class="text-red-500">목표를 찾을 수 없습니다.</p>
  </div>
</template>

<style scoped>
/* 상단 */
.top{
  display: flex; 
  text-align: center
}
.top-backbtn{
  margin-top: 20px; 
  margin-left: 20px
}
.top-title{
  align-items: center; 
  margin-left: 110px
}

/* 내용 시작 */
.goal-detail {
  margin: 0;
  padding: 0;
}

.goal-info {
  margin: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  text-align: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);

  display: flex;
  flex-direction: column;
  align-items: center;
}

.goal-top{
  display: flex
}

.mygoal{
  align-items: center; 
  margin-left: 50px
}

.icon{
  margin-top: 20px; 
  margin-left: 30px
}
.update{
  margin-right: 10px
}

/* 삭제버튼(모달) -> 아래쪽에 */

/* 진행률 바 */
/* 진행률 바 (금액) */
/* .amount-text {
  text-align: left;
  width: 310px;
  margin: 10px 0;
  font-size: 14px;
}

.amount-text p {
  margin: 2px 0;
  display: flex;
  justify-content: space-between;
}

.amount-label {
  color: #555;
  font-weight: 500;
}

.amount-value {
  color: #222;
  font-weight: bold;
} */

/* 키워드 */
.goal-keyword > p {
  display: inline-block;
  padding: 7px;
  /* border: 1px solid gray; */
  background-color: lightgray;
  color: gray;
  border-radius: 5px;
  font-size: 14px;
  line-height: 1;
}

/* 목표 달성 가이드 */
.goal-complete{
  border-radius: 5px;
  padding: 10px 63px;
  background: linear-gradient(90deg, #ffd700, #ffed4e, #ffd700);
  margin-bottom: 10px;
}
.goal-complete>p{
  font-weight: 500;
}

.goal-guide {
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  /* box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); */
  width: 310px;
  /* background-color: #64BAAA; */
  background-color: rgba(100, 186, 170, 0.5);
  margin-bottom: 10px;
  
}
.guide{
  color: white;
  /* text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); */
}
.comment{
  color: #3f3f3f;
  font-weight: 500;
  padding: 5px;
}

.asset-management{
    margin: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  text-align: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);

  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 토글 */
.toggle-arrow {
  cursor: pointer;
  margin: 10px 0;
  font-weight: bold;
  text-align: center;
  color: #666;
  user-select: none;
}

/* 토글 아래 내용 */
.goal-date-target,
.goal-date-expect,
.goal-memo,
.goal-account {
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

.goal-date {
  display: inline-flex;
  margin: 5px;
}
.goal-date-target {
  margin-right: 10px;
  width: 150px;
}
.goal-date-expect {
  width: 150px;
}

.goal-memo {
  width: 310px;
  margin-left: 6px;
}

.goal-account {
  width: 310px;
  margin-bottom: 20px;
  margin-left: 6px;
}

.label{
  color: #bebebe;
}



/* 모달 스타일 (삭제 버튼)*/
.delete-btn {
  border: none;
  background-color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 320px;
  max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 20px 20px 10px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin: 0 0 10px;
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}

.warning-text {
  font-size: 14px !important;
  color: #dc3545 !important;
}

.modal-footer {
  padding: 10px 20px 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.cancel-btn,
.confirm-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background-color: #f8f9fa;
  color: #666;
}

.cancel-btn:hover {
  background-color: #e9ecef;
}

.confirm-btn {
  background-color: #dc3545;
  color: white;
}

.confirm-btn:hover {
  background-color: #c82333;
}
</style>
