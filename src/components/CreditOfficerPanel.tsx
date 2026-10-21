import React, { useState } from 'react';
import type { 
  EvaluationOutcome, 
  OfficerDecisionRecord, 
  SyntheticApplicant 
} from '../types/lending';
import { formatINR } from '../utils/loanCalculations';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lock, 
  Unlock, 
  Send, 
  FileCheck, 
  DollarSign, 
  HelpCircle 
} from 'lucide-react';

interface CreditOfficerPanelProps {
  applicant: SyntheticApplicant;
  evaluation: EvaluationOutcome;
  officerDecision: OfficerDecisionRecord | null;
  onRecordDecision: (record: OfficerDecisionRecord) => void;
  hasAssessmentRun: boolean;
  isDisbursed: boolean;
  onExecuteDisbursement: () => void;
}

export const CreditOfficerPanel: React.FC<CreditOfficerPanelProps> = ({
  applicant,
  evaluation,
  officerDecision,
  onRecordDecision,
  hasAssessmentRun,
  isDisbursed,
  onExecuteDisbursement,
}) => {
  const [selectedAction, setSelectedAction] = useState<'OFFICER_APPROVED' | 'OFFICER_REQUEST_INFO' | 'OFFICER_REJECTED'>(
    evaluation.systemRecommendation === 'RECOMMENDED_SANCTION' 
      ? 'OFFICER_APPROVED' 
      : evaluation.systemRecommendation === 'REFERRED_FOR_REVIEW'
        ? 'OFFICER_REQUEST_INFO'
        : 'OFFICER_REJECTED'
  );
  const [rationale, setRationale] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Quick fill rationale templates based on scenario
  const applyTemplate = (text: string) => {
    setRationale(text);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rationale.trim()) {
      setValidationError('Mandatory banking requirement: A written rationale is required before recording any credit decision.');
      return;
    }

    const decisionRecord: OfficerDecisionRecord = {
      decision: selectedAction,
      rationale: rationale.trim(),
      officerName: 'S. K. Verma',
      officerEmpId: 'PNB-CR-8841',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST',
      sanctionAmount: selectedAction === 'OFFICER_APPROVED' ? evaluation.recalculatedLoanAmount : undefined,
    };

    onRecordDecision(decisionRecord);
    setValidationError(null);
  };

  const isEligibleForDisbursement = hasAssessmentRun && officerDecision?.decision === 'OFFICER_APPROVED';

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="text-xs font-bold text-[#7B1113] uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
            <ShieldCheck className="w-4 h-4 text-[#7B1113]" />
            <span>Stage 7: Human Credit Officer Review & Governance</span>
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Mandatory Underwriter Decision Console
          </h2>
        </div>
        <div className="text-xs text-slate-500">
          <span>Officer: <strong>S. K. Verma</strong> (ID: PNB-CR-8841)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: AI Recommendation & Explainability (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Explainable System Recommendation
            </span>

            {/* Recommendation Tag Banner */}
            <div className="mb-3">
              {evaluation.systemRecommendation === 'RECOMMENDED_SANCTION' && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>System Recommends: Sanction Approval</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    All illustrative policy benchmarks and prime bureau criteria satisfied.
                  </p>
                </div>
              )}
              {evaluation.systemRecommendation === 'REFERRED_FOR_REVIEW' && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>System Recommends: Underwriter Review / Restructure</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Application exceeds standard 50% FOIR threshold or has near-prime inquiry volume.
                  </p>
                </div>
              )}
              {evaluation.systemRecommendation === 'RECOMMENDED_DECLINE' && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>System Recommends: Decline Application</span>
                  </div>
                  <p className="text-[11px] text-rose-800">
                    Hard knockout criteria breached (income threshold or bureau delinquency).
                  </p>
                </div>
              )}
            </div>

            {/* Rationale Bullet Points */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-700 block text-[11px]">Primary Decision Factors:</span>
              <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside">
                {evaluation.recommendationRationale.map((r, idx) => (
                  <li key={idx} className="leading-relaxed">{r}</li>
                ))}
              </ul>
            </div>

            {/* Negative Flags if any */}
            {evaluation.riskFlags.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <span className="font-semibold text-rose-800 block text-[11px] mb-1">Identified Risk Flags:</span>
                <div className="space-y-1">
                  {evaluation.riskFlags.map((flag, idx) => (
                    <div key={idx} className="p-1.5 rounded bg-rose-50/70 border border-rose-200/60 text-[11px] text-rose-700">
                      • {flag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Proposed Terms: {formatINR(evaluation.recalculatedLoanAmount)} for {evaluation.recalculatedTenureMonths}m</span>
            <span>EMI: {formatINR(evaluation.monthlyEMI)}</span>
          </div>
        </div>

        {/* Right Column: Credit Officer Input Console & Disbursement Gate (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Record Underwriter Decision
            </span>

            {/* 3 Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedAction('OFFICER_APPROVED')}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  selectedAction === 'OFFICER_APPROVED'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Sanction</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('OFFICER_REQUEST_INFO')}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  selectedAction === 'OFFICER_REQUEST_INFO'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Request More Info</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('OFFICER_REJECTED')}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  selectedAction === 'OFFICER_REJECTED'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject Application</span>
              </button>
            </div>

            {/* Quick Fill Rationale Templates */}
            <div>
              <span className="text-[11px] text-slate-500 block mb-1">
                Quick-Fill Rationale Templates (Click to insert):
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyTemplate(`Approved. Tier-1 salaried applicant with prime CIBIL ${applicant.externalBureau.creditScore} and acceptable FOIR of ${evaluation.foirPercentage}%. Sanction granted for ${formatINR(evaluation.recalculatedLoanAmount)}.`)}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded border border-slate-200"
                >
                  ✓ Prime Approval Rationale
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate(`Referred. FOIR (${evaluation.foirPercentage}%) exceeds 50% limit. Counter-offer recommended: reduce sanction to ₹4,00,000 or request 3 months additional bank statements.`)}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded border border-slate-200"
                >
                  ⚠ High FOIR / Restructure Rationale
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate(`Declined. Does not meet minimum policy criteria: monthly income below ₹25,000 threshold and adverse bureau credit history recorded.`)}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded border border-slate-200"
                >
                  ✗ Policy Knockout Rationale
                </button>
              </div>
            </div>

            {/* Rationale Textarea */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Officer Underwriting Rationale (Mandatory):
              </label>
              <textarea
                rows={3}
                value={rationale}
                onChange={(e) => {
                  setRationale(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="Enter detailed credit rationale justifying your approval, stipulation, or rejection..."
                className="w-full text-xs p-2.5 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#7B1113] focus:border-[#7B1113]"
              />
              {validationError && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{validationError}</p>
              )}
            </div>

            {/* Record Decision Button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Decision will be appended to the immutable audit trail.
              </span>
              <button
                type="submit"
                disabled={!hasAssessmentRun}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  hasAssessmentRun
                    ? 'bg-[#7B1113] hover:bg-[#600d0f] text-white shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Record Official Decision</span>
              </button>
            </div>
          </form>

          {/* Disbursement Gate Safety Guardrail */}
          <div className="mt-4 pt-3 border-t border-slate-200 bg-slate-50 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {isEligibleForDisbursement ? (
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Unlock className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
              )}
              <div>
                <strong className="text-xs text-slate-900 block">
                  Simulated Sanction & Disbursement Gateway
                </strong>
                <p className="text-[11px] text-slate-500">
                  {isDisbursed
                    ? 'Disbursement successfully simulated. Transaction reference generated.'
                    : isEligibleForDisbursement
                      ? 'Approved by Officer. Ready for simulated disbursement.'
                      : 'Locked: Requires successful assessment and officer approval.'}
                </p>
              </div>
            </div>

            <button
              onClick={onExecuteDisbursement}
              disabled={!isEligibleForDisbursement || isDisbursed}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                isDisbursed
                  ? 'bg-emerald-600 text-white cursor-default'
                  : isEligibleForDisbursement
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isDisbursed ? (
                <>
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Sanction Disbursed ✓</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Disburse Loan (Simulated)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
