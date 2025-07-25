const bankLogoMap = {
  '0010001': 'wooribank.png',
  '0010002': 'scbank.png',
  '0010016': 'imbank.png',
  '0010017': 'bnkbank.png',
  '0010019': 'gwangjubank.png',
  '0010020': 'shinhanbank.png',
  '0010022': 'gwangjubank.png',
  '0010024': 'bnkbank.png',
  '0010026': 'ibkbank.png',
  '0010030': 'kdbbank.png',
  '0010927': 'kbbank.png',
  '0011625': 'shinhanbank.png',
  '0013175': 'nhbank.png',
  '0013909': 'kebhanabank.png',
  '0014674': 'kbank.png',
  '0014807': 'suhyupbank.png',
  '0015130': 'kakaobank.png',
  '0017801': 'tossbank.png',
};
const defaultLogo = '/default-bank-logo.png';

export function getBankLogoUrl(bankCode) {
  const fileName = bankLogoMap[bankCode];
  if (fileName) {
    return `/images/financial/${fileName}`;
  }
  return defaultLogo;
} 