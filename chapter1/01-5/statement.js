import invoices from '../invoices.json' assert { type: "json" };
import plays from '../plays.json' assert { type: "json" };
import { createStatementData } from './createStatementData.js';

function htmlStatement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data, plays) {
  let result = `청구내역 (고객명: ${data.customer})\n`;
  for (let perf of data.performances) {
    result += `${perf.play.name}: ${use(perf.amount)} ${perf.audience}석\n`;  // 청구 내역을 출력한다.
  }
  
  result += `총액 ${use(data.totalAmount)}\n`;
  result += `적립 포인트 ${data.totalVolumeCredits}점\n`;
  return result;
}

function use(aNumber) {
  return new Intl.NumberFormat('en-US', 
  {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(aNumber / 100);
}

//TestCode
const result = htmlStatement(invoices[0], plays);
console.log('\n\n');
console.log(result);
