'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Building2,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { KENYAN_COLLEGE_INFO } from '@/lib/kenyan-tvet-data';

export function PublicContactSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: 'ADMISSIONS',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      // Keep feedback visible
    }, 4000);
  };

  const faqs = [
    {
      q: 'How do I confirm my KUCCPS placement to the college?',
      a: 'KUCCPS publishes placement lists directly to our admissions portal. You can confirm your admission status by visiting the Admissions tab, clicking "Start Online Application", and entering your KCSE Index Number. Your provisional admission letter will be ready for download.'
    },
    {
      q: 'How does Lipa na M-Pesa automated fee reconciliation work?',
      a: 'Pay tuition and application fees via PayBill 247247 using your unique Admission Number or Application Reference as the Account Number. Our system receives the Safaricom M-Pesa instant webhook, reconciles your ledger, and generates an official institutional receipt within 30 seconds.'
    },
    {
      q: 'Are government capitation subsidies and HELB loans available?',
      a: 'Yes. All Kenyan citizens placed through KUCCPS receive KES 30,000 annual Government Capitation. Additionally, trainees can apply for HELB TVET tuition loans and upkeep bursaries. Our Dean of Trainees office provides physical and online assistance for HELB submissions.'
    },
    {
      q: 'Does the college provide on-campus hostel accommodation?',
      a: 'Yes, the Nairobi Main Campus has 4 modern hostel blocks with 24/7 security, high-speed Wi-Fi, and hot water. Spaces are booked during admissions registration on a first-come, first-served basis. Verified private off-campus hostels are also inspected by our Trainee Welfare Office.'
    },
    {
      q: 'When do industrial attachments take place?',
      a: 'Every diploma and craft certificate trainee completes a mandatory 12-week supervised industrial attachment during their 2nd year. The College Industrial Liaison Office partners with over 150 organizations across Kenya to facilitate placement and NITA insurance coverage.'
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-800 space-y-16 py-12 sm:py-16">
      
      {/* 1. Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider font-mono">
            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Multi-Campus Network & Administrative Helpdesk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contact & Visit Our Campuses
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Our admissions counselors, student welfare coordinators, and department heads are available across three modern campuses in Nairobi and Nakuru.
          </p>
        </div>
      </div>

      {/* 2. Campus Locations Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Nairobi Campus */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Main Campus
              </span>
              <span className="text-xs text-slate-400 font-mono">Nairobi</span>
            </div>
            <h3 className="font-extrabold text-xl text-slate-900">Nairobi Main Campus</h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Off Ngong Road, Dagoretti Corner, P.O. Box 54890-00200 Nairobi</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-mono font-semibold text-slate-800">+254 (0) 20 234 5678</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-mono">admissions@tvetcollege.ac.ke</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Mon–Fri: 8:00 AM – 5:00 PM • Sat: 9:00 AM – 1:00 PM</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
              <strong>Public Transit:</strong> Matatu Route 111, 2, 4W from Nairobi CBD Railway Bus Station.
            </div>
          </div>

          {/* CBD Town Campus */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                Town Centre
              </span>
              <span className="text-xs text-slate-400 font-mono">Nairobi CBD</span>
            </div>
            <h3 className="font-extrabold text-xl text-slate-900">CBD Town Campus</h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>Technical Plaza, 4th–6th Floor, Haile Selassie Avenue, Nairobi</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="font-mono font-semibold text-slate-800">+254 722 000 111</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="font-mono">towncampus@tvetcollege.ac.ke</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Mon–Fri: 7:00 AM – 8:00 PM • Sat: 8:00 AM – 4:00 PM</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
              <strong>Focus:</strong> Evening & weekend business, computing, and KASNEB CPA classes for working professionals.
            </div>
          </div>

          {/* Nakuru Western Campus */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Rift Valley
              </span>
              <span className="text-xs text-slate-400 font-mono">Nakuru</span>
            </div>
            <h3 className="font-extrabold text-xl text-slate-900">Nakuru Western Campus</h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>Section 58, Along Nakuru-Nairobi Highway, P.O. Box 1204 Nakuru</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-mono font-semibold text-slate-800">+254 733 999 888</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-mono">nakuru@tvetcollege.ac.ke</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Mon–Fri: 8:00 AM – 5:00 PM • Sat: 9:00 AM – 1:00 PM</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
              <strong>Focus:</strong> Agri-tech green farming, mechanical engineering plant workshops, and automotive bays.
            </div>
          </div>

        </div>
      </div>

      {/* 3. Interactive Contact Form & Administrative Direct Lines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                Direct Communication
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Send an Administrative Inquiry</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your message is routed directly to the designated department officer for resolution.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 text-center animate-in fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-emerald-900">Inquiry Received Successfully</h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Thank you, <strong>{formData.fullName}</strong>. Your ticket has been assigned to the <strong>{formData.department}</strong> department. An admissions officer will contact you at <strong>{formData.phone}</strong> or <strong>{formData.email}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      fullName: '',
                      email: '',
                      phone: '',
                      department: 'ADMISSIONS',
                      subject: '',
                      message: ''
                    });
                  }}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Kelvin Kipchumba"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Phone Number (Safaricom/Airtel) *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 0712 345 678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. kelvin@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Target Directorate / Department *</label>
                    <select
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
                    >
                      <option value="ADMISSIONS">Admissions & KUCCPS Placement</option>
                      <option value="BURSAR">Bursar & M-Pesa Fee Clearance</option>
                      <option value="EXAMINATIONS">Examinations Directorate (KNEC / CDACC)</option>
                      <option value="REGISTRAR">Academic Registrar (Certificates / Transcripts)</option>
                      <option value="ATTACHMENT">Industrial Liaison & Attachment</option>
                      <option value="GENERAL">General Inquiries</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Subject / Course of Interest *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. May Intake Diploma in Electrical Engineering"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Message / Inquiry Details *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry, KCSE mean grade, or assistance required..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Direct Hotlines & Lipa na M-Pesa Verification */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Hotlines Card */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
              <h4 className="font-bold text-base text-emerald-400">Emergency & Direct Desk Lines</h4>
              
              <div className="space-y-3 text-xs divide-y divide-slate-800">
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-400">Admissions Registrar</span>
                  <span className="font-mono font-bold text-white">+254 722 100 200</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-400">Bursar & Finance Office</span>
                  <span className="font-mono font-bold text-white">+254 722 100 201</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-400">Examinations Desk</span>
                  <span className="font-mono font-bold text-white">+254 722 100 202</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-400">Dean of Trainees & Hostels</span>
                  <span className="font-mono font-bold text-white">+254 722 100 203</span>
                </div>
              </div>
            </div>

            {/* M-Pesa Security Warning */}
            <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Anti-Fraud Advisory</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-950">
                {KENYAN_COLLEGE_INFO.name} does <strong>NOT</strong> accept personal cash or payments to personal mobile phone numbers. All institutional fees must strictly be remitted via <strong>Lipa na M-Pesa PayBill 247247</strong>.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* 4. Frequently Asked Questions Accordion */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
            Clear Answers
          </span>
          <h3 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
