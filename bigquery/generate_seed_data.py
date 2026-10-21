#!/usr/bin/env python3
"""
Punjab National Bank · Intelligent Lending Presales POC
Seed Data Generator & Relational Integrity Validator (Phase 1)

This script:
1. Extracts and normalizes the 3 curated synthetic applicant scenarios (Priya, Rajesh, Amit).
2. Performs comprehensive data validation:
   - Primary key uniqueness (duplicate ID check)
   - Required fields completeness (no nulls/empty strings)
   - Foreign key referential integrity (no orphaned records)
   - Credit score validity & policy tier alignment (Prime >= 720, Review 675-719, High Risk < 675)
   - Mathematical consistency of EMI and FOIR reducing-balance formulas
3. Generates BigQuery-ready Newline-Delimited JSON (NDJSON) files in bigquery/seeds/
4. Generates an ANSI-SQL insert script in bigquery/seeds.sql for direct BigQuery Console execution.
5. Reports any data inconsistencies discovered in the source data.

Usage:
    python3 bigquery/generate_seed_data.py
"""

import os
import sys
import json
import math
from datetime import datetime, timezone
from typing import Dict, List, Any, Tuple

# Base directory paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
SEEDS_DIR = os.path.join(SCRIPT_DIR, "seeds")

# ============================================================================
# FINANCIAL CALCULATION ENGINE (Matching src/utils/loanCalculations.ts)
# ============================================================================

def calculate_monthly_emi(principal: float, annual_rate_pct: float, tenure_months: int) -> int:
    """
    Standard Reducing Balance EMI Formula:
    EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    where r = annual_rate_pct / (12 * 100)
    """
    if principal <= 0 or tenure_months <= 0:
        return 0
    if annual_rate_pct <= 0:
        return round(principal / tenure_months)
    
    monthly_rate = annual_rate_pct / (12 * 100)
    factor = math.pow(1 + monthly_rate, tenure_months)
    emi = (principal * monthly_rate * factor) / (factor - 1)
    return round(emi)

def calculate_foir(existing_monthly_obligations: float, proposed_monthly_emi: float, net_monthly_income: float) -> float:
    """
    Fixed Obligation to Income Ratio (FOIR):
    FOIR (%) = ((Total Existing EMIs + Proposed EMI) / Net Monthly Income) * 100
    """
    if net_monthly_income <= 0:
        return 100.0
    total_commitments = existing_monthly_obligations + proposed_monthly_emi
    foir = (total_commitments / net_monthly_income) * 100.0
    return round(foir, 1)

def get_credit_score_tier(score: int) -> Tuple[str, str]:
    """
    Authoritative Policy Tier mapping based on src/data/illustrativePolicies.ts:
    - Prime: >= 720
    - Near Prime / Review Band: 675 - 719
    - Subprime / High Risk: < 675
    Returns (authoritative_tier, legacy_display_category)
    """
    if score >= 720:
        return "PRIME", "Prime (750+)"
    elif score >= 675:
        return "NEAR_PRIME_REVIEW", "Near Prime (675-749)"
    else:
        return "SUBPRIME_HIGH_RISK", "Subprime (<675)"

# ============================================================================
# SYNTHETIC SOURCE DATA (Exact mirror of src/data/syntheticApplicants.ts)
# ============================================================================

BASE_TIMESTAMP = "2026-10-18T10:00:00Z"

