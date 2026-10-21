import React from 'react';
import { 
  Printer, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';

interface ResearchNotePageProps {
  onSwitchToAILog?: () => void;
}

export const ResearchNotePage: React.FC<ResearchNotePageProps> = ({ onSwitchToAILog }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    // Generate a downloadable Blob from the markdown file content
    const markdownContent = `# Deliverable D5: Banking Research Note
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

[1. Application Intake] ──> [2. KYC & Document Ingestion] ──> [3. Banking & Cashflow Analysis]
                                                                        │
[6. Sanction & KFS Issuance] <── [5. Credit Underwriting] <── [4. Bureau Check & Dedupe]
          │
          └──> [7. Disbursement & Loan Booking]

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
  * **Credit Score:** Prime (>= 720), Near-Prime / Review (675 - 719), Subprime (< 675).
  * **Delinquency Track (DPD):** Days Past Due across trade lines in the preceding 24–36 months. Any 30+, 60+, or 90+ DPD write-off, settlement, or "Suit Filed" record serves as a knockout trigger.
  * **Enquiry Velocity:** Number of credit searches in the last 30–60 days; multiple recent inquiries signal "credit hunger."

### Stage 5: Credit Underwriting & Policy Eligibility
* **Debt Service Ratio (FOIR):** The underwriter calculates the Fixed Obligation to Income Ratio (FOIR) or Debt-to-Burden Ratio (DBR):
  FOIR (%) = ((Total Existing Monthly EMIs + Proposed New Loan EMI) / Net Monthly Income) * 100
  Indian commercial banks typically enforce an illustrative FOIR ceiling between 40% and 55% for salaried personal loans, ensuring the applicant retains adequate disposable income for basic living expenses.
* **Equated Monthly Installment (EMI):** Computed using the standard reducing-balance formula:
  EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
* **Exception Handling & Loan Restructuring:** If an applicant's FOIR exceeds policy limits (e.g., our test persona Rajesh Kumar at 73.1%), underwriters may propose restructuring the loan by reducing the sanctioned principal or extending tenure to bring FOIR within permissible limits.

### Stage 6: Sanction & Key Fact Statement (KFS) Issuance
* **Sanction Letter:** Formally issued upon underwriter sign-off, detailing sanctioned amount, approved interest rate, tenure, and applicable processing charges.
* **Regulatory Compliance:** As per RBI Digital Lending Guidelines, the bank must provide a standardized Key Fact Statement (KFS) before contract execution, disclosing the Annual Percentage Rate (APR), recovery mechanisms, and grievance redressal officers.

### Stage 7: Disbursement & Core Booking
* **Execution:** Once the digital loan agreement is signed via Aadhaar e-Sign (NeSL / CDSL) and e-NACH repayment mandate is registered, funds are disbursed directly into the borrower's verified bank account via NEFT/RTGS.

---

## 3. Operational Roles & Governance Controls (Maker-Checker)

Indian banks enforce strict organizational segregation of duties to prevent internal fraud and bias:

- Sourcing Officer / Maker (Level 1): Initiates application intake, uploads documents, triggers initial bureau and KYC pulls.
- Credit Underwriter / Checker (Level 2): Reviews aggregated file, verifies OCR extractions, inspects policy exceptions, evaluates FOIR, and records official sanction decision. Mandatory requirement to input written underwriting rationale.
- Operations / Disbursement Gateway (Level 3): Validates signed agreements, confirms e-NACH mandate registration, releases funds. Disbursement gateway is software-locked until Maker-Checker approvals are registered in the audit trail.

---

## 4. Turnaround Times (TAT) & Operational Bottlenecks

### Typical Industry Turnaround Times
* Pre-approved Existing-to-Bank (ETB) Customers: Instant to 4 hours (fully automated STP).
* Open-Market / New-to-Bank (NTB) Salaried Applications: Typically 24 to 72 hours (1 to 3 business days) across private and public sector commercial banks.

### Key Operational Bottlenecks (Supported by Industry Observations)
1. Manual Pay Slip & Statement Reconciliation: Discrepancies between declared employer name, bank credit narrations, and salary slip deductions require manual back-and-forth between branch officers and credit teams.
2. Inquiry Spikes & Unrecorded Debt: When an applicant recently availed Buy-Now-Pay-Later (BNPL) or fintech loans that have not yet updated in the monthly bureau batch, underwriters must manually call for updated bank statements.
3. Multi-System Latency: Underwriters manually logging in and out of 3–4 disconnected software systems (CBS, credit bureau web portals, document vaults, and compliance exception trackers).

---

## 5. Regulatory & Compliance Framework

The solution architecture directly reflects key RBI regulations:
1. RBI Master Direction – Know Your Customer (KYC) Direction, 2016 (Updated 2023)
2. RBI Guidelines on Digital Lending (September 2022 / August 2023)
3. Credit Information Companies (Regulation) Act, 2005 (CICRA)
4. Fair Practices Code for Lenders (RBI)

---

## 6. Sources & References

1. Reserve Bank of India (RBI): Master Direction – Know Your Customer (KYC) Direction, 2016. https://www.rbi.org.in
2. Reserve Bank of India (RBI): Guidelines on Digital Lending, Circular RBI/2022-23/111 (September 2022).
3. Reserve Bank of India (RBI): Master Direction – Fair Practices Code for Lenders.
4. Credit Information Companies (Regulation) Act, 2005 (CICRA): Ministry of Law and Justice.
5. Indian Banks' Association (IBA) & Boston Consulting Group (BCG): Digital Lending Transformation in Indian Retail Banking.
6. National Payments Corporation of India (NPCI): e-NACH and DigiLocker API Specifications.
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'D5_Banking_Research_Note.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto font-sans">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#7B1113] via-[#8c1619] to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-md border-b-4 border-amber-500 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deliverable D5 · Banking Domain Research</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              Banking Research Note
            </h1>
            <p className="text-xs md:text-sm text-amber-100/90 leading-relaxed max-w-2xl">
              End-to-End Salaried Personal Loan Approval Process in Indian Commercial Banks. Grounded in RBI circulars, Maker-Checker credit governance, and verifiable turnaround time benchmarks.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              title="Prints or exports document to PDF using browser print dialog"
              className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-98"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              title="Download original Markdown source file"
              className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download (.md)</span>
            </button>
          </div>
        </div>
      </section>

      {/* PDF Export Guidance Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-xs text-blue-900 no-print">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <strong>PDF Export Guide:</strong> Clicking <strong>&quot;Print / Save as PDF&quot;</strong> triggers your browser&apos;s native print dialog. In the destination dropdown, select <strong>&quot;Save as PDF&quot;</strong> for a clean document.
          </span>
        </div>
        {onSwitchToAILog && (
          <button
            onClick={onSwitchToAILog}
            className="text-blue-800 hover:text-blue-950 font-bold underline text-[11px] shrink-0 ml-2"
          >
            View AI Usage Log (D6) &rarr;
          </button>
        )}
      </div>

      {/* Printable Research Document Card */}
      <article className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-10 text-slate-800 space-y-8 print-page">
        {/* Document Header Metadata */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-2">
            <span className="font-mono font-bold text-[#7B1113]">DOCUMENT REF: DOCS-D5-2026</span>
            <span>Date: October 2026</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-950 mb-2">
            End-to-End Salaried Personal Loan Approval Process in Indian Commercial Banks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div><strong>Role & Context:</strong> Business Analyst – Data & AI Presales</div>
            <div><strong>Target Audience:</strong> Retail Lending Head / Banking Leadership</div>
            <div><strong>Product Focus:</strong> Retail Salaried Personal Loan (Unsecured)</div>
            <div><strong>Regulatory Scope:</strong> Reserve Bank of India (RBI) & CICRA Framework</div>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#7B1113]"></span>
            1. Executive Summary & Lending Domain Context
          </h3>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            In the Indian retail credit ecosystem, an unsecured <strong>Salaried Personal Loan</strong> is a high-velocity, document-intensive credit product extended to salaried individuals based on disposable income, employer reputation, and credit bureau track record. Unlike secured lending (e.g., mortgages or auto loans), personal loans carry no underlying physical collateral, making underwriting rigor, cashflow verification, and fraud detection paramount.
          </p>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            While top-tier banks have achieved instant or near-instant Straight-Through Processing (STP) for &quot;pre-approved&quot; internal salary account holders, the <strong>open-market / non-STP salaried segment</strong> remains operationally complex. Underwriters must synthesize disparate data types—unstructured PDF pay slips, Core Banking relationship histories, and real-time Credit Information Company (CIC) bureau reports—while maintaining compliance with the Reserve Bank of India (RBI) regulatory framework.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#7B1113]"></span>
            2. End-to-End Retail Loan Approval Lifecycle
          </h3>
          <p className="text-xs md:text-sm text-slate-700">
            A standard personal loan application in an Indian commercial bank traverses seven distinct operational stages:
          </p>

          {/* Lifecycle Flow Diagram */}
          <div className="bg-slate-900 text-amber-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto">
            <pre className="whitespace-pre">
{`[1. Application Intake] ──> [2. KYC & Document Ingestion] ──> [3. Banking & Cashflow Analysis]
                                                                        │
[6. Sanction & KFS Issuance] <── [5. Credit Underwriting] <── [4. Bureau Check & Dedupe]
          │
          └──> [7. Disbursement & Loan Booking]`}
            </pre>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-slate-700">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block text-xs font-bold mb-1">Stage 1: Application Intake & Sourcing</strong>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                <li><strong>Mechanisms:</strong> Omnichannel intake via bank branches, internet banking portals, or Direct Selling Agents (DSAs).</li>
                <li><strong>Information Captured:</strong> Demographics, requested principal, proposed tenure (typically 12–60 months), employer name/category, and declared existing monthly obligations.</li>
                <li><strong>Initial Deduplication:</strong> Cross-checked against the bank&apos;s internal dedupe database to detect duplicate active applications.</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block text-xs font-bold mb-1">Stage 2: KYC & Document Verification (Customer Due Diligence)</strong>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                <li><strong>Identity & Address:</strong> Verified using Officially Valid Documents (OVDs) via <strong>DigiLocker</strong>, <strong>Aadhaar Offline XML / e-KYC</strong>, or <strong>Video-based Customer Identification Process (V-CIP)</strong> under the RBI KYC Master Direction.</li>
                <li><strong>PAN Verification:</strong> Verified directly against the Income Tax Department database through the NSDL / Protean API to ensure name matching and active status.</li>
                <li><strong>Income Documentation:</strong> Collection of 3 consecutive months of salary pay slips and Form 16 / Income Tax Returns (ITR). Optical Character Recognition (OCR) parsers extract gross earnings, statutory deductions (Provident Fund, Professional Tax, TDS), and net credit pay.</li>
                <li><strong>Salary Variance Check:</strong> Pay slips are inspected for unexpected fluctuations between basic salary and variable components (bonuses, overtime, arrears).</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block text-xs font-bold mb-1">Stage 3: Structured Banking Data & Cashflow Analysis</strong>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                <li><strong>Core Banking System (CBS) Lookup:</strong> For existing customers, internal account vintage, average quarterly balance (AQB), and past internal repayment track records are extracted from systems such as Finacle or BaNCS.</li>
                <li><strong>Account Aggregator (AA) / Bank Statement Parsing:</strong> Under the RBI-regulated Account Aggregator framework (or through digitized PDF bank statement parsing), 6 months of primary salary account statements are inspected for regular salary credits, inward cheque returns, and liquidity buffers.</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block text-xs font-bold mb-1">Stage 4: Credit Bureau Ingestion & Dedupe</strong>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                <li><strong>Bureau Pull:</strong> Mandatory automated retrieval of the Comprehensive Credit Information Report (CIR) from authorized Credit Information Companies (TransUnion CIBIL, Equifax, Experian, or CRIF High Mark) pursuant to CICRA 2005.</li>
                <li><strong>Metrics Inspected:</strong> Credit Score (Prime &ge; 720; Review 675–719; Subprime &lt; 675), 24-month delinquency history (DPD), and recent inquiry velocity to prevent credit hunger.</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block text-xs font-bold mb-1">Stage 5: Credit Underwriting & Policy Eligibility</strong>
              <p className="text-xs text-slate-600 mb-2">
                The underwriter calculates the <strong>Fixed Obligation to Income Ratio (FOIR)</strong> or Debt-to-Burden Ratio (DBR):
              </p>
              <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-xs text-slate-800 mb-2">
                FOIR (%) = ((Total Existing Monthly EMIs + Proposed New Loan EMI) / Net Monthly Income) &times; 100
              </div>
              <p className="text-xs text-slate-600 mb-2">
                Indian commercial banks typically enforce an illustrative FOIR ceiling between <strong>40% and 55%</strong> for salaried personal loans, ensuring the applicant retains adequate disposable income for basic living expenses.
              </p>
              <p className="text-xs text-slate-600">
                Monthly EMI is computed using the standard reducing-balance formula:
                <code className="block bg-white p-2 rounded border border-slate-200 mt-1 font-mono text-xs">
                  EMI = P &times; r &times; (1 + r)^n / ((1 + r)^n - 1)
                </code>
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block text-xs font-bold mb-1">Stage 6: Sanction & Key Fact Statement (KFS) Issuance</strong>
              <p className="text-xs text-slate-600">
                Upon underwriter sign-off, a formal sanction letter and standardized <strong>Key Fact Statement (KFS)</strong> are generated in compliance with RBI Digital Lending Guidelines, disclosing the Annual Percentage Rate (APR), recovery mechanisms, and grievance redressal officer details.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block text-xs font-bold mb-1">Stage 7: Disbursement & Core Booking</strong>
              <p className="text-xs text-slate-600">
                Following execution of the digital loan agreement via Aadhaar e-Sign (NeSL) and e-NACH mandate registration, funds are disbursed directly into the borrower&apos;s verified bank account via NEFT/RTGS.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#7B1113]"></span>
            3. Operational Roles & Governance Controls (Maker-Checker)
          </h3>
          <p className="text-xs md:text-sm text-slate-700">
            Indian banks enforce strict organizational segregation of duties to prevent internal fraud and bias:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Role / Level</th>
                  <th className="p-2.5">Operational Responsibility</th>
                  <th className="p-2.5">Governance Guardrail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 text-[11px]">
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Sourcing Officer / Maker (Level 1)</td>
                  <td className="p-2.5">Initiates application intake, uploads documents, triggers initial bureau and KYC pulls.</td>
                  <td className="p-2.5">Cannot approve loans, modify risk thresholds, or authorize disbursement.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Credit Underwriter / Checker (Level 2)</td>
                  <td className="p-2.5">Reviews aggregated file, verifies OCR extractions, inspects policy exceptions, evaluates FOIR, and records official sanction decision.</td>
                  <td className="p-2.5">Mandatory requirement to input written underwriting rationale; bound by delegation of financial powers.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Operations / Disbursement Gateway (Level 3)</td>
                  <td className="p-2.5">Validates signed agreements, confirms e-NACH mandate registration, releases funds.</td>
                  <td className="p-2.5">Disbursement gateway is software-locked until Maker-Checker approvals are registered in the audit trail.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#7B1113]"></span>
            4. Turnaround Times (TAT) & Operational Bottlenecks
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block mb-1">Typical Industry Turnaround Times</strong>
              <ul className="space-y-1.5 text-slate-600">
                <li>• <strong>Pre-approved Existing-to-Bank (ETB):</strong> Instant to 4 hours (fully automated STP).</li>
                <li>• <strong>Open-Market / New-to-Bank (NTB) Salaried:</strong> Typically <strong>24 to 72 hours</strong> (1 to 3 business days) across private and public sector commercial banks.</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block mb-1">Key Operational Bottlenecks</strong>
              <ul className="space-y-1.5 text-slate-600">
                <li>1. <strong>Manual Pay Slip Reconciliation:</strong> Discrepancies between employer names, bank narration, and pay slip deductions.</li>
                <li>2. <strong>Inquiry Spikes & Unrecorded Debt:</strong> Latency in monthly bureau batches for recent fintech/BNPL lines.</li>
                <li>3. <strong>Multi-System Latency:</strong> Officers logging in/out of disconnected CBS, bureau portals, and policy drives.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#7B1113]"></span>
            5. Regulatory & Compliance Framework
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>RBI Master Direction – KYC Direction, 2016 (Updated 2023):</strong> Mandates Customer Due Diligence (CDD) using verified identity mechanisms (DigiLocker, e-KYC, PAN validation).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>RBI Guidelines on Digital Lending (September 2022 / August 2023):</strong> Mandates direct bank-to-borrower disbursements without pass-through accounts, algorithmic explainability, and standardized Key Fact Statement (KFS) disclosures.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Credit Information Companies (Regulation) Act, 2005 (CICRA):</strong> Requires consent-driven access to bureau data and timely submission of credit accounts.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Fair Practices Code for Lenders (RBI):</strong> Requires clear written communication of reasons whenever an application is declined or restructured.</span>
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#7B1113]"></span>
            6. Sources & References
          </h3>
          <ol className="space-y-2 text-xs text-slate-600 list-decimal list-inside">
            <li>
              <strong>Reserve Bank of India (RBI):</strong> <em>Master Direction – Know Your Customer (KYC) Direction, 2016</em> (Updated periodically).{' '}
              <a href="https://www.rbi.org.in" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline inline-flex items-center gap-1">
                rbi.org.in <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <strong>Reserve Bank of India (RBI):</strong> <em>Guidelines on Digital Lending</em>, Circular RBI/2022-23/111, DOR.CRE.REC.66/21.07.001/2022-23 (September 2, 2022).
            </li>
            <li>
              <strong>Reserve Bank of India (RBI):</strong> <em>Master Direction – Fair Practices Code for Lenders</em>.
            </li>
            <li>
              <strong>Credit Information Companies (Regulation) Act, 2005 (CICRA):</strong> Ministry of Law and Justice, Government of India.
            </li>
            <li>
              <strong>Indian Banks&apos; Association (IBA) & Boston Consulting Group (BCG):</strong> <em>Digital Lending Transformation in Indian Retail Banking</em> (Reports on credit appraisal TAT and Account Aggregator adoption).
            </li>
            <li>
              <strong>National Payments Corporation of India (NPCI):</strong> <em>e-NACH and DigiLocker API Integration Specifications for Digital Onboarding</em>.
            </li>
          </ol>
        </section>

        {/* Prototype Alignment Disclaimer */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 italic">
          <strong>Note on Prototype Alignment:</strong> In this demonstration, Punjab National Bank (PNB) is used as an illustrative public-sector banking context. The credit thresholds (&ge; ₹25,000 net income, &le; 50.0% FOIR, &ge; 720 CIBIL) represent industry benchmarks and not official proprietary PNB circulars.
        </div>
      </article>
    </div>
  );
};
