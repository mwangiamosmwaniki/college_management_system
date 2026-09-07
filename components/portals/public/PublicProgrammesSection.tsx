'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  GraduationCap,
  Award,
  Info,
  X
} from 'lucide-react';
import { PublicProgrammeItem } from '@/types/erp';
import { KENYAN_PUBLIC_PROGRAMMES } from '@/lib/kenyan-tvet-data';

interface PublicProgrammesSectionProps {
  onApplyForProgramme: (programme?: PublicProgrammeItem) => void;
  onDownloadProspectus: () => void;
  isStandalonePage?: boolean;
}

export function PublicProgrammesSection({
  onApplyForProgramme,
  onDownloadProspectus,
  isStandalonePage = false
}: PublicProgrammesSectionProps) {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedBody, setSelectedBody] = useState<string>('ALL');
  const [selectedProgrammeModal, setSelectedProgrammeModal] = useState<PublicProgrammeItem | null>(null);

  // Separate Featured Courses from the rest
  const featuredCourses = useMemo(() => {
    return KENYAN_PUBLIC_PROGRAMMES.filter(p => p.featured);
  }, []);

  // Filtered Courses for Search Engine
  const searchResults = useMemo(() => {
    return KENYAN_PUBLIC_PROGRAMMES.filter(prog => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.minimumRequirements.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.careerOutcomes.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDept = selectedDept === 'ALL' || prog.departmentId === selectedDept;
      const matchesLevel = selectedLevel === 'ALL' || prog.qualificationLevel === selectedLevel;
      const matchesBody = selectedBody === 'ALL' || prog.examiningBody === selectedBody;

      return matchesSearch && matchesDept && matchesLevel && matchesBody;
    });
  }, [searchQuery, selectedDept, selectedLevel, selectedBody]);

  // Unique departments for filter pills / dropdown
  const departments = useMemo(() => {
    const map = new Map<string, string>();
    KENYAN_PUBLIC_PROGRAMMES.forEach(p => map.set(p.departmentId, p.departmentName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  const hasActiveFilters = searchQuery !== '' || selectedDept !== 'ALL' || selectedLevel !== 'ALL' || selectedBody !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDept('ALL');
    setSelectedLevel('ALL');
    setSelectedBody('ALL');
  };

  return (
    <section className={`py-12 sm:py-16 ${isStandalonePage ? 'bg-slate-50' : 'bg-white'} border-b border-slate-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2 font-mono">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>Academic Catalog & Curriculum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Accredited TVET Programmes & Qualifications
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Fully approved by TVETA, examined by KNEC, TVET CDACC, KASNEB, and NITA across Diploma, Craft Certificate, and Artisan qualification levels.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onDownloadProspectus}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Download Prospectus</span>
            </button>
          </div>
        </div>

        {/* 1. FEATURED COURSES SHOWCASE */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl font-bold text-slate-900">Featured Flagship Courses</h3>
            </div>
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">
              Highest industry placement & employer demand
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map(course => (
              <div
                key={course.id}
                className="rounded-2xl bg-white border-2 border-emerald-500/20 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {course.code}
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Featured
                    </span>
                  </div>

                  {/* Course Title */}
                  <h4 className="font-extrabold text-lg text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {course.name}
                  </h4>

                  <p className="text-xs text-slate-500 font-medium">
                    {course.departmentName}
                  </p>

                  {/* Key Stats Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-mono uppercase">Level</span>
                      <span className="font-semibold text-slate-800">{course.qualificationLevel.replace('_', ' ')}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-mono uppercase">Duration</span>
                      <span className="font-semibold text-slate-800">{course.durationTerms} Terms ({course.durationMonths} Mo)</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-mono uppercase">Examining Body</span>
                      <span className="font-semibold text-slate-800">{course.examiningBody}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-mono uppercase">Tuition / Term</span>
                      <span className="font-bold text-emerald-800">KES {course.tuitionFeePerTerm.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Requirements Summary */}
                  <div className="bg-emerald-50/70 border border-emerald-200/60 p-3 rounded-xl text-xs text-emerald-950 space-y-1">
                    <span className="font-bold text-emerald-900 block text-[11px] uppercase tracking-wider">Entry Requirement:</span>
                    <p className="text-slate-700 text-xs line-clamp-2 leading-relaxed">{course.minimumRequirements}</p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedProgrammeModal(course)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    View Syllabus
                  </button>

                  <button
                    onClick={() => onApplyForProgramme(course)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. SEARCH & BROWSE ALL PROGRAMMES SECTION */}
        <div id="programme_search_section" className="space-y-6 pt-8 border-t border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-700" />
              <h3 className="text-xl font-bold text-slate-900">Explore & Search All Courses</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Search across all {KENYAN_PUBLIC_PROGRAMMES.length} accredited programmes by keyword, department, or qualification level.
            </p>
          </div>

          {/* Interactive Search & Filter Controls */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 border border-slate-200 space-y-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3 items-center">
              {/* Search Input */}
              <div className="relative w-full md:flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search course title, unit code, career outcome (e.g. Mechatronics, Cyber, Chef, KCSE D)..."
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Department Dropdown */}
              <div className="w-full md:w-64">
                <select
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="ALL">All Departments ({departments.length})</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Qualification Level Dropdown */}
              <div className="w-full md:w-52">
                <select
                  value={selectedLevel}
                  onChange={e => setSelectedLevel(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="ALL">All Levels</option>
                  <option value="DIPLOMA">Diploma (Level 6)</option>
                  <option value="CRAFT_CERTIFICATE">Craft Certificate (Level 5)</option>
                  <option value="ARTISAN">Artisan (Level 4)</option>
                  <option value="CERTIFICATE">Professional Certificate</option>
                </select>
              </div>

              {/* Examining Body Dropdown */}
              <div className="w-full md:w-44">
                <select
                  value={selectedBody}
                  onChange={e => setSelectedBody(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="ALL">All Exam Bodies</option>
                  <option value="KNEC">KNEC</option>
                  <option value="TVET_CDACC">TVET CDACC</option>
                  <option value="KASNEB">KASNEB</option>
                  <option value="NITA">NITA</option>
                </select>
              </div>
            </div>

            {/* Results Count & Active Filters Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">
                  Showing {searchResults.length} of {KENYAN_PUBLIC_PROGRAMMES.length} programmes
                </span>
                {hasActiveFilters && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                    Filters Applied
                  </span>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>
          </div>

          {/* Course Search Results Grid */}
          {searchResults.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Info className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">No courses match your criteria</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try clearing your search query or selecting &ldquo;All Departments&rdquo; to see the full course list.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
              >
                View All Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map(prog => (
                <div
                  key={prog.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {prog.code}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 font-mono">
                        {prog.examiningBody}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 leading-snug line-clamp-2">
                      {prog.name}
                    </h4>

                    <p className="text-xs text-slate-500 font-medium">
                      {prog.departmentName}
                    </p>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div>
                        <span className="text-slate-400 block">Level</span>
                        <span className="font-medium text-slate-800">{prog.qualificationLevel.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Duration</span>
                        <span className="font-medium text-slate-800">{prog.durationTerms} Terms</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Tuition Fee</span>
                        <span className="font-bold text-emerald-800">KES {prog.tuitionFeePerTerm.toLocaleString()} / Term</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Next Intake</span>
                        <span className="font-medium text-slate-800">May & Sept 2026</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-700 block mb-0.5 text-[11px]">Requirements:</span>
                      <p className="line-clamp-2 text-[11px] text-slate-500">{prog.minimumRequirements}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedProgrammeModal(prog)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      Syllabus Details
                    </button>

                    <button
                      onClick={() => onApplyForProgramme(prog)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Apply</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* SYLLABUS DETAILS MODAL */}
      {selectedProgrammeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {selectedProgrammeModal.code} • {selectedProgrammeModal.examiningBody}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {selectedProgrammeModal.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedProgrammeModal.departmentName}</p>
              </div>

              <button
                onClick={() => setSelectedProgrammeModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div><strong>Qualification Level:</strong> {selectedProgrammeModal.qualificationLevel.replace('_', ' ')}</div>
                  <div><strong>Duration:</strong> {selectedProgrammeModal.durationTerms} Terms ({selectedProgrammeModal.durationMonths} Months)</div>
                  <div><strong>Tuition Fee:</strong> KES {selectedProgrammeModal.tuitionFeePerTerm.toLocaleString()} / Term</div>
                  <div><strong>Campus:</strong> {selectedProgrammeModal.campus}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1 text-xs uppercase tracking-wider">Minimum Entry Requirements</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {selectedProgrammeModal.minimumRequirements}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1 text-xs uppercase tracking-wider">Career & Industry Opportunities</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                  {selectedProgrammeModal.careerOutcomes.map((career, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{career}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                <div className="font-bold">Accreditation & Certification:</div>
                <p className="text-[11px] text-emerald-800">{selectedProgrammeModal.accreditation}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedProgrammeModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setSelectedProgrammeModal(null);
                  onApplyForProgramme(selectedProgrammeModal);
                }}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Apply for this Course</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
