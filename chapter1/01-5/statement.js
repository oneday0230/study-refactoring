import invoices from '../invoices.json' assert { type: "json" };
import plays from '../plays.json' assert { type: "json" };
import createStatementData from './createStatementData.js';

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data, plays) {
  let result = `청구내역 (고객명: ${data.customer})\n`;
  for (let perf of data.performances) {
    result += `${perf.play.name}: ${use(perf.amount)} ${perf.audience}석\n`;  // 청구 내역을 출력한다.
  }
  
  result += `총액 ${use(data.totalAmount)}\n`;
  result += `적립 포인트 ${data.totalVolumeCredits}점\n`;
  return result;
}

function htmlStatement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays)); // 중간 데이터 생성 함수를 공유
}

function renderHtml(data) {
  let result = `<h1>청구내역 (고객명: ${data.customer})</h1>\n`;
  result += '<table>\n';
  result += '<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>\n';

  for (let perf of data.performances) {
    result += `<tr><td>${perf.play.name}</td><td>${perf.audience}석</td>`;  // 청구 내역을 출력한다.
    result += `<td>${use(perf.amount)}</td></tr>\n`
  }
  result += '</table>\n';
  result += `<p>총액: <em>${use(data.totalAmount)}</em></p>\n`;
  result += `<p>적립 포인트: <em>${data.totalVolumeCredits}점</em></p>\n`;
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
const result = statement(invoices[0], plays);
console.log('\n\n');
console.log(result);
