// src/stores/bank.js
import { defineStore } from 'pinia';

export const useBankStore = defineStore('bank', {
  state: () => ({
    banks: [
      {
        name: '기업은행',
        code: '0003',
        logo: '/resources/images/financial/ibkbank.png',
        link: 'https://mybank.ibk.co.kr/uib/jsp/index.jsp',
        connected: false,
      },
      {
        name: '국민은행',
        code: '0004',
        logo: '/resources/images/financial/kbbank.png',
        link: 'https://obank.kbstar.com/quics?page=C055068&QSL=F#loading',
        connected: false,
      },
      {
        name: '우리은행',
        code: '0020',
        logo: '/resources/images/financial/wooribank.png',
        link: 'https://spib.wooribank.com/pib/Dream?withyou=CMLGN0001',
        connected: false,
      },
      {
        name: '농협은행',
        code: '0011',
        logo: '/resources/images/financial/nhbank.png',
        link: 'https://banking.nonghyup.com/servlet/IPCNPA000I.view',
        connected: false,
      },
      {
        name: 'SC은행',
        code: '0023',
        logo: '/resources/images/financial/scbank.png',
        link: 'https://open.standardchartered.co.kr/login/index?langCode=KR&certLogin=Y&prdType=&redirectURL=/main/H03501?menuid=OIB01010000000000&amp;ptfrm=HIN.KOR.INTRO.top5_sub2&ascpURL=',
        connected: false,
      },
      {
        name: '씨티은행',
        code: '0027',
        logo: '/resources/images/financial/citybank.png',
        link: 'https://www.citibank.co.kr/ComLognLogn0100.act',
        connected: false,
      },
      {
        name: '대구은행',
        code: '0031',
        logo: '/resources/images/financial/daegubank.png',
        link: 'https://banking.imbank.co.kr/index.jsp',
        connected: false,
      },
      {
        name: '전북은행',
        code: '0037',
        logo: '/resources/images/financial/jeonbuk.png',
        link: 'https://ibs.jbbank.co.kr/',
        connected: false,
      },
      {
        name: '경남은행',
        code: '0039',
        logo: '/resources/images/financial/bnkbank.png',
        link: 'https://www.knbank.co.kr/ib20/mnu/CMMLGI001001001',
        connected: false,
      },
      {
        name: '새마을금고',
        code: '0045',
        logo: '/resources/images/financial/KFCCbank.png',
        link: 'https://ibs.kfcc.co.kr/LOGN/02/PIBLOGN020001',
        connected: false,
      },
      {
        name: '우체국',
        code: '0071',
        logo: '/resources/images/financial/koreapostbank.png',
        link: 'https://www.epostbank.go.kr/LNLNDM00DM.do',
        connected: false,
      },
      {
        name: 'KEB하나은행',
        code: '0081',
        logo: '/resources/images/financial/kebhanabank.png',
        link: 'https://www.kebhana.com/common/login.do',
        connected: false,
      },
      {
        name: '신한은행',
        code: '0088',
        logo: '/resources/images/financial/shinhanbank.png',
        link: 'https://bank.shinhan.com/index.jsp#252400000000',
        connected: false,
      },
    ],
  }),
  actions: {
    markAsConnected(code) {
      const bank = this.banks.find((b) => b.code === code);
      if (bank) bank.connected = true;
    },
    initializeConnectedBanks(connectedBankCodes) {
      this.banks.forEach((b) => {
        b.connected = connectedBankCodes.includes(b.code);
      });
    },
  },
  getters: {
    connectedCount: (state) => state.banks.filter((b) => b.connected).length,
  },
});