RAW_APPLICANTS = [
    {
        "applicant_id": "APP-PNB-2026-001",
        "full_name": "Priya Sharma",
        "age": 31,
        "city": "Bengaluru, Karnataka",
        "employer_name": "Infosys Limited",
        "employer_category": "Category A (MNC/Tier-1)",
        "employment_vintage_years": 4.5,
        "designation": "Senior Lead Software Engineer",
        "net_monthly_salary": 95000,
        "existing_monthly_obligations": 12000,
        "pan_number_masked": "ABCPS****K",
        "aadhaar_number_masked": "**** **** 8241",
        "scenario_tag": "STRAIGHTFORWARD",
        "scenario_summary": "Prime salaried applicant with Tier-1 employer, clean credit history (CIBIL 785), low debt ratio, and verified KYC/salary credits. Recommended for fast-track sanction.",
        "application": {
            "application_id": "APP-PNB-2026-001",  # Preserved 1:1 with frontend ID
            "loan_product_id": "RETAIL_SALARIED_PL_001",
            "loan_product_name": "Salaried Personal Loan",
            "requested_amount": 500000,
            "requested_tenure_months": 36,
            "indicative_annual_rate": 11.75,
            "loan_purpose": "Home Renovation & Furnishing",
            "application_status": "INTAKE_VERIFIED",
            "intake_channel": "DIGITAL_PORTAL"
        },
        "banking": {
            "customer_relationship_vintage_months": 38,
            "has_existing_cbs_account": True,
            "account_type": "Salary",
            "internal_repayment_track_record": "Clean",
            "average_quarterly_balance": 52000,
            "cbs_source_tag": "Simulated Core Banking System (CBS)",
            "salary_credit_detected": True,
            "salary_credit_pattern": "Regular Monthly Credit",
            "avg_monthly_bank_balance": 48500,
            "inward_cheque_bounces_past_6_months": 0,
            "account_aggregator_source_tag": "Simulated Account Aggregator (AA) Statement",
            "pan_verified": True,
            "aadhaar_verified": True,
            "kyc_source_tag": "Simulated DigiLocker / Aadhaar e-KYC",
            "salary_slips_verified_count": 3,
            "average_reported_net_salary": 95000,
            "salary_variance_detected": False,
            "variance_percentage": 0.0,
            "ocr_source_tag": "Simulated OCR & Salary Slip Parser",
            "simulated_document_hash": "DOC-HASH-SHA256-APP-001-VERIFIED"
        },
        "bureau": {
            "bureau_name": "Simulated Credit Bureau (CIBIL)",
            "credit_score": 785,
            "total_active_accounts": 2,
            "unsecured_accounts_count": 1,
            "total_reported_outstanding": 280000,
            "max_dpd_past_24_months": 0,
            "recent_enquiries_past_60_days": 1,
            "suit_filed_or_wilful_default": False,
            "bureau_source_tag": "Simulated Bureau Gateway API"
        }
    },
    {
        "applicant_id": "APP-PNB-2026-002",
        "full_name": "Rajesh Kumar",
        "age": 38,
        "city": "Pune, Maharashtra",
        "employer_name": "Apex Supply Chain Logistics Pvt Ltd",
        "employer_category": "Category B (Mid-Corporate)",
        "employment_vintage_years": 2.8,
        "designation": "Operations Regional Manager",
        "net_monthly_salary": 52000,
        "existing_monthly_obligations": 16500,
        "pan_number_masked": "BLRPK****E",
        "aadhaar_number_masked": "**** **** 4192",
        "scenario_tag": "BORDERLINE_REVIEW",
        "scenario_summary": "Borderline profile: Moderate CIBIL (690), recent credit enquiry spike (3 enquiries), and proposed loan amount of ₹6.5L pushes FOIR to 73.1% (> 50% threshold). Requires underwriter review or counter-offer with reduced amount/extended tenure.",
        "application": {
            "application_id": "APP-PNB-2026-002",
            "loan_product_id": "RETAIL_SALARIED_PL_001",
            "loan_product_name": "Salaried Personal Loan",
            "requested_amount": 650000,
            "requested_tenure_months": 36,
            "indicative_annual_rate": 11.75,
            "loan_purpose": "Family Medical Procedure & Consolidation",
            "application_status": "INTAKE_VERIFIED",
            "intake_channel": "DIGITAL_PORTAL"
        },
        "banking": {
            "customer_relationship_vintage_months": 14,
            "has_existing_cbs_account": True,
            "account_type": "Savings",
            "internal_repayment_track_record": "Clean",
            "average_quarterly_balance": 16500,
            "cbs_source_tag": "Simulated Core Banking System (CBS)",
            "salary_credit_detected": True,
            "salary_credit_pattern": "Regular Monthly Credit",
            "avg_monthly_bank_balance": 14200,
            "inward_cheque_bounces_past_6_months": 0,
            "account_aggregator_source_tag": "Simulated Account Aggregator (AA) Statement",
            "pan_verified": True,
            "aadhaar_verified": True,
            "kyc_source_tag": "Simulated DigiLocker / Aadhaar e-KYC",
            "salary_slips_verified_count": 3,
            "average_reported_net_salary": 52000,
            "salary_variance_detected": True,
            "variance_percentage": 6.2,
            "ocr_source_tag": "Simulated OCR & Salary Slip Parser",
            "simulated_document_hash": "DOC-HASH-SHA256-APP-002-REVIEW"
        },
        "bureau": {
            "bureau_name": "Simulated Credit Bureau (CIBIL)",
            "credit_score": 690,
            "total_active_accounts": 3,
            "unsecured_accounts_count": 2,
            "total_reported_outstanding": 320000,
            "max_dpd_past_24_months": 0,
            "recent_enquiries_past_60_days": 3,
            "suit_filed_or_wilful_default": False,
            "bureau_source_tag": "Simulated Bureau Gateway API"
        }
    },
    {
        "applicant_id": "APP-PNB-2026-003",
        "full_name": "Amit Verma",
        "age": 27,
        "city": "Jaipur, Rajasthan",
        "employer_name": "QuickKart Local Retailers",
        "employer_category": "Category C (Small Enterprise)",
        "employment_vintage_years": 1.1,
        "designation": "Telesales Executive",
        "net_monthly_salary": 22000,
        "existing_monthly_obligations": 8500,
        "pan_number_masked": "CKIPV****N",
        "aadhaar_number_masked": "**** **** 1058",
        "scenario_tag": "HIGH_RISK_DECLINE",
        "scenario_summary": "High-risk profile with hard knockout triggers: Net salary (₹22,000) falls below minimum policy limit of ₹25,000; poor bureau score (585) with historical 65 DPD default on credit card; inward cheque bounces detected. Recommended for decline.",
        "application": {
            "application_id": "APP-PNB-2026-003",
            "loan_product_id": "RETAIL_SALARIED_PL_001",
            "loan_product_name": "Salaried Personal Loan",
            "requested_amount": 300000,
            "requested_tenure_months": 24,
            "indicative_annual_rate": 11.75,
            "loan_purpose": "Debt Payoff & Personal Expenses",
            "application_status": "INTAKE_VERIFIED",
            "intake_channel": "DIGITAL_PORTAL"
        },
        "banking": {
            "customer_relationship_vintage_months": 0,
            "has_existing_cbs_account": False,
            "account_type": "None",
            "internal_repayment_track_record": "No Prior Loan Track",
            "average_quarterly_balance": 0,
            "cbs_source_tag": "Simulated Core Banking System (CBS)",
            "salary_credit_detected": True,
            "salary_credit_pattern": "Irregular / Intermittent",
            "avg_monthly_bank_balance": 2400,
            "inward_cheque_bounces_past_6_months": 2,
            "account_aggregator_source_tag": "Simulated Account Aggregator (AA) Statement",
            "pan_verified": True,
            "aadhaar_verified": True,
            "kyc_source_tag": "Simulated DigiLocker / Aadhaar e-KYC",
            "salary_slips_verified_count": 2,
            "average_reported_net_salary": 22000,
            "salary_variance_detected": True,
            "variance_percentage": 14.5,
            "ocr_source_tag": "Simulated OCR & Salary Slip Parser",
            "simulated_document_hash": "DOC-HASH-SHA256-APP-003-DECLINE"
        },
        "bureau": {
            "bureau_name": "Simulated Credit Bureau (CIBIL)",
            "credit_score": 585,
            "total_active_accounts": 2,
            "unsecured_accounts_count": 2,
            "total_reported_outstanding": 145000,
            "max_dpd_past_24_months": 65,
            "recent_enquiries_past_60_days": 4,
            "suit_filed_or_wilful_default": False,
            "bureau_source_tag": "Simulated Bureau Gateway API"
        }
    }
]

