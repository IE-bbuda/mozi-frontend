// src/pages/financialSearch/util/bankDepositUrl.js

// 은행 코드별 예금 안내 페이지 URL 매핑 
const bankDepositUrlMap = {
  '0010001': 'https://spot.wooribank.com/pot/Dream?withyou=PODEP0019',
  '0010002': 'https://www.standardchartered.co.kr/np/kr/pl/se/SavingList.jsp?ptfrm=HIN.KOR.INTRO.mega.korPerA1_1',
  '0010016': 'https://www.imbank.co.kr/com_ebz_fnp_sub_main.jsp',
  '0010017': 'https://www.busanbank.co.kr/ib20/mnu/FPMDPO012009001',
  '0010019': 'https://www.kjbank.com/ib20/mnu/FPMDPTR030000',
  '0010020': 'https://bank.shinhan.com/index.jsp#020105020000',
  '0010022': 'https://www.kjbank.com/ib20/mnu/FPMDPTR030000',
  '0010024': 'https://www.busanbank.co.kr/ib20/mnu/FPMDPO012009001',
  '0010026': 'https://mybank.ibk.co.kr/uib/jsp/index.jsp',
  '0010030': 'https://banking.kdb.co.kr/bp/index.jsp',
  '0010927': 'https://obank.kbstar.com/quics?page=C016613#CP',
  '0011625': 'https://bank.shinhan.com/index.jsp#020105020000',
  '0013175': 'https://smartmarket.nonghyup.com/servlet/BFDCW1012R.view',
  '0013909': 'https://www.kebhana.com/cont/mall/mall08/mall0805/index.jsp?_menuNo=62608',
  '0014674': 'https://www.kbanknow.com/ib20/mnu/FPMDPT070000',
  '0014807': 'https://www.suhyup-bank.com/',
  '0015130': 'https://www.kakaobank.com/products/deposit',
  '0017801': 'https://www.tossbank.com/product-service/savings/time-deposit',
};

export function getBankDepositUrl(bankCode) {
  return bankDepositUrlMap[bankCode] || '#';
} 