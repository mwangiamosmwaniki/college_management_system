'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Calendar,
  User,
  Clock,
  ArrowRight,
  ChevronRight,
  Tag,
  Share2,
  FileText,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { PublicNewsItem } from '@/types/erp';
import { KENYAN_PUBLIC_NEWS } from '@/lib/kenyan-tvet-data';

export function PublicNewsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeStoryModal, setActiveStoryModal] = useState<PublicNewsItem | null>(null);

  const categories = useMemo(() => {
    return [
      { id: 'ALL', label: 'All Updates' },
      { id: 'INTAKE_ALERT', label: 'Intakes & Admissions' },
      { id: 'EXAMINATION_NOTICE', label: 'Examinations' },
      { id: 'GRADUATION', label: 'Graduation' },
      { id: 'ANNOUNCEMENT', label: 'Attachment & Placements' },
      { id: 'TENDER', label: 'Tenders & Procurement' }
    ];
  }, []);

  const filteredNews = useMemo(() => {
    if (selectedCategory === 'ALL') return KENYAN_PUBLIC_NEWS;
    return KENYAN_PUBLIC_NEWS.filter(n => n.category === selectedCategory);
  }, [selectedCategory]);

  const featuredStory = KENYAN_PUBLIC_NEWS.find(n => n.featured) || KENYAN_PUBLIC_NEWS[0];

  return (
    <div className="bg-slate-50 text-slate-800 space-y-12 py-12 sm:py-16">
      
      {/* 1. Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider font-mono">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>Official Newsroom & Media Centre</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Campus News & Official Updates
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Stay informed on institutional announcements, intake dates, examination timetables, and campus developments.
          </p>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Featured Lead Story (If Showing All) */}
      {selectedCategory === 'ALL' && featuredStory && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-6 relative h-64 sm:h-80 w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80"
                  alt={featuredStory.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow">
                    Featured Story
                  </span>
                </div>
              </div>

              <div className="lg:col-span-6 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span>{featuredStory.publishedDate}</span>
                  <span>•</span>
                  <span>{featuredStory.author}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                  {featuredStory.title}
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {featuredStory.summary}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveStoryModal(featuredStory)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">
            {selectedCategory === 'ALL' ? 'Latest Press Releases & Bulletins' : 'Filtered Bulletins'}
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {filteredNews.length} articles published
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map(item => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold font-mono">
                    {item.category.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{item.publishedDate}</span>
                </div>

                <h4 className="font-bold text-base sm:text-lg text-slate-900 leading-snug hover:text-emerald-700 transition-colors">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] font-mono">{item.author}</span>
                <button
                  onClick={() => setActiveStoryModal(item)}
                  className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Article</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Read Full Story Modal */}
      {activeStoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                  {activeStoryModal.category.replace('_', ' ')}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 leading-tight">
                  {activeStoryModal.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                  <span>Published: {activeStoryModal.publishedDate}</span>
                  <span>•</span>
                  <span>Source: {activeStoryModal.author}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveStoryModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-4 whitespace-pre-line">
              {activeStoryModal.content}
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
              <span className="text-slate-500">Official Gazetted Communication</span>
              <button
                onClick={() => setActiveStoryModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
