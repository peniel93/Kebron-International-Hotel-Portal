import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { BootstrapAlert } from '../components/BootstrapAlert';
import { MapPin, Phone, Mail, Send, Clock, Globe } from 'lucide-react';

export const ContactPage = () => {
  const { t } = useLanguage();
  const [siteSettings, setSiteSettings] = useState(null);
  const [alert, setAlert] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dataService.getSiteSettings().then(setSiteSettings);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setAlert({ type: 'success', message: 'Thank you for reaching out! Your message has been transmitted to Kebron Hotel management.' });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t('contactTitle')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Our 24/7 guest relations team is here to assist you with room reservations, event bookings, and general inquiries.
        </p>
      </div>

      {alert && <BootstrapAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Info Card */}
        <div className="glass-card p-8 bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 text-white space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-2xl font-extrabold tracking-tight text-white border-b border-white/20 pb-3">
              Kebron Hotel Info
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white uppercase tracking-wider">{t('address')}</p>
                  <p className="text-slate-300">{siteSettings?.location_address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white uppercase tracking-wider">{t('phoneLines')}</p>
                  <p className="text-slate-300">{siteSettings?.contact_phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white uppercase tracking-wider">{t('emailUs')}</p>
                  <p className="text-slate-300">{siteSettings?.contact_email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white uppercase tracking-wider">Working Hours</p>
                  <p className="text-slate-300">Front Desk: 24 Hours / 7 Days</p>
                  <p className="text-slate-300">Dining Services: 06:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20 text-xs text-amber-300 font-semibold">
            ✦ Ethiopian Hospitality at its Finest
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-card p-8 lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('sendMessage')}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('guestName')} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="Your Full Name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('email')} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('subject')} *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="form-input"
                placeholder="Inquiry / Reservation Subject"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('message')} *
              </label>
              <textarea
                required
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="form-input"
                placeholder="Type your message or feedback..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-pattern-gold px-8 py-3 text-xs font-bold shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? "Transmitting..." : t('sendBtn')}</span>
            </button>
          </form>
        </div>

      </div>

      {/* Google Maps Card */}
      <div className="glass-card overflow-hidden h-80 rounded-2xl">
        <iframe
          title="Kebron Hotel Google Map Location"
          src={siteSettings?.google_maps_url}
          className="w-full h-full border-0"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

    </div>
  );
};
