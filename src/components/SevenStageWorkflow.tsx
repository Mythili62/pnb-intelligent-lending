import React, { useState } from 'react';
import type { WorkflowStageDetail } from '../types/lending';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  FileText, 
  Database, 
  CreditCard, 
  Scale, 
  BrainCircuit, 
  UserCheck 
} from 'lucide-react';

interface SevenStageWorkflowProps {
  stages: WorkflowStageDetail[];
  activeStageIndex: number;
  isAssessing: boolean;
  hasAssessmentRun: boolean;
}

export const SevenStageWorkflow: React.FC<SevenStageWorkflowProps> = ({
  stages,
  activeStageIndex,
  isAssessing,
  hasAssessmentRun,
}) => {
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedStageId(prev => prev === id ? null : id);
  };

  const getStageIcon = (id: string) => {
    switch (id) {
      case 'stage_1_intake':
        return <FileText className="w-4 h-4" />;
      case 'stage_2_document_verification':
        return <ShieldCheck className="w-4 h-4" />;
      case 'stage_3_banking_data':
        return <Database className="w-4 h-4" />;
      case 'stage_4_bureau_checks':
        return <CreditCard className="w-4 h-4" />;
      case 'stage_5_policy_eligibility':
        return <Scale className="w-4 h-4" />;
      case 'stage_6_risk_assessment':
        return <BrainCircuit className="w-4 h-4" />;
      case 'stage_7_human_review':
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: WorkflowStageDetail['status']) => {
    switch (status) {
      case 'PASSED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Passed
          </span>
        );
      case 'REVIEW_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3 h-3" /> Review
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3" /> Knockout
          </span>
        );
      case 'AWAITING_OFFICER':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 animate-pulse">
            <Clock className="w-3 h-3" /> Awaiting Officer
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 animate-pulse">
            <Clock className="w-3 h-3" /> Processing...
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">
            Pending
          </span>
        );
    }
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="text-xs font-bold text-[#7B1113] uppercase tracking-wider mb-0.5">
            Deterministic Assessment Lifecycle
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Seven-Stage Agentic & Governance Workflow
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">
            {hasAssessmentRun ? 'Assessment complete' : 'Click "Run Assessment" above to evaluate stages'}
          </span>
        </div>
      </div>

      {/* Progress Stepper Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {stages.map((stage, idx) => {
          const isCurrentActive = isAssessing && activeStageIndex === idx;
          const isDone = hasAssessmentRun || (isAssessing && activeStageIndex > idx);

          return (
            <div
              key={stage.id}
              onClick={() => toggleExpand(stage.id)}
              className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                isCurrentActive
                  ? 'border-[#7B1113] bg-amber-50/70 shadow-sm ring-1 ring-[#7B1113]'
                  : isDone
                    ? 'border-slate-200 bg-white hover:border-slate-300'
                    : 'border-slate-100 bg-slate-50/60 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400">
                  0{stage.order}
                </span>
                <span className="text-slate-600">
                  {getStageIcon(stage.id)}
                </span>
              </div>
              <p className="font-bold text-[11px] text-slate-800 line-clamp-1 mb-1">
                {stage.name}
              </p>
              <div className="mt-1">
                {isDone ? getStatusBadge(stage.status) : (
                  <span className="text-[10px] text-slate-400">Waiting</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Accordion / Detailed Cards for Each Stage */}
      <div className="space-y-3 mt-1">
        {stages.map((stage, idx) => {
          const isDone = hasAssessmentRun || (isAssessing && activeStageIndex > idx);
          const isExpanded = expandedStageId === stage.id || (isAssessing && activeStageIndex === idx);

          return (
            <div
              key={stage.id}
              className={`rounded-xl border transition-all ${
                isExpanded ? 'border-slate-300 shadow-sm bg-white' : 'border-slate-200 bg-slate-50/40 hover:bg-white'
              }`}
            >
              {/* Stage Header Row */}
              <button
                type="button"
                onClick={() => toggleExpand(stage.id)}
                className="w-full p-3.5 flex items-center justify-between text-left gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    stage.status === 'PASSED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : stage.status === 'REVIEW_REQUIRED'
                        ? 'bg-amber-100 text-amber-800'
                        : stage.status === 'FAILED'
                          ? 'bg-rose-100 text-rose-800'
                          : stage.status === 'AWAITING_OFFICER'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                  }`}>
                    {stage.order}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{stage.name}</span>
                      <span className="text-[10px] text-slate-400 hidden sm:inline">· {stage.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{stage.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isDone ? getStatusBadge(stage.status) : (
                    <span className="text-xs text-slate-400">Pending</span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Collapsible Detail Panel */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-white rounded-b-xl">
                  {/* Inputs Column */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    <span className="font-bold text-[11px] text-slate-700 uppercase tracking-wider block mb-2">
                      Stage Inputs & Parameters
                    </span>
                    <div className="space-y-1.5 text-[11px]">
                      {Object.entries(stage.inputs).map(([key, val]) => (
                        <div key={key} className="flex justify-between border-b border-slate-200/50 pb-1">
                          <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-mono text-slate-800 font-semibold">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Findings Column */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    <span className="font-bold text-[11px] text-slate-700 uppercase tracking-wider block mb-2">
                      Evaluated Findings
                    </span>
                    <ul className="space-y-1.5 text-[11px] text-slate-700 list-disc list-inside">
                      {stage.findings.map((finding, fIdx) => (
                        <li key={fIdx} className="leading-relaxed">
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Evidence / Audit Token Column */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    <span className="font-bold text-[11px] text-slate-700 uppercase tracking-wider block mb-2">
                      Grounding Evidence & Audit
                    </span>
                    <div className="space-y-1.5 text-[11px] text-slate-600">
                      {stage.evidence.map((ev, eIdx) => (
                        <div key={eIdx} className="p-1.5 rounded bg-white border border-slate-200 font-mono text-[10px]">
                          {ev}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
