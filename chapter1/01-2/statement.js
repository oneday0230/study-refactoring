const invoices = [
  {
    customer: 'BigCo',
    performances: [
      { playID: 'hamlet', audience: 55 },
      { playID: 'as-like', audience: 35 },
      { playID: 'othello', audience: 40 },
    ],
  },
];

const plays = {
  hamlet: { name: 'Hamlet', type: 'tragedy' },
  'as-like': { name: 'As YOu Like it', type: 'comedy' },
  othello: { name: 'Othello', type: 'tragedy' },
};

export function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구내역 (고객명: ${invoice.customer})\n`;

  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = playFor(perf); // 우변을 함수로 추출
    let thisAmount = amountFor(perf, play); // 추출한 함수를 이용

    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);

    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ('comedy' === play.type) {
      volumeCredits += Math.floor(perf.audience / 5);
    }

    // 청구 내역을 출력한다.
    result += `${play.name}: ${format(thisAmount / 100)} ${perf.audience}석\n`;
    totalAmount += thisAmount;
  }
  result += `총액 ${format(totalAmount / 100)}\n`;
  result += `적립 포인트 ${volumeCredits}점\n`;

  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function amountFor(aPerformance, play) {
  // 값이 바뀌지 않는 변수 (aPerformance, play)는 매개변수로 전달
  let result = 0; // 변수를 초기화 하는 코드 thisAmount -> result 명확한 이름으로 변경

  switch (play.type) {
    case 'tragedy': // 비극
      result = 40_000;

      if (aPerformance.audience > 30) {
        result += 1_000 * (aPerformance.audience - 30);
      }
      break;
    case 'comedy': // 희극
      result = 30_000;

      if (aPerformance.audience > 20) {
        result += 10_000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르: ${play.type}`);
  }

  return result; // 함수 안에서 값이 바뀌는 변수 반환
}

const result = statement(invoices[0], plays);
console.log('\n\n');
console.log(result);
