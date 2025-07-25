<script setup>
import { ref, computed } from 'vue'
import RecommendCard from '@/components/goal/RecommendCard.vue'
import db from '@/data/db.json'
import { useRoute } from 'vue-router'

const route = useRoute()
const goalId = route.params.goalId

const policies = db.YouthPolicy
const productsRaw = db.DepositProduct
const options = db.DepositOption

// DepositProduct에 옵션 금리 붙이기
const products = productsRaw.map(product => {
  const matchedOption = options.find(option => option.deposit_id === product.deposit_id)
  return {
    ...product,
    intr_rate: matchedOption?.intr_rate ?? '정보 없음',
    intr_rate2: matchedOption?.intr_rate2 ?? '정보 없음',
  }
})

// 쿼리 파라미터에서 tab 값 받아 초기 설정
const initialTab = route.query.tab === 'product' ? 'product' : 'policy'
const activeTab = ref(initialTab)
// const activeTab = ref('policy')
function selectTab(tab) {
  activeTab.value = tab
}

</script>

<template>
  <div class="recommendation-list">
    
    <!-- 상단 -->
    <div class="top">
      <div class="top-backbtn">
        <router-link :to="`/goal/${goalId}`">
          <i class="fa-solid fa-chevron-left"></i>
        </router-link>
      </div>
      <div class="top-title">
        <h3>추천 결과</h3>
      </div>
    </div>

    <!-- 탭 버튼 -->
    <div class="tab">
      <button
        :class="{ active: activeTab === 'policy' }"
        @click="selectTab('policy')"
        style="margin-right: 10px;"
      >정책</button>
      <button
        :class="{ active: activeTab === 'product' }"
        @click="selectTab('product')"
      >금융</button>
    </div>

    <!-- 리스트 렌더링 -->
    <!-- 정책 -->
    <div v-if="activeTab === 'policy'">
      <div v-for="policy in policies" :key="policy.policy_id" class="recommendation-item">
        <RecommendCard type="policy" :policy="policy" />
      </div>
    </div>
    <!-- 금융 -->
    <div v-else-if="activeTab === 'product'">
      <div v-for="product in products" :key="product.deposit_id" class="recommendation-item">
        <RecommendCard type="product" :product="product" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 350px;
  margin: 0 auto;
}

/* 상단 */
.top{
  display: flex;
}
.top-backbtn{
  margin-top: 20px; 
  margin-left: 15px;
}
.top-title{
  margin-left: 110px;
}
.top-title>h3{
  text-align: center
}

/* 탭 */
.tab{
  display: flex; 
  justify-content: center; 
  margin: 0;
}


button {
  padding: 8px 16px;
  border: 1px solid white;
  border-radius: 4px;
  background-color: white;
  color: #757575;
  cursor: pointer;
  font-size: 16px;
}
button.active {
  /* background-color: #20B825; */
  color: black;
  font-weight: bolder;
  /* border-color: #20B825; */

}
</style>
