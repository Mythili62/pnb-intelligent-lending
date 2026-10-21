-- ============================================================================
-- Punjab National Bank · Intelligent Lending Presales POC
-- BigQuery Schema DDL: Minimum Viable Dataset (Phase 1)
--
-- Dataset: pnb_intelligent_lending
-- Region:  asia-south1 (Mumbai) or default GCP region
--
-- DISCLAIMER:
-- All schemas, mock customer profiles, bureau scores, and verification
-- tokens are SYNTHETIC and strictly for educational demonstration.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Applicant Master: dim_applicants
-- Contains core demographics, employer information, income and declared obligations.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pnb_intelligent_lending.dim_applicants` (
    applicant_id STRING NOT NULL OPTIONS(description="Unique applicant identifier, e.g. APP-PNB-2026-001"),
    full_name STRING NOT NULL OPTIONS(description="Full legal name of the applicant"),
    age INT64 NOT NULL OPTIONS(description="Age in years (permissible bracket: 21-60)"),
    city STRING NOT NULL OPTIONS(description="Residential city and state"),
    employer_name STRING NOT NULL OPTIONS(description="Employer organization name"),
    employer_category STRING NOT NULL OPTIONS(description="Category A (MNC/Tier-1), Category B (Mid-Corporate), or Category C (Small Enterprise)"),
    employment_vintage_years NUMERIC NOT NULL OPTIONS(description="Years of continuous employment with current organization"),
    designation STRING NOT NULL OPTIONS(description="Job title / role designation"),
    net_monthly_salary NUMERIC NOT NULL OPTIONS(description="Net monthly in-hand salary in INR"),
    existing_monthly_obligations NUMERIC NOT NULL OPTIONS(description="Total existing monthly debt commitments/EMIs in INR"),
    pan_number_masked STRING NOT NULL OPTIONS(description="Masked Permanent Account Number, e.g. ABCPS****K"),
    aadhaar_number_masked STRING NOT NULL OPTIONS(description="Masked Aadhaar identification number, e.g. **** **** 8241"),
    scenario_tag STRING NOT NULL OPTIONS(description="Curated test scenario: STRAIGHTFORWARD, BORDERLINE_REVIEW, or HIGH_RISK_DECLINE"),
    scenario_summary STRING NOT NULL OPTIONS(description="Narrative summary of the simulated applicant profile"),
    created_at TIMESTAMP NOT NULL OPTIONS(description="Record ingestion timestamp"),
    PRIMARY KEY (applicant_id) NOT ENFORCED
)
CLUSTER BY scenario_tag, city
OPTIONS(
    description="Demographics, employment history, and declared financial profile master"
);

-- ----------------------------------------------------------------------------
-- 2. Loan Applications: fact_loan_applications
-- Tracks the specific loan request, product parameters, terms and lifecycle state.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pnb_intelligent_lending.fact_loan_applications` (
    application_id STRING NOT NULL OPTIONS(description="Unique loan application tracking number"),
    applicant_id STRING NOT NULL OPTIONS(description="Foreign key referencing dim_applicants.applicant_id"),
    loan_product_id STRING NOT NULL OPTIONS(description="Product code: RETAIL_SALARIED_PL_001"),
    loan_product_name STRING NOT NULL OPTIONS(description="Product display name: Salaried Personal Loan"),
    requested_amount NUMERIC NOT NULL OPTIONS(description="Requested principal loan amount in INR"),
    requested_tenure_months INT64 NOT NULL OPTIONS(description="Requested repayment tenure in months"),
    indicative_annual_rate NUMERIC NOT NULL OPTIONS(description="Indicative reducing balance interest rate, e.g. 11.75"),
    loan_purpose STRING NOT NULL OPTIONS(description="Declared purpose for personal loan"),
    application_status STRING NOT NULL OPTIONS(description="Application status: INTAKE_VERIFIED, IN_ASSESSMENT, AWAITING_OFFICER, SANCTIONED, DECLINED"),
    intake_channel STRING NOT NULL OPTIONS(description="Submission channel: DIGITAL_PORTAL, BRANCH, or PARTNER_API"),
    created_at TIMESTAMP NOT NULL OPTIONS(description="Application intake timestamp"),
    PRIMARY KEY (application_id) NOT ENFORCED,
    FOREIGN KEY (applicant_id) REFERENCES `pnb_intelligent_lending.dim_applicants`(applicant_id) NOT ENFORCED
)
PARTITION BY DATE(created_at)
CLUSTER BY application_status, applicant_id
OPTIONS(
    description="Retail loan application requests, intake terms, and lifecycle status"
);

