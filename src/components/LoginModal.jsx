import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { BootstrapAlert } from './BootstrapAlert';
import { UserCheck, X, Eye, EyeOff, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useAuth();
  const { t } = useLanguage();
  
  // States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  // Password Change Step State
  const [mustChangeStep, setMustChangeStep] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  if (!isOpen) return null;

  const handleResetModal = () => {
    setUsername('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowNewPassword(false);
    setMustChangeStep(false);
    setAuthenticatedUser(null);
    setAlert(null);
    onClose();
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    const res = await login(username, password);
    setLoading(false);

    if (res.success) {
      const user = res.user;
      if (!user.is_password_changed) {
        setAuthenticatedUser(user);
        setMustChangeStep(true);
        setAlert({ 
          type: 'warning', 
          message: `First-Time Login Detected! You are currently using a default password. You must change and save a new password before proceeding.` 
        });
      } else {
        setAlert({ type: 'success', message: `Welcome ${user.full_name}! Redirecting to ${user.role} Dashboard...` });
        setTimeout(() => {
          handleResetModal();
          if (onSuccess) onSuccess();
        }, 1000);
      }
    } else {
      setAlert({ type: 'danger', message: res.message || 'Invalid username or password.' });
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!newPassword || newPassword.length < 4) {
      setAlert({ type: 'danger', message: 'New password PIN must be at least 4 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({ type: 'danger', message: 'New password and confirmation password do not match.' });
      return;
    }

    if (newPassword === '1234') {
      setAlert({ type: 'warning', message: 'Please pick a new password different from default "1234".' });
      return;
    }

    setLoading(true);
    const updatedUser = await dataService.changeUserPassword(authenticatedUser.id, newPassword);
    setLoading(false);

    if (updatedUser) {
      setAlert({ type: 'success', message: 'Password updated and saved to database successfully! Logging you in...' });
      setTimeout(() => {
        handleResetModal();
        if (onSuccess) onSuccess();
      }, 1200);
    } else {
      setAlert({ type: 'danger', message: 'Failed to update password. Please try again.' });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 sm:p-8 relative">
        <button 
          onClick={handleResetModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: LOGIN FORM */}
        {!mustChangeStep ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-tr from-cyan-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg text-white">
                <UserCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Kebron Staff & Admin Portal Login
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Access your role-based dashboard using your username and password PIN.
              </p>
            </div>

            {alert && <BootstrapAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Username ID
                </label>
                <div className="relative flex items-center w-full">
                  <input
                    type="text"
                    required
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input px-4 font-medium w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password PIN
                </label>
                <div className="relative flex items-center w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input pl-4 pr-12 font-medium w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 z-10"
                    title={showPassword ? "Hide Password" : "Show Password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-amber-700 to-brown-700 text-white font-bold text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Authenticating..." : "Login to Dashboard"}
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: MANDATORY PASSWORD CHANGE FLOW */
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg text-white">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Update Default Password Required
              </h2>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
                Account: {authenticatedUser?.full_name} ({authenticatedUser?.username})
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                For security reasons, you must set a new password before accessing your dashboard.
              </p>
            </div>

            {alert && <BootstrapAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Enter New Password PIN *
                </label>
                <div className="relative flex items-center w-full">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={4}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-input pl-4 pr-12 font-bold w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 z-10"
                    title={showNewPassword ? "Hide Password" : "Show Password"}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password PIN *
                </label>
                <div className="relative flex items-center w-full">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={4}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input pl-4 pr-12 font-bold w-full"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-700 text-white font-bold text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Saving to Database..." : "Approve & Save New Password"}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
