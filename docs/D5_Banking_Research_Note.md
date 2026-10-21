# Deliverable D5: Banking Research Note
**Role & Context:** Business Analyst – Data & AI Presales  
**Topic:** End-to-End Salaried Personal Loan Approval Process in Indian Commercial Banks  
**Target Audience:** Banking Leadership / Retail Lending Head (Presales Point of View)  
**Date:** October 2026  

---

## 1. Executive Summary & Lending Domain Context

In the Indian retail credit ecosystem, an unsecured **Salaried Personal Loan** is a high-velocity, document-intensive credit product extended to salaried individuals based on disposable income, employer reputation, and credit bureau track record. Unlike secured lending (e.g., mortgages or auto loans), personal loans carry no underlying physical collateral, making underwriting rigor, cashflow verification, and fraud detection paramount.

While top-tier banks have achieved instant or near-instant Straight-Through Processing (STP) for "pre-approved" internal salary account holders, the **open-market / non-STP salaried segment** remains operationally complex. Underwriters must synthesize disparate data types—unstructured PDF pay slips, Core Banking relationship histories, and real-time Credit Information Company (CIC) bureau reports—while maintaining compliance with the Reserve Bank of India (RBI) regulatory framework.

---

## 2. End-to-End Retail Loan Approval Lifecycle

A standard personal loan application in an Indian commercial bank traverses seven distinct operational stages:

```
[1. Application Intake] ──> [2. KYC & Document Ingestion] ──> [3. Banking & Cashflow Analysis]
                                                                        │
[6. Sanction & KFS Issuance] <── [5. Credit Underwriting] <── [4. Bureau Check & Dedupe]
          │
          └──> [7. Disbursement & Loan Booking]
```

### Stage 1: Application Intake & Sourcing
* **Mechanisms:** Omnichannel intake via bank branches, internet banking portals, or Direct Selling Agents (DSAs).
* **Information Captured:** Demographics, requested principal, proposed tenure (typically 12–60 months), employer name/category, and declared existing monthly obligations.
* **Initial Deduplication:** Cross-checked against the bank's internal dedupe database to detect duplicate active applications.

### Stage 2: KYC & Document Verification (Customer Due Diligence)
* **Identity & Address:** Verified using Officially Valid Documents (OVDs) via **DigiLocker**, **Aadhaar Offline XML / e-KYC**, or **Video-based Customer Identification Process (V-CIP)** under the RBI KYC Master Direction.
* **PAN Verification:** Verified directly against the Income Tax Department database through the NSDL / Protean API to ensure name matching and active status.
* **Income Documentation:** Collection of 3 consecutive months of salary pay slips and Form 16 / Income Tax Returns (ITR). Optical Character Recognition (OCR) parsers extract gross earnings, statutory deductions (Provident Fund, Professional Tax, TDS), and net credit pay.
* **Salary Variance Check:** Pay slips are inspected for unexpected fluctuations between basic salary and variable components (bonuses, overtime, arrears).

### Stage 3: Structured Banking Data & Cashflow Analysis
* **Core Banking System (CBS) Lookup:** For existing customers, internal account vintage, average quarterly balance (AQB), and past internal repayment track records are extracted from systems such as Finacle or BaNCS.
* **Account Aggregator (AA) / Bank Statement Parsing:** Under the RBI-regulated Account Aggregator framework (or through digitized PDF bank statement parsing), 6 months of primary salary account statements are inspected:
  * **Salary Credit Validation:** Confirming regular electronic salary credits (via NEFT/RTGS/ACH) matching pay slips.
  * **Cheque / Mandate Returns:** Evaluating inward cheque bounces or NACH mandate rejections for insufficient funds (a critical indicator of cashflow distress).
  * **Average Monthly Balance (AMB):** Checking liquidity buffers after existing loan debits.

### Stage 4: Credit Bureau Ingestion & Dedupe
* **Bureau Pull:** Mandatory automated retrieval of the Comprehensive Credit Information Report (CIR) from at least one authorized Credit Information Company (TransUnion CIBIL, Equifax, Experian, or CRIF High Mark) pursuant to CICRA 2005.
* **Key Bureau Metrics Inspected:**
  * **Credit Score:** Prime ($\ge 720$), Near-Prime / Review ($675 - 719$), Subprime ($< 675$).
  * **Delinquency Track (DPD):** Days Past Due across trade lines in the preceding 24–36 months. Any 30+, 60+, or 90+ DPD write-off, settlement, or "Suit Filed" record serves as a knockout trigger.
  * **Enquiry Velocity:** Number of credit searches in the last 30–60 days; multiple recent inquiries signal "credit hunger."

### Stage 5: Credit Underwriting & Policy Eligibility
* **Debt Service Ratio (FOIR):** The underwriter calculates the **Fixed Obligation to Income Ratio (FOIR)** or Debt-to-Burden Ratio (DBR):
  $$\text{FOIR (\%)} = \frac{\text{Total Existing Monthly EMIs} + \text{Proposed New Loan EMI}}{\text{Net Monthly Income}} \times 100$$
  Indian commercial banks typically enforce an illustrative FOIR ceiling between **40% and 55%** for salaried personal loans, ensuring the applicant retains adequate disposable income for basic living expenses.
* **Equated Monthly Installment (EMI):** Computed using the standard reducing-balance formula:
  $$\text{EMI} = P \times r \times \frac{(1+r)^n}{(1+r)^n - 1}$$
