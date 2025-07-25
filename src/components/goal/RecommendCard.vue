<script setup>
// const props = defineProps({
//   policy: Object
// })
const props = defineProps({
  type: {
    type: String,
    required: true, // 'policy' 또는 'product'
  },
  policy: Object,
  product: Object
})
</script>


<template>
  <!-- <h1>추천 카드 (공통)</h1> -->


  <!-- <div class="recommend-card"> -->
  <div :class="['recommend-card', type]">

    <!-- 정책 카드(policy) -->
    <template v-if="type === 'policy' && policy">
    
      <div class="card" style="display: flex;">
        <!-- 왼(이미지) -->
        <div class="card-image" style="margin-right: 7px; margin-top: 2px;">
          <img src="/images/goal/policy.png" alt="정책 이미지" style="width: 30px; height: 30px;"/>
        </div>

        <!-- 오(내용) -->
        <div class="card-body">
          <div style="display: flex;">
            <p class="title"><strong>{{ policy.plcyNm }}</strong></p>

            <div style="">
              <!-- <i class="fa-solid fa-bookmark" style="color: #569FFF;"></i> -->
              <!-- <i class="fa-regular fa-bookmark" style="color: #757575;"></i> -->
              <!-- <p style="font-size: 14px;">90점</p> -->
            </div>
          </div>

          <p class="txt">{{ policy.plcyExplnCn }}</p>
          <p class="category">
            <span class="label">분류</span> {{ policy.lclsfNm }}
          </p>
          <p class="age">
            <span class="label">연령</span> {{ policy.sprtTrgtMinAge }} ~ {{ policy.sprtTrgtMaxAge }}세
          </p>
          <p class="period">
            <span class="label">기간</span> {{ policy.bizPrdBgngYmd }} ~ {{ policy.bizPrdEndYmd }}
          </p>
          <div class="keyword">
            <div class="tag">
              <p>{{ policy.lclsfNm }}</p>
              <p>{{ policy.mclsfNm }}</p>
            </div>
          </div>
          <div class="url">
            <p>
              <a :href="policy.aplyUrlAddr" target="_blank" rel="noopener noreferrer">자세히보기</a>
            </p>
          </div>
        </div><!-- end card-body -->
      </div><!-- end card-->
    </template>

    <!-- 금융 상품 카드(product) -->
    <template v-else-if="type === 'product' && product">

      <div class="card" style="display: flex;">
        <!-- 왼(이미지) -->
        <div class="card-image" style="margin-right: 7px; margin-top: 2px;">
          <img src="/images/goal/kb.png" alt="정책 이미지" style="width: 30px; height: 30px;"/>
        </div>

        <!-- 오(내용) -->
        <div class="card-body">

          <p class="title"><strong>{{ product.fin_prdt_nm }}</strong></p>
          <p class="txt">기본 금리: {{ product.intr_rate }}%</p>
          <p class="txt">최고 우대 금리: {{ product.intr_rate2 }}%</p>
          <p class="category">
            <span class="label">대상</span> {{ product.join_member }}
          </p>
          <p class="age">
            <span class="label">최고한도</span> {{ product.max_limit.toLocaleString() }}원
          </p>
          <p class="period">
            <span class="label">공시 기간</span> {{ product.dcls_start_day }} ~ {{ product.dcls_end_day }}
          </p>
          <div class="keyword">
            <div class="tag">
              <p>{{ product.kor_co_nm }}</p>
              <p>{{ product.join_way }}</p>
            </div>
          </div>

        </div><!-- end card-body-->
      </div><!-- end card-->
    </template>

    <!-- 데이터 없을 때 -->
    <template v-else>
      <p>데이터가 없습니다.</p>
    </template>

  </div>
</template>

<style scoped>

.recommend-card {
  margin-left: 10px;
  margin-right: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  padding: 12px 1rem;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  text-align: left;
  background-color: #fff;
  margin-bottom: 1rem;

  /* 기본(왼쪽): 색 x */
  border-left: 7px solid transparent;
}

/* 정책: 초록 */
.recommend-card.policy {
  border-left-color: #20B825;
}

/* 금융: 노란색 */
.recommend-card.product {
  border-left-color: #FCC659;
}


.recommend-card p,
.recommend-card .keyword,
.recommend-card .url {
  margin-top: 4px;
  margin-bottom: 4px;
}
.recommend-card p:first-child {
  margin-top: 0;
}

.recommend-card .url {
  margin-bottom: 0;
}

.title{
  font-size: 14px;
}

.txt,
.category,
.age,
.period{
  font-size: 12px;
}

.label{
  color: #c6c6c6;
}

/* 키워드 */
.keyword .tag p {
  display: inline-block;
  background-color: #d9d9d9; 
  padding: 4px 10px; 
  border-radius: 5px; 
  font-size: 10px;
  color: #757575; 
  margin-right: 4px;

  margin-bottom: 0px;
}

/* 자세히보기 */
.url {
  display: flex;
  justify-content: flex-end;

  margin-top: 0px;
}

.url>p{
  display: inline-block;
  border: 1px solid #d9d9d9;
  padding: 4px;
  border-radius: 5px;
  color: #757575;
  font-size: 12px;
}

</style>
