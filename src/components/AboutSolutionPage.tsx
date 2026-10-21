import React from 'react';
import { 
  Building2, 
  FileText, 
  Database, 
  CreditCard, 
  ShieldCheck, 
  BrainCircuit, 
  Users, 
  CheckCircle2, 
  Sparkles,
  Lock
} from 'lucide-react';

export const AboutSolutionPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#7B1113] via-[#8c1619] to-slate-900 text-white rounded-2xl p-8 shadow-md border-b-4 border-amber-500">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deliverable D4 · Solution Overview</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">
            About PNB Intelligent Lending
          </h1>
          <p className="text-sm md:text-base text-amber-100/90 leading-relaxed">
            An enterprise Point-of-View (POV) demonstration illustrating how an agentic AI solution coupled with a modern data lakehouse streamlines retail loan underwriting while maintaining strict banking governance.
          </p>
        </div>
      </section>

      {/* 1. The Business Problem */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Building2 className="w-5 h-5 text-[#7B1113]" />
          <h2 className="text-lg font-bold text-slate-900">
            The Business Problem in Retail Lending
          </h2>
        </div>

        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
          In modern retail banking, processing a personal loan application is a document-heavy, operationally fragmented workflow. Credit officers face recurring operational friction across branches:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <span className="text-xs font-bold text-slate-800 block mb-1.5">
              1. Document Fragmentation
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Customer salary slips, bank statements, and KYC scans arrive in inconsistent PDF and image formats. Officers manually extract line items, calculate net pay, and verify salary deductions.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <span className="text-xs font-bold text-slate-800 block mb-1.5">
              2. Swivel-Chair Verification
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Underwriters must switch across separate portals: Core Banking for internal accounts, credit bureau gateways for CIBIL reports, and shared drives for internal credit policy circulars.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <span className="text-xs font-bold text-slate-800 block mb-1.5">
              3. Inconsistent Branch Decisions
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              With frequently updated policy thresholds and varying manual calculation practices, borderline applications often result in inconsistent decisions across regional lending hubs.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Unifying Disparate Data Sources */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Database className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Bringing Three Data Silos Together
          </h2>
        </div>

        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
          The solution brings together the three primary data types into a unified lakehouse data layer (architected on Google BigQuery):
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-xs">
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs mb-2">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>Unstructured Documents</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Extracted via Document AI OCR: 3 months of salary slips, PAN/Aadhaar identity tokens, Account Aggregator statements, and bank credit policy guidelines.
              </p>
            </div>
            <span className="text-[10px] text-blue-700 font-semibold mt-3 pt-2 border-t border-blue-200/60">
              Evaluated in Stage 2 (OCR & KYC)
            </span>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs mb-2">
                <Database className="w-4 h-4 text-emerald-700" />
                <span>Structured Core Banking (CBS)</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Direct lookup of customer relationship vintage, account type, average quarterly balances, and existing internal loan repayment track records.
              </p>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-3 pt-2 border-t border-emerald-200/60">
              Evaluated in Stage 3 (Banking Data)
            </span>
          </div>

          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-purple-900 text-xs mb-2">
                <CreditCard className="w-4 h-4 text-purple-700" />
                <span>External Verification APIs</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Simulated credit bureau gateway (CIBIL score, score band, active trade lines, 24-month delinquency history, and recent credit search velocity).
              </p>
            </div>
            <span className="text-[10px] text-purple-700 font-semibold mt-3 pt-2 border-t border-purple-200/60">
              Evaluated in Stage 4 (Bureau Check)
            </span>
          </div>
        </div>
      </section>

      {/* 3. How AI Agents Assist Underwriting */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <BrainCircuit className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-slate-900">
            How AI Agents Assist the Underwriting Process
          </h2>
        </div>

        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
          AI agents do not replace the credit officer; they act as an intelligent cognitive copilot that prepares the file, runs deterministic calculations, and flags potential credit risks:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-900 block text-xs mb-1">
                Document Parsing & Variance Detection
              </strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Extracts net take-home salary, checks consistency across all 3 submitted slips, and flags salary fluctuations exceeding the normal threshold.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-900 block text-xs mb-1">
                Deterministic Policy & FOIR Evaluation
              </strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Applies verified banking mathematics: calculates Reducing-Balance EMI and Fixed Obligation to Income Ratio (FOIR) dynamically without arbitrary percentage guesses.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-900 block text-xs mb-1">
                Credit Risk & Delinquency Synthesis
              </strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Inspects historical Days Past Due (DPD), checks for recent credit-seeking spikes, and synthesizes findings into plain-English positive factors and risk alerts.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-900 block text-xs mb-1">
                Intelligent Restructuring Suggestions
              </strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                For borderline cases, the system guides underwriters by demonstrating how adjusting the loan amount or tenure can bring the FOIR into policy compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Explainability & Human-in-the-Loop Governance */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Explainability & Human-in-the-Loop Governance
          </h2>
        </div>

        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
          A fundamental principle of the PNB Intelligent Lending architecture is that <strong>AI does not disburse funds</strong>. The solution enforces bank-grade governance at every step:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <strong className="text-slate-900 block text-xs mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Explainable Rule Audits
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Every recommendation displays the exact threshold, the observed applicant value, and the pass/review/fail outcome, backed by evidence tokens and document hashes.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <strong className="text-slate-900 block text-xs mb-1.5 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#7B1113]" />
              Mandatory Underwriter Review
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              A licensed credit officer reviews the case and must enter a mandatory written rationale before recording an official decision (Approve, Request Info, or Reject).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <strong className="text-slate-900 block text-xs mb-1.5 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-700" />
              Safety-Locked Disbursement
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              The disbursement gateway is physically locked in software until the 7 stages have executed and an explicit human approval is permanently logged in the audit trail.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
