// constants/enums.js
export const REGION = {
  SEOUL: 'SEOUL',
  BUSAN: 'BUSAN',
  DAEGU: 'DAEGU',
  INCHEON: 'INCHEON',
  GWANGJU: 'GWANGJU',
  DAEJEON: 'DAEJEON',
  ULSAN: 'ULSAN',
  SEJONG: 'SEJONG',
  JEJU: 'JEJU',
  GYEONGGI: 'GYEONGGI',
  GANGWON: 'GANGWON',
  CHUNGBUK: 'CHUNGBUK',
  CHUNGNAM: 'CHUNGNAM',
  JEONBUK: 'JEONBUK',
  JEONNAM: 'JEONNAM',
  GYEONGBUK: 'GYEONGBUK',
  GYEONGNAM: 'GYEONGNAM',
};

export const REGION_LABELS = {
  SEOUL: '서울',
  BUSAN: '부산',
  DAEGU: '대구',
  INCHEON: '인천',
  GWANGJU: '광주',
  DAEJEON: '대전',
  ULSAN: '울산',
  SEJONG: '세종',
  JEJU: '제주',
  GYEONGGI: '경기도',
  GANGWON: '강원도',
  CHUNGBUK: '충청북도',
  CHUNGNAM: '충청남도',
  JEONBUK: '전라북도',
  JEONNAM: '전라남도',
  GYEONGBUK: '경상북도',
  GYEONGNAM: '경상남도',
};

export const MARITAL_STATUS = {
  SINGLE: 'SINGLE',
  MARRIED: 'MARRIED',
};

export const MARITAL_STATUS_LABELS = {
  SINGLE: '미혼',
  MARRIED: '기혼',
};

export const EDUCATION_LEVEL = {
  NO_RESTRICTION: 'NO_RESTRICTION',
  LESS_THAN_HIGH: 'LESS_THAN_HIGH',
  HIGH_SCHOOL_ENROLLED: 'HIGH_SCHOOL_ENROLLED',
  HIGH_SCHOOL_EXPECTED: 'HIGH_SCHOOL_EXPECTED',
  HIGH_SCHOOL: 'HIGH_SCHOOL',
  COLLEGE_ENROLLED: 'COLLEGE_ENROLLED',
  COLLEGE_EXPECTED: 'COLLEGE_EXPECTED',
  COLLEGE: 'COLLEGE',
  GRADUATE: 'GRADUATE',
  OTHER: 'OTHER',
};

export const EDUCATION_LEVEL_LABELS = {
  NO_RESTRICTION: '제한없음',
  LESS_THAN_HIGH: '고등학교 미만',
  HIGH_SCHOOL_ENROLLED: '고등학교 재학',
  HIGH_SCHOOL_EXPECTED: '고등학교 졸업 예정',
  HIGH_SCHOOL: '고등학교 졸업',
  COLLEGE_ENROLLED: '전문대학 재학',
  COLLEGE_EXPECTED: '전문대학 졸업 예정',
  COLLEGE: '전문대학 졸업',
  GRADUATE: '대학원',
  OTHER: '기타',
};

export const EMPLOYMENT_STATUS = {
  NO_RESTRICTION: 'NO_RESTRICTION',
  EMPLOYED: 'EMPLOYED',
  SELF_EMPLOYED: 'SELF_EMPLOYED',
  UNEMPLOYED: 'UNEMPLOYED',
  FREELANCER: 'FREELANCER',
  DAY_WORKER: 'DAY_WORKER',
  SHORT_TERM_WORKER: 'SHORT_TERM_WORKER',
  PREPARING_STARTUP: 'PREPARING_STARTUP',
  FARMER: 'FARMER',
  OTHER: 'OTHER',
};

export const EMPLOYMENT_STATUS_LABELS = {
  NO_RESTRICTION: '제한없음',
  EMPLOYED: '재직자',
  SELF_EMPLOYED: '자영업자',
  UNEMPLOYED: '미취업자',
  FREELANCER: '프리랜서',
  DAY_WORKER: '일용근로자',
  SHORT_TERM_WORKER: '단기근로자',
  PREPARING_STARTUP: '예비창업자',
  FARMER: '영농종사자',
  OTHER: '기타',
};

export const MAJOR = {
  NO_RESTRICTION: 'NO_RESTRICTION',
  HUMANITIES: 'HUMANITIES',
  SOCIAL: 'SOCIAL',
  BUSINESS: 'BUSINESS',
  LANGUAGE: 'LANGUAGE',
  ENGINEERING: 'ENGINEERING',
  ARTS_SPORTS: 'ARTS_SPORTS',
  AGRICULTURE: 'AGRICULTURE',
  OTHER: 'OTHER',
};

export const MAJOR_LABELS = {
  NO_RESTRICTION: '제한없음',
  HUMANITIES: '인문계열',
  SOCIAL: '사회계열',
  BUSINESS: '상경계열',
  LANGUAGE: '어학계열',
  ENGINEERING: '공학계열',
  ARTS_SPORTS: '예체능계열',
  AGRICULTURE: '농산업계열',
  OTHER: '기타',
};

export const SPECIALTY = {
  NO_RESTRICTION: 'NO_RESTRICTION',
  SME: 'SME',
  WOMEN: 'WOMEN',
  BASIC_LIVELIHOOD: 'BASIC_LIVELIHOOD',
  SINGLE_PARENT: 'SINGLE_PARENT',
  DISABLED: 'DISABLED',
  FARMER: 'FARMER',
  MILITARY: 'MILITARY',
  LOCAL_TALENT: 'LOCAL_TALENT',
  OTHER: 'OTHER',
};

export const SPECIALTY_LABELS = {
  NO_RESTRICTION: '제한없음',
  SME: '중소기업',
  WOMEN: '여성',
  BASIC_LIVELIHOOD: '기초생활수급자',
  SINGLE_PARENT: '한부모가정',
  DISABLED: '장애인',
  FARMER: '농업인',
  MILITARY: '군인',
  LOCAL_TALENT: '지역인재',
  OTHER: '기타',
};

// 옵션 배열로 변환하는 헬퍼 함수들
export const getRegionOptions = () =>
  Object.keys(REGION).map((key) => ({
    code: REGION[key],
    label: REGION_LABELS[key],
  }));

export const getEducationOptions = () =>
  Object.keys(EDUCATION_LEVEL).map((key) => ({
    code: EDUCATION_LEVEL[key],
    label: EDUCATION_LEVEL_LABELS[key],
  }));

export const getEmploymentOptions = () =>
  Object.keys(EMPLOYMENT_STATUS).map((key) => ({
    code: EMPLOYMENT_STATUS[key],
    label: EMPLOYMENT_STATUS_LABELS[key],
  }));

export const getMajorOptions = () =>
  Object.keys(MAJOR).map((key) => ({
    code: MAJOR[key],
    label: MAJOR_LABELS[key],
  }));

export const getSpecialtyOptions = () =>
  Object.keys(SPECIALTY).map((key) => ({
    code: SPECIALTY[key],
    label: SPECIALTY_LABELS[key],
  }));
