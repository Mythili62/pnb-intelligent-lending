/**
 * SEVEN-STAGE WORKFLOW SIMULATION ENGINE
 * 
 * Deterministic local simulation of the retail lending lifecycle:
 * 1. Application Intake
 * 2. Document Verification
 * 3. Structured Banking Data Retrieval
 * 4. Mock Credit Bureau Checks
 * 5. Policy Eligibility Assessment
 * 6. Credit Risk Assessment
 * 7. Human Credit Officer Review
 * 
 * DISCLAIMER:
 * All stages, evidence tokens, and rule verifications are simulated
 * using deterministic synthetic data. No real external APIs or live models are invoked.
 */

import type {
  SyntheticApplicant,
  EvaluationOutcome,
  WorkflowStageDetail,
  OfficerDecisionRecord,
} from '../types/lending';
import { formatINR } from './loanCalculations';

export function buildWorkflowStages(
  applicant: SyntheticApplicant,
  evaluation: EvaluationOutcome,
  officerDecision?: OfficerDecisionRecord | null
): WorkflowStageDetail[] {
  const profile = applicant.profile;
  const docs = applicant.unstructuredDocs;
  const cbs = applicant.structuredCBS;
  const bureau = applicant.externalBureau;

  // --- Stage 1: Application Intake ---
  const stage1: WorkflowStageDetail = {
    id: 'stage_1_intake',
    order: 1,
    name: 'Application Intake & Demographics',
    category: 'Omnichannel Intake Layer',
    status: 'PASSED',
    summary: 'Captured retail personal loan application and validated basic eligibility constraints.',
    inputs: {
      applicationId: profile.id,
      applicantName: profile.applicantName,
      age: `${profile.age} years`,
      city: profile.city,
      employer: profile.employerName,
      employerTier: profile.employerCategory,
      designation: profile.designation,
      requestedAmount: formatINR(evaluation.recalculatedLoanAmount),
      requestedTenure: `${evaluation.recalculatedTenureMonths} Months`,
    },
    findings: [
      `Application ${profile.id} registered successfully for ${profile.applicantName}.`,
      `Applicant age (${profile.age} yrs) complies with permissible retail lending age bracket (21 to 60 yrs).`,
      `Employer category logged as ${profile.employerCategory} with ${profile.employmentVintageYears} yrs vintage.`,
    ],
    evidence: [
      `Requested amount ${formatINR(evaluation.recalculatedLoanAmount)} is within permissible bounds (₹50k - ₹15L).`,
      `Tenure of ${evaluation.recalculatedTenureMonths} months is within allowed policy tenure (12 - 60 months).`,
      `Simulated intake channel: Digital Lending Platform (Web Intake).`,
    ],
  };

  // --- Stage 2: Document Verification ---
  const kycPassed = docs.kycStatus.panVerified && docs.kycStatus.aadhaarVerified;
  const salarySlipsOk = docs.salarySlipVerification.slipsVerifiedCount >= 3;
  const varianceDetected = docs.salarySlipVerification.salaryVarianceDetected;

  let stage2Status: WorkflowStageDetail['status'] = 'PASSED';
  if (!kycPassed || (!salarySlipsOk && docs.salarySlipVerification.slipsVerifiedCount < 2)) {
    stage2Status = 'FAILED';
  } else if (varianceDetected || docs.salarySlipVerification.slipsVerifiedCount < 3) {
    stage2Status = 'REVIEW_REQUIRED';
  }

  const stage2: WorkflowStageDetail = {
    id: 'stage_2_document_verification',
    order: 2,
    name: 'Document Verification & KYC Ingestion',
    category: 'Unstructured Data Layer (OCR / Parser)',
    status: stage2Status,
    summary: stage2Status === 'PASSED'
      ? 'All KYC credentials and 3 consecutive salary slips successfully extracted and cross-validated.'
      : stage2Status === 'REVIEW_REQUIRED'
        ? 'KYC verified, but salary slip variance or incomplete slip count flagged for manual underwriter review.'
        : 'Critical document deficiency: Incomplete KYC or unverified identity credentials.',
    inputs: {
      panStatus: docs.kycStatus.panVerified ? 'Verified' : 'Unverified',
      panMasked: docs.kycStatus.panNumberMasked,
      aadhaarStatus: docs.kycStatus.aadhaarVerified ? 'Verified' : 'Unverified',
      aadhaarMasked: docs.kycStatus.aadhaarNumberMasked,
      salarySlipsVerified: `${docs.salarySlipVerification.slipsVerifiedCount} Slips`,
      averageOCRSalary: formatINR(docs.salarySlipVerification.averageReportedNetSalary),
      salaryVarianceDetected: varianceDetected ? `Yes (${docs.salarySlipVerification.variancePercentage}%)` : 'No (0%)',
    },
    findings: [
      kycPassed
        ? `DigiLocker e-KYC: PAN (${docs.kycStatus.panNumberMasked}) and Aadhaar (${docs.kycStatus.aadhaarNumberMasked}) validated.`
        : 'PAN or Aadhaar could not be validated via simulated DigiLocker gateway.',
      `${docs.salarySlipVerification.slipsVerifiedCount} of 3 mandated monthly salary slips parsed via OCR engine.`,
      varianceDetected
        ? `Notice: Salary variance of ${docs.salarySlipVerification.variancePercentage}% detected across submitted pay slips.`
        : 'Zero variance observed between stated salary and OCR-extracted net credit pay.',
    ],
    evidence: [
      `Simulated OCR Document Hash: SHA256-${profile.id.replace(/[^0-9]/g, '')}-DOCS`,
      `Identity Provider: ${docs.kycStatus.source}`,
      `Document Extraction Service: ${docs.salarySlipVerification.source}`,
    ],
  };

  // --- Stage 3: Structured Banking Data Retrieval ---
  const chequeBounces = docs.bankStatementAnalysis.inwardChequeBouncesPast6Months;
  const regularCredits = docs.bankStatementAnalysis.salaryCreditPattern === 'Regular Monthly Credit';

  let stage3Status: WorkflowStageDetail['status'] = 'PASSED';
  if (chequeBounces > 0) {
    stage3Status = 'FAILED';
  } else if (!regularCredits || cbs.internalRepaymentTrackRecord === 'Minor Delinquency') {
    stage3Status = 'REVIEW_REQUIRED';
  }

  const stage3: WorkflowStageDetail = {
    id: 'stage_3_banking_data',
    order: 3,
    name: 'Structured Banking & Account Aggregator Analysis',
    category: 'Core Banking (CBS) & Cashflow Layer',
    status: stage3Status,
    summary: stage3Status === 'PASSED'
      ? 'Clean internal banking record, consistent monthly salary credits, and zero cheque bounces.'
      : stage3Status === 'REVIEW_REQUIRED'
        ? 'Irregular salary credit frequency or minor delinquency observed in bank statement.'
        : `High cashflow risk: ${chequeBounces} inward cheque bounce(s) detected in the last 6 months.`,
    inputs: {
      cbsCustomer: cbs.hasExistingAccount ? `Yes (${cbs.accountType} Account)` : 'New to Bank',
      cbsVintage: `${cbs.customerRelationshipVintageMonths} Months`,
      cbsRepaymentTrack: cbs.internalRepaymentTrackRecord,
      averageQuarterlyBalance: formatINR(cbs.averageQuarterlyBalance),
      salaryCreditPattern: docs.bankStatementAnalysis.salaryCreditPattern,
      chequeBounces6M: `${chequeBounces} Bounce(s)`,
    },
    findings: [
      cbs.hasExistingAccount
        ? `Existing relationship found: ${cbs.accountType} account active for ${cbs.customerRelationshipVintageMonths} months.`
        : 'New-to-Bank customer: No internal deposit or credit history found in CBS.',
      `Account Aggregator: Salary credits evaluated as "${docs.bankStatementAnalysis.salaryCreditPattern}".`,
      chequeBounces > 0
        ? `Warning: ${chequeBounces} inward cheque bounce(s) detected in last 180 days.`
        : 'Zero inward cheque returns or NACH mandates failed in the past 6 months.',
    ],
    evidence: [
      `CBS System Source: ${cbs.source}`,
      `Account Aggregator Pull: ${docs.bankStatementAnalysis.source}`,
      `Observed Average Bank Balance: ${formatINR(docs.bankStatementAnalysis.avgMonthlyBalance)}`,
    ],
  };

  // --- Stage 4: Mock Credit Bureau Checks ---
  const bureauScore = bureau.creditScore;
  const maxDPD = bureau.maxDPDPast24Months;
  const recentEnquiries = bureau.recentEnquiriesPast60Days;

  let stage4Status: WorkflowStageDetail['status'] = 'PASSED';
  if (bureauScore < 675 || maxDPD > 30 || bureau.suitFiledOrWilfulDefault) {
    stage4Status = 'FAILED';
  } else if (bureauScore < 720 || recentEnquiries > 2) {
    stage4Status = 'REVIEW_REQUIRED';
  }

  const stage4: WorkflowStageDetail = {
    id: 'stage_4_bureau_checks',
    order: 4,
    name: 'Mock Credit Bureau Checks',
    category: 'External Bureau Gateway (CIBIL API)',
    status: stage4Status,
    summary: stage4Status === 'PASSED'
      ? `Prime credit profile: CIBIL ${bureauScore}, zero historical delinquency, and minimal recent credit searches.`
      : stage4Status === 'REVIEW_REQUIRED'
        ? `Near-prime score (${bureauScore}) or inquiry velocity (${recentEnquiries} enquiries) warrants underwriter review.`
        : `Severe credit risk: Subprime score (${bureauScore}) or historical delinquency (${maxDPD} DPD) recorded.`,
    inputs: {
      bureauProvider: bureau.bureauName,
      cibilScore: `${bureauScore} (${bureau.scoreCategory})`,
      activeTradeLines: `${bureau.totalActiveAccounts} Total (${bureau.unsecuredAccountsCount} Unsecured)`,
      reportedOutstanding: formatINR(bureau.totalReportedOutstanding),
      maxDPD24M: `${maxDPD} Days Past Due`,
      recentEnquiries60D: `${recentEnquiries} Enquiries`,
    },
    findings: [
      `Simulated CIBIL Score retrieved: ${bureauScore} [${bureau.scoreCategory}].`,
      maxDPD === 0
        ? 'Zero 30+ DPD defaults or written-off trade lines across bureau history.'
        : `Adverse credit entry: Maximum ${maxDPD} Days Past Due recorded on active trade line in past 24 months.`,
      recentEnquiries > 2
        ? `Credit hunger alert: ${recentEnquiries} unsecured enquiries logged in past 60 days (exceeds benchmark of 2).`
        : `Normal inquiry velocity: ${recentEnquiries} credit inquiry logged in last 60 days.`,
    ],
    evidence: [
      `Simulated Bureau Report ID: CIR-CIBIL-${profile.id}-SIM`,
      `Active Debt Lines: ${bureau.totalActiveAccounts} trade lines with ${formatINR(bureau.totalReportedOutstanding)} outstanding.`,
      `Suit Filed / Wilful Default: ${bureau.suitFiledOrWilfulDefault ? 'YES' : 'NO'}`,
    ],
  };

  // --- Stage 5: Policy Eligibility Assessment ---
  const incomeRule = evaluation.ruleEvaluations.find(r => r.ruleId === 'ILLUSTRATIVE-RULE-01');
  const foirRule = evaluation.ruleEvaluations.find(r => r.ruleId === 'ILLUSTRATIVE-RULE-02');

  let stage5Status: WorkflowStageDetail['status'] = 'PASSED';
  if (incomeRule?.status === 'FAILED') {
    stage5Status = 'FAILED';
  } else if (foirRule?.status === 'REVIEW_REQUIRED') {
    stage5Status = 'REVIEW_REQUIRED';
  }

  const stage5: WorkflowStageDetail = {
    id: 'stage_5_policy_eligibility',
    order: 5,
    name: 'Policy Eligibility & Debt Service Capacity',
    category: 'Illustrative Retail Credit Policy',
    status: stage5Status,
    summary: stage5Status === 'PASSED'
      ? `Complies with all baseline policies: Net salary ${formatINR(profile.netMonthlySalary)} and FOIR of ${evaluation.foirPercentage}%.`
      : stage5Status === 'REVIEW_REQUIRED'
        ? `Elevated debt burden: Calculated FOIR (${evaluation.foirPercentage}%) exceeds illustrative 50% benchmark.`
        : `Policy knockout: Net monthly income (${formatINR(profile.netMonthlySalary)}) is below the ₹25,000 threshold.`,
    inputs: {
      netMonthlySalary: formatINR(profile.netMonthlySalary),
      existingObligations: formatINR(profile.existingMonthlyObligations),
      proposedLoanAmount: formatINR(evaluation.recalculatedLoanAmount),
      proposedTenure: `${evaluation.recalculatedTenureMonths} Months`,
      computedNewEMI: formatINR(evaluation.monthlyEMI),
      totalMonthlyCommitments: formatINR(profile.existingMonthlyObligations + evaluation.monthlyEMI),
      calculatedFOIR: `${evaluation.foirPercentage}%`,
      maxPermittedFOIR: `${evaluation.maxPermissibleFOIR}%`,
    },
    findings: [
      incomeRule?.status === 'PASSED'
        ? `Net monthly salary of ${formatINR(profile.netMonthlySalary)} exceeds illustrative ₹25,000 policy threshold.`
        : `Hard policy violation: Monthly net salary ${formatINR(profile.netMonthlySalary)} fails ₹25,000 threshold.`,
      foirRule?.status === 'PASSED'
        ? `Total debt commitments require ${evaluation.foirPercentage}% of income, well below the 50.0% ceiling.`
        : `FOIR breach: Proposed commitments require ${evaluation.foirPercentage}% of monthly net pay (benchmark: 50.0%).`,
    ],
    evidence: [
      `Formula: ((${formatINR(profile.existingMonthlyObligations)} + ${formatINR(evaluation.monthlyEMI)}) / ${formatINR(profile.netMonthlySalary)}) × 100 = ${evaluation.foirPercentage}%`,
      `Policy Reference: Illustrative Credit Policy Benchmark Rule 01 & 02`,
    ],
  };

  // --- Stage 6: Credit Risk Assessment & Synthesis ---
  let stage6Status: WorkflowStageDetail['status'] = 'PASSED';
  if (evaluation.systemRecommendation === 'RECOMMENDED_DECLINE') {
    stage6Status = 'FAILED';
  } else if (evaluation.systemRecommendation === 'REFERRED_FOR_REVIEW') {
    stage6Status = 'REVIEW_REQUIRED';
  }

  const stage6: WorkflowStageDetail = {
    id: 'stage_6_risk_assessment',
    order: 6,
    name: 'Credit Risk Synthesis & Recommendation',
    category: 'Agentic Synthesis & Explainability Layer',
    status: stage6Status,
    summary: evaluation.systemRecommendation === 'RECOMMENDED_SANCTION'
      ? 'Low risk profile. Automated synthesis recommends full sanction approval for credit officer sign-off.'
      : evaluation.systemRecommendation === 'REFERRED_FOR_REVIEW'
        ? 'Moderate risk profile. Synthesis refers to credit officer for restructuring (reduced amount or longer tenure).'
        : 'High risk profile. Automated synthesis recommends declining application due to policy/bureau knockouts.',
    inputs: {
      overallRecommendation: evaluation.systemRecommendation,
      totalRiskFlagsCount: evaluation.riskFlags.length,
      debtServiceBuffer: formatINR(Math.max(0, profile.netMonthlySalary - (profile.existingMonthlyObligations + evaluation.monthlyEMI))),
      interestRateApplied: `${evaluation.indicativeAnnualRate}% p.a.`,
    },
    findings: evaluation.recommendationRationale,
    evidence: evaluation.riskFlags.length > 0
      ? evaluation.riskFlags
      : ['No negative credit flags or policy breaches detected across evaluated sources.'],
  };

  // --- Stage 7: Human Credit Officer Review ---
  let stage7Status: WorkflowStageDetail['status'] = 'AWAITING_OFFICER';
  if (officerDecision) {
    if (officerDecision.decision === 'OFFICER_APPROVED') {
      stage7Status = 'PASSED';
    } else if (officerDecision.decision === 'OFFICER_REQUEST_INFO') {
      stage7Status = 'REVIEW_REQUIRED';
    } else if (officerDecision.decision === 'OFFICER_REJECTED') {
      stage7Status = 'FAILED';
    }
  }

  const stage7: WorkflowStageDetail = {
    id: 'stage_7_human_review',
    order: 7,
    name: 'Human Credit Officer Review & Sanction',
    category: 'Human-in-the-Loop Governance',
    status: stage7Status,
    summary: officerDecision
      ? `Credit Officer ${officerDecision.officerName} (${officerDecision.officerEmpId}) has recorded a decision: ${officerDecision.decision.replace('OFFICER_', '')}.`
      : 'Mandatory banking governance step: Awaiting licensed human underwriter review and authorization.',
    inputs: {
      requiredActor: 'Licensed Credit Officer / Underwriter',
      governanceProtocol: 'Four-Eyes Principle / Maker-Checker Policy',
      officerDecision: officerDecision ? officerDecision.decision : 'Pending Officer Action',
      officerRationale: officerDecision ? officerDecision.rationale : 'Awaiting Rationale Entry',
    },
    findings: officerDecision
      ? [
          `Officer Decision: ${officerDecision.decision.replace('OFFICER_', '')}`,
          `Recorded Rationale: "${officerDecision.rationale}"`,
          `Recorded Timestamp: ${officerDecision.timestamp}`,
        ]
      : [
          'Underwriter review is required before simulated sanction letter or disbursement can occur.',
          'Credit officer can approve the proposed terms, counter-offer with revised parameters, or decline.',
        ],
    evidence: officerDecision
      ? [
          `Officer Sign-off ID: ${officerDecision.officerEmpId}`,
          `Digital Signature Hash: DSIG-PNB-${profile.id}-${Date.now().toString().slice(-6)}`,
          `Simulated Sanction Disbursement Status: ${officerDecision.decision === 'OFFICER_APPROVED' ? 'Eligible for Disbursement' : 'Disbursement Blocked'}`,
        ]
      : [
          'Audit Guard: System disbursement trigger locked pending credit officer authorization.',
        ],
  };

  return [stage1, stage2, stage3, stage4, stage5, stage6, stage7];
}