* **Exception Handling & Loan Restructuring:** If an applicant's FOIR exceeds policy limits (e.g., our test persona Rajesh Kumar at 73.1%), underwriters may propose restructuring the loan by reducing the sanctioned principal or extending tenure to bring FOIR within permissible limits.

### Stage 6: Sanction & Key Fact Statement (KFS) Issuance
* **Sanction Letter:** Formally issued upon underwriter sign-off, detailing sanctioned amount, approved interest rate, tenure, and applicable processing charges.
* **Regulatory Compliance:** As per RBI Digital Lending Guidelines, the bank must provide a standardized **Key Fact Statement (KFS)** before contract execution, disclosing the Annual Percentage Rate (APR), recovery mechanisms, and grievance redressal officers.

### Stage 7: Disbursement & Core Booking
* **Execution:** Once the digital loan agreement is signed via Aadhaar e-Sign (NeSL / CDSL) and e-NACH repayment mandate is registered, funds are disbursed directly into the borrower's verified bank account via NEFT/RTGS.

---

## 3. Operational Roles & Governance Controls (Maker-Checker)

Indian banks enforce strict organizational segregation of duties to prevent internal fraud and bias:

| Role / Level | Operational Responsibility | Governance Guardrail |
| :--- | :--- | :--- |
| **Sourcing Officer / Maker (Level 1)** | Initiates application intake, uploads documents, triggers initial bureau and KYC pulls. | Cannot approve loans, modify risk thresholds, or authorize disbursement. |
| **Credit Underwriter / Checker (Level 2)** | Reviews aggregated file, verifies OCR extractions, inspects policy exceptions, evaluates FOIR, and records official sanction decision. | Mandatory requirement to input written underwriting rationale; bound by delegation of financial powers (e.g., Branch Credit Manager up to ₹10 Lakhs; Regional Committee beyond). |
| **Operations / Disbursement Gateway (Level 3)** | Validates signed agreements, confirms e-NACH mandate registration, releases funds. | Disbursement gateway is software-locked until Maker-Checker approvals are registered in the audit trail. |

---

## 4. Turnaround Times (TAT) & Operational Bottlenecks

### Typical Industry Turnaround Times
* **Pre-approved Existing-to-Bank (ETB) Customers:** Instant to 4 hours (fully automated STP).
* **Open-Market / New-to-Bank (NTB) Salaried Applications:** Typically **24 to 72 hours** (1 to 3 business days) across private and public sector commercial banks.

### Key Operational Bottlenecks (Supported by Industry Observations)
1. **Manual Pay Slip & Statement Reconciliation:** Discrepancies between declared employer name, bank credit narrations, and salary slip deductions require manual back-and-forth between branch officers and credit teams.
2. **Inquiry Spikes & Unrecorded Debt:** When an applicant recently availed Buy-Now-Pay-Later (BNPL) or fintech loans that have not yet updated in the monthly bureau batch, underwriters must manually call for updated bank statements.
3. **Multi-System Latency:** Underwriters manually logging in and out of 3–4 disconnected software systems (CBS, credit bureau web portals, document vaults, and compliance exception trackers).

---

## 5. Regulatory & Compliance Framework

The solution architecture directly reflects key RBI regulations:

1. **RBI Master Direction – Know Your Customer (KYC) Direction, 2016 (Updated 2023):** Mandates Customer Due Diligence (CDD) using verified identity mechanisms (DigiLocker, e-KYC, PAN validation).
2. **RBI Guidelines on Digital Lending (September 2022 / August 2023):**
   * Loans must be disbursed directly into bank accounts without third-party pass-through.
   * Automated algorithmic lending must retain explainability, with clear credit policies approved by the bank's Board.
   * Requirement for mandatory Key Fact Statement (KFS) disclosure.
3. **Credit Information Companies (Regulation) Act, 2005 (CICRA):** Requires consent-driven access to bureau data and timely submission of credit accounts.
4. **Fair Practices Code for Lenders (RBI):** Requires clear written communication of reasons whenever an application is declined or restructured.

---

## 6. Sources & References

1. **Reserve Bank of India (RBI):** *Master Direction – Know Your Customer (KYC) Direction, 2016* (Updated periodically). [rbi.org.in](https://www.rbi.org.in)
2. **Reserve Bank of India (RBI):** *Guidelines on Digital Lending*, Circular RBI/2022-23/111, DOR.CRE.REC.66/21.07.001/2022-23 (September 2, 2022).
3. **Reserve Bank of India (RBI):** *Master Direction – Reserve Bank of India (Internal Grievance Redressal / Fair Practices Code for Lenders)*.
4. **Credit Information Companies (Regulation) Act, 2005 (CICRA):** Ministry of Law and Justice, Government of India.
5. **Indian Banks' Association (IBA) & Boston Consulting Group (BCG):** *Digital Lending Transformation in Indian Retail Banking* (Reports on credit appraisal TAT and Account Aggregator adoption).
6. **National Payments Corporation of India (NPCI):** *e-NACH and DigiLocker API Integration Specifications for Digital Onboarding*.

---
*Note on Prototype Alignment: In this demonstration, Punjab National Bank (PNB) is used as an illustrative public-sector banking context. The credit thresholds (₹25k income, 50% FOIR, 720 CIBIL) represent industry benchmarks and not official proprietary PNB circulars. Practitioners or mentors consulted: [To be confirmed by candidate].*
