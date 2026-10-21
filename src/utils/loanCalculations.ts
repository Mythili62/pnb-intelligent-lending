/**
 * FINANCIAL & LENDING POLICY CALCULATION ENGINE
 * 
 * Contains explicit, verifiable banking formulas:
 * 1. Monthly EMI using standard reducing-balance formula
 * 2. Fixed Obligation to Income Ratio (FOIR)
 * 3. Dynamic Applicant Policy Evaluation
 * 
 * DISCLAIMER:
 * These calculations and criteria are illustrative models for simulation.
 */

import type {
  SyntheticApplicant,
  EvaluationOutcome,
  RuleEvaluationItem,
} from '../types/lending';
import {
  DEFAULT_ANNUAL_INTEREST_RATE,
} from '../data/illustrativePolicies';

/**
 * Standard Reducing Balance EMI Formula:
 * 
 * EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * 
 * Where:
 * P = Principal loan amount (INR)
 * r = Monthly interest rate = (Annual Rate / 12) / 100
 * n = Tenure in months
 */
export function calculateMonthlyEMI(
  principal: number,
  annualInterestRatePercent: number = DEFAULT_ANNUAL_INTEREST_RATE,
  tenureMonths: number
): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualInterestRatePercent <= 0) {
    return Math.round(principal / tenureMonths);
  }

  const monthlyRate = annualInterestRatePercent / (12 * 100);
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);

  return Math.round(emi);
}

/**
 * Fixed Obligation to Income Ratio (FOIR):
 * 
 * FOIR (%) = ((Total Existing Monthly EMIs + Proposed New EMI) / Net Monthly Income) * 100
 */
export function calculateFOIR(
  existingMonthlyObligations: number,
  proposedNewEMI: number,
  netMonthlyIncome: number
): number {
  if (netMonthlyIncome <= 0) return 100.0;
  const totalMonthlyCommitments = existingMonthlyObligations + proposedNewEMI;
  const foir = (totalMonthlyCommitments / netMonthlyIncome) * 100;
  return Number(foir.toFixed(1));
}

/**
 * Formats a number into Indian Rupee Currency representation (e.g., ₹5,00,000)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Evaluates an applicant against illustrative lending rules.
 * Accepts optional amount and tenure overrides to recalculate when user tweaks terms.
 */
