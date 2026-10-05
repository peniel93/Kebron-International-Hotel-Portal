import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { BootstrapAlert } from '../components/BootstrapAlert';
import { DashboardSidebarDrawer } from '../components/DashboardSidebarDrawer';
import { ShiftRosterManager } from '../components/ShiftRosterManager';
import { Users, Calendar, Plus, Trash2, Shield, ChefHat, Bell, Clock } from 'lucide-react';

export const ManagerDashboard = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('shifts');
  const [alert, setAlert] = useState(null);

  // Form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('GUARDIAN');
  const [gender, setGender] = useState('Male');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const u = await dataService.getUsers();
    setUsers(u);
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    const created = await dataService.createUser({
      full_name: fullName,
      phone,
      address,
      role,
      gender
    });
    setAlert({
      type: 'success',
      message: `Staff worker created! Username: ${created.username} | Auto PIN: ${created.default_password} (Saved to Main Registrar DB)`
    });
    setFullName('');
    setPhone('');
    setAddress('');
    loadData();
  };

  const handleDeleteStaff = async (id) => {
    await dataService.deleteUser(id);
    setAlert({ type: 'danger', message: 'Worker record removed.' });
    loadData();
  };

  const operationalUsers = users.filter(u => ['GUARDIAN', 'JANITOR', 'COOK', 'CHEF'].includes(u.role));

  const tabs = [
    { id: 'shifts', label: 'Staff Shift Rosters & Working Partners', icon: <Calendar className="w-4 h-4" /> },
    { id: 'workers', label: 'Operational Staff Directory', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-amber-900 via-red-950 to-slate-900 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-extrabold text-xs uppercase">
            Human Resource Operations Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">Hotel Manager Dashboard</h1>
          <p className="text-xs text-slate-300">Welcome, {currentUser?.full_name} ({currentUser?.username})</p>
        </div>
      </div>

      {alert && <BootstrapAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Left-Side Navigation Drawer */}
      <DashboardSidebarDrawer
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        title="Manager Operations Menu"
      />

      {/* 2. STAFF SHIFT ROSTERING & PARTNER SHIFT VIEWER */}
      {activeTab === 'shifts' && (
        <div id="tab-content-shifts">
          <ShiftRosterManager />
        </div>
      )}

      {/* OPERATIONAL STAFF DIRECTORY & REGISTRATION */}
      {activeTab === 'workers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="tab-content-workers">
          
          {/* Create Staff Worker */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-500" />
              <span>Add Guardians, Janitors, Cooks & Chefs</span>
            </h3>

            <form onSubmit={handleCreateStaff} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input text-xs"
                  placeholder="e.g. Dawit Tadesse"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold mb-1">Assigned Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="form-input text-xs font-bold">
                    <option value="GUARDIAN">Guardian / Security</option>
                    <option value="JANITOR">Janitor / Sanitation</option>
                    <option value="COOK">Line Cook</option>
                    <option value="CHEF">Head Chef</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-input text-xs">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
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

              <div>
                <label className="block text-xs font-bold mb-1">Residence Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-input text-xs"
                  placeholder="Subcity / Kebele"
                />
              </div>

              <button type="submit" className="btn-pattern-gold w-full py-2.5 text-xs font-bold shadow-md">
                Create & Save Worker Profile
              </button>
            </form>
          </div>

          {/* Operational Workers List */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Staff Workers Roster</span>
              <span className="text-xs text-slate-500 font-bold">{operationalUsers.length} Active Staff</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-100 dark:bg-slate-900/60">
                    <th className="p-3">Staff Member</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {operationalUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="p-3 font-bold">
                        {u.full_name}
                        <span className="block text-[10px] font-mono text-slate-500">{u.username}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">{u.phone}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteStaff(u.id)}
                          className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          title="Remove Worker"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
