import { useState, useEffect } from 'react';
import { SYNTHETIC_APPLICANTS } from './data/syntheticApplicants';
import { evaluateApplicant } from './utils/loanCalculations';
import { buildWorkflowStages } from './utils/workflowEngine';
import { ApplicantWorkbench } from './components/ApplicantWorkbench';
import { SevenStageWorkflow } from './components/SevenStageWorkflow';
import { CreditOfficerPanel } from './components/CreditOfficerPanel';
import { AuditTrailView } from './components/AuditTrailView';
import { ApproachStoryPage } from './components/ApproachStoryPage';
import { ArchitecturePage } from './components/ArchitecturePage';
import { AboutSolutionPage } from './components/AboutSolutionPage';
import { FAQPage } from './components/FAQPage';
import { ContactUsPage } from './components/ContactUsPage';
import { ResearchNotePage } from './components/ResearchNotePage';
import { AIUsageLogPage } from './components/AIUsageLogPage';
import type { 
  OfficerDecisionRecord, 
  AuditLogEntry 
} from './types/lending';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  BookOpen, 
  Layers,
  Info,
  HelpCircle,
  Mail,
  FileText,
  Cpu
} from 'lucide-react';

export type ActivePage = 'workbench' | 'approach' | 'architecture' | 'about' | 'faq' | 'contact' | 'docs';

