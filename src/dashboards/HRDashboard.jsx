import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { BootstrapAlert } from '../components/BootstrapAlert';
import { Briefcase, Users, FileText, Download, Plus, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const HRDashboard = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [alert, setAlert] = useState(null);

  // Hire Form
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('RECEPTIONIST');
  const [empGender, setEmpGender] = useState('Female');
  const [empSalary, setEmpSalary] = useState('12000');
  const [empStatus, setEmpStatus] = useState('ACTIVE');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const u = await dataService.getUsers(); setUsers(u);
    const a = await dataService.getApplications(); setApplications(a);
  };

  const handleHireEmployee = async (e) => {
    e.preventDefault();
    const created = await dataService.createUser({
      full_name: empName,
      role: empRole,
      gender: empGender
    });
    setAlert({ type: 'success', message: `Employee ${empName} hired and recorded under ${empRole} department!` });
    setEmpName('');
    loadData();
  };

  const handleUpdateEmpStatus = async (user, status) => {
    await dataService.updateUser(user.id, { status });
    setAlert({ type: 'warning', message: `Employee ${user.full_name} status updated to ${status}.` });
    loadData();
  };

  const handleExportRecruitmentReportCSV = () => {
    let csv = "Applicant ID,Applicant Name,Email,Phone,Written Score,Written Result,Interview Score,Interview Result,Recruitment Status\n";
    applications.forEach(a => {
      csv += `"${a.id}","${a.applicant_name}","${a.email}","${a.phone}",${a.written_exam_score || 0},"${a.written_exam_result}",${a.interview_score || 0},"${a.interview_result}","${a.recruitment_status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Recruitment_Status_Report_For_Manager.csv';
    link.click();
  };

  const handleExportRecruitmentReportPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setFontSize(16);
    pdf.text("Kebron Hotel HR Recruitment & Hiring Status Report", 14, 15);
    pdf.setFontSize(10);
    pdf.text(`Submitted to Hotel Manager | Date: ${new Date().toLocaleDateString()}`, 14, 22);

    let y = 30;
    pdf.setFontSize(9);
    pdf.text("Applicant Name | Written Result | Interview Result | Status", 14, y);
    y += 5;
    pdf.line(14, y, 195, y);
    y += 5;

    applications.forEach(a => {
      pdf.text(`${a.applicant_name} | Written: ${a.written_exam_result} | Interview: ${a.interview_result} | Status: ${a.recruitment_status}`, 14, y);
      y += 6;
      if (y > 280) { pdf.addPage(); y = 15; }
    });

    pdf.save("HR_Recruitment_Status_Report.pdf");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-rose-950 via-pink-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-extrabold text-xs uppercase">
            Human Resources Management Department
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">Human Resources (HR) Dashboard</h1>
          <p className="text-xs text-slate-300">Welcome, {currentUser?.full_name}</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleExportRecruitmentReportCSV} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow">
            <Download className="w-4 h-4" /> CSV Report for Manager
          </button>
          <button onClick={handleExportRecruitmentReportPDF} className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow">
            <FileText className="w-4 h-4" /> PDF Report for Manager
          </button>
        </div>
      </div>

      {alert && <BootstrapAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Hire & Recruit Form */}
      <div className="glass-card p-6 space-y-4" id="hr-hire-form">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-rose-500" />
          <span>Hire & Recruit New Employee</span>
        </h3>

        <form onSubmit={handleHireEmployee} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={empName}
              onChange={(e) => setEmpName(e.target.value)}
              className="form-input text-xs"
              placeholder="Candidate Name"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Role / Department</label>
            <select value={empRole} onChange={(e) => setEmpRole(e.target.value)} className="form-input text-xs font-bold">
              <option value="RECEPTIONIST">Front Desk Receptionist</option>
              <option value="ACCOUNTANT">Accountant</option>
              <option value="JANITOR">Janitor</option>
              <option value="COOK">Cook / Chef</option>
              <option value="GUARDIAN">Guardian / Security</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Gender *</label>
            <select value={empGender} onChange={(e) => setEmpGender(e.target.value)} className="form-input text-xs font-bold">
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-pattern-gold w-full py-2.5 text-xs font-bold">
              Hire & Save Employee
            </button>
          </div>
        </form>
      </div>

      {/* Employee Master Directory & Employment Status (Active, Suspended, Retired, Fired) */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Employee Master Directory & Department Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b bg-slate-100 dark:bg-slate-900/60">
                <th className="p-3">Employee Name</th>
                <th className="p-3">Username ID</th>
                <th className="p-3">Department Role</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Employment Status</th>
                <th className="p-3 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="p-3 font-bold">{u.full_name}</td>
                  <td className="p-3 font-mono text-amber-600">{u.username}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{u.gender || 'Female'}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${
                      u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                      u.status === 'SUSPENDED' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {u.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <button
                      onClick={() => handleUpdateEmpStatus(u, 'ACTIVE')}
                      className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                    >
                      Active
                    </button>
                    <button
                      onClick={() => handleUpdateEmpStatus(u, 'SUSPENDED')}
                      className="px-2 py-1 bg-amber-500 text-white rounded text-[10px] font-bold"
                    >
                      Suspend
                    </button>
                    <button
                      onClick={() => handleUpdateEmpStatus(u, 'INACTIVE')}
                      className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold"
                    >
                      Fire/Retire
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