# Baseline initial audit entries for the 3 applicants
RAW_AUDIT_LOGS = [
    {
        "log_id": "LOG-INIT-001",
        "application_id": "APP-PNB-2026-001",
        "applicant_id": "APP-PNB-2026-001",
        "timestamp": "2026-10-18T10:00:00Z",
        "actor": "SYSTEM_AGENT",
        "actor_name": "Workflow Orchestrator",
        "stage_name": "Workbench Intake",
        "action": "APPLICANT_LOADED",
        "details": "Loaded synthetic profile for Priya Sharma (APP-PNB-2026-001). Ready for 7-stage evaluation.",
        "status_tag": "INFO"
    },
    {
        "log_id": "LOG-INIT-002",
        "application_id": "APP-PNB-2026-002",
        "applicant_id": "APP-PNB-2026-002",
        "timestamp": "2026-10-18T10:05:00Z",
        "actor": "SYSTEM_AGENT",
        "actor_name": "Workflow Orchestrator",
        "stage_name": "Workbench Intake",
        "action": "APPLICANT_LOADED",
        "details": "Loaded synthetic profile for Rajesh Kumar (APP-PNB-2026-002). Ready for 7-stage evaluation.",
        "status_tag": "INFO"
    },
    {
        "log_id": "LOG-INIT-003",
        "application_id": "APP-PNB-2026-003",
        "applicant_id": "APP-PNB-2026-003",
        "timestamp": "2026-10-18T10:10:00Z",
        "actor": "SYSTEM_AGENT",
        "actor_name": "Workflow Orchestrator",
        "stage_name": "Workbench Intake",
        "action": "APPLICANT_LOADED",
        "details": "Loaded synthetic profile for Amit Verma (APP-PNB-2026-003). Ready for 7-stage evaluation.",
        "status_tag": "INFO"
    }
]