-- ----------------------------------------------------------------------------
-- 3. Banking & Verification Profiles: fact_banking_cbs_profiles
-- Combines Core Banking (CBS) relationship, Account Aggregator (AA) cashflows,
-- and synthetic document verification metadata (DigiLocker KYC, OCR pay slips).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pnb_intelligent_lending.fact_banking_cbs_profiles` (
    banking_profile_id STRING NOT NULL OPTIONS(description="Unique banking profile identifier"),
    applicant_id STRING NOT NULL OPTIONS(description="Foreign key referencing dim_applicants.applicant_id"),
    application_id STRING NOT NULL OPTIONS(description="Foreign key referencing fact_loan_applications.application_id"),
    
    -- Core Banking System (CBS) Metrics
    customer_relationship_vintage_months INT64 NOT NULL OPTIONS(description="Customer relationship age with PNB in months"),
    has_existing_cbs_account BOOL NOT NULL OPTIONS(description="True if customer holds an existing CBS account"),
    account_type STRING NOT NULL OPTIONS(description="Salary, Savings, or None"),
    internal_repayment_track_record STRING NOT NULL OPTIONS(description="Clean, Minor Delinquency, or No Prior Loan Track"),
    average_quarterly_balance NUMERIC NOT NULL OPTIONS(description="Average Quarterly Balance in CBS account (INR)"),
    cbs_source_tag STRING NOT NULL OPTIONS(description="Origin tag: Simulated Core Banking System (CBS)"),
    
    -- Cashflow & Account Aggregator (AA) Metrics
    salary_credit_detected BOOL NOT NULL OPTIONS(description="True if automated monthly salary credits detected"),
    salary_credit_pattern STRING NOT NULL OPTIONS(description="Regular Monthly Credit or Irregular / Intermittent"),
    avg_monthly_bank_balance NUMERIC NOT NULL OPTIONS(description="Observed average monthly balance from bank statement (INR)"),
    inward_cheque_bounces_past_6_months INT64 NOT NULL OPTIONS(description="Count of inward returns or NACH mandate bounces in last 180 days"),
    account_aggregator_source_tag STRING NOT NULL OPTIONS(description="Origin tag: Simulated Account Aggregator (AA) Statement"),
    
    -- Synthetic Document Verification Metadata (OCR & DigiLocker)
    pan_verified BOOL NOT NULL OPTIONS(description="True if PAN was verified via simulated DigiLocker/e-KYC"),
    aadhaar_verified BOOL NOT NULL OPTIONS(description="True if Aadhaar was verified via simulated UIDAI/DigiLocker"),
    kyc_source_tag STRING NOT NULL OPTIONS(description="Origin tag: Simulated DigiLocker / Aadhaar e-KYC"),
    salary_slips_verified_count INT64 NOT NULL OPTIONS(description="Count of parsed salary slips (policy mandate: 3 slips)"),
    average_reported_net_salary NUMERIC NOT NULL OPTIONS(description="Average net pay extracted by OCR from pay slips (INR)"),
    salary_variance_detected BOOL NOT NULL OPTIONS(description="True if variance detected across submitted pay slips"),
    variance_percentage NUMERIC NOT NULL OPTIONS(description="Percentage variance across submitted pay slips"),
    ocr_source_tag STRING NOT NULL OPTIONS(description="Origin tag: Simulated OCR & Salary Slip Parser"),
    simulated_document_hash STRING NOT NULL OPTIONS(description="Simulated cryptographic document extraction hash"),
    created_at TIMESTAMP NOT NULL OPTIONS(description="Verification record creation timestamp"),
    
    PRIMARY KEY (banking_profile_id) NOT ENFORCED,
    FOREIGN KEY (applicant_id) REFERENCES `pnb_intelligent_lending.dim_applicants`(applicant_id) NOT ENFORCED,
    FOREIGN KEY (application_id) REFERENCES `pnb_intelligent_lending.fact_loan_applications`(application_id) NOT ENFORCED
)
CLUSTER BY applicant_id, account_type
OPTIONS(
    description="Consolidated CBS records, cashflow behavior, and synthetic document verification metadata"
);

-- ----------------------------------------------------------------------------
-- 4. Credit Bureau Profiles: fact_bureau_profiles
-- Stores mock CIBIL inquiry responses, credit score, active tradeline summaries,
-- delinquency history (DPD), inquiry velocity, and legal flags.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pnb_intelligent_lending.fact_bureau_profiles` (
    bureau_profile_id STRING NOT NULL OPTIONS(description="Unique bureau pull report identifier"),
    applicant_id STRING NOT NULL OPTIONS(description="Foreign key referencing dim_applicants.applicant_id"),
    application_id STRING NOT NULL OPTIONS(description="Foreign key referencing fact_loan_applications.application_id"),
    bureau_name STRING NOT NULL OPTIONS(description="Bureau agency name: Simulated Credit Bureau (CIBIL)"),
    credit_score INT64 NOT NULL OPTIONS(description="3-digit credit score between 300 and 900"),
    credit_score_tier STRING NOT NULL OPTIONS(description="Authoritative policy band: PRIME (>=720), NEAR_PRIME_REVIEW (675-719), or SUBPRIME_HIGH_RISK (<675)"),
    legacy_score_category STRING NOT NULL OPTIONS(description="Preserved UI display category: Prime (750+), Near Prime (675-749), or Subprime (<675)"),
    total_active_accounts INT64 NOT NULL OPTIONS(description="Total count of active credit accounts reported to bureau"),
    unsecured_accounts_count INT64 NOT NULL OPTIONS(description="Count of active unsecured trade lines (credit cards, personal loans)"),
    total_reported_outstanding NUMERIC NOT NULL OPTIONS(description="Total outstanding debt across all trade lines in INR"),
    max_dpd_past_24_months INT64 NOT NULL OPTIONS(description="Peak Days Past Due recorded on active trade lines in last 24 months"),
    recent_enquiries_past_60_days INT64 NOT NULL OPTIONS(description="Number of unsecured credit inquiries logged in preceding 60 days"),
    suit_filed_or_wilful_default BOOL NOT NULL OPTIONS(description="True if legal suit filed, wilful default, or written-off trade line exists"),
    bureau_source_tag STRING NOT NULL OPTIONS(description="Origin tag: Simulated Bureau Gateway API"),
    pulled_at TIMESTAMP NOT NULL OPTIONS(description="Bureau report retrieval timestamp"),
    
    PRIMARY KEY (bureau_profile_id) NOT ENFORCED,
    FOREIGN KEY (applicant_id) REFERENCES `pnb_intelligent_lending.dim_applicants`(applicant_id) NOT ENFORCED,
    FOREIGN KEY (application_id) REFERENCES `pnb_intelligent_lending.fact_loan_applications`(application_id) NOT ENFORCED
)
CLUSTER BY applicant_id, credit_score_tier
OPTIONS(
    description="Mock credit bureau report data, CIBIL scores, delinquency history, and inquiry velocity"
);

