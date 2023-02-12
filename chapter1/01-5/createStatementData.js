class PerformanceCaculator {  // p.66~ 공연료 계산기 생성
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  //amountFor함수를 복제하여 해당 클레스에서 계산 되도록 수정
  get amount() {
    let result = 0;
    switch (this.play.type)
    {
      case 'tragedy': // 비극
        result = 40_000;
        if (this.performance.audience > 30) {
          result += 1_000 * (this.performance.audience - 30);
        }
        break;
      case 'comedy':  // 희극
        result = 30_000;
  
        if (this.performance.audience > 20) {
          result += 10_000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${this.play.type}`);
    }
  
    return result;
  }
}

export default function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;
  
  function enrichPerformance (aPerformance) {
    const calculator = new PerformanceCaculator(aPerformance, playFor(aPerformance)); // 공연 정보를 계산기로 전달
    const result = Object.assign({}, aPerformance); // 얕은 복사 수행
    result.play = calculator.play;
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }
  
  function amountFor(aPerformance) {
    // 원본함수인 amountFor()도 계산기를 이용하도록 수정
    return new PerformanceCaculator(aPerformance, playFor(aPerformance)).amount;
  }
  
  function volumeCreditsFor(aPerformance) {
    let volumeCredits = 0;
    volumeCredits += Math.max(aPerformance.audience - 30, 0);
  
    if ('comedy' === aPerformance.play.type) {
      volumeCredits += Math.floor(aPerformance.audience / 5);
    }
  
    return volumeCredits;
  }
  
  function totalAmount(data) {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }
  
  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }
}