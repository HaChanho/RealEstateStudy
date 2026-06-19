#!/usr/bin/env node
/**
 * _report-v10-spec.js — 미도래 9건 딥다이브 보고서를 v10(본인 명의)로 동기화하기 위한
 * 권위 세금 수치 스펙 생성 + cases.js 적용 여부 교차검증. (읽기 전용, cases.js 불변)
 */
const path = require('path');
global.window = {};
require(path.join(__dirname, 'cases.js'));
const C = global.window.AUCTION_CASES || [];
const TODAY = '2026-06-15';

const SELF_BASE = 72350000;            // 본인 근로 과세표준(총급여 88M)
function taxAt(base) {
  if (base <= 14000000) return base * 0.06;
  if (base <= 50000000) return base * 0.15 - 1260000;
  if (base <= 88000000) return base * 0.24 - 5760000;
  if (base <= 150000000) return base * 0.35 - 15440000;
  if (base <= 300000000) return base * 0.38 - 19940000;
  return base * 0.40 - 25940000;
}
const SELF_BASE_TAX = taxAt(SELF_BASE); // 11,604,000
function incomeTaxForP(P) { return Math.round((taxAt(SELF_BASE + P) - SELF_BASE_TAX) * 1.1); }
const man = n => Math.round(n / 10000).toLocaleString();

const future = C.filter(c => c.saleDate && c.saleDate > TODAY).sort((a,b)=> (a.caseNumber>b.caseNumber?1:-1));
console.log(`미도래 ${future.length}건 — v10 권위 세금 스펙 (본인 base 과세표준 ${man(SELF_BASE)}만, base세액 ${man(SELF_BASE_TAX)}만)\n`);

for (const c of future) {
  const EP = c.expectedProfit70;
  const taxCalc = incomeTaxForP(EP);            // 스크립트 재계산
  const afterCalc = EP - taxCalc;
  const combined = SELF_BASE + EP;
  const crosses35 = combined > 88000000;        // EP > 15.65M 이면 35% 진입
  const mrCalc = +(taxCalc / EP).toFixed(4);
  // cases.js 저장값과 교차검증
  const ok = (c.incomeTax === taxCalc) && (c.afterTaxProfit === afterCalc) && (c.taxableProfit === EP);
  console.log(`■ ${c.caseNumber}  (${c.complex||''}) tier=${c.interestTier} verdict=${c.verdict}`);
  console.log(`  saleDate=${c.saleDate}  taxOwner(cases.js)=${c.taxOwner}`);
  console.log(`  B70=${man(c.bid70)}만  S(중립매도)=${man(c.neutralSalePrice)}만  repairCost(참고)=${man(c.repairCost)}만`);
  console.log(`  과세표준=EP70 = ${EP.toLocaleString()} (${man(EP)}만)`);
  console.log(`  합산 과세표준 = ${combined.toLocaleString()} (${man(combined)}만)  ${crosses35?'⚠️ 88M 초과 → 초과분 35%(38.5%) 진입':'✅ 88M 이내 → 전부 24%(26.4%)'}`);
  console.log(`  추가 종소세(지방세 포함) = ${taxCalc.toLocaleString()} (${man(taxCalc)}만)  한계세율≈${(mrCalc*100).toFixed(1)}%`);
  console.log(`  세후이익 = ${afterCalc.toLocaleString()} (${man(afterCalc)}만)`);
  console.log(`  cases.js 저장값: incomeTax=${c.incomeTax} afterTax=${c.afterTaxProfit} mr=${c.marginalRate}  →  교차검증 ${ok?'✅ 일치':'❌ 불일치(주의!)'}`);
  console.log('');
}