-- ----------------------------------------------------------------------------
-- 5. Audit Trail: fact_audit_log
-- Append-only audit log tracking system agent lifecycle actions and credit officer
-- maker-checker sign-offs. Governed by IAM append-only access controls.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pnb_intelligent_lending.fact_audit_log` (
    log_id STRING NOT NULL OPTIONS(description="Unique audit entry identifier, e.g. LOG-1729000000000"),
    application_id STRING NOT NULL OPTIONS(description="Foreign key referencing fact_loan_applications.application_id"),
    applicant_id STRING NOT NULL OPTIONS(description="Foreign key referencing dim_applicants.applicant_id"),
    timestamp TIMESTAMP NOT NULL OPTIONS(description="Server event timestamp"),
    actor STRING NOT NULL OPTIONS(description="Actor role: SYSTEM_AGENT, CREDIT_OFFICER, or DISBURSEMENT_GATEWAY"),
    actor_name STRING NOT NULL OPTIONS(description="Display name of actor (e.g. Workflow Orchestrator, Rajeshwar Sen)"),
    stage_name STRING NOT NULL OPTIONS(description="Workflow stage context (e.g. Workbench Intake, Stage 7: Human Review)"),
    action STRING NOT NULL OPTIONS(description="Action verb, e.g. APPLICANT_LOADED, OFFICER_APPROVED, STAGE_PASSED"),
    details STRING NOT NULL OPTIONS(description="Complete textual description and evidence trail of the action"),
    status_tag STRING NOT NULL OPTIONS(description="Status indicator: INFO, PASSED, WARNING, DECLINED, or APPROVED"),
    
    PRIMARY KEY (log_id) NOT ENFORCED,
    FOREIGN KEY (application_id) REFERENCES `pnb_intelligent_lending.fact_loan_applications`(application_id) NOT ENFORCED,
    FOREIGN KEY (applicant_id) REFERENCES `pnb_intelligent_lending.dim_applicants`(applicant_id) NOT ENFORCED
)
PARTITION BY DATE(timestamp)
CLUSTER BY application_id, actor
OPTIONS(
    description="Append-only audit trail capturing system evaluations and human maker-checker governance decisions"
);
