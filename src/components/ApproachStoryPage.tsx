import React from 'react';
import { 
  Database, 
  BrainCircuit, 
  FileText, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Users, 
  Sparkles, 
  GitCompare, 
  Search, 
  Scale 
} from 'lucide-react';

export const ApproachStoryPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#7B1113] via-[#8c1619] to-slate-900 text-white rounded-2xl p-8 shadow-md border-b-4 border-amber-500">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deliverable D2 · Executive Presales Narrative</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">
            Transforming Retail Lending: From Fragmented Silos to Agentic Intelligence
          </h1>
          <p className="text-sm md:text-base text-amber-100/90 leading-relaxed">
            A two-act strategic approach designed for bank leadership: first unifying multi-source banking data into a BigQuery lakehouse, then empowering human credit officers with explainable AI agents.
          </p>
        </div>
      </section>

      {/* Act 1: The Lakehouse */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shadow-sm">
            1
          </div>
          <div>
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">Act 1: The Foundation</div>
            <h2 className="text-xl font-bold text-slate-900">
              The Lakehouse: Solving the Three-Data-Silo Challenge
            </h2>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          In a typical retail lending department, a credit officer must cross-reference three fundamentally different categories of data. Today, this requires logging into multiple isolated systems, manually inspecting PDFs, and typing figures into spreadsheets.
        </p>

        {/* The 3 Silos Problem Visual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase mb-2">
              <FileText className="w-4 h-4" />
              <span>1. Unstructured Documents</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Customer salary slips, ITR PDFs, KYC scans, internal lending manuals, and evolving regulatory circulars.
            </p>
            <div className="text-[11px] bg-white p-2 rounded border border-slate-200 text-slate-500">
              <strong>Challenge:</strong> Unstructured layouts, variable pay deductions, and frequent policy updates that officers must manually cross-verify.
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase mb-2">
              <Database className="w-4 h-4" />
              <span>2. Structured Core Banking</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Core Banking System (CBS) transaction tables, customer relationship vintage, existing loan tracks, and quarterly balances.
            </p>
            <div className="text-[11px] bg-white p-2 rounded border border-slate-200 text-slate-500">
              <strong>Challenge:</strong> Data trapped in legacy mainframes and isolated relational stores that cannot easily be joined with documents in real time.
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase mb-2">
              <CreditCard className="w-4 h-4" />
              <span>3. External Gateway APIs</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Credit bureaus (CIBIL), simulated DigiLocker PAN/Aadhaar verification, and Account Aggregator statements.
            </p>
            <div className="text-[11px] bg-white p-2 rounded border border-slate-200 text-slate-500">
              <strong>Challenge:</strong> Disparate response schemas, API rate limits, per-query costs, and latency mismatches across providers.
            </div>
          </div>
        </div>

        {/* Lakehouse Consolidation Flow Diagram */}
        <div className="bg-slate-900 text-white rounded-xl p-6">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            The Lakehouse Solution Architecture
          </div>
          <h3 className="text-base font-bold text-white mb-4">
            Unifying Multi-Modal Banking Data into Google BigQuery
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-800 p-3.5 rounded-lg border border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-amber-400 font-mono text-[10px] block mb-1">01 / INGESTION</span>
                <strong className="text-white text-xs block mb-1">Multi-Modal Ingestion</strong>
                <p className="text-[11px] text-slate-300">
                  Batched and streaming collectors pull PDF pay slips, Core Banking accounts, and Bureau XML/JSON responses into Cloud Storage and Pub/Sub.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 mt-2">GCS · Pub/Sub · Cloud Run</span>
            </div>

            <div className="bg-slate-800 p-3.5 rounded-lg border border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-amber-400 font-mono text-[10px] block mb-1">02 / PARSING & OCR</span>
                <strong className="text-white text-xs block mb-1">Extraction & Vectorization</strong>
                <p className="text-[11px] text-slate-300">
                  Document AI extracts salary lines and detects pay variance. Policy circulars are indexed and vectorized into semantic chunks.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 mt-2">Document AI · Embeddings</span>
            </div>

            <div className="bg-slate-800 p-3.5 rounded-lg border border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-amber-400 font-mono text-[10px] block mb-1">03 / CONSOLIDATION</span>
                <strong className="text-white text-xs block mb-1">BigQuery Lakehouse</strong>
                <p className="text-[11px] text-slate-300">
                  Unified analytics layer housing structured tables (applicants, trade lines), feature store records, and vector embeddings in one place.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 mt-2">BigQuery · Feature Store</span>
            </div>

            <div className="bg-slate-800 p-3.5 rounded-lg border border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-amber-400 font-mono text-[10px] block mb-1">04 / CONSUMPTION</span>
                <strong className="text-white text-xs block mb-1">Ready for Agentic Reasoning</strong>
                <p className="text-[11px] text-slate-300">
                  Provides high-speed SQL queries and vector similarity searches so AI agents can evaluate policy compliance in sub-seconds.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 mt-2">SQL · Vector Search APIs</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span><strong>Business Value:</strong> Single pane of glass eliminates data duplication, reconciles discrepancies, and creates an auditable golden record for every applicant.</span>
          </div>
        </div>
      </section>

      {/* Act 2: Agentic AI */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#7B1113] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            2
          </div>
          <div>
            <div className="text-xs font-bold text-[#7B1113] uppercase tracking-wider">Act 2: The Agentic Solution</div>
            <h2 className="text-xl font-bold text-slate-900">
              Agentic AI: Reasoning Over Data While Keeping Humans in Control
            </h2>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Once data is consolidated in the lakehouse, a coordinated team of AI agents performs deterministic checks, policy lookups, and debt service calculations. Rather than acting as a black-box auto-approval system, the agents produce an <strong>explainable recommendation</strong> and prepare the case for a licensed human credit officer.
        </p>

        {/* 4 Specialized Agents Visual */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                <FileText className="w-4 h-4" />
              </div>
              <strong className="text-xs text-slate-900 block mb-1">Document Intelligence Agent</strong>
              <p className="text-[11px] text-slate-600">
                Parses 3 months of salary slips, validates DigiLocker KYC hashes, and alerts underwriters if salary fluctuations exceed tolerance limits.
              </p>
            </div>
            <span className="text-[10px] text-blue-700 font-semibold mt-3 block">Powers Stage 2 in D1</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                <CreditCard className="w-4 h-4" />
              </div>
              <strong className="text-xs text-slate-900 block mb-1">Bureau & Cashflow Agent</strong>
              <p className="text-[11px] text-slate-600">
                Queries mock CIBIL APIs, analyzes historical delinquency (DPD), checks inquiry velocity, and checks bank statements for cheque returns.
              </p>
            </div>
            <span className="text-[10px] text-purple-700 font-semibold mt-3 block">Powers Stages 3 & 4 in D1</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                <Scale className="w-4 h-4" />
              </div>
              <strong className="text-xs text-slate-900 block mb-1">Policy Eligibility Agent</strong>
              <p className="text-[11px] text-slate-600">
                Applies standard retail lending guidelines: computes Reducing-Balance EMI, calculates FOIR, and tests against the 50% capacity cap.
              </p>
            </div>
            <span className="text-[10px] text-amber-800 font-semibold mt-3 block">Powers Stage 5 in D1</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <strong className="text-xs text-slate-900 block mb-1">Orchestration & HIL Agent</strong>
              <p className="text-[11px] text-slate-600">
                Synthesizes findings into plain English, packages evidence, and halts at the Credit Officer Review Console awaiting human sign-off.
              </p>
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold mt-3 block">Powers Stages 6 & 7 in D1</span>
          </div>
        </div>

        {/* End-to-End Governance Flow */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
            Human-in-the-Loop Governance & Exception Handling
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <strong className="text-slate-900 flex items-center gap-1.5 mb-1.5">
                <Users className="w-4 h-4 text-[#7B1113]" />
                Human Oversight by Design
              </strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                The AI agent provides an opinion, never an autonomous disbursement. A licensed credit officer retains complete legal authority to accept, modify, or reject the recommendation.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <strong className="text-slate-900 flex items-center gap-1.5 mb-1.5">
                <Search className="w-4 h-4 text-blue-600" />
                100% Evidence Traceability
              </strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Every assertion links back to an exact artifact: the OCR salary line, the bureau report ID, or the specific mathematical FOIR formula.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <strong className="text-slate-900 flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Intelligent Exception Handling
              </strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Borderline applicants (like Rajesh Kumar) are not rejected outright; the system suggests loan restructuring (e.g. extending tenure or lowering amount) to bring FOIR into compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before and After Comparison Section */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <GitCompare className="w-5 h-5 text-[#7B1113]" />
          <h2 className="text-lg font-bold text-slate-900">
            Operational Transformation: Before vs. After
          </h2>
        </div>

        <p className="text-xs text-slate-600">
          A side-by-side comparison illustrating how consolidating data into a lakehouse and deploying agentic workflows transforms the daily work of bank credit officers without compromising regulatory compliance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Legacy Process Card */}
          <div className="bg-rose-50/50 rounded-xl p-5 border border-rose-200 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold mb-3">
                <span>Traditional Manual Lending Workflow</span>
              </div>
              <ul className="space-y-3 text-slate-700 text-[11px]">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Fragmented Data Collection:</strong> Officers spend hours requesting missing salary slips, paper bank statements, and ID documents from branches.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Manual Calculations:</strong> Fixed obligations and net disposable income are computed manually in spreadsheets, creating risk of calculation errors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Swivel-Chair Portal Switching:</strong> Underwriters log into separate bureau portals, CBS screens, and PDF circular drives to assemble a case.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Subjective Exception Handling:</strong> Borderline cases depend heavily on individual branch discretion with limited audit consistency.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-200 text-[10px] text-rose-800 italic">
              Result: High cognitive fatigue for credit officers and inconsistent branch compliance.
            </div>
          </div>

          {/* Agentic Solution Card */}
          <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-200 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-3">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Agentic Lakehouse Solution (PNB Intelligent Lending)</span>
              </div>
              <ul className="space-y-3 text-slate-700 text-[11px]">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>Unified Lakehouse Ingestion:</strong> Ingests documents, core banking balances, and bureau data into BigQuery as an integrated golden record.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>Dynamic Formula Verification:</strong> Reducing-balance EMI and FOIR compute dynamically with instant recalculation on restructured terms.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>Single Explainable Workbench:</strong> All 7 stages execute with plain-English rationales, evidence tokens, and rule-by-rule statuses.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>Immutable Auditability & HIL:</strong> Human underwriter controls final approval with mandatory rationale recorded in an immutable governance log.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200 text-[10px] text-emerald-800 italic">
              Result: Substantial reduction in manual verification overhead while preserving strict underwriter governance.
            </div>
          </div>
        </div>

        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Presales Note:</strong> Turnaround velocity depends on integration maturity and document quality. The agentic platform automates data synthesis and policy checks while keeping human credit officers firmly in command of credit risk.
          </span>
        </div>
      </section>
    </div>
  );
};
