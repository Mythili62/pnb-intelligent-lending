import React from 'react';
import type { AuditLogEntry } from '../types/lending';
import { History, ShieldAlert, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

interface AuditTrailViewProps {
  logs: AuditLogEntry[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs }) => {
  const getStatusBadge = (tag: AuditLogEntry['statusTag']) => {
    switch (tag) {
      case 'PASSED':
      case 'APPROVED':
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" /> {tag}
          </span>
        );
      case 'WARNING':
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" /> {tag}
          </span>
        );
      case 'DECLINED':
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
            <XCircle className="w-2.5 h-2.5" /> {tag}
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 flex items-center gap-1">
            <Info className="w-2.5 h-2.5" /> {tag}
          </span>
        );
    }
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#7B1113]" />
          <h2 className="text-base font-bold text-slate-900">
            Immutable Decision Audit Trail & Governance Log
          </h2>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>Simulated Compliance Record ({logs.length} events logged)</span>
        </div>
      </div>

      {/* Log Table */}
      {logs.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 italic">
          No assessment executed yet. Click &quot;Run Assessment&quot; above to log the stage evaluation events.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-[11px] font-semibold uppercase">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Workflow Stage</th>
                <th className="py-2.5 px-3">Action Recorded</th>
                <th className="py-2.5 px-3">Outcome</th>
                <th className="py-2.5 px-3">Audit Details & Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.actor === 'CREDIT_OFFICER'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300/60'
                        : log.actor === 'DISBURSEMENT_GATEWAY'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300/60'
                          : 'bg-purple-100 text-purple-900 border border-purple-300/60'
                    }`}>
                      {log.actorName}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                    {log.stageName}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {getStatusBadge(log.statusTag)}
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-slate-600 max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
