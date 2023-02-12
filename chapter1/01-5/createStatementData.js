export default function createStatementData(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;
  
  function enrichPerformance (aPerformance) {
    const calculator = createPerformanceCaculator(aPerformance, playFor(aPerformance)); // 생성자 대신 팩터리 함수 이용
    const result = Object.assign({}, aPerformance); // 얕은 복사 수행
    result.play = calculator.play;
    result.amount = calculator.amount;  // amountFor() 대신 클래스를 사용용하도록 수정
    result.volumeCredits = calculator.volumeCredits;  //  volumeCreditsFor() 대신 클래스를 사용하도록 수정
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }
  
  function totalAmount(data) {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }
  
  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }
}

function createPerformanceCaculator(aPerformance, aPlay) {
  switch(aPlay.type) {
    case 'tragedy': return new TragedyCalculator(aPerformance, aPlay);
    case 'comedy': return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`알 수 없는 장르: ${aPlay.type}`);
  }
}

class PerformanceCaculator {  // p.66~ 공연료 계산기 생성
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCaculator {
    get amount() {
      let result = 40000;
      if (this.performance.audience > 30) {
        result += 1_000 * (this.performance.audience - 30);
      }
      return result;
    }
}

class ComedyCalculator extends PerformanceCaculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}