# ============================================================================
# NORMALIZATION & SEED BUILDER
# ============================================================================

def build_normalized_tables() -> Dict[str, List[Dict[str, Any]]]:
    """Normalizes the synthetic applicants into the 5 BigQuery tables."""
    dim_applicants = []
    fact_loan_applications = []
    fact_banking_cbs_profiles = []
    fact_bureau_profiles = []

    for raw in RAW_APPLICANTS:
        app_id = raw["applicant_id"]
        
        # 1. dim_applicants
        dim_applicants.append({
            "applicant_id": app_id,
            "full_name": raw["full_name"],
            "age": raw["age"],
            "city": raw["city"],
            "employer_name": raw["employer_name"],
            "employer_category": raw["employer_category"],
            "employment_vintage_years": raw["employment_vintage_years"],
            "designation": raw["designation"],
            "net_monthly_salary": raw["net_monthly_salary"],
            "existing_monthly_obligations": raw["existing_monthly_obligations"],
            "pan_number_masked": raw["pan_number_masked"],
            "aadhaar_number_masked": raw["aadhaar_number_masked"],
            "scenario_tag": raw["scenario_tag"],
            "scenario_summary": raw["scenario_summary"],
            "created_at": BASE_TIMESTAMP
        })

        # 2. fact_loan_applications
        appl = raw["application"]
        fact_loan_applications.append({
            "application_id": appl["application_id"],
            "applicant_id": app_id,
            "loan_product_id": appl["loan_product_id"],
            "loan_product_name": appl["loan_product_name"],
            "requested_amount": appl["requested_amount"],
            "requested_tenure_months": appl["requested_tenure_months"],
            "indicative_annual_rate": appl["indicative_annual_rate"],
            "loan_purpose": appl["loan_purpose"],
            "application_status": appl["application_status"],
            "intake_channel": appl["intake_channel"],
            "created_at": BASE_TIMESTAMP
        })

        # 3. fact_banking_cbs_profiles
        bank = raw["banking"]
        fact_banking_cbs_profiles.append({
            "banking_profile_id": f"BANK-PROF-{app_id}",
            "applicant_id": app_id,
            "application_id": appl["application_id"],
            "customer_relationship_vintage_months": bank["customer_relationship_vintage_months"],
            "has_existing_cbs_account": bank["has_existing_cbs_account"],
            "account_type": bank["account_type"],
            "internal_repayment_track_record": bank["internal_repayment_track_record"],
            "average_quarterly_balance": bank["average_quarterly_balance"],
            "cbs_source_tag": bank["cbs_source_tag"],
            "salary_credit_detected": bank["salary_credit_detected"],
            "salary_credit_pattern": bank["salary_credit_pattern"],
            "avg_monthly_bank_balance": bank["avg_monthly_bank_balance"],
            "inward_cheque_bounces_past_6_months": bank["inward_cheque_bounces_past_6_months"],
            "account_aggregator_source_tag": bank["account_aggregator_source_tag"],
            "pan_verified": bank["pan_verified"],
            "aadhaar_verified": bank["aadhaar_verified"],
            "kyc_source_tag": bank["kyc_source_tag"],
            "salary_slips_verified_count": bank["salary_slips_verified_count"],
            "average_reported_net_salary": bank["average_reported_net_salary"],
            "salary_variance_detected": bank["salary_variance_detected"],
            "variance_percentage": bank["variance_percentage"],
            "ocr_source_tag": bank["ocr_source_tag"],
            "simulated_document_hash": bank["simulated_document_hash"],
            "created_at": BASE_TIMESTAMP
        })

        # 4. fact_bureau_profiles
        bur = raw["bureau"]
        tier, legacy_cat = get_credit_score_tier(bur["credit_score"])
        fact_bureau_profiles.append({
            "bureau_profile_id": f"BUR-PROF-{app_id}",
            "applicant_id": app_id,
            "application_id": appl["application_id"],
            "bureau_name": bur["bureau_name"],
            "credit_score": bur["credit_score"],
            "credit_score_tier": tier,
            "legacy_score_category": legacy_cat,
            "total_active_accounts": bur["total_active_accounts"],
            "unsecured_accounts_count": bur["unsecured_accounts_count"],
            "total_reported_outstanding": bur["total_reported_outstanding"],
            "max_dpd_past_24_months": bur["max_dpd_past_24_months"],
            "recent_enquiries_past_60_days": bur["recent_enquiries_past_60_days"],
            "suit_filed_or_wilful_default": bur["suit_filed_or_wilful_default"],
            "bureau_source_tag": bur["bureau_source_tag"],
            "pulled_at": BASE_TIMESTAMP
        })

    # 5. fact_audit_log
    fact_audit_log = RAW_AUDIT_LOGS

    return {
        "dim_applicants": dim_applicants,
        "fact_loan_applications": fact_loan_applications,
        "fact_banking_cbs_profiles": fact_banking_cbs_profiles,
        "fact_bureau_profiles": fact_bureau_profiles,
        "fact_audit_log": fact_audit_log
    }

