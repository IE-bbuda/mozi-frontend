<script setup>
import RecommendCard from './RecommendCard.vue';
import db from '@/data/db.json'

import { useRoute } from 'vue-router'

const route = useRoute()
const goalId = route.params.goalId

// < 정책 >
// const policies = db.YouthPolicy

// 특정 정책 ID로 하나만 추출
const selectedPolicyId = 1
const policy = db.YouthPolicy.find(p => p.policy_id === selectedPolicyId)

// < 금융 >
const depositProduct = db.DepositProduct.find(p => p.deposit_id === 1)
const depositOption = db.DepositOption.find(o => o.deposit_id === 1)

const productData = depositProduct ? {
  ...depositProduct,
  intr_rate: depositOption?.intr_rate ?? null,
  intr_rate2: depositOption?.intr_rate2 ?? null,
} : null
</script>

<template>
  <!-- <h1>추천 영역 (목표 상세 내)</h1> -->

  <div>
    <div class="goal-recommend">
      <!-- 정책 -->
      <div>
        <div class="card-title">
          <div>
            <p>맞춤형 정책 제안</p>
          </div>
          <div class="plusbtn">
            <router-link :to="`/goal/${goalId}/recommendations?tab=policy`">
              <i class="fa-solid fa-plus"></i>
            </router-link>
          </div>
        </div>

        <!-- 정책 카드 -->
        <!-- <RecommendCard v-if="policy" :policy="policy" /> -->
        <RecommendCard type="policy" :policy="policy" />
      </div>

      <!-- 금융 -->
      <div>
        <div class="card-title">
          <div>
            <p>맞춤형 금융 상품</p>
          </div>
          <div class="plusbtn">
            <router-link :to="`/goal/${goalId}/recommendations?tab=product`">
              <i class="fa-solid fa-plus"></i>
            </router-link>
          </div>
        </div>
        
        <!-- 금융 카드 -->
        <!-- <RecommendCard/> -->
        <RecommendCard type="product" :product="productData" />
      </div>

    </div>
  </div>
</template>

<style scoped>
.goal-recommend{
  margin: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  text-align: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}
.goal-recommend>div{
  margin: 10px;
  /* border: 1px solid #d9d9d9; */
  border-radius: 5px;
  text-align: center;
  /* box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); */

  /* display: flex; */
  flex-direction: column;
  align-items: center;
}

/* 카드 */
.card-title{
  display: flex; 
  text-align: center; 
  margin-left: 100px;
}

.plusbtn{
  margin-top: 15px; 
  margin-left: 80px;
}

</style>
