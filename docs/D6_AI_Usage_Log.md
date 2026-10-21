# Deliverable D6: AI Usage Log
**Role & Context:** Business Analyst – Data & AI Presales  
**Project:** PNB Intelligent Lending (Agentic AI Loan Approval POV Demo)  
**Tools Employed:** Google Antigravity Agent (Gemini 3.8 Flash High) / Claude AI Assistance  
**Date:** October 2026  

---

## 1. Summary of AI Tools & Collaboration Model

Throughout this assignment, AI was utilized as an **interactive pair-programming assistant, domain structuring copilot, and technical solution architect**. The collaboration followed an iterative, step-by-step workflow: reviewing assignment deliverables, validating banking domain logic, generating synthetic datasets, implementing React components, and executing static build validations.

---

## 2. Tasks Performed with AI Assistance

| Phase / Task | AI Contribution | Human / User Direction & Governance |
| :--- | :--- | :--- |
| **1. Domain Scoping & Design** | Synthesized assignment brief, decomposed deliverables D1–D6, mapped Page 6 reference architecture. | Constrained product to **Salaried Personal Loan**; mandated 3 distinct test personas (straightforward, review, knockout). |
| **2. Synthetic Data & Math Engine** | Drafted TypeScript interfaces and implemented standard Reducing-Balance EMI & FOIR formulas. | **Explicit Correction:** Banned arbitrary percentage confidence scores (e.g. 96%); mandated transparent, deterministic rule checklists. |
| **3. Workflow Execution (D1)** | Built 7-stage interactive pipeline (Intake to Sanction) with evidence tokens and audit trail logging. | Mandated that human underwriter approval is strictly required; locked simulated disbursement gateway until sign-off. |
| **4. Story & Architecture (D2, D3)** | Generated executive two-act narrative (Lakehouse & Agentic AI) and 7-layer technical diagram mapping GCP services. | Required explicit separation between the target BigQuery architecture and the local prototype simulation. Banned exaggerated TAT claims. |
| **5. Supporting Pages (D4)** | Built About page, interactive FAQ (9 domain questions with search/filter), and Presales Contact form with validation. | Directed UI corrections: excised the technical limitations banner from About and removed assignment tags (`D1`, `D2`, etc.) from navigation. |

---

## 3. Representative Prompts (Verbatim from Project History)

1. **Domain & Task 1 Scoping:**  
   > *"Approved, with the following corrections before starting Task 1: 1. Proceed with a Salaried Personal Loan and three synthetic applicants. 2. Clearly label all credit thresholds and policy rules as illustrative... 3. Do not use arbitrary AI confidence percentages such as 96% or 72%... 4. Calculate EMI and FOIR using explicit formulas and recalculate them when terms change..."*
2. **7-Stage Workflow (Deliverable D1):**  
   > *"Task 1 is running successfully in my browser. Now implement Task 2: the interactive Loan Approval Workflow (Deliverable D1)... Add a seven-stage workflow: Application intake, Document verification, Structured banking data, Mock bureau checks, Policy eligibility, Credit risk assessment, Human credit officer review... Prevent simulated sanction from bypassing human approval..."*
3. **Approach & Architecture Pages (D2 & D3):**  
   > *"D1 has been implemented. Now build Deliverables D2 and D3 as two separate, polished pages... Act 1: The Lakehouse... Act 2: Agentic AI... D3: Solution Architecture with 7 layers... Distinguish intended BigQuery architecture from current local simulation..."*
4. **Supporting Pages (Deliverable D4):**  
   > *"Implement Deliverable D4: Supporting Pages... 1. About the Solution... 2. FAQ (9 specific questions)... 3. Contact Us with validation and clear success state... Ensure navigation works across D1, D2, D3 and D4..."*

---

## 4. Errors Identified, Corrections & Validations

* **Elimination of "Hallucinated" Confidence Scores:** Initial drafts proposed using heuristic AI confidence percentages (e.g., 96%). The user explicitly corrected this, replacing black-box metrics with verifiable, rule-by-rule status checks (Passed / Review Required / Knockout).
* **TypeScript Compiler (`tsc`) Fixes:** Static checks surfaced `verbatimModuleSyntax` errors. Resolved by updating to `import type { ... }` in `lending.ts` and `loanCalculations.ts`.
* **Dead Import Cleanup:** Strict compiler settings (`noUnusedLocals: true`) flagged unused Lucide icons in generated pages. Removed unused tokens to ensure clean compilation.
* **JSX Syntax Correction:** When excising the technical limitations banner in `AboutSolutionPage.tsx`, an enclosing `</section>` tag was inadvertently removed; flagged during build check and promptly corrected.
* **Continuous Build Verification:** Ran `npm run build` after every milestone. All bundles compiled with exit code 0 in under 250 milliseconds.

---

## 5. Transparent Time-Savings Estimation

| Activity | Estimated Traditional Manual Effort | AI-Assisted Effort | Net Time Saved |
| :--- | :--- | :--- | :--- |
| **Banking research, KYC & digital lending analysis** | 4.0 – 5.0 hours | 0.5 hours | ~4.0 hours |
| **Synthetic banking dataset & formula modeling** | 3.0 – 4.0 hours | 0.5 hours | ~3.0 hours |
| **Full-stack React, TypeScript & Tailwind UI development** | 12.0 – 14.0 hours | 2.0 hours | ~11.0 hours |
| **Technical architecture & executive storytelling diagrams** | 3.5 – 4.5 hours | 0.5 hours | ~3.5 hours |
| **Total Estimated Time** | **22.5 – 27.5 hours** | **3.5 hours** | **~21.5 hours (~85% acceleration)** |

*Basis of estimation: Time for a solo Business Analyst / Developer to manually code multi-page React components, research RBI digital lending circulars, format responsive Tailwind CSS layouts, and debug TypeScript definitions from scratch.*

---

## 6. Items Requiring Personal Candidate Confirmation

> **[To be confirmed by candidate before submission]:**
> 1. Exact candidate name, contact email, and application ID for submission cover.
> 2. Personal confirmation of any informal practitioner discussions with banking colleagues (e.g., branch managers or retail credit underwriters) to credit in D5.
> 3. Final verification of screen recording (5 minutes or less) demonstrating the live D1–D4 web application.