# ============================================================================
# RELATIONAL & MATHEMATICAL VALIDATION ENGINE
# ============================================================================

class ValidationResult:
    def __init__(self):
        self.passed_checks = []
        self.failed_checks = []
        self.reported_inconsistencies = []

    def check(self, name: str, condition: bool, error_msg: str):
        if condition:
            self.passed_checks.append(name)
        else:
            self.failed_checks.append((name, error_msg))

    def report_inconsistency(self, component: str, description: str):
        self.reported_inconsistencies.append((component, description))

def run_validations(tables: Dict[str, List[Dict[str, Any]]]) -> ValidationResult:
    res = ValidationResult()

    dim_applicants = tables["dim_applicants"]
    fact_loan_applications = tables["fact_loan_applications"]
    fact_banking = tables["fact_banking_cbs_profiles"]
    fact_bureau = tables["fact_bureau_profiles"]
    fact_audit = tables["fact_audit_log"]

    # ------------------------------------------------------------------------
    # Check 1: Duplicate ID Checks (Primary Key Uniqueness)
    # ------------------------------------------------------------------------
    def verify_unique_pk(table_name: str, records: List[Dict[str, Any]], pk_field: str):
        ids = [r[pk_field] for r in records]
        unique_ids = set(ids)
        res.check(
            f"PK Uniqueness: {table_name}.{pk_field}",
            len(ids) == len(unique_ids),
            f"Found duplicate primary keys in {table_name}: {len(ids)} rows vs {len(unique_ids)} unique"
        )

    verify_unique_pk("dim_applicants", dim_applicants, "applicant_id")
    verify_unique_pk("fact_loan_applications", fact_loan_applications, "application_id")
    verify_unique_pk("fact_banking_cbs_profiles", fact_banking, "banking_profile_id")
    verify_unique_pk("fact_bureau_profiles", fact_bureau, "bureau_profile_id")
    verify_unique_pk("fact_audit_log", fact_audit, "log_id")

    # ------------------------------------------------------------------------
    # Check 2: Missing Required Fields Check (NOT NULL Validation)
    # ------------------------------------------------------------------------
    for t_name, rows in tables.items():
        missing_count = 0
        for r in rows:
            for k, v in r.items():
                if v is None or (isinstance(v, str) and v.strip() == ""):
                    missing_count += 1
        res.check(
            f"NOT NULL Completeness: {t_name}",
            missing_count == 0,
            f"{t_name} has {missing_count} null or empty required fields"
        )

    # ------------------------------------------------------------------------
    # Check 3: Orphaned Records Check (Foreign Key Referential Integrity)
    # ------------------------------------------------------------------------
    applicant_pks = {r["applicant_id"] for r in dim_applicants}
    application_pks = {r["application_id"] for r in fact_loan_applications}

    for app in fact_loan_applications:
        res.check(
            f"FK Integrity: fact_loan_applications.applicant_id ({app['applicant_id']})",
            app["applicant_id"] in applicant_pks,
            f"Orphaned application {app['application_id']}: applicant_id {app['applicant_id']} not in dim_applicants"
        )

    for b in fact_banking:
        res.check(
            f"FK Integrity: fact_banking.applicant_id ({b['applicant_id']})",
            b["applicant_id"] in applicant_pks,
            f"Orphaned banking profile {b['banking_profile_id']}: applicant_id {b['applicant_id']} not in dim_applicants"
        )
        res.check(
            f"FK Integrity: fact_banking.application_id ({b['application_id']})",
            b["application_id"] in application_pks,
            f"Orphaned banking profile {b['banking_profile_id']}: application_id {b['application_id']} not in fact_loan_applications"
        )

    for bur in fact_bureau:
        res.check(
            f"FK Integrity: fact_bureau.applicant_id ({bur['applicant_id']})",
            bur["applicant_id"] in applicant_pks,
            f"Orphaned bureau profile {bur['bureau_profile_id']}: applicant_id {bur['applicant_id']} not in dim_applicants"
        )
        res.check(
            f"FK Integrity: fact_bureau.application_id ({bur['application_id']})",
            bur["application_id"] in application_pks,
            f"Orphaned bureau profile {bur['bureau_profile_id']}: application_id {bur['application_id']} not in fact_loan_applications"
        )

    for aud in fact_audit:
        res.check(
            f"FK Integrity: fact_audit.application_id ({aud['application_id']})",
            aud["application_id"] in application_pks,
            f"Orphaned audit entry {aud['log_id']}: application_id {aud['application_id']} not in fact_loan_applications"
        )
        res.check(
            f"FK Integrity: fact_audit.applicant_id ({aud['applicant_id']})",
            aud["applicant_id"] in applicant_pks,
            f"Orphaned audit entry {aud['log_id']}: applicant_id {aud['applicant_id']} not in dim_applicants"
        )

    # ------------------------------------------------------------------------
    # Check 4: Credit Score Validity & Policy Tier Checks
    # ------------------------------------------------------------------------
    for bur in fact_bureau:
        score = bur["credit_score"]
        tier = bur["credit_score_tier"]
        res.check(
            f"Credit Score Range: {bur['bureau_profile_id']} ({score})",
            300 <= score <= 900,
            f"Invalid credit score {score} for {bur['bureau_profile_id']}"
        )
        
        # Verify policy tier mapping against authoritative benchmark
        if score >= 720:
            expected_tier = "PRIME"
        elif score >= 675:
            expected_tier = "NEAR_PRIME_REVIEW"
        else:
            expected_tier = "SUBPRIME_HIGH_RISK"
        
        res.check(
            f"Credit Policy Tier Alignment: {bur['bureau_profile_id']} ({score} -> {tier})",
            tier == expected_tier,
            f"Score {score} mapped to {tier}, expected {expected_tier}"
        )

    # ------------------------------------------------------------------------
    # Check 5: Financial Calculation Consistency Checks
    # (Matches exact unrounded reducing-balance math from src/utils/loanCalculations.ts)
    # ------------------------------------------------------------------------
    expected_scenarios = {
        "APP-PNB-2026-001": {
            "name": "Priya Sharma",
            "expected_emi": 16548,
            "expected_foir": 30.1,
            "expected_recommendation": "RECOMMENDED_SANCTION"
        },
        "APP-PNB-2026-002": {
            "name": "Rajesh Kumar",
            "expected_emi": 21512,
            "expected_foir": 73.1,
            "expected_recommendation": "REFERRED_FOR_REVIEW"
        },
        "APP-PNB-2026-003": {
            "name": "Amit Verma",
            "expected_emi": 14087,
            "expected_foir": 102.7,
            "expected_recommendation": "RECOMMENDED_DECLINE"
        }
    }

    for app in fact_loan_applications:
        app_id = app["applicant_id"]
        applicant = next(a for a in dim_applicants if a["applicant_id"] == app_id)
        exp = expected_scenarios[app_id]

        p = float(app["requested_amount"])
        r = float(app["indicative_annual_rate"])
        n = int(app["requested_tenure_months"])
        income = float(applicant["net_monthly_salary"])
        obligations = float(applicant["existing_monthly_obligations"])

        computed_emi = calculate_monthly_emi(p, r, n)
        computed_foir = calculate_foir(obligations, computed_emi, income)

        res.check(
            f"EMI Match ({exp['name']}): Expected ₹{exp['expected_emi']}, Computed ₹{computed_emi}",
            abs(computed_emi - exp["expected_emi"]) <= 1,
            f"EMI calculation mismatch for {exp['name']}: expected {exp['expected_emi']}, got {computed_emi}"
        )

        res.check(
            f"FOIR Match ({exp['name']}): Expected {exp['expected_foir']}%, Computed {computed_foir}%",
            abs(computed_foir - exp["expected_foir"]) <= 0.1,
            f"FOIR calculation mismatch for {exp['name']}: expected {exp['expected_foir']}%, got {computed_foir}%"
        )

    # ------------------------------------------------------------------------
    # Discovered Inconsistencies Report
    # ------------------------------------------------------------------------
    res.report_inconsistency(
        "Financial Calculations (Exact Reducing Balance vs Truncated Factor)",
        "The runtime TypeScript engine (src/utils/loanCalculations.ts lines 42-45) computes full-precision floating-point exponentiation: "
        "monthlyRate = 11.75 / (12 * 100) = 0.009791666666666667, factor = (1 + monthlyRate)^n. "
        "For Priya (P=5L, n=36), exact factor is 1.420182525..., yielding EMI = ₹16,548 and FOIR = 30.1%. "
        "For Rajesh (P=6.5L, n=36), exact factor yields EMI = ₹21,512 and FOIR = 73.1% (matching scenarioSummary text in syntheticApplicants.ts line 136). "
        "For Amit (P=3L, n=24), exact factor is 1.2631589..., yielding EMI = ₹14,087 and FOIR = 102.7%. "
        "Any intermediate manual rounding of the compounding factor (e.g. to 1.4206) shifts the EMI by ₹12 (₹16,536 vs ₹16,548). "
        "RESOLUTION: Python seed generator and validator use the exact unrounded floating-point formula matching loanCalculations.ts."
    )

    # ------------------------------------------------------------------------
    # Discovered Inconsistencies Report
    # ------------------------------------------------------------------------
    res.report_inconsistency(
        "src/types/lending.ts vs src/data/illustrativePolicies.ts",
        "Legacy type annotation in src/types/lending.ts (line 75) uses 'Prime (750+)' and 'Near Prime (675-749)', whereas the actual credit policy benchmark (ILLUSTRATIVE-RULE-03 in src/data/illustrativePolicies.ts) and the evaluation engine (src/utils/loanCalculations.ts line 146) strictly enforce Prime >= 720 and Review 675-719. "
        "RESOLUTION: BigQuery schema implements 'credit_score_tier' with authoritative values ('PRIME', 'NEAR_PRIME_REVIEW', 'SUBPRIME_HIGH_RISK') while preserving 'legacy_score_category' to keep UI components compatible."
    )

    res.report_inconsistency(
        "src/data/syntheticApplicants.ts (Entity Key Model)",
        "In the current frontend synthetic dataset, 'id' serves simultaneously as the applicant master ID and the loan application ID ('APP-PNB-2026-001'). In BigQuery, this is normalized into separate entities: dim_applicants (applicant_id) and fact_loan_applications (application_id), joined by foreign key. "
        "RESOLUTION: Kept identical ID strings ('APP-PNB-2026-001') for both applicant_id and application_id in Phase 1 to guarantee 100% backward compatibility with existing frontend state lookups."
    )

    return res

