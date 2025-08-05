<script setup>
import { ref, reactive, computed } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'vue-router';
import { authAPI } from '@/api/auth.js';

library.add(faChevronLeft);
const router = useRouter();

const form = reactive({
  name: '',
  email: '',
});

const error = reactive({
  name: '',
  email: '',
});

const foundId = ref('');
const isSubmitted = ref(false);
const loading = ref(false);

const isFormValid = computed(
  () => form.name.trim() && form.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
);

function validate() {
  error.name = form.name.trim() ? '' : '가입 시 등록한 이름을 입력해 주세요';
  error.email = form.email.trim()
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      ? ''
      : '정확한 이메일을 입력해 주세요'
    : '정확한 이메일을 입력해 주세요';
}

async function handleSubmit() {
  validate();
  if (error.name || error.email) return;

  try {
    loading.value = true;
    const response = await authAPI.findLoginId(form.name, form.email);
    console.log('아이디 찾기 응답:', response);

    if (response?.result?.found) {
      foundId.value = response.result.masked_login_id;
    } else {
      foundId.value = '';
    }
  } catch (err) {
    console.error('아이디 찾기 실패:', err);
    foundId.value = '';
    const errorMessage = err.response?.data?.message || '아이디 찾기 중 오류가 발생했습니다.';
    alert(errorMessage);
  } finally {
    loading.value = false;
    isSubmitted.value = true;
  }
}

function resetForm() {
  Object.assign(form, { name: '', email: '' });
  Object.assign(error, { name: '', email: '' });
  foundId.value = '';
  isSubmitted.value = false;
}

function goBack() {
  router.go(-1);
}

function goToLogin() {
  router.push({ name: 'login' });
}
</script>
