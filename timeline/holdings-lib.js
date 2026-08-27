// 공유 순수함수 — Node(require)와 브라우저(window.HoldingsLib) 양쪽. 부수효과·Date.now 없음(테스트 위해 today는 인자).
(function (factory) {
  const lib = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = lib;
  if (typeof window !== 'undefined') window.HoldingsLib = lib;
})(function () {
  const TAXONOMY = ['취득세','법무등기','채권매입','대출부대','명도비','미납관리비','대출이자','재산세','공실관리비','보험','수리비','중개수수료','양도세','중도상환수수료','기타'];
  // 원가 3버킷. 어느 버킷에도 없는 '중개수수료'(매도가 비례)와 '양도세'(세전 이후)는
  // 원가 누적에서 의도적으로 제외한다 — 다른 데서 따로 모델링한다.
  const FIN_CATS = ['대출이자', '중도상환수수료'];
  const VAR_CATS = ['명도비', '미납관리비', '재산세', '공실관리비', '보험', '수리비', '기타'];

  function caseIdOf(sourceResultKey) { return String(sourceResultKey || '').split('@')[0]; }

  function deriveAuctionFacts(holding, RESULTS, CASES) {
    const key = holding && holding.sourceResultKey;
    const r = (RESULTS && RESULTS[key]) || null;
    const caseId = caseIdOf(key);
    const c = (CASES || []).find(function (x) { return x.id === caseId; }) || null;
    return {
      caseId: caseId,
      complex: c ? c.complex : null,
      court: c ? c.court : null,
      dongHo: c ? c.dongHo : null,
      address: c ? c.address : null,
      areaSqm: c ? c.areaSqm : null,
      appraisalPrice: c ? c.appraisalPrice : null,
      reportUrl: c ? c.reportUrl : null,
      wonPrice: r ? r.soldPrice : null,
      wonDate: r ? r.saleDateActual : null,
      bidderCount: r && r.bidderCount != null ? r.bidderCount : null,
      myResult: r ? r.myResult : null,
    };
  }

  // out=지출(+), in=환급/역분개(−). reversal은 반대 direction·동일 amount라 서명합이 상쇄.
  function costTotal(holding) {
    return (holding.costs || []).reduce(function (s, e) {
      const sign = e.direction === 'in' ? -1 : 1;
      return s + sign * (Number(e.amount) || 0);
    }, 0);
  }

  function daysBetween(aISO, bISO) { return Math.round((Date.parse(bISO) - Date.parse(aISO)) / 86400000); }

  function holdingDays(holding, todayISO) {
    const won = (holding.milestones || []).find(function (m) { return m.key === 'won'; });
    const start = won && won.at;
    if (!start) return null;
    const end = holding.disposition === 'sold' ? (holding.resaleClosedAt || todayISO) : todayISO;
    return daysBetween(start, end);
  }


  // ===== 재무 지표 (§Q1) =====
  // 렌더 코드에 산식을 두지 않는다 — 시뮬레이션과 실현손익이 다른 식을 쓰면
  // 매도 순간 숫자가 점프한다. 전부 여기서 계산한다.

  const BROKERAGE_RATE = 0.004;   // 매도 중개수수료 0.4%
  const ACQ_CATS = ['취득세', '법무등기', '채권매입', '대출부대'];

  function signed(e) { return (e && e.direction === 'in' ? -1 : 1) * (Number(e && e.amount) || 0); }

  // 취득부대비 — 잔금·등기 시점에 확정되는 비용만. 보유비용(대출이자 등)은 제외.
  function acquisitionCosts(h) {
    return (h && h.costs || []).filter((c) => ACQ_CATS.indexOf(c.category) >= 0)
      .reduce((s, c) => s + signed(c), 0);
  }

  // 취득총원가 C = 낙찰가 + 취득부대비
  function totalCost(h, facts) {
    const won = facts && facts.wonPrice != null ? facts.wonPrice : 0;
    return won + acquisitionCosts(h);
  }

  // 자기자본 E = C − 조달합계. 0 이면 수익률·IRR 이 정의되지 않는다.
  function equity(h, facts) {
    const fund = (h && h.funding || []).reduce((s, x) => s + (Number(x && x.amount) || 0), 0);
    return totalCost(h, facts) - fund;
  }

  // 변동비 — 아직 집행 전이지만 매도까지 확정적으로 발생할 비용.
  // 원장에 plannedCosts 가 있으면 그것을 쓰고, 없으면 cases.js 모델 추정치에서 파생한다
  // (수리비 repairCost + 명도 등 costBreakdown.etc). 숫자를 원장에 복제하지 않기 위함.
  // 중개수수료는 여기 넣지 않는다 — 매도가 비례라 BROKERAGE_RATE 로 따로 처리한다.
  // 취득비는 이미 costs[] 에 실적으로 있으므로 넣지 않는다.
  function plannedTotal(h, caseData) {
    const explicit = (h && h.plannedCosts) || null;
    if (explicit) return explicit.reduce((s, x) => s + (Number(x && x.amount) || 0), 0);
    if (!caseData) return 0;
    const cb = caseData.costBreakdown || {};
    return (Number(caseData.repairCost) || 0) + (Number(cb.etc) || 0);
  }

  // 변동비 총액 = 미집행 예정비 + 미계상 확정부채.
  // 미계상 부채(예: 공용 체납관리비)는 근거가 확정된 채무라 손익분기에 반드시 들어가야 한다.
  // 원장에 기록된 변동비 실적. 이걸 안 읽으면 실제로 쓴 돈이 손익에서 사라진다.
  function variableExecuted(h) {
    return ((h && h.costs) || []).reduce(
      (s, c) => (VAR_CATS.indexOf(c && c.category) >= 0 ? s + signed(c) : s), 0);
  }

  // 변동비 = max(예산, 집행실적) + 미계상 확정부채.
  // 예산은 '앞으로 더 나갈 돈'의 상한이다. 예산 안에서 쓴 지출은 이미 차감돼 있으니
  // 기록해도 손익분기가 움직이면 안 되고, 예산을 넘긴 초과분만 손익을 깎아야 한다.
  // (구 버전은 예산만 읽어서, 돈을 쓰고 기록해도 본전선이 1원도 안 움직였다.)
  function variableCosts(h, caseData) {
    return Math.max(plannedTotal(h, caseData), variableExecuted(h)) + unbookedTotal(h);
  }

  // 주담보(경락잔금대출) 외 조달 — 신용대출 등. 원리금 상환이 아니라 이자만 계산한다.
  // 주담보를 금액 일치로 골라내면, 다른 조달이 우연히 같은 금액일 때 그 이자가 통째로 사라진다.
  // 명시 플래그(isPrimaryLoan)를 우선하고, 없으면 금액이 맞는 '첫 한 건'만 제외한다.
  function otherFunding(h) {
    const ln = h && h.loan;
    const list = (h && h.funding) || [];
    if (!ln || ln.principal == null) return list.slice();
    if (list.some((x) => x && x.isPrimaryLoan)) return list.filter((x) => !(x && x.isPrimaryLoan));
    let dropped = false;
    return list.filter((x) => {
      if (!dropped && x && x.amount === ln.principal) { dropped = true; return false; }
      return true;
    });
  }

  // 원리금균등 상각표. 이 루프가 여러 벌 존재하면 반드시 어긋나므로 여기 한 곳에만 둔다.
  // loanBalance 와 financeCost 가 이걸 소비한다.
  function amortSchedule(h, n) {
    const ln = h && h.loan;
    const out = [];
    if (!ln || !ln.principal) return out;
    const i = (ln.rate || 0) / 12;
    const M = (ln.repayment && ln.repayment.monthlyPayment) || 0;
    let bal = ln.principal;
    for (let k = 1; k <= n; k++) {
      const interest = bal * i;
      const principal = M ? Math.min(M - interest, bal) : 0;
      bal = Math.max(0, bal - principal);
      out.push({ k: k, interest: interest, principal: principal, balance: bal });
    }
    return out;
  }

  // 원리금균등 상환 잔액. k 회차 납입 후 잔액.
  function loanBalance(h, k) {
    const ln = h && h.loan;
    if (!ln || !ln.principal) return 0;
    if (!(ln.repayment && ln.repayment.monthlyPayment)) return ln.principal;
    const sch = amortSchedule(h, k);
    return sch.length ? sch[sch.length - 1].balance : ln.principal;
  }

  // 금융비용(m) = 경락이자 누계 + 중도상환수수료 + 기타조달 이자
  // m = 잔금일로부터의 개월 수.
  function financeCost(h, m) {
    const ln = h && h.loan;
    if (!ln) return 0;
    const i = (ln.rate || 0) / 12;
    const M = ln.repayment && ln.repayment.monthlyPayment;
    // 스텁이자 — 실행일~첫 납입일 사이 일할 이자. 원장에 실적으로 존재한다.
    const firstAt = ln.repayment && ln.repayment.firstPaidAt;
    const stubEntry = (h.costs || []).find((c) => c.category === '대출이자' && c.occurredAt === firstAt);
    let interest = stubEntry ? Number(stubEntry.amount) || 0 : 0;
    const sch = amortSchedule(h, m);
    interest += sch.reduce((s2, r) => s2 + r.interest, 0);
    if (!sch.length) interest += (ln.principal || 0) * i * m;   // 대출은 있으나 상각표가 없는 경우
    const prepay = loanBalance(h, m) * (ln.prepayFeeRate || 0);
    const others = otherFunding(h)
      .reduce((s, x) => s + (Number(x.amount) || 0) * (Number(x.rate) || 0) * m / 12, 0);
    return interest + prepay + others;
  }

  // 손익분기 매도가 — 이 값 이상으로 팔아야 본전. 중개수수료를 매도가에 비례해 뺀다.
  function breakEvenPrice(h, facts, m, caseData) {
    return (totalCost(h, facts) + financeCost(h, m) + variableCosts(h, caseData)) / (1 - BROKERAGE_RATE);
  }

  // 세전이익 — 매도가 P, 보유 m 개월 가정.
  function pretaxProfit(h, facts, salePrice, m, caseData) {
    return salePrice * (1 - BROKERAGE_RATE) - totalCost(h, facts) - financeCost(h, m)
      - variableCosts(h, caseData);
  }

  // 월 런레이트 — 손익 기준(이자만)과 현금 기준(원리금 전액)은 다르다.
  function monthlyRunRate(h) {
    const ln = h && h.loan;
    if (!ln) return { interest: 0, cash: 0 };
    const i = (ln.rate || 0) / 12;
    const others = otherFunding(h)
      .reduce((s, x) => s + (Number(x.amount) || 0) * (Number(x.rate) || 0) / 12, 0);
    const M = (ln.repayment && ln.repayment.monthlyPayment) || 0;
    return { interest: (ln.principal || 0) * i + others, cash: M + others };
  }

  // 실현 세전이익 — pretaxProfit 과 '같은 분해'에 실적을 대입한다.
  // 구 버전은 variableCosts 를 통째로 빼먹고 모델이자 대신 원장이자만 써서,
  // 같은 가격·같은 날인데 disposition 만 'sold' 로 바꾸면 손익이 1,596만 점프했다.
  function realizedPretax(h, facts) {
    if (!h || h.disposition !== 'sold' || h.resalePrice == null) return null;
    const balAt = (h.milestones || []).find((m) => m.key === 'balance');
    const months = (balAt && balAt.at && h.resaleClosedAt)
      ? Math.max(0, Math.round(daysBetween(balAt.at, h.resaleClosedAt) / 30.44)) : 0;
    const won = facts && facts.wonPrice != null ? facts.wonPrice : 0;
    const finBooked = (h.costs || []).reduce(
      (s2, c) => (FIN_CATS.indexOf(c && c.category) >= 0 ? s2 + signed(c) : s2), 0);
    // 중도상환수수료가 원장에 있으면 그 값을 쓰고, 없을 때만 모델로 채운다(이중계상 방지).
    const feeBooked = (h.costs || []).some((c) => c && c.category === '중도상환수수료');
    const prepay = feeBooked ? 0 : loanBalance(h, months) * ((h.loan && h.loan.prepayFeeRate) || 0);
    return h.resalePrice * (1 - BROKERAGE_RATE)
      - won - acquisitionCosts(h)
      - (finBooked + prepay)
      - (variableExecuted(h) + unbookedTotal(h));
  }

  // 미계상 부채 — variableCosts 에 더해져 손익분기에 반영된다.
  // (구 주석은 '넣지 않는다'고 적혀 있었으나 코드는 정반대였다.)
  function unbookedTotal(h) {
    return (h && h.unbookedLiabilities || []).reduce((s, x) => s + (Number(x && x.amount) || 0), 0);
  }

  // ── 손익 브릿지 — 매도가에서 세전이익까지의 분해 ──
  // pretaxProfit = P(1−b) − totalCost − financeCost − variableCosts 이고
  // totalCost = 낙찰가 + 취득부대비 이므로, 아래 단계 합은 pretaxProfit 과 정확히 일치한다.
  // 산식을 여기서 새로 만들지 않고 기존 함수를 분해만 한다(두 곳이 어긋나는 것을 막는다).
  function profitBridge(h, facts, salePrice, m, caseData) {
    const P = Number(salePrice) || 0;
    const wonP = (facts && facts.wonPrice != null) ? Number(facts.wonPrice) || 0 : 0;
    const steps = [
      { key: 'sale',      label: '매도가',     amount: P,                    kind: 'start' },
      { key: 'brokerage', label: '중개수수료', amount: -P * BROKERAGE_RATE,  kind: 'out' },
      { key: 'won',       label: '낙찰가',     amount: -wonP,                kind: 'out' },
      { key: 'acq',       label: '취득부대비', amount: -acquisitionCosts(h),  kind: 'out' },
      { key: 'finance',   label: '금융비용',   amount: -financeCost(h, m),    kind: 'out' },
      { key: 'variable',  label: '변동비',     amount: -variableCosts(h, caseData), kind: 'out' },
    ];
    const total = steps.reduce((s, x) => s + x.amount, 0);
    steps.push({ key: 'pretax', label: '세전이익', amount: total, kind: 'total' });
    return steps;
  }

  // ── 항목별 비용 — 성격이 다른 네 갈래를 한 축에 모은다 ──
  //   ledgerExecuted : 원장에 있고 오늘까지 집행됨
  //   ledgerPlanned  : 원장에 있으나 날짜가 미래 (확정 예정)
  //   budget         : 원장 밖 예산. plannedCosts 가 있으면 그 카테고리, 없으면 caseData 파생 한 행
  //   unbooked       : 확정 채무인데 원장에 아직 없음
  // 네 갈래는 배타적이어야 하지만 그 불변식을 코드가 강제하지는 못한다(원장 입력에 달려 있다).
  // 같은 이름이 원장과 미계상에 동시에 있으면 conflict 로 표시해 사람이 고치게 한다.
  function costByCategory(h, today0, caseData) {
    const rows = {};
    const get = (cat) => (rows[cat] || (rows[cat] = {
      category: cat, ledgerExecuted: 0, ledgerPlanned: 0, budget: 0, unbooked: 0, total: 0,
    }));
    ((h && h.costs) || []).forEach((e) => {
      const future = e.occurredAt && today0 && String(e.occurredAt) > String(today0);
      const r = get(e.category || '기타');
      if (future) r.ledgerPlanned += signed(e); else r.ledgerExecuted += signed(e);
    });
    const pc = (h && h.plannedCosts) || null;
    if (pc && pc.length) {
      pc.forEach((p) => { get(p.category || '기타').budget += Number(p.amount) || 0; });
    } else {
      const pt = plannedTotal(h, caseData);
      if (pt) get('예정 변동비 (수리·기타)').budget += pt;
    }
    ((h && h.unbookedLiabilities) || []).forEach((u) => {
      get(u.label || '미계상').unbooked += Number(u.amount) || 0;
    });
    const list = Object.keys(rows).map((k) => {
      const r = rows[k];
      r.total = r.ledgerExecuted + r.ledgerPlanned + r.budget + r.unbooked;
      // 원장에 이미 기록된 항목이 미계상에도 남아 있으면 같은 채무를 두 번 세고 있다.
      r.conflict = (r.ledgerExecuted + r.ledgerPlanned !== 0) && r.unbooked !== 0;
      return r;
    }).sort((a, b) => b.total - a.total);
    const totals = { ledgerExecuted: 0, ledgerPlanned: 0, budget: 0, unbooked: 0, total: 0 };
    list.forEach((r) => { Object.keys(totals).forEach((k) => { totals[k] += r[k]; }); });
    return { rows: list, totals: totals };
  }

  // ── 민감도 격자 — 매도가 × 보유개월 → 세전이익 ──
  // "언제 얼마에 팔면 얼마 남는가"를 한 판에 놓는다. 셀 값은 pretaxProfit 을 그대로 부른다.
  // 입력 순서를 보존한다(정렬하면 축 라벨과 어긋난다).
  function sensitivityGrid(h, facts, prices, monthsList, caseData) {
    const ms = (monthsList || []).slice();
    return {
      months: ms,
      breakEven: ms.map((m) => breakEvenPrice(h, facts, m, caseData)),
      rows: (prices || []).map((p) => ({
        price: p,
        cells: ms.map((m) => {
          const profit = pretaxProfit(h, facts, p, m, caseData);
          return { months: m, profit: profit, sign: profit >= 0 ? 'gain' : 'loss' };
        }),
      })),
    };
  }

  function addMonths(ym, n) {
    const y = Number(ym.slice(0, 4)), m = Number(ym.slice(5, 7)) - 1 + n;
    const yy = y + Math.floor(m / 12), mm = ((m % 12) + 12) % 12 + 1;
    return yy + '-' + String(mm).padStart(2, '0');
  }

  // 월별 부담 — 잔금월부터 n 개월. HERO 의 '월 부담' 한 숫자로는
  // "12월까지 현금을 얼마나 마련해둬야 하나"에 답할 수 없다. 누적이 답이다.
  // 과거 월은 원장 실적으로 시드하고 미래만 모델로 채운다.
  function monthlyPlan(h, facts, caseData, n, today0) {
    const bal = ((h && h.milestones) || []).find((m) => m.key === 'balance');
    if (!bal || !bal.at) return [];
    const start = String(bal.at).slice(0, 7);
    const sch = amortSchedule(h, n);
    const otherMonthly = otherFunding(h)
      .reduce((s, x) => s + (Number(x.amount) || 0) * (Number(x.rate) || 0) / 12, 0);
    const nowYM = String(today0 || '').slice(0, 7);
    const rows = [];
    let cum = 0;
    for (let k = 0; k < n; k++) {
      const ym = addMonths(start, k);
      const past = nowYM ? ym <= nowYM : false;
      // 잔금월(k=0)은 첫 정기납입 전이다 — 원장에 있는 실적 이자만 잡는다.
      const booked = ((h && h.costs) || []).reduce(
        (s, c) => (FIN_CATS.indexOf(c && c.category) >= 0 && String(c.occurredAt || '').slice(0, 7) === ym
          ? s + signed(c) : s), 0);
      const r = sch[k - 1];
      const loanInterest = k === 0 ? booked : (r ? r.interest : 0);
      const loanPrincipal = k === 0 ? 0 : (r ? r.principal : 0);
      const cash = loanInterest + loanPrincipal + (k === 0 ? 0 : otherMonthly);
      cum += cash;
      rows.push({
        month: ym, isPast: past, loanInterest: loanInterest, loanPrincipal: loanPrincipal,
        otherInterest: k === 0 ? 0 : otherMonthly, cash: cash, cumCash: cum,
        balance: r ? r.balance : (h.loan ? h.loan.principal : 0),
        breakEven: breakEvenPrice(h, facts, k, caseData),
      });
    }
    return rows;
  }

  return {
    TAXONOMY: TAXONOMY, caseIdOf: caseIdOf, deriveAuctionFacts: deriveAuctionFacts,
    costTotal: costTotal, holdingDays: holdingDays, daysBetween: daysBetween,
    BROKERAGE_RATE: BROKERAGE_RATE, ACQ_CATS: ACQ_CATS,
    FIN_CATS: FIN_CATS, VAR_CATS: VAR_CATS, variableExecuted: variableExecuted,
    otherFunding: otherFunding, amortSchedule: amortSchedule, monthlyPlan: monthlyPlan,
    acquisitionCosts: acquisitionCosts, totalCost: totalCost, equity: equity,
    plannedTotal: plannedTotal, unbookedTotal: unbookedTotal, variableCosts: variableCosts,
    loanBalance: loanBalance, financeCost: financeCost,
    breakEvenPrice: breakEvenPrice, pretaxProfit: pretaxProfit,
    monthlyRunRate: monthlyRunRate, realizedPretax: realizedPretax,
    profitBridge: profitBridge, costByCategory: costByCategory,
    sensitivityGrid: sensitivityGrid,
  };
});