export default function App() {
  // Navigation State
  const [activePage, setActivePage] = useState<ActivePage>('workbench');
  const [activeDocSubTab, setActiveDocSubTab] = useState<'d5' | 'd6'>('d5');

  // D1 State (Preserved across tab switches)
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>(SYNTHETIC_APPLICANTS[0].profile.id);
  const [customAmount, setCustomAmount] = useState<number>(SYNTHETIC_APPLICANTS[0].profile.requestedLoanAmount);
  const [customTenure, setCustomTenure] = useState<number>(SYNTHETIC_APPLICANTS[0].profile.requestedTenureMonths);
  
  const [isAssessing, setIsAssessing] = useState<boolean>(false);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [hasAssessmentRun, setHasAssessmentRun] = useState<boolean>(false);
  const [officerDecision, setOfficerDecision] = useState<OfficerDecisionRecord | null>(null);
  const [isDisbursed, setIsDisbursed] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const selectedApplicant = SYNTHETIC_APPLICANTS.find(a => a.profile.id === selectedApplicantId) ?? SYNTHETIC_APPLICANTS[0];

  // Dynamic Financial & Policy Recalculation
  const evaluation = evaluateApplicant(selectedApplicant, customAmount, customTenure);

  // Dynamic 7-Stage Workflow Details
  const stages = buildWorkflowStages(selectedApplicant, evaluation, officerDecision);

  // Switch applicant handler
  const handleSelectApplicant = (id: string) => {
    if (id === selectedApplicantId) return;
    setSelectedApplicantId(id);
    const applicant = SYNTHETIC_APPLICANTS.find(a => a.profile.id === id);
    if (applicant) {
      setCustomAmount(applicant.profile.requestedLoanAmount);
      setCustomTenure(applicant.profile.requestedTenureMonths);
    }
    setHasAssessmentRun(false);
    setIsAssessing(false);
    setActiveStageIndex(0);
    setOfficerDecision(null);
    setIsDisbursed(false);

    // Initial audit entry
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST';
    setAuditLogs(prev => [
      {
        id: `LOG-${Date.now()}`,
        timestamp,
        actor: 'SYSTEM_AGENT',
        actorName: 'Workflow Orchestrator',
        stageName: 'Workbench Intake',
        action: 'APPLICANT_LOADED',
        details: `Loaded synthetic profile for ${applicant?.profile.applicantName} (${id}). Ready for 7-stage evaluation.`,
        statusTag: 'INFO',
      },
      ...prev,
    ]);
  };

  // Term changes handler (invalidates previous officer decision since terms changed)
  const handleCustomAmountChange = (amount: number) => {
    setCustomAmount(amount);
    if (officerDecision) setOfficerDecision(null);
    if (isDisbursed) setIsDisbursed(false);
  };

  const handleCustomTenureChange = (tenure: number) => {
    setCustomTenure(tenure);
    if (officerDecision) setOfficerDecision(null);
    if (isDisbursed) setIsDisbursed(false);
  };

  // Run Assessment Step-by-Step Simulation
  const handleRunAssessment = () => {
    setIsAssessing(true);
    setActiveStageIndex(0);
    setOfficerDecision(null);
    setIsDisbursed(false);

    const now = new Date();
    const baseTimeStr = now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST';

    // Step through the stages sequentially with slight interval
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      if (currentStep < 7) {
        setActiveStageIndex(currentStep);
      } else {
        clearInterval(interval);
        setIsAssessing(false);
        setHasAssessmentRun(true);

        // Generate comprehensive audit logs for all 6 automated stages
        const newLogs: AuditLogEntry[] = [
          {
            id: `LOG-STG6-${Date.now()}`,
            timestamp: baseTimeStr,
            actor: 'SYSTEM_AGENT',
            actorName: 'Agentic Synthesis',
            stageName: 'Stage 6: Risk Assessment',
            action: 'SYNTHESIS_RECOMMENDATION',
            details: `Synthesis complete: ${evaluation.systemRecommendation.replace(/_/g, ' ')}. ${evaluation.recommendationRationale.join(' ')}`,
            statusTag: evaluation.systemRecommendation === 'RECOMMENDED_SANCTION' ? 'PASSED' : evaluation.systemRecommendation === 'REFERRED_FOR_REVIEW' ? 'WARNING' : 'DECLINED',
          },
          {
            id: `LOG-STG5-${Date.now()}`,
            timestamp: baseTimeStr,
            actor: 'SYSTEM_AGENT',
            actorName: 'Policy Rule Engine',
            stageName: 'Stage 5: Policy Eligibility',
            action: 'BENCHMARK_EVALUATION',
            details: `Evaluated FOIR: ${evaluation.foirPercentage}% (Benchmark: <=50%). Monthly net pay: ₹${selectedApplicant.profile.netMonthlySalary.toLocaleString('en-IN')}.`,
            statusTag: evaluation.foirPercentage <= 50 ? 'PASSED' : 'WARNING',
          },
          {
            id: `LOG-STG4-${Date.now()}`,
            timestamp: baseTimeStr,
            actor: 'SYSTEM_AGENT',
            actorName: 'Bureau Gateway API',
            stageName: 'Stage 4: Bureau Checks',
            action: 'CIBIL_SCORE_INGESTION',
            details: `Simulated CIBIL score: ${selectedApplicant.externalBureau.creditScore} (${selectedApplicant.externalBureau.scoreCategory}). 24-Mo DPD: ${selectedApplicant.externalBureau.maxDPDPast24Months}.`,
            statusTag: selectedApplicant.externalBureau.creditScore >= 720 ? 'PASSED' : selectedApplicant.externalBureau.creditScore >= 675 ? 'WARNING' : 'DECLINED',
          },
          {
            id: `LOG-STG3-${Date.now()}`,
            timestamp: baseTimeStr,
            actor: 'SYSTEM_AGENT',
            actorName: 'Core Banking (CBS)',
            stageName: 'Stage 3: Banking Data',
            action: 'CBS_VINTAGE_CHECK',
            details: `Internal relationship: ${selectedApplicant.structuredCBS.hasExistingAccount ? selectedApplicant.structuredCBS.accountType : 'New Customer'}. Cheque bounces in 6M: ${selectedApplicant.unstructuredDocs.bankStatementAnalysis.inwardChequeBouncesPast6Months}.`,
            statusTag: selectedApplicant.unstructuredDocs.bankStatementAnalysis.inwardChequeBouncesPast6Months === 0 ? 'PASSED' : 'DECLINED',
          },
          {
            id: `LOG-STG2-${Date.now()}`,
            timestamp: baseTimeStr,
            actor: 'SYSTEM_AGENT',
            actorName: 'OCR Document Parser',
            stageName: 'Stage 2: Document Verification',
            action: 'KYC_SALARY_SLIPS_VERIFIED',
            details: `DigiLocker PAN & Aadhaar verified. Verified ${selectedApplicant.unstructuredDocs.salarySlipVerification.slipsVerifiedCount} salary slips (Variance: ${selectedApplicant.unstructuredDocs.salarySlipVerification.variancePercentage}%).`,
            statusTag: selectedApplicant.unstructuredDocs.salarySlipVerification.salaryVarianceDetected ? 'WARNING' : 'PASSED',
          },
          {
            id: `LOG-STG1-${Date.now()}`,
            timestamp: baseTimeStr,
            actor: 'SYSTEM_AGENT',
            actorName: 'Omnichannel Intake',
            stageName: 'Stage 1: Application Intake',
            action: 'INTAKE_VALIDATED',
            details: `Application ${selectedApplicant.profile.id} registered for ₹${customAmount.toLocaleString('en-IN')} over ${customTenure} months.`,
            statusTag: 'PASSED',
          },
        ];

        setAuditLogs(prev => [...newLogs, ...prev]);
      }
    }, 250);
  };

  // Reset workflow handler
  const handleResetWorkflow = () => {
    setHasAssessmentRun(false);
    setIsAssessing(false);
    setActiveStageIndex(0);
    setOfficerDecision(null);
    setIsDisbursed(false);
  };

  // Record Credit Officer Decision Handler
  const handleRecordOfficerDecision = (record: OfficerDecisionRecord) => {
    setOfficerDecision(record);
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST';

    const logEntry: AuditLogEntry = {
      id: `LOG-OFFICER-${Date.now()}`,
      timestamp,
      actor: 'CREDIT_OFFICER',
      actorName: `${record.officerName} (${record.officerEmpId})`,
      stageName: 'Stage 7: Underwriter Sign-off',
      action: record.decision,
      details: `Underwriter Decision: ${record.decision.replace('OFFICER_', '')}. Rationale: "${record.rationale}"`,
      statusTag: record.decision === 'OFFICER_APPROVED' ? 'APPROVED' : record.decision === 'OFFICER_REQUEST_INFO' ? 'WARNING' : 'DECLINED',
    };

    setAuditLogs(prev => [logEntry, ...prev]);
  };

  // Execute Simulated Disbursement Handler
  const handleExecuteDisbursement = () => {
    if (!hasAssessmentRun || officerDecision?.decision !== 'OFFICER_APPROVED') return;

    setIsDisbursed(true);
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST';
    const txnRef = `TXN-DISB-PNB-${Math.floor(100000 + Math.random() * 900000)}`;

    const logEntry: AuditLogEntry = {
      id: `LOG-DISB-${Date.now()}`,
      timestamp,
      actor: 'DISBURSEMENT_GATEWAY',
      actorName: 'Core Banking Payment Gateway',
      stageName: 'Post-Sanction Disbursement',
      action: 'LOAN_DISBURSED_SIMULATED',
      details: `Simulated loan disbursement of ₹${customAmount.toLocaleString('en-IN')} executed for ${selectedApplicant.profile.applicantName}. Transaction Ref: ${txnRef}.`,
      statusTag: 'APPROVED',
    };

    setAuditLogs(prev => [logEntry, ...prev]);
  };

  // Initial load audit trail
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST';
    setAuditLogs([
      {
        id: `LOG-INIT-${Date.now()}`,
        timestamp,
        actor: 'SYSTEM_AGENT',
        actorName: 'Workflow Orchestrator',
        stageName: 'System Boot',
        action: 'PLATFORM_INITIALIZED',
        details: 'Intelligent Lending Platform initialized with 3 synthetic applicant profiles and illustrative credit policies.',
        statusTag: 'INFO',
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* PNB Corporate Topbar */}
      <header className="bg-[#7B1113] text-white px-6 py-4 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-amber-500 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-white text-[#7B1113] flex items-center justify-center font-black tracking-wider text-lg shadow-sm shrink-0">
            PNB
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              punjab national bank
              <span className="text-xs bg-amber-400 text-slate-900 font-semibold px-2 py-0.5 rounded tracking-normal">
                PRE-SALES PROTOTYPE
              </span>
            </h1>
            <p className="text-xs text-amber-100 font-medium tracking-wide">
              INTELLIGENT LENDING PLATFORM · DATA & AI PRESALES DEMO
            </p>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-1 bg-red-950/70 p-1 rounded-xl border border-amber-400/20 text-xs">
          <button
            onClick={() => setActivePage('workbench')}
            className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activePage === 'workbench'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-amber-100 hover:text-white hover:bg-red-900/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Loan Workbench</span>
          </button>

          <button
            onClick={() => setActivePage('approach')}
            className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activePage === 'approach'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-amber-100 hover:text-white hover:bg-red-900/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Our Approach</span>
          </button>

          <button
            onClick={() => setActivePage('architecture')}
            className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activePage === 'architecture'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-amber-100 hover:text-white hover:bg-red-900/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </button>

          <button
            onClick={() => setActivePage('docs')}
            className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activePage === 'docs'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-amber-100 hover:text-white hover:bg-red-900/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Research & AI Log</span>
          </button>

          <button
            onClick={() => setActivePage('about')}
            className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activePage === 'about'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-amber-100 hover:text-white hover:bg-red-900/50'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About</span>
          </button>

          <button
            onClick={() => setActivePage('faq')}
            className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activePage === 'faq'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-amber-100 hover:text-white hover:bg-red-900/50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ</span>
          </button>

          <button
            onClick={() => setActivePage('contact')}
            className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activePage === 'contact'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-amber-100 hover:text-white hover:bg-red-900/50'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Us</span>
          </button>
        </nav>
      </header>

      {/* Mandatory Illustrative & Synthetic Data Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900 no-print">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>DEMO ENVIRONMENT · SYNTHETIC DATA & ILLUSTRATIVE RULES:</strong> All credit scores, applicant profiles, policy rules, and bureau responses are completely synthetic and for simulation purposes only. They do not constitute official Punjab National Bank policies or decisions.
          </span>
        </div>
        <span className="bg-amber-200/70 font-semibold px-2 py-0.5 rounded text-amber-950 uppercase tracking-wider text-[10px]">
          Simulated POC
        </span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        {/* VIEW 1: Deliverable D1 (Interactive Loan Workbench) */}
        {activePage === 'workbench' && (
          <>
            <ApplicantWorkbench
              applicants={SYNTHETIC_APPLICANTS}
              selectedApplicant={selectedApplicant}
              onSelectApplicant={handleSelectApplicant}
              customAmount={customAmount}
              onCustomAmountChange={handleCustomAmountChange}
              customTenure={customTenure}
              onCustomTenureChange={handleCustomTenureChange}
              evaluation={evaluation}
              isAssessing={isAssessing}
              onRunAssessment={handleRunAssessment}
              onResetWorkflow={handleResetWorkflow}
              hasAssessmentRun={hasAssessmentRun}
            />

            <SevenStageWorkflow
              stages={stages}
              activeStageIndex={activeStageIndex}
              isAssessing={isAssessing}
              hasAssessmentRun={hasAssessmentRun}
            />

            <CreditOfficerPanel
              applicant={selectedApplicant}
              evaluation={evaluation}
              officerDecision={officerDecision}
              onRecordDecision={handleRecordOfficerDecision}
              hasAssessmentRun={hasAssessmentRun}
              isDisbursed={isDisbursed}
              onExecuteDisbursement={handleExecuteDisbursement}
            />

            <AuditTrailView logs={auditLogs} />
          </>
        )}

        {/* VIEW 2: Deliverable D2 (Our Approach - Business Story) */}
        {activePage === 'approach' && (
          <ApproachStoryPage />
        )}

        {/* VIEW 3: Deliverable D3 (Solution Architecture) */}
        {activePage === 'architecture' && (
          <ArchitecturePage />
        )}

        {/* VIEW 4: Deliverables D5 & D6 (Research & AI Log Documentation Hub) */}
        {activePage === 'docs' && (
          <div className="flex flex-col gap-6">
            {/* Sub-Navigation Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl border border-slate-200 p-2.5 shadow-sm no-print">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveDocSubTab('d5')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                    activeDocSubTab === 'd5'
                      ? 'bg-[#7B1113] text-white shadow-sm ring-1 ring-[#7B1113]'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Banking Research Note (D5)</span>
                </button>

                <button
                  onClick={() => setActiveDocSubTab('d6')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                    activeDocSubTab === 'd6'
                      ? 'bg-[#7B1113] text-white shadow-sm ring-1 ring-[#7B1113]'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  <span>AI Usage Log (D6)</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 hidden md:flex items-center gap-2">
                <span className="font-medium text-slate-700">Source of Truth:</span>
                <span className="font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                  {activeDocSubTab === 'd5' ? 'docs/D5_Banking_Research_Note.md' : 'docs/D6_AI_Usage_Log.md'}
                </span>
              </div>
            </div>

            {/* Render Sub-Page */}
            {activeDocSubTab === 'd5' ? (
              <ResearchNotePage onSwitchToAILog={() => setActiveDocSubTab('d6')} />
            ) : (
              <AIUsageLogPage onSwitchToResearch={() => setActiveDocSubTab('d5')} />
            )}
          </div>
        )}

        {/* VIEW 5: Deliverable D4 (About the Solution) */}
        {activePage === 'about' && (
          <AboutSolutionPage />
        )}

        {/* VIEW 6: Deliverable D4 (FAQ) */}
        {activePage === 'faq' && (
          <FAQPage />
        )}

        {/* VIEW 7: Deliverable D4 (Contact Us) */}
        {activePage === 'contact' && (
          <ContactUsPage />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-3 text-center text-xs text-slate-500 no-print">
        Punjab National Bank · Intelligent Lending Presales POC
      </footer>
    </div>
  );
}
