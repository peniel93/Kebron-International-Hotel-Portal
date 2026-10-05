import React, { useState } from 'react';
import { X, FileText, Download, Eye, CheckCircle, XCircle, Award } from 'lucide-react';

export const DocumentViewer = ({ applicant, isOpen, onClose, onUpdateStatus }) => {
  const [selectedDocKey, setSelectedDocKey] = useState('cv_url');

  if (!isOpen || !applicant) return null;

  const docFields = [
    { label: 'CV or Resume', key: 'cv_url' },
    { label: 'Academic Document', key: 'academic_doc_url' },
    { label: 'University Temporary Doc', key: 'university_temp_doc_url' },
    { label: 'Grade 12 Transcript', key: 'grade12_transcript_url' },
    { label: 'Grade 10 Transcript', key: 'grade10_transcript_url' },
    { label: 'Grade 8 Transcript', key: 'grade8_transcript_url' },
    { label: 'Grade 12 Entrance Cert', key: 'grade12_entrance_cert_url' },
    { label: 'Grade 10 Matric Cert', key: 'grade10_matric_cert_url' },
    { label: 'Grade 6 Ministry Cert', key: 'grade6_ministry_cert_url' },
    { label: 'Grade 8 Ministry Cert', key: 'grade8_ministry_cert_url' },
    { label: 'Birth Certificate', key: 'birth_certificate_url' },
    { label: 'Fayda / ID Card (Front)', key: 'fayda_id_front_url' },
    { label: 'Fayda / ID Card (Back)', key: 'fayda_id_back_url' }
  ];

  const currentDocName = applicant[selectedDocKey] || "Not Provided";

  const handleDownload = (docName) => {
    const textContent = `KEBRON HOTEL APPLICANT DOCUMENT PREVIEW\nApplicant: ${applicant.applicant_name}\nDocument Type: ${selectedDocKey}\nFile Reference: ${docName}`;
    const blob = new Blob([textContent], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${applicant.applicant_name.replace(/\s+/g, '_')}_${selectedDocKey}.pdf`;
    link.click();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <span>Applicant Documents & Recruitment Profile</span>
            </h3>
            <p className="text-xs text-slate-500">
              {applicant.applicant_name} | {applicant.email} | {applicant.phone}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          
          {/* Document File Selector List */}
          <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-2 border-r border-slate-200 dark:border-slate-800">
            <p className="text-xs font-bold uppercase text-amber-600 mb-2">Submitted Files & Certificates</p>
            {docFields.map((doc) => {
              const filePresent = !!applicant[doc.key];
              return (
                <button
                  key={doc.key}
                  onClick={() => setSelectedDocKey(doc.key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                    selectedDocKey === doc.key
                      ? 'bg-amber-500 text-white font-bold shadow'
                      : filePresent
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                      : 'bg-slate-50 dark:bg-slate-900/50 text-slate-400 opacity-60'
                  }`}
                >
                  <span className="truncate">{doc.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/10">
                    {filePresent ? 'Attached' : 'Empty'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Document Viewer Preview Screen */}
          <div className="md:col-span-2 flex flex-col justify-between bg-slate-900 text-white rounded-xl p-6 min-h-[350px] shadow-inner relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>Document Previewer Mode</span>
                </span>
                {applicant[selectedDocKey] && (
                  <button
                    onClick={() => handleDownload(applicant[selectedDocKey])}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </button>
                )}
              </div>

              <div className="text-center py-10 space-y-3">
                <FileText className="w-16 h-16 text-amber-400 mx-auto opacity-80" />
                <h4 className="text-lg font-bold">
                  {docFields.find(d => d.key === selectedDocKey)?.label}
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  Filename: {currentDocName}
                </p>
                {applicant[selectedDocKey] ? (
                  <div className="inline-block px-4 py-2 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs">
                    File verified and available in database repository.
                  </div>
                ) : (
                  <div className="inline-block px-4 py-2 rounded-lg bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs">
                    Optional document was not attached by applicant.
                  </div>
                )}
              </div>
            </div>

            {/* Applicant Scores & Recruitment Status Control */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400">Written Score: </span>
                <span className="font-bold text-amber-400">{applicant.written_exam_score ?? 'N/A'}%</span>
                <span className="mx-2">|</span>
                <span className="text-slate-400">Interview: </span>
                <span className="font-bold text-emerald-400">{applicant.interview_score ?? 'N/A'}%</span>
              </div>

              {onUpdateStatus && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateStatus(applicant.id, { written_exam_result: 'PASSED', recruitment_status: 'HIRED' })}
                    className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Pass / Hire</span>
                  </button>
                  <button
                    onClick={() => onUpdateStatus(applicant.id, { written_exam_result: 'FAILED', recruitment_status: 'REJECTED' })}
                    className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Fail / Reject</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
