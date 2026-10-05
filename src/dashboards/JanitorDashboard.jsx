import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { BootstrapAlert } from '../components/BootstrapAlert';
import { DashboardSidebarDrawer } from '../components/DashboardSidebarDrawer';
import { ShiftRosterManager } from '../components/ShiftRosterManager';
import { Clock, Calendar, Bell, Send, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const JanitorDashboard = () => {
  const { currentUser } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [activeTab, setActiveTab] = useState('roster');
  const [alert, setAlert] = useState(null);

  // Form
  const [janitorName, setJanitorName] = useState('');
  const [shiftDay, setShiftDay] = useState('Monday - Wednesday');
  const [shiftTime, setShiftTime] = useState('07:00 AM - 03:00 PM');
  const [assignedArea, setAssignedArea] = useState('Lobby & Hotel Floors 1-2');
  const [sanitationProg, setSanitationProg] = useState('Daily Morning Sanitation');

  // Report
  const [reportTitle, setReportTitle] = useState('');
  const [reportText, setReportText] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const s = await dataService.getJanitorShifts();
    setShifts(s);
  };

  const handleAddShift = async (e) => {
    e.preventDefault();
    await dataService.addJanitorShift({
      janitor_name: janitorName,
      shift_day: shiftDay,
      shift_time: shiftTime,
      assigned_area: assignedArea,
      sanitation_program: sanitationProg
    });
    setAlert({ type: 'success', message: `Shift scheduled for Janitor ${janitorName}!` });
    setJanitorName('');
    loadData();
  };

  const handleSendJanitorReport = async (e) => {
    e.preventDefault();
    await dataService.sendReport({
      sender_role: 'JANITOR',
      sender_name: currentUser?.full_name || 'Janitor Admin',
      report_title: reportTitle,
      content: reportText
    });
    setAlert({ type: 'success', message: 'Sanitation report posted to Main Registrar!' });
    setReportTitle('');
    setReportText('');
  };

  const tabs = [
    { id: 'roster', label: 'My Shift Schedule & Partners', icon: <Calendar className="w-4 h-4" /> },
    { id: 'sanitation', label: 'Cleaning & Sanitation Areas', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'report', label: 'Transmit Sanitation Report', icon: <Send className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-xs uppercase">
            Sanitation & Janitorial Division
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">Janitor & Sanitation Dashboard</h1>
          <p className="text-xs text-slate-300">Welcome, {currentUser?.full_name} ({currentUser?.username})</p>
        </div>
      </div>

      {alert && <BootstrapAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Left-Side Navigation Drawer */}
      <DashboardSidebarDrawer
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        title="Sanitation Navigation Menu"
      />

      {/* 2. SHIFT ROSTER & WORKING PARTNERS VIEWER */}
      {activeTab === 'roster' && (
        <div id="tab-content-roster">
          <ShiftRosterManager />
        </div>
      )}

      {activeTab === 'sanitation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="tab-content-sanitation">
          
          {/* Add Sanitation Area */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <span>Assign Janitor Sanitation Area</span>
            </h3>

            <form onSubmit={handleAddShift} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Janitor Staff Name *</label>
                <input
                  type="text"
                  required
                  value={janitorName}
                  onChange={(e) => setJanitorName(e.target.value)}
                  className="form-input text-xs"
                  placeholder="e.g. Almaz Bekele"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Assigned Area</label>
                <input
                  type="text"
                  value={assignedArea}
                  onChange={(e) => setAssignedArea(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold mb-1">Shift Days</label>
                  <input type="text" value={shiftDay} onChange={(e) => setShiftDay(e.target.value)} className="form-input text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Shift Time</label>
                  <input type="text" value={shiftTime} onChange={(e) => setShiftTime(e.target.value)} className="form-input text-xs" />
                </div>
              </div>

              <button type="submit" className="btn-pattern-gold w-full py-2.5 text-xs font-bold">
                Assign Sanitation Area
              </button>
            </form>
          </div>

          {/* Assigned Areas List */}
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Sanitation & Cleaning Assignments</span>
              <span className="text-xs text-slate-500 font-bold">{shifts.length} Active Shifts</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-100 dark:bg-slate-900/60">
                    <th className="p-3">Janitor Name</th>
                    <th className="p-3">Assigned Area</th>
                    <th className="p-3">Shift Schedule</th>
                    <th className="p-3">Program</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {shifts.map((s) => (
                    <tr key={s.id}>
                      <td className="p-3 font-bold">{s.janitor_name}</td>
                      <td className="p-3 text-emerald-600 font-bold">{s.assigned_area}</td>
                      <td className="p-3">{s.shift_day}<br/><span className="text-[10px] text-slate-400">{s.shift_time}</span></td>
                      <td className="p-3">{s.sanitation_program}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'report' && (
        <div className="glass-card p-6 space-y-4 max-w-2xl" id="tab-content-report">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-500" />
            <span>Transmit Sanitation Audit Report</span>
          </h3>

          <form onSubmit={handleSendJanitorReport} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">Report Title *</label>
              <input
                type="text"
                required
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="form-input text-xs"
                placeholder="e.g. Weekly Deep Cleaning & Disinfection Audit"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Report Body Details *</label>
              <textarea
                required
                rows="5"
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="form-input text-xs"
                placeholder="Details regarding detergent stock, floor sanitation..."
              ></textarea>
            </div>
            <button type="submit" className="btn-pattern-gold w-full py-2.5 text-xs font-bold">
              Transmit Report to Registrar
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
