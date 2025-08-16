<template>
  <div class="border p-3 rounded mb-3 bg-light">
    <!-- 가입 방법 -->
    <div class="filter-section">
      <div class="filter-label">가입 방법</div>
      <div class="chip-group" role="group" aria-label="가입 방법">
        <button
          v-for="option in joinWayOptions"
          :key="option.value"
          :class="['chip', { active: selectedJoinWays.includes(option.value) }]"
          :aria-pressed="selectedJoinWays.includes(option.value)"
          @click="toggleJoinWay(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- 기간 -->
    <div class="filter-section">
      <div class="filter-label">기간</div>
      <div class="chip-group" role="group" aria-label="기간">
        <button
          v-for="option in periodOptions"
          :key="option.value"
          :class="['chip', { active: selectedPeriod === option.value }]"
          :aria-pressed="selectedPeriod === option.value"
          @click="selectPeriod(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- 금리 -->
    <div class="filter-section">
      <div class="filter-label">금리</div>
      <div class="chip-group" role="group" aria-label="금리 정렬">
        <button
          v-for="option in rateSortOptions"
          :key="option.value"
          :class="['chip', { active: selectedRateSort === option.value }]"
          :aria-pressed="selectedRateSort === option.value"
          @click="selectRateSort(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- 은행명 -->
    <div class="filter-section">
      <div class="filter-label">은행명</div>
      <div class="chip-group bank" role="group" aria-label="은행명">
        <button
          v-for="option in bankOptions"
          :key="option.value"
          :class="['chip', 'chip-sm', { active: selectedBanks.includes(option.value) }]"
          :aria-pressed="selectedBanks.includes(option.value)"
          @click="toggleBank(option.value)"
        >
          <img
            :src="getBankLogoUrl(option.value)"
            alt="로고"
            class="bank-logo"
            @error="$event.target.src='/images/financial/default.png'"
          />
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- 하단 액션 -->
    <div class="filter-actions d-flex gap-2 justify-content-end mt-3">
      <button @click="applyFilter" class="btn btn-primary btn-sm">적용</button>
      <button @click="resetFilter" class="btn btn-secondary btn-sm">초기화</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinancialFilter',
  data() {
    return {
      periodOptions: [
        { label: '전체', value: '' },
        { label: '~ 6개월', value: 6 },
        { label: '~12개월', value: 12 },
        { label: '~24개월', value: 24 },
        { label: '~36개월', value: 36 }
      ],
      rateSortOptions: [
        { label: '높은 금리순', value: 'high' },
        { label: '기본 금리순', value: 'base' }
      ],
      bankOptions: [
        { label: 'KB국민', value: '0010927' },
        { label: '신한', value: '0011625' },
        { label: '우리', value: '0010001' },
        { label: '하나', value: '0013909' },
        { label: 'SC제일', value: '0010002' },
        { label: '카카오뱅크', value: '0015130' },
        { label: 'IBK 기업', value: '0010026' },
        { label: '케이뱅크', value: '0014674' },
        { label: '토스뱅크', value: '0017801' },
        { label: '부산', value: '0010017' },
        { label: 'IM뱅크', value: '0010016' },
        { label: 'SH수협', value: '0014807' },
        { label: '경남', value: '0010024' },
        { label: '광주', value: '0010019' },
        { label: '전북', value: '0010022' },
        { label: '제주', value: '0010020' },
        { label: 'NH농협', value: '0013175' },
        { label: '신협', value: '0014807' }
      ],
      joinWayOptions: [
        { label: '영업점', value: '영업점' },
        { label: '인터넷', value: '인터넷' },
        { label: '스마트폰', value: '스마트폰' },
        { label: '전화', value: '전화' }
      ],
      selectedPeriod: '',
      selectedRateSort: '',
      selectedBanks: [],
      selectedJoinWays: [],
      bankLogoMap: {
        '0010927': 'kbbank.png',
        '0010020': 'shinhanbank.png',
        '0010001': 'wooribank.png',
        '0013909': 'kebhanabank.png',
        '0010002': 'scbank.png',
        '0015130': 'kakaobank.png',
        '0010026': 'ibkbank.png',
        '0014674': 'kbank.png',
        '0017801': 'tossbank.png',
        '0010017': 'bnkbank.png',       // 부산/경남 공용(파일 하나면 이렇게 둬도 OK)
        '0010016': 'imbank.png',
        '0014807': 'suhyupbank.png',    // 수협/신협 공용
        '0010019': 'gwangjubank.png',   // 광주/전북 공용
        '0010022': 'gwangjubank.png',
        '0010024': 'bnkbank.png',
        '0011625': 'shinhanbank.png',
        '0013175': 'nhbank.png'
      }
    }
  },
  methods: {
    getBankLogoUrl(code) {
      // ✅ public/images/financial 경로 사용
      return `/images/financial/${this.bankLogoMap[code] || 'default.png'}`;
    },
    selectPeriod(value) {
      this.selectedPeriod = value;
    },
    selectRateSort(value) {
      this.selectedRateSort = value;
    },
    toggleBank(value) {
      if (this.selectedBanks.includes(value)) {
        this.selectedBanks = this.selectedBanks.filter(v => v !== value);
      } else {
        this.selectedBanks.push(value);
      }
    },
    toggleJoinWay(value) {
      if (this.selectedJoinWays.includes(value)) {
        this.selectedJoinWays = this.selectedJoinWays.filter(v => v !== value);
      } else {
        this.selectedJoinWays.push(value);
      }
    },
    applyFilter() {
      this.$emit('filter-applied', {
        period: this.selectedPeriod,
        rateSort: this.selectedRateSort,
        banks: this.selectedBanks,
        joinWays: this.selectedJoinWays
      });
       this.$emit('close-filter'); // ✅ 필터 닫기 신호
    },
    resetFilter() {
      this.selectedPeriod = '';
      this.selectedRateSort = '';
      this.selectedBanks = [];
      this.selectedJoinWays = [];
    }
  }
}
</script>

<style scoped>
:root {
  --accent: #3182f6;
  --bg-muted: #f7f8fa;
  --border: #e5e8eb;
  --text: #222;
  --text-muted: #6b7684;
}

.filter-section { margin-bottom: 16px; }
.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  appearance: none;
  border: 1px solid var(--border);
  background: var(--bg-muted);
  color: var(--text);
  border-radius: 9999px;
  padding: 8px 14px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: background .15s ease, border-color .15s ease, box-shadow .15s ease, transform .05s ease;
}
.chip:hover {
  background: #f2f4f6;
  border-color: #dfe3e8;
}
.chip:active { transform: translateY(1px); }
.chip.active {
  background: #eef4ff;
  border-color: var(--accent);
  color: var(--text);
  font-weight: 600;
  box-shadow: 0 0 0 3px rgba(49,130,246,0.12);
}

.chip-sm {
  display: flex;
  align-items: center;
 
  font-size: 13px;
}

/* ✅ 은행 칩: 3열 고정 그리드 */
.chip-group.bank {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.chip-group.bank .chip {
  width: 100%;
  justify-content: flex-start;
  min-height: 36px;
}
.chip-group.bank .chip.chip-sm {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 6px;
}

.bank-logo {
  width: 18px;
  height: 18px;
  object-fit: contain;
  margin-right: 6px;
}


</style>
