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

// p52~ 계산 관련 코드는 전부 statement 함수로 모아지도록 리팩토링
function statement(invoice, plays) { // 본문 전체를 별도 함수로 추출
  const statementData = {};
  statementData.customer = invoice.customer;  // 고객 데이터를 중간 데이터로부터 얻음
  statementData.performances = invoice.performances.map(enrichPerformance);  // 공연정보를 중간 데이터로부터 얻음

  return renderPlainText(statementData, plays);  // 중간 데이터 구조를 인수로 전달 (statementData, 필요없어진 인수(invoice 삭제)

  function amountFor(aPerformance) {
    let result = 0;
    switch (aPerformance.play.type)
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
        throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
    }
  
    return result; // 함수 안에서 값이 바뀌는 변수 반환
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function volumeCreditsFor(aPerformance) {
    let volumeCredits = 0;
    volumeCredits += Math.max(aPerformance.audience - 30, 0);
  
    if ('comedy' === aPerformance.play.type) {
      volumeCredits += Math.floor(aPerformance.audience / 5);
    }
  
    return volumeCredits;
  }

  // p.55 함수로 건넨 데이터를 가변데이터가 아닌 '불변 데이터'로써 수정하지 않고 취급하기 위해 공연 객체를 복사.
  function enrichPerformance (aPerformance) {
    const result = Object.assign({}, aPerformance); // 얕은 복사 수행
    result.play = playFor(result);  // 중간 데이터에 연극 정보 저장
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }
}


// p52~ renderPlainText 함수에는 data 매개변수로 전달된 데이터만 처리하도록 리팩토링
function renderPlainText(data, plays) {  // 중간 데이터 구조를 인수로 전달 (data)
  let result = `청구내역 (고객명: ${data.customer})\n`;  // 고객 데이터를 중간 데이터로부터 얻음
  for (let perf of data.performances) {
    result += `${perf.play.name}: ${use(perf.amount)} ${perf.audience}석\n`;  // 청구 내역을 출력한다.
  }
  
  result += `총액 ${use(totalAmount() / 100)}\n`;
  result += `적립 포인트 ${totalVolumeCredits()}점\n`;
  return result;

  function totalAmount() {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.amount;
    }
    return result;
  }
  
  function totalVolumeCredits() {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.volumeCredits;   // 추출한 함수를 이용해 값을 누적
    }
    return result;
  }
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
