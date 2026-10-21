/**
 * PNB Intelligent Lending - TypeScript Data Types
 * 
 * DISCLAIMER:
 * All data structures, credit parameters, bureau responses, and policies
 * represented here are SYNTHETIC and strictly for simulation and demonstration
 * purposes. They do NOT represent official Punjab National Bank policies or customer data.
 */

export interface LoanProduct {
  id: string;
  name: string;
  category: 'RETAIL_UNSECURED';
  subCategory: 'Salaried Personal Loan';
  currency: 'INR';
  indicativeAnnualRate: number; // e.g. 11.75%
  minTenureMonths: number;      // e.g. 12
  maxTenureMonths: number;      // e.g. 60
  minLoanAmount: number;        // e.g. 50,000
  maxLoanAmount: number;        // e.g. 15,00,000
}

export interface ApplicantProfile {
  id: string;
  applicantName: string;
  age: number;
  city: string;
  employerName: string;
  employerCategory: 'Category A (MNC/Tier-1)' | 'Category B (Mid-Corporate)' | 'Category C (Small Enterprise)';
  employmentVintageYears: number;
  designation: string;
  netMonthlySalary: number; // in INR
  existingMonthlyObligations: number; // in INR
  requestedLoanAmount: number; // in INR
  requestedTenureMonths: number;
  loanPurpose: string;
}

export interface UnstructuredDocumentData {
  kycStatus: {
    panVerified: boolean;
    panNumberMasked: string;
    aadhaarVerified: boolean;
    aadhaarNumberMasked: string;
    source: 'Simulated DigiLocker / Aadhaar e-KYC';
  };
  salarySlipVerification: {
    slipsVerifiedCount: number;
    averageReportedNetSalary: number;
    salaryVarianceDetected: boolean;
    variancePercentage: number;
    source: 'Simulated OCR & Salary Slip Parser';
  };
  bankStatementAnalysis: {
    salaryCreditDetected: boolean;
    salaryCreditPattern: 'Regular Monthly Credit' | 'Irregular / Intermittent' | 'Cash Deposit';
    avgMonthlyBalance: number;
    inwardChequeBouncesPast6Months: number;
    source: 'Simulated Account Aggregator (AA) Statement';
  };
}

export interface StructuredCBSData {
  customerRelationshipVintageMonths: number;
  hasExistingAccount: boolean;
  accountType: 'Savings' | 'Salary' | 'None';
  internalRepaymentTrackRecord: 'Clean' | 'Minor Delinquency' | 'No Prior Loan Track';
  averageQuarterlyBalance: number;
  source: 'Simulated Core Banking System (CBS)';
}

export interface ExternalBureauData {
  bureauName: 'Simulated Credit Bureau (CIBIL)';
  creditScore: number;
  scoreCategory: 'Prime (750+)' | 'Near Prime (675-749)' | 'Subprime (<675)';
  totalActiveAccounts: number;
  unsecuredAccountsCount: number;
  totalReportedOutstanding: number;
  maxDPDPast24Months: number; // Days Past Due
  recentEnquiriesPast60Days: number;
  suitFiledOrWilfulDefault: boolean;
  source: 'Simulated Bureau Gateway API';
}

export interface IllustrativePolicyRule {
  ruleId: string;
  ruleName: string;
  description: string;
  thresholdType: 'MIN' | 'MAX' | 'EXACT';
  thresholdValue: number | string | boolean;
  isMandatoryKnockout: boolean; // If true, failure causes recommendation to decline
}

export interface RuleEvaluationItem {
  ruleId: string;
  ruleName: string;
  benchmarkDescription: string;
  observedValue: string;
  status: 'PASSED' | 'REVIEW_REQUIRED' | 'FAILED';
  explanation: string;
}

export interface EvaluationOutcome {
  applicantId: string;
  recalculatedLoanAmount: number;
  recalculatedTenureMonths: number;
  indicativeAnnualRate: number;
  monthlyEMI: number;
  foirPercentage: number;
  maxPermissibleFOIR: number;
  ruleEvaluations: RuleEvaluationItem[];
  systemRecommendation: 'RECOMMENDED_SANCTION' | 'REFERRED_FOR_REVIEW' | 'RECOMMENDED_DECLINE';
  recommendationRationale: string[];
  riskFlags: string[];
  mandatoryHumanSignOff: true;
}

export type CreditOfficerDecision = 
  | 'PENDING_OFFICER_REVIEW'
  | 'OFFICER_APPROVED'
  | 'OFFICER_STIPULATED_APPROVAL'
  | 'OFFICER_REJECTED';

export interface SyntheticApplicant {
  profile: ApplicantProfile;
  unstructuredDocs: UnstructuredDocumentData;
  structuredCBS: StructuredCBSData;
  externalBureau: ExternalBureauData;
  scenarioType: 'STRAIGHTFORWARD' | 'BORDERLINE_REVIEW' | 'HIGH_RISK_DECLINE';
  scenarioSummary: string;
}

/* --- Task 2: Seven-Stage Workflow & Audit Trail Types --- */

export type StageId = 
  | 'stage_1_intake'
  | 'stage_2_document_verification'
  | 'stage_3_banking_data'
  | 'stage_4_bureau_checks'
  | 'stage_5_policy_eligibility'
  | 'stage_6_risk_assessment'
  | 'stage_7_human_review';

export type StageStatus = 'IDLE' | 'PROCESSING' | 'PASSED' | 'REVIEW_REQUIRED' | 'FAILED' | 'AWAITING_OFFICER';

export interface WorkflowStageDetail {
  id: StageId;
  order: number;
  name: string;
  category: string;
  status: StageStatus;
  summary: string;
  inputs: Record<string, string | number | boolean>;
  findings: string[];
  evidence: string[];
  executionTimestamp?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: 'SYSTEM_AGENT' | 'CREDIT_OFFICER' | 'DISBURSEMENT_GATEWAY';
  actorName: string;
  stageName: string;
  action: string;
  details: string;
  statusTag: 'INFO' | 'PASSED' | 'WARNING' | 'DECLINED' | 'APPROVED';
}

export interface OfficerDecisionRecord {
  decision: 'OFFICER_APPROVED' | 'OFFICER_REQUEST_INFO' | 'OFFICER_REJECTED';
  rationale: string;
  officerName: string;
  officerEmpId: string;
  timestamp: string;
  sanctionAmount?: number;
  stipulations?: string[];
}
