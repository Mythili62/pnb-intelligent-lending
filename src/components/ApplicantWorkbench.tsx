import React from 'react';
import type { SyntheticApplicant, EvaluationOutcome } from '../types/lending';
import { formatINR } from '../utils/loanCalculations';
import { 
  User, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Play, 
  RotateCcw,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface ApplicantWorkbenchProps {
  applicants: SyntheticApplicant[];
  selectedApplicant: SyntheticApplicant;
  onSelectApplicant: (applicantId: string) => void;
  customAmount: number;
  onCustomAmountChange: (amount: number) => void;
  customTenure: number;
  onCustomTenureChange: (tenure: number) => void;
  evaluation: EvaluationOutcome;
  isAssessing: boolean;
  onRunAssessment: () => void;
  onResetWorkflow: () => void;
  hasAssessmentRun: boolean;
}

export const ApplicantWorkbench: React.FC<ApplicantWorkbenchProps> = ({
  applicants,
  selectedApplicant,
  onSelectApplicant,
  customAmount,
  onCustomAmountChange,
  customTenure,
  onCustomTenureChange,
  evaluation,
  isAssessing,
  onRunAssessment,
  onResetWorkflow,
  hasAssessmentRun,
}) => {
  const profile = selectedApplicant.profile;

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-5">
      {/* Header and Applicant Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="text-xs font-bold text-[#7B1113] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#7B1113]"></span>
            <span>Application Workbench</span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="text-slate-500 font-normal">Select Predefined Applicant</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Salaried Personal Loan Evaluation Desk
          </h2>
        </div>

        {/* 3 Applicant Switcher Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {applicants.map((app) => {
            const isSelected = app.profile.id === profile.id;
            return (
              <button
                key={app.profile.id}
                onClick={() => onSelectApplicant(app.profile.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all border ${
                  isSelected
                    ? 'bg-[#7B1113] text-white border-[#7B1113] shadow-sm ring-2 ring-[#7B1113]/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <User className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{app.profile.applicantName}</span>
                {app.scenarioType === 'STRAIGHTFORWARD' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isSelected ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                    Prime
                  </span>
                )}
                {app.scenarioType === 'BORDERLINE_REVIEW' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isSelected ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'}`}>
                    Review
                  </span>
                )}
                {app.scenarioType === 'HIGH_RISK_DECLINE' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isSelected ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-800'}`}>
                    Risk
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Details & Financial Recalculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Applicant Demographics (4 cols) */}
        <div className="lg:col-span-4 bg-slate-50/70 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400 block mb-0.5">{profile.id}</span>
                <h3 className="font-bold text-base text-slate-900">{profile.applicantName}</h3>
                <p className="text-xs text-slate-500">{profile.designation}</p>
              </div>
              {selectedApplicant.scenarioType === 'STRAIGHTFORWARD' && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Straightforward
                </span>
              )}
              {selectedApplicant.scenarioType === 'BORDERLINE_REVIEW' && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Underwriter Review
                </span>
              )}
              {selectedApplicant.scenarioType === 'HIGH_RISK_DECLINE' && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> High Risk Flags
                </span>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Employer:</span>
                <strong className="text-slate-800 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {profile.employerName}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Employer Category:</span>
                <span className="text-slate-700 font-medium">{profile.employerCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Employment Vintage:</span>
                <span className="text-slate-700">{profile.employmentVintageYears} Years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="text-slate-700">{profile.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Stated Loan Purpose:</span>
                <span className="text-slate-700">{profile.loanPurpose}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-slate-600 bg-white p-2.5 rounded border border-slate-200 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>{selectedApplicant.scenarioSummary}</span>
          </div>
        </div>

        {/* Middle Column: Dynamic Loan Term Sliders (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#7B1113]" />
                Loan Terms Adjustment
              </span>
              <span className="text-[11px] text-slate-400">Illustrative 11.75% p.a.</span>
            </div>

            <div className="space-y-3.5 mt-2">
              {/* Amount Slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Loan Amount:</span>
                  <strong className="text-slate-900 font-mono text-sm">{formatINR(customAmount)}</strong>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="25000"
                  value={customAmount}
                  onChange={(e) => onCustomAmountChange(Number(e.target.value))}
                  className="w-full accent-[#7B1113] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>₹50k</span>
                  <span>₹5L</span>
                  <span>₹10L</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Tenure (Months):</span>
                  <strong className="text-slate-900 font-mono text-sm">{customTenure} Mos ({customTenure / 12} Yrs)</strong>
                </div>
                <input
                  type="range"
                  min="12"
                  max="60"
                  step="6"
                  value={customTenure}
                  onChange={(e) => onCustomTenureChange(Number(e.target.value))}
                  className="w-full accent-[#7B1113] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>12 Mos</span>
                  <span>36 Mos</span>
                  <span>60 Mos</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic mt-3 pt-2 border-t border-slate-100">
            * Adjusting terms will dynamically recalculate proposed EMI and FOIR below.
          </p>
        </div>

        {/* Right Column: Calculated Banking Metrics & Assessment Trigger (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 text-white rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              Calculated Debt Capacity
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[11px]">Net Monthly Pay</span>
                <span className="font-mono font-bold text-white text-sm">{formatINR(profile.netMonthlySalary)}</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[11px]">Existing Commitments</span>
                <span className="font-mono font-bold text-white text-sm">{formatINR(profile.existingMonthlyObligations)}</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[11px]">Proposed EMI</span>
                <span className="font-mono font-bold text-amber-300 text-sm">{formatINR(evaluation.monthlyEMI)}</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[11px]">Calculated FOIR</span>
                <span className={`font-mono font-bold text-sm ${
                  evaluation.foirPercentage > 50 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {evaluation.foirPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={onRunAssessment}
              disabled={isAssessing}
              className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                isAssessing
                  ? 'bg-amber-500 text-slate-950 cursor-wait'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:shadow-lg active:scale-98'
              }`}
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isAssessing ? 'animate-spin' : ''}`} />
              <span>{isAssessing ? 'Evaluating Stages...' : hasAssessmentRun ? 'Re-Run Assessment' : 'Run Assessment'}</span>
            </button>

            {hasAssessmentRun && (
              <button
                onClick={onResetWorkflow}
                title="Reset simulation to initial state"
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
