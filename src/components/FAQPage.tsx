import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search,
  CheckCircle2,
  Info
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'Governance' | 'Data & Privacy' | 'Architecture' | 'Credit Policy';
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  statusBadge: 'Current POC Feature' | 'Target Production Architecture';
}

export const FAQPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'Governance',
      question: 'Does AI make the final loan approval decision?',
      shortAnswer: 'No. AI acts as an underwriter copilot; human credit officers retain sole approval authority.',
      detailedAnswer: 'In strict compliance with banking regulations and credit risk governance, AI agents cannot auto-approve or disburse funds. The system synthesizes data, evaluates rule benchmarks, and generates an explainable recommendation. A licensed credit officer must review the case and input a mandatory written underwriting rationale before recording the official decision (Approve, Request Info, or Reject). The simulated disbursement gateway remains software-locked until this human sign-off occurs.',
      statusBadge: 'Current POC Feature',
    },
    {
      id: 'faq-2',
      category: 'Data & Privacy',
      question: 'Is this connected to real Punjab National Bank (PNB) core systems?',
      shortAnswer: 'No. This is an isolated presales demonstration with zero live banking connectivity.',
      detailedAnswer: 'This application runs as a secure, sandboxed Point-of-View demonstration. It has no network connections to live PNB Core Banking Systems (CBS), Finacle databases, or production banking networks. All data is processed locally in the browser memory using deterministic simulation models.',
      statusBadge: 'Current POC Feature',
    },
    {
      id: 'faq-3',
      category: 'Data & Privacy',
      question: 'Are the applicant profiles and credit scores real?',
      shortAnswer: 'No. All applicants, financial records, and bureau reports are 100% synthetic.',
      detailedAnswer: 'The three applicants (Priya Sharma, Rajesh Kumar, and Amit Verma) are synthetic personas designed to test specific underwriting paths: straightforward prime approval, borderline review due to debt obligations, and knockout rejection. All associated PAN numbers, Aadhaar tokens, salary slips, bank balances, and CIBIL credit scores are simulated. No actual customer data is accessed or stored.',
      statusBadge: 'Current POC Feature',
    },
    {
      id: 'faq-4',
      category: 'Credit Policy',
      question: 'Are the credit evaluation rules official PNB policies?',
      shortAnswer: 'No. The rules are standard illustrative banking benchmarks used for simulation.',
      detailedAnswer: 'The criteria evaluated in the demo—such as a ₹25,000 minimum net monthly salary, a maximum 50.0% Fixed Obligation to Income Ratio (FOIR), and a 720+ prime CIBIL threshold—represent recognized retail banking credit benchmarks. They are clearly labeled as illustrative models and do not represent official proprietary Punjab National Bank credit policies or underwriting manuals.',
      statusBadge: 'Current POC Feature',
    },
    {
      id: 'faq-5',
      category: 'Governance',
      question: 'How are the AI recommendations explained to the underwriter?',
      shortAnswer: 'Through transparent audit checklists and verified formulas, with zero black-box percentages.',
      detailedAnswer: 'Every recommendation is accompanied by an audit matrix displaying the exact rule benchmark, the observed value from the applicant data, and a clear status (Passed, Review Required, or Knockout). Mathematical calculations—such as Reducing-Balance EMI and FOIR—are explicitly calculated and displayed with their underlying formulas. The system intentionally avoids arbitrary black-box confidence scores (e.g., "94% confidence"), opting instead for deterministic, auditable banking logic.',
      statusBadge: 'Current POC Feature',
    },
    {
      id: 'faq-6',
      category: 'Credit Policy',
      question: 'What happens when documents are missing or salary variance is detected?',
      shortAnswer: 'The system flags document discrepancies and routes the file for underwriter review.',
      detailedAnswer: 'In Stage 2 (Document Verification), the OCR parser cross-references net take-home salary across submitted pay slips. If fewer than 3 pay slips are provided (as seen in Amit Verma\'s file) or if salary variance exceeds tolerance limits (as in Rajesh Kumar\'s file), the stage status transitions to "Review Required" or "Knockout". This alerts the credit officer to request supplementary documentation or apply underwriter stipulations before sanction.',
      statusBadge: 'Current POC Feature',
    },
    {
      id: 'faq-7',
      category: 'Architecture',
      question: 'How are policy changes and circular updates handled in the architecture?',
      shortAnswer: 'Through a centralized vector lakehouse rather than modifying application code.',
      detailedAnswer: 'In the target Google Cloud architecture, new RBI circulars and internal bank credit policy manuals are ingested into Google Cloud Storage, parsed, and indexed in BigQuery / Vertex AI Vector Search. When an agent evaluates an application, it performs a real-time semantic lookup against the latest indexed policy chunks. This decouples credit policy updates from software code changes, ensuring immediate enterprise-wide compliance.',
      statusBadge: 'Target Production Architecture',
    },
    {
      id: 'faq-8',
      category: 'Architecture',
      question: 'Is Google BigQuery currently connected in this demonstration?',
      shortAnswer: 'No. The current demonstration uses local mock data; BigQuery is the target cloud design.',
      detailedAnswer: 'The current prototype operates with local in-memory synthetic datasets to provide an instant, zero-latency experience during presales presentations. BigQuery is architected as the target enterprise lakehouse (as detailed in Deliverables D2 and D3), and synthetic schema tables have been designed for Phase 5 cloud ingestion.',
      statusBadge: 'Target Production Architecture',
    },
    {
      id: 'faq-9',
      category: 'Architecture',
      question: 'What would be required for a full production deployment at a bank?',
      shortAnswer: 'Secure enterprise VPC connectors, live bureau gateways, and certified HSM signing.',
      detailedAnswer: 'Transitioning to full production requires: (1) Secure VPC peering between Google Cloud and the bank\'s on-premise Finacle/CBS core; (2) Certified Document AI pipelines trained on regional Indian pay slip formats; (3) Production API connectors to TransUnion CIBIL, Experian, and Account Aggregator ecosystems; (4) Hardware Security Module (HSM) digital signatures for sanction letters; and (5) Strict role-based IAM access control integrated with bank Active Directory/SSO.',
      statusBadge: 'Target Production Architecture',
    },
  ];

  const categories = ['ALL', 'Governance', 'Data & Privacy', 'Credit Policy', 'Architecture'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'ALL' || faq.category === selectedCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.shortAnswer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.detailedAnswer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#7B1113] via-[#8c1619] to-slate-900 text-white rounded-2xl p-8 shadow-md border-b-4 border-amber-500">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Deliverable D4 · Frequently Asked Questions</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-sm md:text-base text-amber-100/90 leading-relaxed">
            Clear, transparent answers on solution architecture, data governance, underwriting explainability, and the boundaries between this demonstration and production banking systems.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1113] focus:border-[#7B1113]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#7B1113] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Accordion List */}
      <section className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-400">
            No questions matched your search criteria. Try a different keyword or category.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;

            return (
              <div
                key={faq.id}
                className={`bg-white rounded-xl border transition-all ${
                  isExpanded ? 'border-slate-300 shadow-sm ring-1 ring-slate-200' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-4 flex items-start justify-between text-left gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      Q
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">
                          {faq.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          faq.statusBadge === 'Current POC Feature'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {faq.statusBadge}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">
                        {faq.question}
                      </h3>
                      {!isExpanded && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          {faq.shortAnswer}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-slate-400 shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Expanded Answer Panel */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-1 border-t border-slate-100 text-xs text-slate-700 space-y-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-medium text-slate-800 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#7B1113] shrink-0 mt-0.5" />
                      <span>{faq.shortAnswer}</span>
                    </div>

                    <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed pl-1">
                      {faq.detailedAnswer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Bottom Summary Callout */}
      <section className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            Need additional technical or business details for your presales meeting? Use our <strong>Contact Us</strong> page to request customized architectural walkthroughs.
          </span>
        </div>
      </section>
    </div>
  );
};
