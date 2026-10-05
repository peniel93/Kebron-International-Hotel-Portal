import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const BootstrapAlert = ({ type = 'success', message, onClose }) => {
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  // Clean out any accidental "Bootstrap Alert:" string prefix
  const cleanMessage = typeof message === 'string'
    ? message.replace(/^Bootstrap Alert:\s*/i, '').trim()
    : message;

  const styleMap = {
    success: 'bg-emerald-900/95 text-emerald-100 border-emerald-500/60 shadow-emerald-950/40',
    danger: 'bg-red-900/95 text-red-100 border-red-500/60 shadow-red-950/40',
    warning: 'bg-amber-900/95 text-amber-100 border-amber-500/60 shadow-amber-950/40',
    info: 'bg-blue-900/95 text-blue-100 border-blue-500/60 shadow-blue-950/40'
  };

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    danger: <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
  };

  return (
    <div className={`fixed top-20 right-3 sm:right-6 z-[9999] max-w-sm sm:max-w-md w-[92vw] sm:w-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-lg flex items-start justify-between gap-3 transition-all duration-300 transform translate-y-0 ${styleMap[type] || styleMap.info}`}>
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {iconMap[type] || iconMap.info}
        <div className="min-w-0 flex-1">
          <h5 className="text-xs font-black uppercase tracking-wider text-white/90">
            {type === 'success' ? 'Action Completed' : type === 'danger' ? 'System Notice' : 'Notice'}
          </h5>
          <p className="text-xs font-semibold leading-snug break-words mt-0.5">
            {cleanMessage}
          </p>
        </div>
      </div>
      
      {onClose && (
        <button 
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 text-white/80 transition-colors shrink-0"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
