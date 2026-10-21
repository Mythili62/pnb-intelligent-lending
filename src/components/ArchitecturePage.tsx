import React, { useState } from 'react';
import { 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Info, 
  CheckCircle2 
} from 'lucide-react';

interface LayerCardProps {
  layerNumber: number;
  title: string;
  category: string;
  techStack: string[];
  description: string;
  connectionToD1: string;
  isActive: boolean;
  onClick: () => void;
}

const LayerCard: React.FC<LayerCardProps> = ({
  layerNumber,
  title,
  category,
  techStack,
  description,
  connectionToD1,
  isActive,
  onClick,
}) => (
  <div 
    onClick={onClick}
    className={`p-4 rounded-xl border transition-all cursor-pointer ${
      isActive 
        ? 'border-[#7B1113] bg-white ring-2 ring-[#7B1113]/20 shadow-md' 
        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
        LAYER {layerNumber}
      </span>
      <span className="text-[11px] text-slate-400 font-medium">{category}</span>
    </div>

    <h3 className="font-bold text-sm text-slate-900 mb-1">{title}</h3>
    <p className="text-xs text-slate-600 line-clamp-2 mb-3">{description}</p>

    <div className="flex flex-wrap gap-1 mb-2">
      {techStack.map((tech, i) => (
        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
          {tech}
        </span>
      ))}
    </div>

    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-[#7B1113] font-medium flex items-center gap-1">
      <CheckCircle2 className="w-3 h-3 text-[#7B1113]" />
      <span>{connectionToD1}</span>
    </div>
  </div>
);

export const ArchitecturePage: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<number>(4);

  const layersData = [
    {
      layerNumber: 1,
      title: 'Enterprise Data Sources',
      category: 'Client Core Systems',
      techStack: ['Finacle / CBS', 'Cloud Storage', 'External APIs'],
      description: 'Houses structured core banking records (accounts, repayment track), unstructured documents (salary slips, ITRs, circulars), and external bureau/verification services.',
      connectionToD1: 'Supplies the data modeled in syntheticApplicants.ts (Priya, Rajesh, Amit profiles).',
      targetGCPService: 'Core Banking RDBMS, GCS Document Buckets, CIBIL Gateway APIs',
      currentPrototypeMode: 'Deterministic synthetic JSON objects structured to mirror production schema.',
      dataFlowSummary: 'Raw documents, transactions, and bureau payloads are pushed into the ingestion queue.',
    },
    {
      layerNumber: 2,
      title: 'Ingestion & Transformation Pipeline',
      category: 'Data Engineering',
      techStack: ['Google Cloud Dataflow', 'Cloud Pub/Sub', 'Document AI'],
      description: 'Parses unstructured PDFs via Document AI OCR, validates schema integrity, reconciles customer identity tokens, and streams structured records into the lakehouse.',
      connectionToD1: 'Maps to Stage 2 in D1: Document Verification and salary variance detection.',
      targetGCPService: 'Document AI OCR, Cloud Run workers, Dataflow batch/stream pipelines',
      currentPrototypeMode: 'Local OCR parse simulation tracking slips count, detected net pay, and salary variance.',
      dataFlowSummary: 'Extracts clean JSON key-values from PDF pay slips and loads them into BigQuery tables.',
    },
    {
      layerNumber: 3,
      title: 'BigQuery Lakehouse Layer',
      category: 'Enterprise Knowledge',
      techStack: ['Google BigQuery', 'Vertex Feature Store', 'Vector Search'],
      description: 'The single source of truth: consolidates applicant profiles, trade lines, credit history, feature embeddings, and vector-indexed credit policy circulars.',
      connectionToD1: 'Backing data model for Stages 3, 4, and 5 in D1.',
      targetGCPService: 'BigQuery Analytics Tables, Vertex AI Vector Search for policy circular retrieval',
      currentPrototypeMode: 'Local in-memory data store with clear BigQuery target schema defined.',
      dataFlowSummary: 'Stores relational tables and semantic embeddings for high-speed sub-second queries by AI agents.',
    },
    {
      layerNumber: 4,
      title: 'Agent Orchestration & Core Agents',
      category: 'Agentic Core (Page 6 Reference)',
      techStack: ['FastAPI Runner', 'Gemini / Claude', 'LangGraph / Workflow Engine'],
      description: 'A multi-agent runner orchestrating specialized agents: Document Agent, Bureau Agent, Policy Agent, and Risk Synthesizer. Manages state, session events, and context memory.',
      connectionToD1: 'Executes Stages 1 through 6 in D1 when user clicks "Run Assessment".',
      targetGCPService: 'FastAPI on Cloud Run, Vertex AI Gemini 1.5 Pro / Claude 3.5 Sonnet, LangGraph',
      currentPrototypeMode: 'Deterministic step-by-step TypeScript simulation with exact banking formula evaluation.',
      dataFlowSummary: 'Receives application ID, queries BigQuery via tools, evaluates policy rules, and builds recommendation.',
    },
    {
      layerNumber: 5,
      title: 'Tool Box & Mock Integrations',
      category: 'Tool & Protocol Layer',
      techStack: ['Model Context Protocol (MCP)', 'OpenAPI Specs', 'Database Connectors'],
      description: 'Standardized interfaces allowing agents to call external systems securely: SQL queries on BigQuery, simulated CIBIL credit score lookups, and DigiLocker identity verification.',
      connectionToD1: 'Powers the evidence grounding tokens in D1 (CIR-CIBIL-SIM, SHA256 hashes).',
      targetGCPService: 'Cloud Endpoints, Cloud Functions, Secret Manager for API keys',
      currentPrototypeMode: 'Mock service stubs returning realistic Indian bureau scores, DPDs, and enquiry counts.',
      dataFlowSummary: 'Agents invoke tools using structured JSON inputs and receive verified evidence payloads.',
    },
    {
      layerNumber: 6,
      title: 'Credit Officer Workstation & UI',
      category: 'Frontend & Application',
      techStack: ['React', 'Vite', 'TypeScript', 'Tailwind CSS'],
      description: 'An executive-grade web frontend providing an interactive workbench: loan restructuring sliders, real-time stage progress, explainable recommendation cards, and decision controls.',
      connectionToD1: 'The primary user interface built in D1 (Workbench, Stepper, and Officer Panel).',
      targetGCPService: 'Google Cloud Run / Firebase Hosting / CDN',
      currentPrototypeMode: 'Fully functional, responsive React client running locally on Vite.',
      dataFlowSummary: 'Displays real-time assessment findings to the underwriter and sends recorded decisions to the audit trail.',
    },
    {
      layerNumber: 7,
      title: 'Governance, Audit & Human Approval (HIL)',
      category: 'Compliance & Safety',
      techStack: ['Firestore Audit Log', 'Confidence Gate', 'Four-Eyes Principle'],
      description: 'Ensures strict compliance with banking regulations. Interrupts automated pipelines when confidence thresholds or policy anomalies are detected. Disallows auto-disbursement.',
      connectionToD1: 'Enforces mandatory officer rationale and locks the Simulated Disbursement Gateway in D1.',
      targetGCPService: 'Firestore for immutable audit records, Cloud KMS for digital signatures',
      currentPrototypeMode: 'Active in-app audit trail and hard-locked simulated disbursement button.',
      dataFlowSummary: 'Captures underwriter employee ID, decision, and rationale into an immutable audit table.',
    },
  ];

  const activeLayer = layersData.find(l => l.layerNumber === selectedLayer) ?? layersData[3];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#7B1113] text-white rounded-2xl p-8 shadow-md border-b-4 border-amber-500">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <Layers className="w-3.5 h-3.5" />
            <span>Deliverable D3 · Technical Solution Architecture</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">
            Agentic + Data Platform: Technical Architecture
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Detailed technical blueprint mapping the 7 architectural layers from the assignment's reference architecture (page 6) to Google Cloud services and our interactive lending demonstration.
          </p>
        </div>
      </section>

      {/* Target vs Prototype Status Banner */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-slate-900 block text-xs">
              Architecture Status: Target Cloud Architecture vs. Current Prototype
            </strong>
            <p className="text-slate-600 text-[11px]">
              This architecture depicts the full production design on Google Cloud (BigQuery, Cloud Run, Vertex AI). The current demonstration executes as a <strong>deterministic local simulation</strong> using synthetic data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] uppercase tracking-wider">
            GCP Target Model
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase tracking-wider">
            Local POC Active
          </span>
        </div>
      </section>

      {/* End-to-End Directional Data Flow Diagram */}
      <section className="bg-slate-950 text-white rounded-xl p-6 border border-slate-800 shadow-sm">
        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
          End-to-End Directional Data Flow
        </div>
        <h2 className="text-base font-bold text-white mb-4">
          How Data Travels from Ingestion to Sanction
        </h2>

        {/* Visual Pipeline with Directional Arrows */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center text-xs">
          {/* Node 1 */}
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center flex flex-col justify-between h-28">
            <span className="text-[10px] font-mono text-slate-500">01 / SOURCES</span>
            <div className="font-bold text-slate-200 text-[11px]">Core CBS & Documents</div>
            <span className="text-[10px] text-slate-400">PDFs · Accounts · Bureau</span>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:flex justify-center text-amber-400">
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </div>

          {/* Node 2 */}
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center flex flex-col justify-between h-28">
            <span className="text-[10px] font-mono text-slate-500">02 / INGESTION</span>
            <div className="font-bold text-slate-200 text-[11px]">Document AI & ETL</div>
            <span className="text-[10px] text-slate-400">OCR · Dataflow · Pub/Sub</span>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:flex justify-center text-amber-400">
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </div>

          {/* Node 3 */}
          <div className="bg-slate-900 p-3 rounded-lg border border-amber-500/50 text-center flex flex-col justify-between h-28 shadow-sm">
            <span className="text-[10px] font-mono text-amber-400">03 / LAKEHOUSE</span>
            <div className="font-bold text-amber-200 text-[11px]">Google BigQuery</div>
            <span className="text-[10px] text-slate-300">Tables · Embeddings</span>
          </div>

          {/* Arrow 3 */}
          <div className="hidden md:flex justify-center text-amber-400">
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </div>

          {/* Node 4 */}
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center flex flex-col justify-between h-28">
            <span className="text-[10px] font-mono text-slate-500">04 / AGENTS</span>
            <div className="font-bold text-slate-200 text-[11px]">Agent Runner & Tools</div>
            <span className="text-[10px] text-slate-400">FastAPI · Gemini · MCP</span>
          </div>
        </div>

        {/* Second Row of Flow: Agents -> HIL -> Officer -> Disbursement */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-7 gap-2 items-center text-xs">
          <div className="hidden md:block"></div>
          <div className="hidden md:block"></div>
          <div className="hidden md:block"></div>

          {/* Arrow Down/Right */}
          <div className="hidden md:flex justify-center text-amber-400">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Node 5 */}
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center flex flex-col justify-between h-28">
            <span className="text-[10px] font-mono text-slate-500">05 / GOVERNANCE</span>
            <div className="font-bold text-slate-200 text-[11px]">Confidence & HIL Gate</div>
            <span className="text-[10px] text-slate-400">Interrupt · Rules</span>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex justify-center text-amber-400">
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </div>

          {/* Node 6 */}
          <div className="bg-slate-900 p-3 rounded-lg border border-emerald-500/50 text-center flex flex-col justify-between h-28">
            <span className="text-[10px] font-mono text-emerald-400">06 / OFFICER</span>
            <div className="font-bold text-emerald-200 text-[11px]">Human Credit Officer</div>
            <span className="text-[10px] text-slate-300">Review · Sanction · Audit</span>
          </div>
        </div>
      </section>

      {/* The 7 Interactive Layers Breakdown */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6">
        <div>
          <div className="text-xs font-bold text-[#7B1113] uppercase tracking-wider mb-1">
            Component Breakdown (Click any layer to inspect)
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            The Seven Architectural Layers & D1 Implementation Mapping
          </h2>
        </div>

        {/* 7 Layer Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {layersData.map((layer) => (
            <LayerCard
              key={layer.layerNumber}
              layerNumber={layer.layerNumber}
              title={layer.title}
              category={layer.category}
              techStack={layer.techStack}
              description={layer.description}
              connectionToD1={layer.connectionToD1}
              isActive={selectedLayer === layer.layerNumber}
              onClick={() => setSelectedLayer(layer.layerNumber)}
            />
          ))}
        </div>

        {/* Deep Dive Panel for the Selected Layer */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#7B1113] text-white flex items-center justify-center font-bold text-xs">
                {activeLayer.layerNumber}
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Layer {activeLayer.layerNumber}: {activeLayer.title}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Category: {activeLayer.category}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <strong className="text-slate-800 block text-xs mb-1">Target GCP Architecture Service</strong>
              <p className="text-slate-600 font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                {activeLayer.targetGCPService}
              </p>
              <p className="text-[11px] text-slate-500 mt-2">
                Production deployment uses Google Cloud managed services for infinite scalability and bank-grade data isolation.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <strong className="text-slate-800 block text-xs mb-1">Current Prototype Implementation</strong>
              <p className="text-slate-600 font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                {activeLayer.currentPrototypeMode}
              </p>
              <p className="text-[11px] text-slate-500 mt-2">
                Implemented cleanly in React/TypeScript to guarantee reliable, zero-latency execution in live presales meetings.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <strong className="text-slate-800 block text-xs mb-1">Direct Connection to Working D1 Demo</strong>
              <p className="text-[#7B1113] font-semibold text-[11px] bg-red-50/50 p-2 rounded border border-red-100">
                {activeLayer.connectionToD1}
              </p>
              <p className="text-[11px] text-slate-500 mt-2">
                Data flow: {activeLayer.dataFlowSummary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reference Architecture Alignment Callout */}
      <section className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <strong className="text-amber-400 block text-sm mb-1">
            Alignment with Assignment Reference Architecture (Page 6)
          </strong>
          <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
            This design faithfully mirrors all core components of the assignment’s reference diagram: the <strong>Agent Runner (uvicorn/FastAPI)</strong>, <strong>Context Memory</strong>, <strong>Tool Box with MCP</strong>, <strong>Confidence Scoring Interrupt</strong>, and <strong>Firestore HIL Storage</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-800 text-amber-300 px-3 py-2 rounded-lg border border-slate-700 shrink-0">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Complies with Banking Presales BA Standards</span>
        </div>
      </section>
    </div>
  );
};
