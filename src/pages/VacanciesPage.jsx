import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { BootstrapAlert } from '../components/BootstrapAlert';
import { Briefcase, Calendar, MapPin, Upload, FileText, CheckCircle2, Clock, Info } from 'lucide-react';

export const VacanciesPage = ({ onCheckResultClick }) => {
  const { t } = useLanguage();
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields as required by document
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [residenceAddress, setResidenceAddress] = useState('');
  const [region, setRegion] = useState('Sidama');
  const [zone, setZone] = useState('Hawassa City');
  const [woreda, setWoreda] = useState('Woreda 01');
  const [kebele, setKebele] = useState('Kebele 03');

  // Document attachments
  const [cvFile, setCvFile] = useState(null);
  const [academicDocFile, setAcademicDocFile] = useState(null);
  const [uniTempDocFile, setUniTempDocFile] = useState(null);
  const [g12Transcript, setG12Transcript] = useState(null);
  const [g10Transcript, setG10Transcript] = useState(null);
  const [g8Transcript, setG8Transcript] = useState(null);
  const [g12EntranceCert, setG12EntranceCert] = useState(null);
  const [g10MatricCert, setG10MatricCert] = useState(null);
  const [g6MinistryCert, setG6MinistryCert] = useState(null);
  const [g8MinistryCert, setG8MinistryCert] = useState(null);
  const [birthCert, setBirthCert] = useState(null);
  const [faydaFront, setFaydaFront] = useState(null);
  const [faydaBack, setFaydaBack] = useState(null);

  useEffect(() => {
    dataService.getVacancies().then(setVacancies);
  }, []);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const applicationData = {
      vacancy_id: selectedVacancy.id,
      applicant_name: applicantName,
      email,
      phone,
      residence_address: residenceAddress,
      region,
      zone,
      woreda,
      kebele,
      cv_url: cvFile ? cvFile.name : 'CV_Resume.pdf',
      academic_doc_url: academicDocFile ? academicDocFile.name : 'Academic_Degrees.pdf',
      university_temp_doc_url: uniTempDocFile ? uniTempDocFile.name : null,
      grade12_transcript_url: g12Transcript ? g12Transcript.name : null,
      grade10_transcript_url: g10Transcript ? g10Transcript.name : null,
      grade8_transcript_url: g8Transcript ? g8Transcript.name : null,
      grade12_entrance_cert_url: g12EntranceCert ? g12EntranceCert.name : null,
      grade10_matric_cert_url: g10MatricCert ? g10MatricCert.name : null,
      grade6_ministry_cert_url: g6MinistryCert ? g6MinistryCert.name : null,
      grade8_ministry_cert_url: g8MinistryCert ? g8MinistryCert.name : null,
      birth_certificate_url: birthCert ? birthCert.name : null,
      fayda_id_front_url: faydaFront ? faydaFront.name : null,
      fayda_id_back_url: faydaBack ? faydaBack.name : null
    };

    await dataService.submitApplication(applicationData);
    setSubmitting(false);
    setSelectedVacancy(null);
    setAlert({ type: 'success', message: t('applicationSuccess') });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t('jobOpenings')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Join the prestigious Kebron International Hotel team. Explore open vacancies, review job criteria, submit your online application and credentials, and track your examination results.
        </p>
      </div>

      {alert && <BootstrapAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="flex justify-end">
        <button
          onClick={onCheckResultClick}
          className="btn-pattern-gold px-4 py-2 text-xs font-bold shadow-md"
        >
          🔍 {t('checkResultTitle')}
        </button>
      </div>

      {/* Vacancy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vacancies.map((vac) => (
          <div key={vac.id} className="glass-card p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-600/10 text-cyan-700 dark:text-cyan-400 font-bold text-xs">
                  {vac.department}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Until {vac.application_deadline}</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {vac.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {vac.description}
              </p>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <p><span className="font-bold text-slate-800 dark:text-slate-200">Requirements:</span> {vac.requirements}</p>
                <p><span className="font-bold text-slate-800 dark:text-slate-200">Criteria:</span> {vac.criteria}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedVacancy(vac)}
              className="btn-pattern-primary w-full py-2.5 text-xs justify-center font-bold"
            >
              <Briefcase className="w-4 h-4" />
              <span>{t('applyNow')}</span>
            </button>
          </div>
        ))}
      </div>

      {/* MULTI-DOCUMENT ONLINE JOB APPLICATION MODAL */}
      {selectedVacancy && (
        <div className="modal-overlay">
          <div className="modal-content p-6 sm:p-8 max-w-3xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-500" />
                  <span>{t('applicationFormTitle')} - {selectedVacancy.title}</span>
                </h3>
                <p className="text-xs text-slate-500">Department: {selectedVacancy.department}</p>
              </div>
              <button onClick={() => setSelectedVacancy(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full">
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-6 my-4">
              
              {/* Applicant Personal Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-amber-600 tracking-wider">
                  1. Personal & Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('guestName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="form-input text-xs"
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('email')} *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input text-xs"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input text-xs"
                      placeholder="+251 9..."
                    />
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-amber-600 tracking-wider">
                  2. Residence Address Details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('region')}
                    </label>
                    <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('zone')}
                    </label>
                    <input type="text" value={zone} onChange={(e) => setZone(e.target.value)} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('woreda')}
                    </label>
                    <input type="text" value={woreda} onChange={(e) => setWoreda(e.target.value)} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('kebele')}
                    </label>
                    <input type="text" value={kebele} onChange={(e) => setKebele(e.target.value)} className="form-input text-xs" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Residence Address
                    </label>
                    <input type="text" value={residenceAddress} onChange={(e) => setResidenceAddress(e.target.value)} className="form-input text-xs" placeholder="Street / House No." />
                  </div>
                </div>
              </div>

              {/* Mandatory & Optional Document Uploads */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-amber-600 tracking-wider">
                  3. Upload Required Documents (PDF / Word)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold mb-1">{t('cvResume')}</label>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files[0])} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">{t('academicDoc')} *</label>
                    <input type="file" required accept=".pdf" onChange={(e) => setAcademicDocFile(e.target.files[0])} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">{t('universityDoc')}</label>
                    <input type="file" accept=".pdf" onChange={(e) => setUniTempDocFile(e.target.files[0])} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">{t('grade12Transcript')}</label>
                    <input type="file" accept=".pdf" onChange={(e) => setG12Transcript(e.target.files[0])} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">{t('grade10Transcript')}</label>
                    <input type="file" accept=".pdf" onChange={(e) => setG10Transcript(e.target.files[0])} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">{t('grade8Transcript')}</label>
                    <input type="file" accept=".pdf" onChange={(e) => setG8Transcript(e.target.files[0])} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">{t('grade12Entrance')}</label>
                    <input type="file" accept=".pdf" onChange={(e) => setG12EntranceCert(e.target.files[0])} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">{t('grade10Matric')}</label>
                    <input type="file" accept=".pdf" onChange={(e) => setG10MatricCert(e.target.files[0])} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">{t('grade6Ministry')}</label>
                    <input type="file" accept=".pdf" onChange={(e) => setG6MinistryCert(e.target.files[0])} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">{t('grade8Ministry')}</label>
                    <input type="file" accept=".pdf" onChange={(e) => setG8MinistryCert(e.target.files[0])} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">{t('birthCert')}</label>
                    <input type="file" accept=".pdf,.png,.jpg" onChange={(e) => setBirthCert(e.target.files[0])} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">{t('faydaIdFront')} & Back</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="file" accept="image/*,.pdf" onChange={(e) => setFaydaFront(e.target.files[0])} className="form-input text-xs" placeholder="Front" />
                      <input type="file" accept="image/*,.pdf" onChange={(e) => setFaydaBack(e.target.files[0])} className="form-input text-xs" placeholder="Back" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedVacancy(null)}
                  className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 text-xs font-bold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-pattern-primary px-6 py-2 text-xs font-bold shadow-lg"
                >
                  {submitting ? "Submitting Application..." : t('submitApplication')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
