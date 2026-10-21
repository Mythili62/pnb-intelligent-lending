-- ============================================================================
-- Punjab National Bank · Intelligent Lending Presales POC
-- Seed Data Inserts (Minimum Viable Dataset - 3 Curated Applicants)
-- Generated At: 2026-10-18T11:10:28.820150+00:00
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table: pnb_intelligent_lending.dim_applicants
-- ----------------------------------------------------------------------------
INSERT INTO `pnb_intelligent_lending.dim_applicants` (applicant_id, full_name, age, city, employer_name, employer_category, employment_vintage_years, designation, net_monthly_salary, existing_monthly_obligations, pan_number_masked, aadhaar_number_masked, scenario_tag, scenario_summary, created_at)
VALUES
  ('APP-PNB-2026-001', 'Priya Sharma', 31, 'Bengaluru, Karnataka', 'Infosys Limited', 'Category A (MNC/Tier-1)', 4.5, 'Senior Lead Software Engineer', 95000, 12000, 'ABCPS****K', '**** **** 8241', 'STRAIGHTFORWARD', 'Prime salaried applicant with Tier-1 employer, clean credit history (CIBIL 785), low debt ratio, and verified KYC/salary credits. Recommended for fast-track sanction.', '2026-10-18T10:00:00Z'),
  ('APP-PNB-2026-002', 'Rajesh Kumar', 38, 'Pune, Maharashtra', 'Apex Supply Chain Logistics Pvt Ltd', 'Category B (Mid-Corporate)', 2.8, 'Operations Regional Manager', 52000, 16500, 'BLRPK****E', '**** **** 4192', 'BORDERLINE_REVIEW', 'Borderline profile: Moderate CIBIL (690), recent credit enquiry spike (3 enquiries), and proposed loan amount of ₹6.5L pushes FOIR to 73.1% (> 50% threshold). Requires underwriter review or counter-offer with reduced amount/extended tenure.', '2026-10-18T10:00:00Z'),
  ('APP-PNB-2026-003', 'Amit Verma', 27, 'Jaipur, Rajasthan', 'QuickKart Local Retailers', 'Category C (Small Enterprise)', 1.1, 'Telesales Executive', 22000, 8500, 'CKIPV****N', '**** **** 1058', 'HIGH_RISK_DECLINE', 'High-risk profile with hard knockout triggers: Net salary (₹22,000) falls below minimum policy limit of ₹25,000; poor bureau score (585) with historical 65 DPD default on credit card; inward cheque bounces detected. Recommended for decline.', '2026-10-18T10:00:00Z');

-- ----------------------------------------------------------------------------
-- Table: pnb_intelligent_lending.fact_loan_applications
-- ----------------------------------------------------------------------------
INSERT INTO `pnb_intelligent_lending.fact_loan_applications` (application_id, applicant_id, loan_product_id, loan_product_name, requested_amount, requested_tenure_months, indicative_annual_rate, loan_purpose, application_status, intake_channel, created_at)
VALUES
  ('APP-PNB-2026-001', 'APP-PNB-2026-001', 'RETAIL_SALARIED_PL_001', 'Salaried Personal Loan', 500000, 36, 11.75, 'Home Renovation & Furnishing', 'INTAKE_VERIFIED', 'DIGITAL_PORTAL', '2026-10-18T10:00:00Z'),
  ('APP-PNB-2026-002', 'APP-PNB-2026-002', 'RETAIL_SALARIED_PL_001', 'Salaried Personal Loan', 650000, 36, 11.75, 'Family Medical Procedure & Consolidation', 'INTAKE_VERIFIED', 'DIGITAL_PORTAL', '2026-10-18T10:00:00Z'),
  ('APP-PNB-2026-003', 'APP-PNB-2026-003', 'RETAIL_SALARIED_PL_001', 'Salaried Personal Loan', 300000, 24, 11.75, 'Debt Payoff & Personal Expenses', 'INTAKE_VERIFIED', 'DIGITAL_PORTAL', '2026-10-18T10:00:00Z');

