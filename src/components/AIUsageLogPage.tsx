import React from 'react';
import { 
  Printer, 
  Download, 
  CheckCircle2, 
  Cpu, 
  AlertCircle, 
  Info
} from 'lucide-react';

interface AIUsageLogPageProps {
  onSwitchToResearch?: () => void;
}

export const AIUsageLogPage: React.FC<AIUsageLogPageProps> = ({ onSwitchToResearch }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const markdownContent = `# Deliverable D6: AI Usage Log
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
| **5. Supporting Pages (D4)** | Built About page, interactive FAQ (9 domain questions with search/filter), and Presales Contact form with validation. | Directed UI corrections: excised the technical limitations banner from About and removed assignment tags (\`D1\`, \`D2\`, etc.) from navigation. |

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
* **TypeScript Compiler (\`tsc\`) Fixes:** Static checks surfaced \`verbatimModuleSyntax\` errors. Resolved by updating to \`import type { ... }\` in \`lending.ts\` and \`loanCalculations.ts\`.
* **Dead Import Cleanup:** Strict compiler settings (\`noUnusedLocals: true\`) flagged unused Lucide icons in generated pages. Removed unused tokens to ensure clean compilation.
* **JSX Syntax Correction:** When excising the technical limitations banner in \`AboutSolutionPage.tsx\`, an enclosing \`</section>\` tag was inadvertently removed; flagged during build check and promptly corrected.
* **Continuous Build Verification:** Ran \`npm run build\` after every milestone. All bundles compiled with exit code 0 in under 250 milliseconds.

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
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'D6_AI_Usage_Log.md';
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
              <Cpu className="w-3.5 h-3.5" />
              <span>Deliverable D6 · AI Collaboration Log</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              AI Usage Log
            </h1>
            <p className="text-xs md:text-sm text-amber-100/90 leading-relaxed max-w-2xl">
              Transparent, verifiable record of AI tools utilized, representative prompts, errors identified and resolved, and a grounded estimation of time saved.
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
        {onSwitchToResearch && (
          <button
            onClick={onSwitchToResearch}
            className="text-blue-800 hover:text-blue-950 font-bold underline text-[11px] shrink-0 ml-2"
          >
            &larr; View Research Note (D5)
          </button>
        )}
      </div>

      {/* Printable AI Log Document Card */}
      <article className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-10 text-slate-800 space-y-8 print-page">
        {/* Document Header Metadata */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-2">
            <span className="font-mono font-bold text-[#7B1113]">DOCUMENT REF: DOCS-D6-2026</span>
            <span>Date: October 2026</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-950 mb-2">
            AI Collaboration & Prompt Usage Record
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div><strong>Role & Context:</strong> Business Analyst – Data & AI Presales</div>
            <div><strong>Project:</strong> PNB Intelligent Lending POC</div>
            <div><strong>Primary AI Tool:</strong> Google Antigravity Agent (Gemini 3.8 Flash High) / Claude</div>
            <div><strong>Development Model:</strong> Human-in-the-Loop Pair Programming</div>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#7B1113]"></span>
            1. Summary of AI Tools & Collaboration Model
          </h3>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            Throughout this assignment, AI was utilized as an <strong>interactive pair-programming assistant, domain structuring copilot, and technical solution architect</strong>. The collaboration followed an iterative, step-by-step workflow: reviewing assignment deliverables, validating banking domain logic, generating synthetic datasets, implementing React components, and executing static build validations.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#7B1113]"></span>
            2. Tasks Performed with AI Assistance
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 w-1/4">Phase / Task</th>
                  <th className="p-2.5 w-5/12">AI Contribution</th>
                  <th className="p-2.5 w-1/3">Human / User Direction & Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 text-[11px]">
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">1. Domain Scoping & Design</td>
                  <td className="p-2.5">Synthesized assignment brief, decomposed deliverables D1–D6, mapped Page 6 reference architecture.</td>
                  <td className="p-2.5">Constrained product to <strong>Salaried Personal Loan</strong>; mandated 3 distinct test personas (straightforward, review, knockout).</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">2. Synthetic Data & Math Engine</td>
                  <td className="p-2.5">Drafted TypeScript interfaces and implemented standard Reducing-Balance EMI & FOIR formulas.</td>
                  <td className="p-2.5 font-medium text-rose-800"><strong>Explicit Correction:</strong> Banned arbitrary percentage confidence scores (e.g. 96%); mandated transparent, deterministic rule checklists.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">3. Workflow Execution (D1)</td>
                  <td className="p-2.5">Built 7-stage interactive pipeline (Intake to Sanction) with evidence tokens and audit trail logging.</td>
                  <td className="p-2.5">Mandated that human underwriter approval is strictly required; locked simulated disbursement gateway until sign-off.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">4. Story & Architecture (D2, D3)</td>
                  <td className="p-2.5">Generated executive two-act narrative (Lakehouse & Agentic AI) and 7-layer technical diagram mapping GCP services.</td>
                  <td className="p-2.5">Required explicit separation between the target BigQuery architecture and the local prototype simulation. Banned exaggerated TAT claims.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">5. Supporting Pages (D4)</td>
                  <td className="p-2.5">Built About page, interactive FAQ (9 domain questions with search/filter), and Presales Contact form with validation.</td>
                  <td className="p-2.5">Directed UI corrections: excised technical limitations banner from About and removed assignment tags (<code>D1</code>, <code>D2</code>, etc.) from navigation.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#7B1113]"></span>
            3. Representative Prompts (Verbatim from Project History)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Prompt 1 · Domain & Task 1 Scoping
              </span>
              <p className="text-slate-800 italic text-[11px] font-mono bg-white p-2 rounded border border-slate-200">
                &quot;Approved, with the following corrections before starting Task 1: 1. Proceed with a Salaried Personal Loan and three synthetic applicants. 2. Clearly label all credit thresholds and policy rules as illustrative... 3. Do not use arbitrary AI confidence percentages such as 96% or 72%... 4. Calculate EMI and FOIR using explicit formulas and recalculate them when terms change...&quot;
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Prompt 2 · Seven-Stage Workflow (Deliverable D1)
              </span>
              <p className="text-slate-800 italic text-[11px] font-mono bg-white p-2 rounded border border-slate-200">
                &quot;Task 1 is running successfully in my browser. Now implement Task 2: the interactive Loan Approval Workflow (Deliverable D1)... Add a seven-stage workflow: Application intake, Document verification, Structured banking data, Mock bureau checks, Policy eligibility, Credit risk assessment, Human credit officer review... Prevent simulated sanction from bypassing human approval...&quot;
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Prompt 3 · Approach & Architecture Pages (D2 & D3)
              </span>
              <p className="text-slate-800 italic text-[11px] font-mono bg-white p-2 rounded border border-slate-200">
                &quot;D1 has been implemented. Now build Deliverables D2 and D3 as two separate, polished pages... Act 1: The Lakehouse... Act 2: Agentic AI... D3: Solution Architecture with 7 layers... Distinguish intended BigQuery architecture from current local simulation...&quot;
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Prompt 4 · Supporting Pages (Deliverable D4)
              </span>
              <p className="text-slate-800 italic text-[11px] font-mono bg-white p-2 rounded border border-slate-200">
                &quot;Implement Deliverable D4: Supporting Pages... 1. About the Solution... 2. FAQ (9 specific questions)... 3. Contact Us with validation and clear success state... Ensure navigation works across D1, D2, D3 and D4...&quot;
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#7B1113]"></span>
            4. Errors Identified, Corrections & Validations
          </h3>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Elimination of &quot;Hallucinated&quot; Confidence Scores:</strong> Initial drafts proposed using heuristic AI confidence percentages (e.g., 96%). The user explicitly corrected this, replacing black-box metrics with verifiable, rule-by-rule status checks (Passed / Review Required / Knockout).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>TypeScript Compiler (<code>tsc</code>) Fixes:</strong> Static checks surfaced <code>verbatimModuleSyntax</code> errors. Resolved by updating to <code>import type &#123; ... &#125;</code> in <code>lending.ts</code> and <code>loanCalculations.ts</code>.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Dead Import Cleanup:</strong> Strict compiler settings (<code>noUnusedLocals: true</code>) flagged unused Lucide icons in generated pages. Removed unused tokens to ensure clean compilation.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>JSX Syntax Correction:</strong> When excising the technical limitations banner in <code>AboutSolutionPage.tsx</code>, an enclosing <code>&lt;/section&gt;</code> tag was inadvertently removed; flagged during build check and promptly corrected.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Continuous Build Verification:</strong> Ran <code>npm run build</code> after every milestone. All bundles compiled with exit code 0 in under 250 milliseconds.</span>
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#7B1113]"></span>
            5. Transparent Time-Savings Estimation
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Activity</th>
                  <th className="p-2.5">Estimated Traditional Manual Effort</th>
                  <th className="p-2.5">AI-Assisted Effort</th>
                  <th className="p-2.5">Net Time Saved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 text-[11px]">
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">Banking research, KYC & digital lending analysis</td>
                  <td className="p-2.5 font-mono">4.0 – 5.0 hours</td>
                  <td className="p-2.5 font-mono">0.5 hours</td>
                  <td className="p-2.5 font-bold text-emerald-700">~4.0 hours</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">Synthetic banking dataset & formula modeling</td>
                  <td className="p-2.5 font-mono">3.0 – 4.0 hours</td>
                  <td className="p-2.5 font-mono">0.5 hours</td>
                  <td className="p-2.5 font-bold text-emerald-700">~3.0 hours</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">Full-stack React, TypeScript & Tailwind UI development</td>
                  <td className="p-2.5 font-mono">12.0 – 14.0 hours</td>
                  <td className="p-2.5 font-mono">2.0 hours</td>
                  <td className="p-2.5 font-bold text-emerald-700">~11.0 hours</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">Technical architecture & executive storytelling diagrams</td>
                  <td className="p-2.5 font-mono">3.5 – 4.5 hours</td>
                  <td className="p-2.5 font-mono">0.5 hours</td>
                  <td className="p-2.5 font-bold text-emerald-700">~3.5 hours</td>
                </tr>
                <tr className="bg-slate-50 font-bold text-slate-900">
                  <td className="p-2.5">Total Estimated Time</td>
                  <td className="p-2.5 font-mono">22.5 – 27.5 hours</td>
                  <td className="p-2.5 font-mono">3.5 hours</td>
                  <td className="p-2.5 font-bold text-emerald-700 font-mono">~21.5 hours (~85% acceleration)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            *Basis of estimation: Time for a solo Business Analyst / Developer to manually code multi-page React components, research RBI digital lending circulars, format responsive Tailwind CSS layouts, and debug TypeScript definitions from scratch.
          </p>
        </section>

        {/* Section 6 */}
        <section className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
          <strong className="block text-amber-900 font-bold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-700" />
            6. Items Requiring Personal Candidate Confirmation
          </strong>
          <ul className="list-disc list-inside space-y-1 text-amber-900/90 text-[11px]">
            <li>Exact candidate name, contact email, and application ID for submission cover.</li>
            <li>Personal confirmation of any informal practitioner discussions with banking colleagues (e.g., branch managers or retail credit underwriters) to credit in D5.</li>
            <li>Final verification of screen recording (5 minutes or less) demonstrating the live D1–D4 web application.</li>
          </ul>
        </section>
      </article>
    </div>
  );
};
