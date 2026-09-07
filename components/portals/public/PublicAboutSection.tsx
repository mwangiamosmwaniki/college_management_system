'use client';

import React from 'react';
import Image from 'next/image';
import {
  Building2,
  Globe,
  ShieldCheck,
  CheckCircle2,
  Award,
  Users,
  Briefcase,
  Compass,
  Cpu,
  Wrench,
  Utensils,
  Leaf,
  ChevronRight,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';
import { KENYAN_COLLEGE_INFO } from '@/lib/kenyan-tvet-data';

interface PublicAboutSectionProps {
  onApplyClick: () => void;
  onExploreCoursesClick: () => void;
}

export function PublicAboutSection({
  onApplyClick,
  onExploreCoursesClick
}: PublicAboutSectionProps) {
  return (
    <div className="bg-slate-50 text-slate-800 space-y-16 py-12 sm:py-16">
      
      {/* 1. Page Header & Institutional Identity Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider font-mono">
            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>National TVET Institution • Reg. {KENYAN_COLLEGE_INFO.regNumber}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            About {KENYAN_COLLEGE_INFO.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Pioneering practical, competency-based technical and vocational excellence since {KENYAN_COLLEGE_INFO.charterYear}. Preparing Kenya’s youth for the modern industrialized workforce.
          </p>
        </div>
      </div>

      {/* 2. Institutional Heritage & Principal's Welcome Address */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 lg:p-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Principal Photo & Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 border border-slate-200 shadow-md group">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80"
                  alt={KENYAN_COLLEGE_INFO.principalName}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block font-mono">
                    Chief Executive Officer
                  </span>
                  <h3 className="font-bold text-base sm:text-lg">{KENYAN_COLLEGE_INFO.principalName}</h3>
                  <p className="text-xs text-slate-300">Principal & Member of College Council</p>
                </div>
              </div>
            </div>

            {/* Principal's Speech & Heritage */}
            <div className="lg:col-span-8 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                Principal&apos;s Welcome Message
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                &ldquo;Technical Skills are the Engine of National Transformation&rdquo;
              </h2>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  Welcome to {KENYAN_COLLEGE_INFO.name}. For over four decades, our institution has stood as a beacon of applied technical education in Kenya and the greater East African community.
                </p>
                <p>
                  In alignment with the TVET Act No. 29 of 2013 and the Competency-Based Education and Training (CBET) framework, we have shifted beyond traditional rote examination into hands-on craftsmanship. Our trainees spend 60% of their learning in modern workshops, industrial computer laboratories, and direct 12-week industrial attachments with our industry partners.
                </p>
                <p>
                  Whether you are joining through government placement (KUCCPS) with capitation support or enrolling directly as a self-sponsored student, our faculty is dedicated to equipping you with verifiable, market-demanded capabilities.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-4 border-t border-slate-100">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{KENYAN_COLLEGE_INFO.principalName}</div>
                  <div className="text-xs text-slate-500">Principal, {KENYAN_COLLEGE_INFO.name}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Mission, Vision, and Core Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
            Institutional Compass
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Our Mission, Vision & Guiding Values
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mission */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To provide accessible, high-quality, competency-based technical and vocational training that produces industry-competent, ethical, and innovative professionals ready for Kenya’s Vision 2030 and global workforce demands.
            </p>
          </div>

          {/* Vision */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To be the premier national polytechnic and centre of excellence in applied engineering, computing technologies, green agriculture, and entrepreneurial innovation in the East African region.
            </p>
          </div>

          {/* Core Values */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Core Values</h3>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Integrity & Discipline:</strong> Exemplary institutional ethics.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Technical Competence:</strong> Practical, hands-on mastery.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Inclusivity & Equity:</strong> Open opportunity for every trainee.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Innovation & Industry:</strong> Direct partnership attachments.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Leadership & Institutional Governance */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
            College Administration
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Executive Leadership & Academic Council
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Governed by seasoned academic leaders, licensed professional engineers, and finance administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              PR
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">{KENYAN_COLLEGE_INFO.principalName}</h4>
              <p className="text-xs text-emerald-700 font-semibold">Principal & Chief Executive</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ph.D in Engineering, EBK Registered Consulting Engineer. Spearheads strategic partnerships, TVETA accreditation, and institutional development.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
              REG
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">{KENYAN_COLLEGE_INFO.registrarName}</h4>
              <p className="text-xs text-blue-700 font-semibold">Academic Registrar</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              M.Ed in Curriculum Studies. Oversees KUCCPS admissions, KNEC & TVET CDACC examination registration, student records, and graduation rosters.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              BUR
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">{KENYAN_COLLEGE_INFO.bursarName}</h4>
              <p className="text-xs text-amber-700 font-semibold">Institutional Bursar / Finance Head</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              CPA-K, ICPAK Member. Enforces public finance segregation of duties, M-Pesa automated reconciliation, HELB capitation, and bursary disbursements.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm">
              DOS
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">{KENYAN_COLLEGE_INFO.deanOfStudents}</h4>
              <p className="text-xs text-purple-700 font-semibold">Dean of Trainees</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ph.D in Educational Psychology. Oversees trainee welfare, career mentoring, hostel accommodation, clubs, athletics, and student leadership councils.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Campus Facilities & State-of-the-Art Workshops */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
            World-Class Infrastructure
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Training Workshops & Laboratories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Industry-grade equipment configured for practical CBET competencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Computing & Cyber Labs</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              3 state-of-the-art computer labs equipped with high-speed fiber internet, dedicated Linux servers, Cisco routing racks, and cyber defense sandbox networks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Electrical & Mechatronics Bay</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              EPRA-certified 3-phase electrical wiring booths, industrial PLC automation units, solar PV testing rigs, and motor rewinding workshops.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Automotive Diagnostic Center</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Modern vehicle hydraulic lifts, computerized OBD-II engine scanners, electronic fuel injection (EFI) test benches, and heavy plant bays.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Commercial Culinary Suite</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Industry-standard demonstration kitchen, pastry bakery ovens, mock restaurant banqueting hall, and barista training stations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Nakuru Agricultural Demo Farm</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              15-acre smart greenhouse drip irrigation systems, hydroponic fodder demonstrations, dairy cattle units, and soil testing laboratory.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Civil & Materials Testing Lab</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Concrete compression testing machines, survey total stations and GPS theodolites, soil compaction rigs, and architectural CAD suites.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Accreditations & Key Corporate Partners */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              National Accreditation & Linkages
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Trusted by National Examining Boards & Industry
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Our qualifications are recognized locally and internationally, giving graduates an immediate competitive edge in the job market.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="font-bold text-emerald-400 text-sm">TVETA</div>
              <div className="text-[10px] text-slate-400">National Authority</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="font-bold text-blue-400 text-sm">KNEC</div>
              <div className="text-[10px] text-slate-400">Examining Council</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="font-bold text-amber-400 text-sm">TVET CDACC</div>
              <div className="text-[10px] text-slate-400">CBET Assessment</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="font-bold text-purple-400 text-sm">NITA</div>
              <div className="text-[10px] text-slate-400">Industrial Training</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="font-bold text-teal-400 text-sm">KASNEB</div>
              <div className="text-[10px] text-slate-400">Finance & Accounting</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="font-bold text-cyan-400 text-sm">KUCCPS</div>
              <div className="text-[10px] text-slate-400">Govt Placement</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Call To Action Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to Build Your Technical Career?</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Apply for our May & September 2026 intakes today. Direct online applications take less than 10 minutes with instant SMS confirmation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onApplyClick}
              className="px-6 py-3 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Start Online Application
            </button>
            <button
              onClick={onExploreCoursesClick}
              className="px-5 py-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/60 text-white border border-emerald-400/40 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
