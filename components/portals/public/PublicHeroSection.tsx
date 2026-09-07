'use client';

import React from 'react';
import Image from 'next/image';
import { motion, type Variants } from 'motion/react';
import {
  Sparkles,
  Briefcase,
  UserPlus,
  ArrowRight,
  Award,
  CheckCircle2,
  Download,
  ShieldCheck,
  Search
} from 'lucide-react';
import { KENYAN_COLLEGE_INFO } from '@/lib/kenyan-tvet-data';

interface PublicHeroSectionProps {
  onApplyClick: () => void;
  onExploreCoursesClick: () => void;
  onDownloadProspectus: () => void;
  onStudentLogin: () => void;
  onStaffLogin: () => void;
  institutionalName: string;
  heroBackgroundImage?: string;
}

// Framer Motion Animation Variants for Staggered Sequence
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const headlineVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const subHeadlineVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const actionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const metricsVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const heroImageCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 38 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: 0.22,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function PublicHeroSection({
  onApplyClick,
  onExploreCoursesClick,
  onDownloadProspectus,
  institutionalName,
  heroBackgroundImage = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80'
}: PublicHeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden py-16 sm:py-20 lg:py-28 border-b border-slate-800">
      
      {/* 1. HERO BACKGROUND IMAGE WITH SMOOTH ENTRANCE & MULTI-TIER OVERLAYS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {/* Animated Background Canvas */}
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.28 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full"
        >
          <Image
            src={heroBackgroundImage}
            alt="Technical Institute Modern Engineering Campus"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Cinematic multi-tier gradients ensuring AAA contrast for text */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
        
        {/* Subtle grid and ambient lights */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-emerald-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Staggered Entrance for Headline, Sub-headline, Actions & Metrics */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6"
          >
            
            {/* 1. Admission Alert Badge */}
            <motion.div variants={badgeVariants}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>2026/2027 KUCCPS & Direct Self-Sponsored Intakes Open</span>
              </div>
            </motion.div>

            {/* 2. Primary Headline with Staggered Entrance Animation */}
            <motion.h1
              variants={headlineVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]"
            >
              Skills for Industry, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Technology & Innovation.
              </span>
            </motion.h1>

            {/* 3. Sub-Headline with Staggered Entrance Animation */}
            <motion.p
              variants={subHeadlineVariants}
              className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal"
            >
              {institutionalName} delivers market-driven, competency-based Diploma, Craft Certificate, and Artisan qualifications in Computing, Engineering, Building Sciences, Business, and Hospitality accredited by TVETA, KNEC, and TVET CDACC.
            </motion.p>

            {/* 4. Action Buttons with Staggered Entrance Animation */}
            <motion.div
              variants={actionVariants}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <button
                id="btn_hero_apply_now"
                onClick={onApplyClick}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition-all min-h-[44px] cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Apply for 2026 Intake</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn_hero_explore_courses"
                onClick={onExploreCoursesClick}
                className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 active:bg-slate-800 text-white border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all min-h-[44px] cursor-pointer"
              >
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Browse Programmes</span>
              </button>

              <button
                id="btn_hero_download_prospectus"
                onClick={onDownloadProspectus}
                className="px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Prospectus (PDF)</span>
              </button>
            </motion.div>

            {/* 5. Trust Metrics Row */}
            <motion.div
              variants={metricsVariants}
              className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80"
            >
              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">100%</div>
                <div className="text-xs text-slate-400">Industry Attachment</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">94.8%</div>
                <div className="text-xs text-slate-400">KNEC / CDACC Pass</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 tracking-tight">3,500+</div>
                <div className="text-xs text-slate-400">Enrolled Trainees</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 tracking-tight">3 Campuses</div>
                <div className="text-xs text-slate-400">Nairobi & Nakuru</div>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column: Hero Visual Image with Entrance Animation & Floating Badges */}
          <div className="lg:col-span-5 relative">
            <motion.div
              variants={heroImageCardVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              {/* Main Visual Image Card */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900 group">
                
                {/* Smooth Zoom-in Reveal for Photo */}
                <motion.div
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-72 sm:h-84 w-full overflow-hidden"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80"
                    alt="Technical Engineering & Robotics Lab Trainees"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </motion.div>

                {/* Overlaid Institutional Status Badge */}
                <div className="p-5 sm:p-6 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                        Accreditation Status
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Active 2026
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span><strong>TVETA Registered:</strong> National TVET Reg. {KENYAN_COLLEGE_INFO.regNumber}.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span><strong>KNEC Examination Centre:</strong> Approved Centre #20401102.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span><strong>HELB & Capitation:</strong> Eligible for KES 30,000 Govt Capitation.</span>
                    </div>
                  </div>

                  {/* Lipa na M-Pesa Quick Info */}
                  <div className="bg-emerald-950/70 border border-emerald-800/60 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-mono block">Lipa na M-Pesa</span>
                      <span className="font-bold text-emerald-300">PayBill <strong className="text-white font-mono text-sm">247247</strong></span>
                    </div>
                    <span className="text-[11px] text-slate-300 font-mono bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
                      Acc: Adm / App ID
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Top Right - 100% Practical Attachment with Entrance + Float Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55, ease: [0.175, 0.885, 0.32, 1.275] }}
                className="hidden sm:block absolute -top-5 -right-5 z-20"
              >
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                  className="bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Placement</span>
                    <span className="text-xs font-bold text-white">100% Industry Attachment</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating Badge 2: Bottom Left - CDACC CBET Certified with Entrance + Float Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7, ease: [0.175, 0.885, 0.32, 1.275] }}
                className="hidden sm:block absolute -bottom-5 -left-5 z-20"
              >
                <motion.div
                  animate={{ y: [4, -4, 4] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                  className="bg-slate-900/95 border border-blue-500/40 rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Curriculum</span>
                    <span className="text-xs font-bold text-white">TVET CDACC CBET Level 4-6</span>
                  </div>
                </motion.div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