export function evaluateApplicant(
  applicant: SyntheticApplicant,
  customAmount?: number,
  customTenureMonths?: number,
  customRate: number = DEFAULT_ANNUAL_INTEREST_RATE
): EvaluationOutcome {
  const loanAmount = customAmount ?? applicant.profile.requestedLoanAmount;
  const tenureMonths = customTenureMonths ?? applicant.profile.requestedTenureMonths;
  const netIncome = applicant.profile.netMonthlySalary;
  const existingObligations = applicant.profile.existingMonthlyObligations;

  // 1. Explicit Financial Computations
  const monthlyEMI = calculateMonthlyEMI(loanAmount, customRate, tenureMonths);
  const foirPercentage = calculateFOIR(existingObligations, monthlyEMI, netIncome);
  const maxPermissibleFOIR = 50.0; // Illustrative limit

  const ruleEvaluations: RuleEvaluationItem[] = [];
  const riskFlags: string[] = [];
  const rationale: string[] = [];

  // --- Rule 1: Minimum Net Monthly Salary (₹25,000 threshold) ---
  if (netIncome >= 25000) {
    ruleEvaluations.push({
      ruleId: 'ILLUSTRATIVE-RULE-01',
      ruleName: 'Minimum Net Monthly Salary',
      benchmarkDescription: 'Threshold: >= ₹25,000/month',
      observedValue: formatINR(netIncome) + '/month',
      status: 'PASSED',
      explanation: `Net salary of ${formatINR(netIncome)} meets the baseline threshold.`,
    });
  } else {
    ruleEvaluations.push({
      ruleId: 'ILLUSTRATIVE-RULE-01',
      ruleName: 'Minimum Net Monthly Salary',
      benchmarkDescription: 'Threshold: >= ₹25,000/month',
      observedValue: formatINR(netIncome) + '/month',
      status: 'FAILED',
      explanation: `Net salary of ${formatINR(netIncome)} is below the minimum threshold of ₹25,000.`,
    });
    riskFlags.push(`Monthly net income (${formatINR(netIncome)}) fails minimum threshold.`);
  }

  // --- Rule 2: Fixed Obligation to Income Ratio (FOIR <= 50.0%) ---
  if (foirPercentage <= maxPermissibleFOIR) {
    ruleEvaluations.push({
      ruleId: 'ILLUSTRATIVE-RULE-02',
      ruleName: 'FOIR (Debt-to-Income)',
      benchmarkDescription: `Threshold: <= ${maxPermissibleFOIR}% of net income`,
      observedValue: `${foirPercentage}%`,
      status: 'PASSED',
      explanation: `Total commitments (${formatINR(existingObligations + monthlyEMI)}/mo) are within ${maxPermissibleFOIR}% capacity.`,
    });
  } else {
    ruleEvaluations.push({
      ruleId: 'ILLUSTRATIVE-RULE-02',
      ruleName: 'FOIR (Debt-to-Income)',
      benchmarkDescription: `Threshold: <= ${maxPermissibleFOIR}% of net income`,
      observedValue: `${foirPercentage}%`,
      status: 'REVIEW_REQUIRED',
      explanation: `Proposed commitments require ${foirPercentage}% of monthly income, exceeding the ${maxPermissibleFOIR}% benchmark.`,
    });
    riskFlags.push(`Elevated FOIR (${foirPercentage}%) exceeds standard benchmark of ${maxPermissibleFOIR}%.`);
  }

  // --- Rule 3: Credit Bureau Score (CIBIL) ---
  const bureauScore = applicant.externalBureau.creditScore;
  if (bureauScore >= 720) {
    ruleEvaluations.push({
      ruleId: 'ILLUSTRATIVE-RULE-03',
      ruleName: 'Credit Bureau Score',
      benchmarkDescription: 'Prime Benchmark: >= 720',
      observedValue: `${bureauScore} (${applicant.externalBureau.scoreCategory})`,
      status: 'PASSED',
      explanation: `Excellent credit history with bureau score ${bureauScore}.`,
    });
  } else if (bureauScore >= 675) {
    ruleEvaluations.push({
      ruleId: 'ILLUSTRATIVE-RULE-03',
      ruleName: 'Credit Bureau Score',
      benchmarkDescription: 'Review Band: 675 - 719',
      observedValue: `${bureauScore} (${applicant.externalBureau.scoreCategory})`,
      status: 'REVIEW_REQUIRED',
      explanation: `Score of ${bureauScore} falls into near-prime band; underwriter discretion required.`,
    });
    riskFlags.push(`Bureau score of ${bureauScore} falls in the near-prime review band.`);
  } else {
    ruleEvaluations.push({
      ruleId: 'ILLUSTRATIVE-RULE-03',
      ruleName: 'Credit Bureau Score',
      benchmarkDescription: 'Cut-off: < 675 Ineligible',
      observedValue: `${bureauScore} (${applicant.externalBureau.scoreCategory})`,
      status: 'FAILED',
      explanation: `Score of ${bureauScore} is below the 675 threshold for unsecured retail lending.`,
    });
    riskFlags.push(`Subprime bureau score (${bureauScore}) indicates elevated credit risk.`);
  }

  // --- Rule 4: Delinquency History (DPD) ---
  const maxDPD = applicant.externalBureau.maxDPDPast24Months;
  if (maxDPD === 0) {
    ruleEvaluations.push({
      ruleId: 'ILLUSTRATIVE-RULE-04',
      ruleName: 'Repayment Delinquency History',
      benchmarkDescription: 'Benchmark: 0 Days Past Due in 24 months',
      observedValue: '0 DPD (Clean)',
      status: 'PASSED',
      explanation: 'No default, write-off, or late payments reported in last 24 months.',
    });
  } else {
    ruleEvaluations.push({
      ruleId: 'ILLUSTRATIVE-RULE-04',
      ruleName: 'Repayment Delinquency History',
      benchmarkDescription: 'Benchmark: 0 Days Past Due in 24 months',
      observedValue: `${maxDPD} DPD Recorded`,
      status: 'FAILED',
      explanation: `Historical default of ${maxDPD} Days Past Due recorded on active trade lines.`,
    });
    riskFlags.push(`Delinquency recorded: ${maxDPD} DPD on bureau trade line in past 24 months.`);
  }

  // --- Rule 5: KYC & Salary Consistency ---
  const kycOk = applicant.unstructuredDocs.kycStatus.panVerified && applicant.unstructuredDocs.kycStatus.aadhaarVerified;
  const salaryPattern = applicant.unstructuredDocs.bankStatementAnalysis.salaryCreditPattern;
  const chequeBounces = applicant.unstructuredDocs.bankStatementAnalysis.inwardChequeBouncesPast6Months;

  if (kycOk && salaryPattern === 'Regular Monthly Credit' && chequeBounces === 0) {
    ruleEvaluations.push({
      ruleId: 'ILLUSTRATIVE-RULE-05',
      ruleName: 'KYC & Banking Integrity',
      benchmarkDescription: 'PAN/Aadhaar verified, regular credits, 0 cheque bounces',
      observedValue: 'Verified · 0 Bounces',
      status: 'PASSED',
      explanation: 'Identity validated; consistent monthly salary credits with zero cheque bounces.',
    });
  } else {
    ruleEvaluations.push({
      ruleId: 'ILLUSTRATIVE-RULE-05',
      ruleName: 'KYC & Banking Integrity',
      benchmarkDescription: 'PAN/Aadhaar verified, regular credits, 0 cheque bounces',
      observedValue: `${salaryPattern} · ${chequeBounces} Cheque Bounce(s)`,
      status: chequeBounces > 0 || salaryPattern !== 'Regular Monthly Credit' ? 'FAILED' : 'REVIEW_REQUIRED',
      explanation: chequeBounces > 0 
        ? `${chequeBounces} inward cheque bounce(s) detected in the last 6 months.`
        : 'Discrepancy in salary credit cadence or documentation.',
    });
    if (chequeBounces > 0) {
      riskFlags.push(`${chequeBounces} inward cheque bounce(s) observed in bank statement.`);
    }
  }

  // Determine Overall System Recommendation (Explaining status without arbitrary % confidence)
  const hasKnockoutFailure = ruleEvaluations.some(r => r.status === 'FAILED');
  const hasReviewRequired = ruleEvaluations.some(r => r.status === 'REVIEW_REQUIRED');

  let systemRecommendation: 'RECOMMENDED_SANCTION' | 'REFERRED_FOR_REVIEW' | 'RECOMMENDED_DECLINE';

  if (hasKnockoutFailure) {
    systemRecommendation = 'RECOMMENDED_DECLINE';
    rationale.push('One or more mandatory credit criteria failed (income threshold, bureau delinquency, or subprime score).');
    rationale.push('Automated policy engine recommends declining the application with explicit notices provided.');
  } else if (hasReviewRequired) {
    systemRecommendation = 'REFERRED_FOR_REVIEW';
    rationale.push('Application meets baseline eligibility but triggers review thresholds (elevated FOIR or near-prime score).');
    rationale.push('Underwriter review is required to consider loan restructuring (e.g. reduced sanction amount or extended tenure) or requesting additional income documentation.');
  } else {
    systemRecommendation = 'RECOMMENDED_SANCTION';
    rationale.push('All illustrative credit policy benchmarks successfully satisfied.');
    rationale.push(`Calculated FOIR is ${foirPercentage}% with prime bureau score of ${bureauScore}. Recommended for fast-track sanction approval.`);
  }

  return {
    applicantId: applicant.profile.id,
    recalculatedLoanAmount: loanAmount,
    recalculatedTenureMonths: tenureMonths,
    indicativeAnnualRate: customRate,
    monthlyEMI,
    foirPercentage,
    maxPermissibleFOIR,
    ruleEvaluations,
    systemRecommendation,
    recommendationRationale: rationale,
    riskFlags,
    mandatoryHumanSignOff: true,
  };
}
