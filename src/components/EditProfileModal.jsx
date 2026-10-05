import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { BootstrapAlert } from './BootstrapAlert';
import { User, Mail, Phone, Lock, Upload, KeyRound, Check, X, Shield, Eye, EyeOff } from 'lucide-react';

export const EditProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser } = useAuth();
  const [alert, setAlert] = useState(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [profileImage, setProfileImage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setGender(currentUser.gender || 'Male');
      setProfileImage(currentUser.profile_image || '');
      setNewPassword('');
      setConfirmPassword('');
      setAlert(null);
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleFilePicked = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (newPassword && newPassword !== confirmPassword) {
      setAlert({ type: 'danger', message: 'New password and confirm password do not match.' });
      return;
    }

    setSubmitting(true);

    const updatePayload = {
      full_name: fullName,
      email: email,
      phone: phone,
      gender: gender,
      profile_image: profileImage
    };

    if (newPassword.trim()) {
      updatePayload.password_hash = newPassword.trim();
      updatePayload.is_password_changed = true;
    }

    const updatedUser = await dataService.updateUser(currentUser.id, updatePayload);

    setSubmitting(false);

    if (updatedUser) {
      setCurrentUser(updatedUser);
      setAlert({
        type: 'success',
        message: 'Your profile and security credentials have been updated and saved in the database!'
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setAlert({ type: 'danger', message: 'Failed to update profile in database.' });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 sm:p-8 max-w-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Edit Staff Profile & Credentials
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">
                Username ID: <span className="font-mono text-amber-600 dark:text-amber-400">{currentUser.username}</span> | Role: <span className="text-blue-600">{currentUser.role}</span>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {alert && <div className="mt-4"><BootstrapAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} /></div>}

        <form onSubmit={handleSaveProfile} className="space-y-4 my-4">
          
          {/* Profile Picture Avatar & Picker */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <img
              src={profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
              alt={fullName}
              className="w-14 h-14 rounded-full object-cover border-2 border-amber-500 shadow-md"
            />
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Change Profile Image File
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFilePicked}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-input text-xs"
              placeholder="Full Staff Name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input text-xs"
                placeholder="staff@kebronhotel.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Phone Number *</label>
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

          <div>
            <label className="block text-xs font-bold mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="form-input text-xs font-bold"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Change Password PIN Section */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" />
                <span>Update Password PIN (Optional)</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide PIN' : 'Show PIN'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300">New Password PIN</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input text-xs"
                  placeholder="Leave blank to keep current"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300">Confirm New Password PIN</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input text-xs"
                  placeholder="Confirm new PIN"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-pattern-gold px-6 py-2.5 text-xs font-bold shadow-lg"
            >
              {submitting ? 'Saving in Database...' : 'Save Profile & Update DB'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
