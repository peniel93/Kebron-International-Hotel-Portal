import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { BootstrapAlert } from './BootstrapAlert';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Edit,
  CheckSquare, 
  Square, 
  Send, 
  Trash2, 
  UserCheck, 
  Sparkles,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';

export const ShiftRosterManager = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [shiftRosters, setShiftRosters] = useState([]);
  const [alert, setAlert] = useState(null);

  // Form State
  const [editingShift, setEditingShift] = useState(null);
  const [department, setDepartment] = useState('Front Desk & Reception');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedDays, setSelectedDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [startDate, setStartDate] = useState('2026-08-15');
  const [endDate, setEndDate] = useState('2026-08-20');
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('04:00 PM');
  const [shiftName, setShiftName] = useState('Day Shift Duty');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const formTopRef = useRef(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const departments = [
    'Front Desk & Reception',
    'Housekeeping & Janitorial',
    'Kitchen & Dining',
    'Security & Guarding',
    'Finance & Administration',
    'General Operations'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allUsers = await dataService.getUsers();
    setUsers(allUsers);
    if (allUsers.length > 0 && !selectedEmployeeId) {
      setSelectedEmployeeId(allUsers[0].id);
    }

    const rosters = await dataService.getShiftRosters();
    setShiftRosters(rosters);
  };

  const handleToggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Filter employees for the selected department
  const filteredEmployees = users.filter(u => {
    if (department === 'Front Desk & Reception') return u.role === 'MAIN_REGISTRAR' || u.role === 'EMPLOYEE' || u.role === 'MANAGER';
    if (department === 'Housekeeping & Janitorial') return u.role === 'JANITOR';
    if (department === 'Kitchen & Dining') return u.role === 'COOK' || u.role === 'CHEF';
    if (department === 'Security & Guarding') return u.role === 'GUARDIAN';
    if (department === 'Finance & Administration') return u.role === 'ACCOUNTANT' || u.role === 'FINANCE';
    return true;
  });

  const handleStartEditShift = (shift) => {
    setEditingShift(shift);
    setDepartment(shift.department);
    setSelectedEmployeeId(shift.employee_id);
    setSelectedDays(shift.days || []);
    setStartDate(shift.start_date);
    setEndDate(shift.end_date);
    setStartTime(shift.start_time);
    setEndTime(shift.end_time);
    setShiftName(shift.shift_name);
    setRemarks(shift.remarks || '');
    setAlert(null);

    // Smoothly scroll directly to the shift roster form
    setTimeout(() => {
      const target = document.getElementById('shift-roster-form') || formTopRef.current;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleCancelEdit = () => {
    setEditingShift(null);
    setShiftName('Day Shift Duty');
    setRemarks('');
  };

  const handleSaveShift = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (selectedDays.length === 0) {
      setAlert({ type: 'warning', message: 'Please select at least one day for the shift roster.' });
      return;
    }

    const emp = users.find(u => u.id === selectedEmployeeId) || filteredEmployees[0] || users[0];
    if (!emp) {
      setAlert({ type: 'danger', message: 'Please select a valid staff employee.' });
      return;
    }

    setSubmitting(true);

    const shiftPayload = {
      department,
      employee_id: emp.id,
      employee_name: emp.full_name,
      employee_username: emp.username,
      days: selectedDays,
      start_date: startDate,
      end_date: endDate,
      start_time: startTime,
      end_time: endTime,
      shift_name: shiftName,
      remarks
    };

    if (editingShift) {
      await dataService.updateShiftRoster(editingShift.id, shiftPayload);
      setAlert({
        type: 'success',
        message: `Shift roster for ${emp.full_name} (${emp.username}) updated successfully in database!`
      });
      setEditingShift(null);
    } else {
      await dataService.createShiftRoster(shiftPayload);
      setAlert({
        type: 'success',
        message: `New shift roster assigned to ${emp.full_name} (${emp.username}) and saved in database!`
      });
    }

    setSubmitting(false);
    setRemarks('');
    loadData();
  };

  const handleDeleteShift = async (id) => {
    await dataService.deleteShiftRoster(id);
    setAlert({ type: 'success', message: 'Shift roster assignment removed from database.' });
    if (editingShift && editingShift.id === id) {
      setEditingShift(null);
    }
    loadData();
  };

  const handleSendIndividualNotification = async (shift) => {
    await dataService.createAnnouncement({
      title: `Personal Shift Assignment: ${shift.shift_name}`,
      content: `Hello ${shift.employee_name}, your assigned shift in ${shift.department} is scheduled from ${shift.start_date} to ${shift.end_date} (${shift.start_time} - ${shift.end_time}) on ${shift.days.join(', ')}.`,
      category: 'SHIFT',
      target_role: 'ALL',
      posted_by: `Shift Roster Manager (${currentUser?.full_name})`
    });

    setAlert({
      type: 'success',
      message: `Individual shift notification transmitted directly to ${shift.employee_name} (${shift.employee_username})!`
    });
  };

  // Find shifts assigned to logged-in user
  const myShifts = shiftRosters.filter(s => 
    s.employee_username === currentUser?.username || 
    s.employee_name === currentUser?.full_name ||
    s.employee_id === currentUser?.id
  );

  return (
    <div className="space-y-8 w-full max-w-full" ref={formTopRef}>
      
      {/* 2. BOOTSTRAP ALERT NOTIFICATION UPON ACTION COMPLETION */}
      {alert && <BootstrapAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* 
        ===============================================================
        1. MY ASSIGNED SHIFTS & WORKING PARTNERS (LOGGED-IN USER VIEW)
        ===============================================================
      */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950 text-white space-y-4">
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-black">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">My Shift Schedule & Working Partners</h3>
              <p className="text-xs text-amber-300">View your active working shift and colleagues on duty with you.</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold">
            {myShifts.length} Shift Roster(s) Active
          </span>
        </div>

        {myShifts.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">
            No specific shift assigned to your account yet. Standard department hours apply.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {myShifts.map((myShift) => {
              // Find Partners assigned to the exact same department & shift hours
              const partners = shiftRosters.filter(s => 
                s.department === myShift.department && 
                s.start_time === myShift.start_time &&
                s.id !== myShift.id
              );

              return (
                <div key={myShift.id} className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-400 uppercase">
                      {myShift.shift_name} ({myShift.department})
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                      CONFIRMED
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-200">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-bold">{myShift.start_time} — {myShift.end_time}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{myShift.start_date} to {myShift.end_date}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      {myShift.days.map(day => (
                        <span key={day} className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 text-[10px] font-bold">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Shift Working Partners */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Co-Workers Assigned to Same Shift ({partners.length} Partners):</span>
                    </span>
                    {partners.length === 0 ? (
                      <span className="text-[10px] text-slate-400 block italic">Solo duty assignment.</span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {partners.map(p => (
                          <span key={p.id} className="px-2.5 py-1 rounded-xl bg-slate-900/90 text-white border border-amber-500/40 text-[11px] font-bold">
                            👤 {p.employee_name} ({p.employee_username})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 
        ===============================================================
        2. SHIFT ROSTERING FORM & ASSIGNMENT MATRIX (WITH EDITING LOGIC)
        ===============================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create / Edit Shift Form */}
        <div className="glass-card p-6 space-y-4" ref={formTopRef} id="shift-roster-form">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {editingShift ? <Edit className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-amber-500" />}
              <span>{editingShift ? `Edit Shift Roster` : 'Create & Assign Department Shift'}</span>
            </h3>
            {editingShift && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSaveShift} className="space-y-4">
            
            {/* 1. Department Selector */}
            <div>
              <label className="block text-xs font-bold mb-1">Select Department *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-input text-xs font-bold"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* 2. Specific Employee Picker */}
            <div>
              <label className="block text-xs font-bold mb-1">Select Specific Employee *</label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="form-input text-xs font-bold"
              >
                {filteredEmployees.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.full_name} ({u.username} — {u.role})
                  </option>
                ))}
                {filteredEmployees.length === 0 && (
                  <option value="">No employees found for {department}</option>
                )}
              </select>
            </div>

            {/* 3. Shift Name / Title */}
            <div>
              <label className="block text-xs font-bold mb-1">Shift Title / Name *</label>
              <input
                type="text"
                required
                value={shiftName}
                onChange={(e) => setShiftName(e.target.value)}
                className="form-input text-xs"
                placeholder="e.g. Morning Reception & Guest Duty"
              />
            </div>

            {/* 4. Multi-Select Days Checkboxes */}
            <div>
              <label className="block text-xs font-bold mb-1.5">Select Days of Week (Checkboxes) *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {daysOfWeek.map(day => {
                  const isChecked = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleToggleDay(day)}
                      className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-bold border transition-all ${
                        isChecked
                          ? 'bg-amber-600 text-white border-amber-600 shadow'
                          : 'bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {isChecked ? <CheckSquare className="w-3.5 h-3.5 shrink-0" /> : <Square className="w-3.5 h-3.5 shrink-0" />}
                      <span className="truncate">{day.slice(0, 3)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Date Pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Start Date *</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">End Date *</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
            </div>

            {/* 6. Hour / Time Pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Start Hour *</label>
                <select value={startTime} onChange={(e) => setStartTime(e.target.value)} className="form-input text-xs font-bold">
                  <option value="06:00 AM">06:00 AM</option>
                  <option value="07:00 AM">07:00 AM</option>
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="12:00 PM">12:00 PM (Noon)</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="08:00 PM">08:00 PM (Night)</option>
                  <option value="10:00 PM">10:00 PM (Night)</option>
                  <option value="12:00 AM">12:00 AM (Midnight)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">End Hour *</label>
                <select value={endTime} onChange={(e) => setEndTime(e.target.value)} className="form-input text-xs font-bold">
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="08:00 PM">08:00 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                  <option value="12:00 AM">12:00 AM (Midnight)</option>
                  <option value="06:00 AM">06:00 AM (Morning)</option>
                  <option value="08:00 AM">08:00 AM (Morning)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Shift Notes / Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="form-input text-xs"
                placeholder="e.g. Front desk supervisor and customer care"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-pattern-gold w-full py-2.5 text-xs font-bold shadow-lg"
            >
              {submitting ? "Saving Shift..." : editingShift ? "Update Shift Roster" : "Save & Publish Shift Roster"}
            </button>

          </form>
        </div>

        {/* Shift Rostering Matrix & Partner Details */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                All Department Shift Rosters & Working Partners
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed view of who and who are assigned to work in the same shift. Click edit to modify.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-600">
              {shiftRosters.length} Shifts Configured
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {shiftRosters.map((shift) => {
              // Find partners in the same department & time
              const partners = shiftRosters.filter(s => 
                s.department === shift.department && 
                s.start_time === shift.start_time &&
                s.id !== shift.id
              );

              return (
                <div key={shift.id} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase block">
                        {shift.shift_name} — {shift.department}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        👤 Assigned Staff: {shift.employee_name} (<span className="font-mono text-blue-600">{shift.employee_username}</span>)
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* 1. EDIT SHIFT BUTTON */}
                      <button
                        onClick={() => handleStartEditShift(shift)}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm hover:bg-amber-700 transition-colors"
                        title="Edit Shift Roster Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleSendIndividualNotification(shift)}
                        className="btn-pattern-primary px-2.5 py-1 text-[11px] font-bold flex items-center gap-1 shadow-sm"
                        title="Transmit individual shift notification to staff"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Alert</span>
                      </button>

                      <button
                        onClick={() => handleDeleteShift(shift.id)}
                        className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        title="Remove shift"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Time: <strong className="text-slate-900 dark:text-white">{shift.start_time} — {shift.end_time}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Dates: <strong>{shift.start_date}</strong> to <strong>{shift.end_date}</strong></span>
                    </p>
                  </div>

                  {/* Scheduled Days Badges */}
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[11px] font-bold text-slate-500 mr-1">Scheduled Days:</span>
                    {shift.days.map(day => (
                      <span key={day} className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-extrabold text-[10px]">
                        {day}
                      </span>
                    ))}
                  </div>

                  {/* Who & Who are in the SAME SHIFT */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-500" />
                      <span>Working Shift Partners ({partners.length} Colleagues in Same Shift):</span>
                    </span>

                    {partners.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">No other co-workers assigned to this exact shift block yet.</p>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {partners.map(p => (
                          <div key={p.id} className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border text-xs font-bold">
                            <span className="text-amber-600">🤝</span>
                            <span>{p.employee_name} ({p.employee_username})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
