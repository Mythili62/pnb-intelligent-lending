import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Building2, 
  User, 
  FileText, 
  RotateCcw, 
  ShieldAlert, 
  MessageSquare
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  organisation: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  organisation?: string;
  subject?: string;
  message?: string;
}

export const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    organisation: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedData, setSubmittedData] = useState<ContactFormData | null>(null);
  const [ticketRef, setTicketRef] = useState<string>('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Corporate or personal email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g., name@example.com).';
    }

    // Organisation validation
    if (!formData.organisation.trim()) {
      newErrors.organisation = 'Organisation or financial institution name is required.';
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject line is required.';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Please provide details regarding your inquiry.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Generate simulated ticket reference
    const generatedRef = `INQ-PNB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketRef(generatedRef);
    setSubmittedData({ ...formData });
  };

  const handleReset = () => {
    setSubmittedData(null);
    setTicketRef('');
    setFormData({
      name: '',
      email: '',
      organisation: '',
      subject: '',
      message: '',
    });
    setErrors({});
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#7B1113] via-[#8c1619] to-slate-900 text-white rounded-2xl p-8 shadow-md border-b-4 border-amber-500">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <Mail className="w-3.5 h-3.5" />
            <span>Deliverable D4 · Presales Engagement</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">
            Contact Us & Presales Inquiries
          </h1>
          <p className="text-sm md:text-base text-amber-100/90 leading-relaxed">
            Interested in exploring how agentic AI and lakehouse architectures apply to your bank&apos;s lending portfolio? Connect with our Data & AI presales team.
          </p>
        </div>
      </section>

      {/* Demo Simulation Notice */}
      <section className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-amber-950 font-semibold mb-0.5">
            Demonstration Environment Notice
          </strong>
          <span>
            This contact form operates in simulated demonstration mode. No live backend email gateway is connected, and no personal or corporate information is transmitted over external networks or permanently retained.
          </span>
        </div>
      </section>

      {/* Main Grid: Form on Left, Presales Info on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form or Success Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
          {submittedData ? (
            /* Success State Card */
            <div className="flex flex-col items-center text-center py-6 gap-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Simulated Inquiry Received
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  Thank You, {submittedData.name}!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Your simulated presales inquiry has been successfully captured. In a production deployment, this would trigger an automated notification to your designated Data & AI solution architect.
                </p>
              </div>

              {/* Inquiry Details Summary Box */}
              <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs space-y-2 mt-2">
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Inquiry Ticket ID:</span>
                  <span className="font-mono font-bold text-slate-900">{ticketRef}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Contact Email:</span>
                  <span className="font-semibold text-slate-800">{submittedData.email}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Organisation:</span>
                  <span className="text-slate-800">{submittedData.organisation}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Subject:</span>
                  <span className="text-slate-800 font-medium">{submittedData.subject}</span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-500 block mb-1">Message Recorded:</span>
                  <p className="p-2.5 bg-white rounded border border-slate-200 text-slate-700 font-mono text-[11px]">
                    &quot;{submittedData.message}&quot;
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="mt-2 px-4 py-2 rounded-lg bg-[#7B1113] hover:bg-[#600d0f] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Submit Another Inquiry</span>
              </button>
            </div>
          ) : (
            /* Contact Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Send a Presales Inquiry
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fill in the details below to request a deep dive or customized banking POC walkthrough.
                </p>
              </div>

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="contact-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      placeholder="e.g., Rajesh Sharma"
                      className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1113] ${
                        errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="text-xs font-semibold text-slate-700 block mb-1">
                    Business Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      placeholder="name@bank.com"
                      className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1113] ${
                        errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Organisation & Subject Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-org" className="text-xs font-semibold text-slate-700 block mb-1">
                    Organisation / Institution <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="contact-org"
                      type="text"
                      value={formData.organisation}
                      onChange={(e) => {
                        setFormData({ ...formData, organisation: e.target.value });
                        if (errors.organisation) setErrors({ ...errors, organisation: undefined });
                      }}
                      placeholder="e.g., Punjab National Bank"
                      className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1113] ${
                        errors.organisation ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.organisation && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.organisation}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-700 block mb-1">
                    Inquiry Subject <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        if (errors.subject) setErrors({ ...errors, subject: undefined });
                      }}
                      placeholder="e.g., Request for BigQuery Architecture Deck"
                      className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1113] ${
                        errors.subject ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.subject && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.subject}</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="text-xs font-semibold text-slate-700 block mb-1">
                  Message Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: undefined });
                  }}
                  placeholder="Describe your lending portfolio, current turnaround challenges, or questions regarding our agentic solution..."
                  className={`w-full p-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1113] ${
                    errors.message ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.message && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Fields marked with <span className="text-rose-500">*</span> are mandatory.
                </span>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#7B1113] hover:bg-[#600d0f] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry (Demo)</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Presales Context & Team Highlights (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MessageSquare className="w-4 h-4 text-[#7B1113]" />
              <h3 className="font-bold text-slate-900 text-sm">
                Presales Team Information
              </h3>
            </div>

            <p className="text-slate-600 text-[11px] leading-relaxed">
              This Point-of-View demonstration is curated for the <strong>Business Analyst – Data & AI Presales</strong> role to showcase practical domain problem-solving in Indian retail banking.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Assignment Scope</span>
                <strong className="text-slate-800 text-xs">Retail Salaried Personal Loan Approval</strong>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Cloud Reference</span>
                <strong className="text-slate-800 text-xs">Google Cloud Platform (BigQuery, Vertex AI)</strong>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Governance Standard</span>
                <strong className="text-slate-800 text-xs">Four-Eyes Principle / Maker-Checker Controls</strong>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm text-xs flex flex-col gap-2">
            <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
              Ready for Walkthrough
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Use the <strong>Loan Workbench (D1)</strong> to demonstrate the live 7-stage workflow, <strong>Our Approach (D2)</strong> for executive business storytelling, and <strong>Architecture (D3)</strong> for technical governance questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