-- ----------------------------------------------------------------------------
-- Table: pnb_intelligent_lending.fact_banking_cbs_profiles
-- ----------------------------------------------------------------------------
INSERT INTO `pnb_intelligent_lending.fact_banking_cbs_profiles` (banking_profile_id, applicant_id, application_id, customer_relationship_vintage_months, has_existing_cbs_account, account_type, internal_repayment_track_record, average_quarterly_balance, cbs_source_tag, salary_credit_detected, salary_credit_pattern, avg_monthly_bank_balance, inward_cheque_bounces_past_6_months, account_aggregator_source_tag, pan_verified, aadhaar_verified, kyc_source_tag, salary_slips_verified_count, average_reported_net_salary, salary_variance_detected, variance_percentage, ocr_source_tag, simulated_document_hash, created_at)
VALUES
  ('BANK-PROF-APP-PNB-2026-001', 'APP-PNB-2026-001', 'APP-PNB-2026-001', 38, TRUE, 'Salary', 'Clean', 52000, 'Simulated Core Banking System (CBS)', TRUE, 'Regular Monthly Credit', 48500, 0, 'Simulated Account Aggregator (AA) Statement', TRUE, TRUE, 'Simulated DigiLocker / Aadhaar e-KYC', 3, 95000, FALSE, 0.0, 'Simulated OCR & Salary Slip Parser', 'DOC-HASH-SHA256-APP-001-VERIFIED', '2026-10-18T10:00:00Z'),
  ('BANK-PROF-APP-PNB-2026-002', 'APP-PNB-2026-002', 'APP-PNB-2026-002', 14, TRUE, 'Savings', 'Clean', 16500, 'Simulated Core Banking System (CBS)', TRUE, 'Regular Monthly Credit', 14200, 0, 'Simulated Account Aggregator (AA) Statement', TRUE, TRUE, 'Simulated DigiLocker / Aadhaar e-KYC', 3, 52000, TRUE, 6.2, 'Simulated OCR & Salary Slip Parser', 'DOC-HASH-SHA256-APP-002-REVIEW', '2026-10-18T10:00:00Z'),
  ('BANK-PROF-APP-PNB-2026-003', 'APP-PNB-2026-003', 'APP-PNB-2026-003', 0, FALSE, 'None', 'No Prior Loan Track', 0, 'Simulated Core Banking System (CBS)', TRUE, 'Irregular / Intermittent', 2400, 2, 'Simulated Account Aggregator (AA) Statement', TRUE, TRUE, 'Simulated DigiLocker / Aadhaar e-KYC', 2, 22000, TRUE, 14.5, 'Simulated OCR & Salary Slip Parser', 'DOC-HASH-SHA256-APP-003-DECLINE', '2026-10-18T10:00:00Z');

-- ----------------------------------------------------------------------------
-- Table: pnb_intelligent_lending.fact_bureau_profiles
-- ----------------------------------------------------------------------------
INSERT INTO `pnb_intelligent_lending.fact_bureau_profiles` (bureau_profile_id, applicant_id, application_id, bureau_name, credit_score, credit_score_tier, legacy_score_category, total_active_accounts, unsecured_accounts_count, total_reported_outstanding, max_dpd_past_24_months, recent_enquiries_past_60_days, suit_filed_or_wilful_default, bureau_source_tag, pulled_at)
VALUES
  ('BUR-PROF-APP-PNB-2026-001', 'APP-PNB-2026-001', 'APP-PNB-2026-001', 'Simulated Credit Bureau (CIBIL)', 785, 'PRIME', 'Prime (750+)', 2, 1, 280000, 0, 1, FALSE, 'Simulated Bureau Gateway API', '2026-10-18T10:00:00Z'),
  ('BUR-PROF-APP-PNB-2026-002', 'APP-PNB-2026-002', 'APP-PNB-2026-002', 'Simulated Credit Bureau (CIBIL)', 690, 'NEAR_PRIME_REVIEW', 'Near Prime (675-749)', 3, 2, 320000, 0, 3, FALSE, 'Simulated Bureau Gateway API', '2026-10-18T10:00:00Z'),
  ('BUR-PROF-APP-PNB-2026-003', 'APP-PNB-2026-003', 'APP-PNB-2026-003', 'Simulated Credit Bureau (CIBIL)', 585, 'SUBPRIME_HIGH_RISK', 'Subprime (<675)', 2, 2, 145000, 65, 4, FALSE, 'Simulated Bureau Gateway API', '2026-10-18T10:00:00Z');

-- ----------------------------------------------------------------------------
-- Table: pnb_intelligent_lending.fact_audit_log
-- ----------------------------------------------------------------------------
INSERT INTO `pnb_intelligent_lending.fact_audit_log` (log_id, application_id, applicant_id, timestamp, actor, actor_name, stage_name, action, details, status_tag)
VALUES
  ('LOG-INIT-001', 'APP-PNB-2026-001', 'APP-PNB-2026-001', '2026-10-18T10:00:00Z', 'SYSTEM_AGENT', 'Workflow Orchestrator', 'Workbench Intake', 'APPLICANT_LOADED', 'Loaded synthetic profile for Priya Sharma (APP-PNB-2026-001). Ready for 7-stage evaluation.', 'INFO'),
  ('LOG-INIT-002', 'APP-PNB-2026-002', 'APP-PNB-2026-002', '2026-10-18T10:05:00Z', 'SYSTEM_AGENT', 'Workflow Orchestrator', 'Workbench Intake', 'APPLICANT_LOADED', 'Loaded synthetic profile for Rajesh Kumar (APP-PNB-2026-002). Ready for 7-stage evaluation.', 'INFO'),
  ('LOG-INIT-003', 'APP-PNB-2026-003', 'APP-PNB-2026-003', '2026-10-18T10:10:00Z', 'SYSTEM_AGENT', 'Workflow Orchestrator', 'Workbench Intake', 'APPLICANT_LOADED', 'Loaded synthetic profile for Amit Verma (APP-PNB-2026-003). Ready for 7-stage evaluation.', 'INFO');