# ============================================================================
# EXPORT GENERATOR (NDJSON & SQL)
# ============================================================================

def export_seeds(tables: Dict[str, List[Dict[str, Any]]]):
    os.makedirs(SEEDS_DIR, exist_ok=True)

    # 1. Export Newline-Delimited JSON (NDJSON) files
    for t_name, rows in tables.items():
        file_path = os.path.join(SEEDS_DIR, f"{t_name}.json")
        with open(file_path, "w", encoding="utf-8") as f:
            for r in rows:
                f.write(json.dumps(r, ensure_ascii=False) + "\n")
        print(f"  ✓ Exported {len(rows)} rows to bigquery/seeds/{t_name}.json")

    # 2. Export ANSI SQL INSERT Script
    sql_file_path = os.path.join(SCRIPT_DIR, "seeds.sql")
    with open(sql_file_path, "w", encoding="utf-8") as f:
        f.write("-- ============================================================================\n")
        f.write("-- Punjab National Bank · Intelligent Lending Presales POC\n")
        f.write("-- Seed Data Inserts (Minimum Viable Dataset - 3 Curated Applicants)\n")
        f.write(f"-- Generated At: {datetime.now(timezone.utc).isoformat()}\n")
        f.write("-- ============================================================================\n\n")

        for t_name, rows in tables.items():
            if not rows:
                continue
            cols = list(rows[0].keys())
            cols_str = ", ".join(cols)
            f.write(f"-- ----------------------------------------------------------------------------\n")
            f.write(f"-- Table: pnb_intelligent_lending.{t_name}\n")
            f.write(f"-- ----------------------------------------------------------------------------\n")
            f.write(f"INSERT INTO `pnb_intelligent_lending.{t_name}` ({cols_str})\nVALUES\n")
            
            value_lines = []
            for r in rows:
                val_parts = []
                for c in cols:
                    v = r[c]
                    if v is None:
                        val_parts.append("NULL")
                    elif isinstance(v, bool):
                        val_parts.append("TRUE" if v else "FALSE")
                    elif isinstance(v, (int, float)):
                        val_parts.append(str(v))
                    elif isinstance(v, str):
                        escaped = v.replace("'", "\\'")
                        val_parts.append(f"'{escaped}'")
                    else:
                        escaped = json.dumps(v).replace("'", "\\'")
                        val_parts.append(f"'{escaped}'")
                value_lines.append(f"  ({', '.join(val_parts)})")
            
            f.write(",\n".join(value_lines) + ";\n\n")

    print(f"  ✓ Exported ANSI SQL seed script to bigquery/seeds.sql")

