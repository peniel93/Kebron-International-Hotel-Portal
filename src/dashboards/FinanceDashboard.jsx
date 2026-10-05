import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { BootstrapAlert } from '../components/BootstrapAlert';
import { DashboardSidebarDrawer } from '../components/DashboardSidebarDrawer';
import { Wallet, PieChart, Send, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const FinanceDashboard = () => {
  const { currentUser } = useAuth();
  const [financials, setFinancials] = useState([]);
  const [activeTab, setActiveTab] = useState('summary');
  const [alert, setAlert] = useState(null);

  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const f = await dataService.getFinancialRecords();
    setFinancials(f);
  };

  const handleSendReport = async (e) => {
    e.preventDefault();
    await dataService.sendReport({
      sender_role: 'FINANCE',
      sender_name: currentUser?.full_name || 'Finance User',
      report_title: reportTitle,
      content: reportContent
    });
    setAlert({ type: 'success', message: 'Financial budget report transmitted to Main Registrar Admin!' });
    setReportTitle('');
    setReportContent('');
  };

  const totalIncome = financials.filter(f => f.type === 'INCOME').reduce((sum, f) => sum + f.amount, 0);
  const totalExpense = financials.filter(f => f.type === 'EXPENSE').reduce((sum, f) => sum + f.amount, 0);
  const netReserve = totalIncome - totalExpense;

  const tabs = [
    { id: 'summary', label: 'Financial Reserve & Cash Flow', icon: <Wallet className="w-4 h-4" /> },
    { id: 'report', label: 'Transmit Finance Report', icon: <Send className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-cyan-900 via-blue-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-cyan-500 text-white font-extrabold text-xs uppercase">
            Finance & Treasury Division
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">Finance Dashboard</h1>
          <p className="text-xs text-slate-300">Welcome, {currentUser?.full_name} ({currentUser?.username})</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold bg-white/10 p-3 rounded-xl border border-white/20">
          <div>
            <span className="text-slate-300 block">Total Reserve Fund</span>
            <span className="text-lg font-black text-cyan-300">{netReserve.toLocaleString()} ETB</span>
          </div>
        </div>
      </div>

      {alert && <BootstrapAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Left-Side Navigation Drawer */}
      <DashboardSidebarDrawer
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        title="Finance Navigation Menu"
      />

      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="tab-content-summary">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-emerald-500" />
              <span>Revenue Streams Breakdown</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 font-semibold">
                <span>Room Reservations Settlement</span>
                <span className="font-bold text-emerald-600">+{ (totalIncome * 0.65).toLocaleString() } ETB</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 font-semibold">
                <span>Dining & Culinary Sales</span>
                <span className="font-bold text-emerald-600">+{ (totalIncome * 0.35).toLocaleString() } ETB</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowDownRight className="w-5 h-5 text-red-500" />
              <span>Expenditures & Payroll Breakdown</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 font-semibold">
                <span>Staff Payroll & Benefits</span>
                <span className="font-bold text-red-600">-{ (totalExpense * 0.55).toLocaleString() } ETB</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 font-semibold">
                <span>Utilities, Maintenance & Supplies</span>
                <span className="font-bold text-red-600">-{ (totalExpense * 0.45).toLocaleString() } ETB</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="glass-card p-6 space-y-4 max-w-2xl" id="tab-content-report">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-cyan-500" />
            <span>Transmit Treasury & Budget Report</span>
          </h3>

          <form onSubmit={handleSendReport} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">Report Title *</label>
              <input
                type="text"
                required
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="form-input text-xs"
                placeholder="e.g. Quarterly Budget Allocation & Liquidity Report"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Report Body Details *</label>
              <textarea
                required
                rows="5"
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                className="form-input text-xs"
                placeholder="Treasury allocations, liquidity reserves..."
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
