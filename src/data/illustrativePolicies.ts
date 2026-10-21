/**
 * ILLUSTRATIVE CREDIT POLICY BENCHMARKS (SIMULATION ONLY)
 * 
 * DISCLAIMER:
 * These criteria represent standard illustrative retail banking benchmarks
 * for a Salaried Personal Loan and are strictly used for educational/demo purposes.
 * They are NOT official Punjab National Bank credit policy rules.
 */

import type { IllustrativePolicyRule } from '../types/lending';

export const DEFAULT_ANNUAL_INTEREST_RATE = 11.75; // 11.75% p.a. illustrative rate
export const DEFAULT_LOAN_TENURE_MONTHS = 36;      // 36 months baseline
export const MAX_PERMISSIBLE_TENURE_MONTHS = 60;   // 5 years max
export const MIN_PERMISSIBLE_TENURE_MONTHS = 12;   // 1 year min

export const ILLUSTRATIVE_POLICY_RULES: IllustrativePolicyRule[] = [
  {
    ruleId: 'ILLUSTRATIVE-RULE-01',
    ruleName: 'Minimum Net Monthly Salary',
    description: 'Applicant must earn a minimum net monthly income of ₹25,000 for personal loan eligibility.',
    thresholdType: 'MIN',
    thresholdValue: 25000,
    isMandatoryKnockout: true,
  },
  {
    ruleId: 'ILLUSTRATIVE-RULE-02',
    ruleName: 'Fixed Obligation to Income Ratio (FOIR)',
    description: 'Total monthly obligations (existing EMIs + proposed loan EMI) must not exceed 50.0% of net monthly income.',
    thresholdType: 'MAX',
    thresholdValue: 50.0,
    isMandatoryKnockout: false, // May be reviewed or mitigated by counter-offering lower loan amount
  },
  {
    ruleId: 'ILLUSTRATIVE-RULE-03',
    ruleName: 'Credit Bureau Score (CIBIL)',
    description: 'Prime eligibility requires CIBIL >= 720. Scores between 675 and 719 require underwriter review. Scores < 675 fail standard eligibility.',
    thresholdType: 'MIN',
    thresholdValue: 675,
    isMandatoryKnockout: true,
  },
  {
    ruleId: 'ILLUSTRATIVE-RULE-04',
    ruleName: 'Clean Delinquency Track Record',
    description: 'No active wilful default or 30+ Days Past Due (DPD) write-off recorded across trade lines in past 12-24 months.',
    thresholdType: 'EXACT',
    thresholdValue: 0,
    isMandatoryKnockout: true,
  },
  {
    ruleId: 'ILLUSTRATIVE-RULE-05',
    ruleName: 'KYC & Salary Credit Consistency',
    description: 'PAN and Aadhaar identity verified, with regular monthly salary credits validated via bank statement/aggregator.',
    thresholdType: 'EXACT',
    thresholdValue: true,
    isMandatoryKnockout: true,
  },
  {
    ruleId: 'ILLUSTRATIVE-RULE-06',
    ruleName: 'Bureau Enquiries Velocity',
    description: 'No more than 2 unsecured credit enquiries in the preceding 60 days to prevent credit hunger.',
    thresholdType: 'MAX',
    thresholdValue: 2,
    isMandatoryKnockout: false,
  },
];
