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
    //const play = playFor(perf); -> 인라인된 변수는 제거 (6.4절 변수 인라인하기 참조)
    //let thisAmount = amountFor(perf, playFor(perf)); -> 인라인처리하여 변수 제거
    
    volumeCredits += volumeCreditsFor(perf);   // 추출한 함수를 이용해 값을 누적
    
    // 청구 내역을 출력한다.
    result += `${playFor(perf).name}: ${format(amountFor(perf) / 100)} ${perf.audience}석\n`;   // 변수 인라인(playFor, amountFor)
    totalAmount += amountFor(perf);   // 변수 인라인(amountFor)
  }
  result += `총액 ${format(totalAmount / 100)}\n`;
  result += `적립 포인트 ${volumeCredits}점\n`;

  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function volumeCreditsFor(aPerformance) {   // 새로 추출한 함수
  let volumeCredits = 0;
  
  volumeCredits += Math.max(aPerformance.audience - 30, 0);

  if ('comedy' === playFor(aPerformance).type) {  // 변수 인라인(playFor)
    volumeCredits += Math.floor(aPerformance.audience / 5);
  }

  return volumeCredits;
}

function amountFor(aPerformance) {  // 변수 인라인 리팩토링으로 play 매개변수 삭제
  let result = 0; // 변수를 초기화 하는 코드 thisAmount -> result 명확한 이름으로 변경

  switch (playFor(aPerformance).type) // play를 playFor() 호출로 변경
  {
    case 'tragedy': // 비극
      result = 40_000;

      if (aPerformance.audience > 30) {
        result += 1_000 * (aPerformance.audience - 30);
      }
      break;
    case 'comedy':  // 희극
      result = 30_000;

      if (aPerformance.audience > 20) {
        result += 10_000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);  // play를 playFor() 호출로 변경
  }

  return result; // 함수 안에서 값이 바뀌는 변수 반환
}

const result = statement(invoices[0], plays);
console.log('\n\n');
console.log(result);
