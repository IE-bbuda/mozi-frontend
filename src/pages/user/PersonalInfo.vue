<template>
  <div class="container">
    <h1 class="title">퍼스널 정보 입력</h1>

    <!-- Step 0: 기본 정보 -->
    <div v-if="currentStep === 0" class="step">
      <label>관심지역</label>
      <select v-model="form.region" class="select-input">
        <option value="">지역을 선택하세요</option>
        <option v-for="option in regionOptions" :key="option.code" :value="option.code">
          {{ option.label }}
        </option>
      </select>

      <label>연령 (만)</label>
      <input type="number" v-model.number="form.age" placeholder="예: 24" min="0" />

      <label>혼인여부</label>
      <div class="radio-group">
        <label><input type="radio" :value="MARITAL_STATUS.SINGLE" v-model="form.maritalStatus" /> 미혼</label>
        <label><input type="radio" :value="MARITAL_STATUS.MARRIED" v-model="form.maritalStatus" /> 기혼</label>
      </div>

      <label>연소득</label>
      <div class="income">
        <input type="number" v-model.number="form.annualIncome" placeholder="숫자 입력" min="0" />
        <span>만원</span>
      </div>
    </div>

    <!-- Step 1: 학력 -->
    <div v-else-if="currentStep === 1" class="step">
      <label>학력</label>
      <div class="btn-group">
        <button
          v-for="opt in educationOptions"
          :key="opt.code"
          :class="{ active: form.educationLevel === opt.code }"
          @click="form.educationLevel = opt.code">
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Step 2: 취업 상태 -->
    <div v-else-if="currentStep === 2" class="step">
      <label>취업 상태</label>
      <div class="btn-group">
        <button
          v-for="opt in employmentOptions"
          :key="opt.code"
          :class="{ active: form.employmentStatus === opt.code }"
          @click="form.employmentStatus = opt.code">
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Step 3: 전공 계열 -->
    <div v-else-if="currentStep === 3" class="step">
      <label>전공 분야</label>
      <div class="btn-group">
        <button
          v-for="opt in majorOptions"
          :key="opt.code"
          :class="{ active: form.major === opt.code }"
          @click="form.major = opt.code">
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Step 4: 특화 분야 -->
    <div v-else-if="currentStep === 4" class="step">
      <label>특화 분야</label>
      <div class="btn-group">
        <button
          v-for="opt in specialtyOptions"
          :key="opt.code"
          :class="{ active: form.specialty === opt.code }"
          @click="form.specialty = opt.code">
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="btns">
      <button class="btn-cancel" @click="onCancel">취소</button>
      <button class="btn-next" :disabled="!stepValid" @click="onNext">
        {{ currentStep < 4 ? '다음' : '완료' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { profileAPI } from '@/api/profile.js';
import {
  MARITAL_STATUS,
  getRegionOptions,
  getEducationOptions,
  getEmploymentOptions,
  getMajorOptions,
  getSpecialtyOptions,
} from '@/constants/enums.js';

const router = useRouter();
const currentStep = ref(0);

// enum 옵션들
const regionOptions = getRegionOptions();
const educationOptions = getEducationOptions();
const employmentOptions = getEmploymentOptions();
const majorOptions = getMajorOptions();
const specialtyOptions = getSpecialtyOptions();

// form 객체 - enum 코드로 저장
const form = reactive({
  // 기본 정보
  region: '',
  age: null,
  maritalStatus: '',
  annualIncome: null,
  // 추가 정보
  educationLevel: '',
  employmentStatus: '',
  major: '',
  specialty: '',
});

onMounted(async () => {
  try {
    const profile = await profileAPI.getProfile();

    if (profile && profile.result) {
      // BaseResponse 구조인 경우
      const data = profile.result;
      Object.assign(form, {
        region: data.region || '',
        age: data.age || null,
        maritalStatus: data.marital_status || data.maritalStatus || '',
        annualIncome: data.annual_income || data.annualIncome || null,
        educationLevel: data.education_level || data.educationLevel || '',
        employmentStatus: data.employment_status || data.employmentStatus || '',
        major: data.major || '',
        specialty: data.specialty || '',
      });
    } else if (profile) {
      // 직접 프로필 객체인 경우
      Object.assign(form, {
        region: profile.region || '',
        age: profile.age || null,
        maritalStatus: profile.marital_status || profile.maritalStatus || '',
        annualIncome: profile.annual_income || profile.annualIncome || null,
        educationLevel: profile.education_level || profile.educationLevel || '',
        employmentStatus: profile.employment_status || profile.employmentStatus || '',
        major: profile.major || '',
        specialty: profile.specialty || '',
      });
    }
  } catch (err) {
    console.log('기존 프로필 없음');
  }
});

const stepValid = computed(() => {
  if (currentStep.value === 0) {
    return form.region && form.age >= 0 && form.maritalStatus && form.annualIncome >= 0;
  }
  if (currentStep.value === 1) return !!form.educationLevel;
  if (currentStep.value === 2) return !!form.employmentStatus;
  if (currentStep.value === 3) return !!form.major;
  if (currentStep.value === 4) return !!form.specialty;
  return false;
});

function onCancel() {
  Object.assign(form, {
    region: '',
    age: null,
    maritalStatus: '',
    annualIncome: null,
    educationLevel: '',
    employmentStatus: '',
    major: '',
    specialty: '',
  });
  currentStep.value = 0;
}

async function onNext() {
  if (!stepValid.value) {
    alert('필수 항목을 입력해주세요.');
    return;
  }

  if (currentStep.value < 4) {
    currentStep.value++;
  } else {
    await saveProfile();
  }
}

async function saveProfile() {
  try {
    const profileData = {
      region: form.region,
      age: form.age,
      marital_status: form.maritalStatus,
      annual_income: form.annualIncome,
      education_level: form.educationLevel,
      employment_status: form.employmentStatus,
      major: form.major,
      specialty: form.specialty,
    };

    await profileAPI.saveProfile(profileData);
    alert('프로필이 저장되었습니다!');
    await router.push({ name: 'myPage' });
  } catch (err) {
    console.error('저장 실패:', err.response?.data);
    alert('저장에 실패했습니다: ' + (err.response?.data?.message || err.message));
  }
}
</script>

<style scoped>
.container {
  max-width: 360px;
  margin: 20px auto;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
}

/* 기본 정보 입력 스타일 */
input[type='number'] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 12px;
}

.select-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 12px;
  background: white;
}

.radio-group {
  margin-bottom: 12px;
}

.radio-group label {
  display: inline-block;
  margin-right: 16px;
  font-weight: normal;
}

.income {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.income input {
  flex: 1;
  margin-bottom: 0;
}

.income span {
  margin-left: 8px;
}

/* 버튼 그룹 스타일 */
.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.btn-group button {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fafafa;
  cursor: pointer;
}

.btn-group button.active {
  background: #36c18c;
  color: #fff;
  border-color: #36c18c;
}

.btns {
  display: flex;
  gap: 8px;
}

.btn-cancel {
  flex: 1;
  background: #f2f4f6;
  padding: 12px;
  color: #b0b8c1;
  border: none;
  border-radius: 4px;
}

.btn-next {
  flex: 1;
  background: #36c18c;
  padding: 12px;
  color: #fff;
  font-size: 1rem;
}
.actions button:last-child {
  margin-right: 0;
}
.actions button:first-child {
  background: #a0c4c1;
}
.actions button:last-child {
  background: #36c18c;
  color: #ffffff;
}
.actions button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.title {
  text-align: center;
  margin-bottom: 16px;
  color: #36c18c;
}
</style>
