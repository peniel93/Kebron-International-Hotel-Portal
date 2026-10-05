import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { Search, Award, Calendar, MapPin, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';

export const ResultCheckPage = () => {
  const { t } = useLanguage();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;
    setLoading(true);
    const matches = await dataService.searchApplicantResult(emailOrPhone);
    setResults(matches);
    setSearched(true);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white">
          <Award className="w-9 h-9" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t('checkResultTitle')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {t('checkResultDesc')}
        </p>
      </div>

      {/* Search Bar Form - Well-positioned Search Icon */}
      <div className="glass-card p-6 sm:p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow flex items-center w-full">
            <Search className="w-5 h-5 text-amber-600 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 shrink-0" />
            <input
              type="text"
              required
              placeholder={t('enterEmailOrPhone')}
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="form-input pl-12 pr-4 font-medium w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-pattern-gold px-6 py-3 text-xs font-bold whitespace-nowrap shadow-md"
          >
            {loading ? "Searching..." : t('searchResultBtn')}
          </button>
        </form>
      </div>

      {/* Results View */}
      {searched && (
        <div className="space-y-6">
          {results && results.length > 0 ? (
            results.map((res) => (
              <div key={res.id} className="glass-card p-6 space-y-4 border-l-4 border-amber-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Candidate Result Card</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{res.applicant_name}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${
                    res.recruitment_status === 'HIRED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    Status: {res.recruitment_status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block text-sm border-b pb-1 mb-2">Written Examination Result</span>
                    <p><span className="font-bold">Score:</span> {res.written_exam_score || 'N/A'}</p>
                    <p><span className="font-bold">Result:</span> <span className="font-extrabold text-blue-600">{res.written_exam_result}</span></p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block text-sm border-b pb-1 mb-2">Interview Examination Result</span>
                    <p><span className="font-bold">Score:</span> {res.interview_score || 'N/A'}</p>
                    <p><span className="font-bold">Result:</span> <span className="font-extrabold text-blue-600">{res.interview_result}</span></p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>Venue & Examination Timetable</span>
                  </h4>
                  <p><span className="font-bold">Written Exam Venue:</span> {res.written_exam_venue || 'Conference Hall A'}</p>
                  <p><span className="font-bold">Interview Venue:</span> {res.interview_venue || 'HR Suite Floor 4'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card p-8 text-center space-y-3">
              <XCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Application Records Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No matching recruitment records found for "{emailOrPhone}". Please verify your email or phone number.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