# ============================================================================
# MAIN EXECUTION ENTRYPOINT
# ============================================================================

def main():
    print("=" * 80)
    print("PNB Intelligent Lending · BigQuery Seed Data Generator & Integrity Validator")
    print("=" * 80)

    print("\n[Step 1] Normalizing 3 Curated Synthetic Applicants into Relational Model...")
    tables = build_normalized_tables()
    for t_name, rows in tables.items():
        print(f"  • {t_name.ljust(30)}: {len(rows)} records prepared")

    print("\n[Step 2] Executing Validation Checks...")
    validation = run_validations(tables)

    print(f"\n  Passed Checks ({len(validation.passed_checks)}):")
    for check_name in validation.passed_checks:
        print(f"    ✓ {check_name}")

    if validation.failed_checks:
        print(f"\n  FAILED Checks ({len(validation.failed_checks)}):")
        for check_name, err in validation.failed_checks:
            print(f"    ✗ {check_name}: {err}")
        print("\nERROR: Relational or mathematical validations failed. Aborting export.")
        sys.exit(1)

    print("\n[Step 3] Exporting BigQuery Seed Files...")
    export_seeds(tables)

    print("\n[Step 4] Reported Source Data Inconsistencies:")
    for comp, desc in validation.reported_inconsistencies:
        print(f"\n  [!] {comp}")
        print(f"      {desc}")

    print("\n" + "=" * 80)
    print("SUCCESS: Phase 1 BigQuery DDL and Seed Data Generation Complete.")
    print("=" * 80)

if __name__ == "__main__":
    main()
