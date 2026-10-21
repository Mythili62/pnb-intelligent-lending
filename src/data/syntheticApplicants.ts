/**
 * SYNTHETIC APPLICANTS DATASET (SIMULATION ONLY)
 * 
 * DISCLAIMER:
 * All personal identities, PAN/Aadhaar numbers, bank balances, and bureau data
 * in this file are completely synthetic and fabricated for educational simulation.
 * No real customer data is used.
 */

import type { SyntheticApplicant } from '../types/lending';

export const SYNTHETIC_APPLICANTS: SyntheticApplicant[] = [
  {
    profile: {
      id: 'APP-PNB-2026-001',
      applicantName: 'Priya Sharma',
      age: 31,
      city: 'Bengaluru, Karnataka',
      employerName: 'Infosys Limited',
      employerCategory: 'Category A (MNC/Tier-1)',
      employmentVintageYears: 4.5,
      designation: 'Senior Lead Software Engineer',
      netMonthlySalary: 95000,
      existingMonthlyObligations: 12000, // Existing car loan EMI
      requestedLoanAmount: 500000,       // ₹5 Lakhs
      requestedTenureMonths: 36,         // 3 years
      loanPurpose: 'Home Renovation & Furnishing',
    },
    unstructuredDocs: {
      kycStatus: {
        panVerified: true,
        panNumberMasked: 'ABCPS****K',
        aadhaarVerified: true,
        aadhaarNumberMasked: '**** **** 8241',
        source: 'Simulated DigiLocker / Aadhaar e-KYC',
      },
      salarySlipVerification: {
        slipsVerifiedCount: 3,
        averageReportedNetSalary: 95000,
        salaryVarianceDetected: false,
        variancePercentage: 0.0,
        source: 'Simulated OCR & Salary Slip Parser',
      },
      bankStatementAnalysis: {
        salaryCreditDetected: true,
        salaryCreditPattern: 'Regular Monthly Credit',
        avgMonthlyBalance: 48500,
        inwardChequeBouncesPast6Months: 0,
        source: 'Simulated Account Aggregator (AA) Statement',
      },
    },
    structuredCBS: {
      customerRelationshipVintageMonths: 38,
      hasExistingAccount: true,
      accountType: 'Salary',
      internalRepaymentTrackRecord: 'Clean',
      averageQuarterlyBalance: 52000,
      source: 'Simulated Core Banking System (CBS)',
    },
    externalBureau: {
      bureauName: 'Simulated Credit Bureau (CIBIL)',
      creditScore: 785,
      scoreCategory: 'Prime (750+)',
      totalActiveAccounts: 2,
      unsecuredAccountsCount: 1,
      totalReportedOutstanding: 280000,
      maxDPDPast24Months: 0,
      recentEnquiriesPast60Days: 1,
      suitFiledOrWilfulDefault: false,
      source: 'Simulated Bureau Gateway API',
    },
    scenarioType: 'STRAIGHTFORWARD',
    scenarioSummary: 'Prime salaried applicant with Tier-1 employer, clean credit history (CIBIL 785), low debt ratio, and verified KYC/salary credits. Recommended for fast-track sanction.',
  },

  {
    profile: {
      id: 'APP-PNB-2026-002',
      applicantName: 'Rajesh Kumar',
      age: 38,
      city: 'Pune, Maharashtra',
      employerName: 'Apex Supply Chain Logistics Pvt Ltd',
      employerCategory: 'Category B (Mid-Corporate)',
      employmentVintageYears: 2.8,
      designation: 'Operations Regional Manager',
      netMonthlySalary: 52000,
      existingMonthlyObligations: 16500, // Two ongoing personal EMIs
      requestedLoanAmount: 650000,       // ₹6.5 Lakhs requested
      requestedTenureMonths: 36,         // 3 years
      loanPurpose: 'Family Medical Procedure & Consolidation',
    },
    unstructuredDocs: {
      kycStatus: {
        panVerified: true,
        panNumberMasked: 'BLRPK****E',
        aadhaarVerified: true,
        aadhaarNumberMasked: '**** **** 4192',
        source: 'Simulated DigiLocker / Aadhaar e-KYC',
      },
      salarySlipVerification: {
        slipsVerifiedCount: 3,
        averageReportedNetSalary: 52000,
        salaryVarianceDetected: true,
        variancePercentage: 6.2, // Small bonus/overtime variance detected
        source: 'Simulated OCR & Salary Slip Parser',
      },
      bankStatementAnalysis: {
        salaryCreditDetected: true,
        salaryCreditPattern: 'Regular Monthly Credit',
        avgMonthlyBalance: 14200,
        inwardChequeBouncesPast6Months: 0,
        source: 'Simulated Account Aggregator (AA) Statement',
      },
    },
    structuredCBS: {
      customerRelationshipVintageMonths: 14,
      hasExistingAccount: true,
      accountType: 'Savings',
      internalRepaymentTrackRecord: 'Clean',
      averageQuarterlyBalance: 16500,
      source: 'Simulated Core Banking System (CBS)',
    },
    externalBureau: {
      bureauName: 'Simulated Credit Bureau (CIBIL)',
      creditScore: 690,
      scoreCategory: 'Near Prime (675-749)',
      totalActiveAccounts: 3,
      unsecuredAccountsCount: 2,
      totalReportedOutstanding: 320000,
      maxDPDPast24Months: 0,
      recentEnquiriesPast60Days: 3, // Recent enquiry spike
      suitFiledOrWilfulDefault: false,
      source: 'Simulated Bureau Gateway API',
    },
    scenarioType: 'BORDERLINE_REVIEW',
    scenarioSummary: 'Borderline profile: Moderate CIBIL (690), recent credit enquiry spike (3 enquiries), and proposed loan amount of ₹6.5L pushes FOIR to 73.1% (> 50% threshold). Requires underwriter review or counter-offer with reduced amount/extended tenure.',
  },

  {
    profile: {
      id: 'APP-PNB-2026-003',
      applicantName: 'Amit Verma',
      age: 27,
      city: 'Jaipur, Rajasthan',
      employerName: 'QuickKart Local Retailers',
      employerCategory: 'Category C (Small Enterprise)',
      employmentVintageYears: 1.1,
      designation: 'Telesales Executive',
      netMonthlySalary: 22000,          // Below ₹25,000 threshold
      existingMonthlyObligations: 8500,  // Consumer durable loan EMI
      requestedLoanAmount: 300000,       // ₹3 Lakhs
      requestedTenureMonths: 24,         // 2 years
      loanPurpose: 'Debt Payoff & Personal Expenses',
    },
    unstructuredDocs: {
      kycStatus: {
        panVerified: true,
        panNumberMasked: 'CKIPV****N',
        aadhaarVerified: true,
        aadhaarNumberMasked: '**** **** 1058',
        source: 'Simulated DigiLocker / Aadhaar e-KYC',
      },
      salarySlipVerification: {
        slipsVerifiedCount: 2, // Missing 3rd slip
        averageReportedNetSalary: 22000,
        salaryVarianceDetected: true,
        variancePercentage: 14.5,
        source: 'Simulated OCR & Salary Slip Parser',
      },
      bankStatementAnalysis: {
        salaryCreditDetected: true,
        salaryCreditPattern: 'Irregular / Intermittent',
        avgMonthlyBalance: 2400,
        inwardChequeBouncesPast6Months: 2, // 2 cheque bounces
        source: 'Simulated Account Aggregator (AA) Statement',
      },
    },
    structuredCBS: {
      customerRelationshipVintageMonths: 0,
      hasExistingAccount: false,
      accountType: 'None',
      internalRepaymentTrackRecord: 'No Prior Loan Track',
      averageQuarterlyBalance: 0,
      source: 'Simulated Core Banking System (CBS)',
    },
    externalBureau: {
      bureauName: 'Simulated Credit Bureau (CIBIL)',
      creditScore: 585,
      scoreCategory: 'Subprime (<675)',
      totalActiveAccounts: 2,
      unsecuredAccountsCount: 2,
      totalReportedOutstanding: 145000,
      maxDPDPast24Months: 65, // 65 DPD delinquency 8 months ago
      recentEnquiriesPast60Days: 4,
      suitFiledOrWilfulDefault: false,
      source: 'Simulated Bureau Gateway API',
    },
    scenarioType: 'HIGH_RISK_DECLINE',
    scenarioSummary: 'High-risk profile with hard knockout triggers: Net salary (₹22,000) falls below minimum policy limit of ₹25,000; poor bureau score (585) with historical 65 DPD default on credit card; inward cheque bounces detected. Recommended for decline.',
  },
];
