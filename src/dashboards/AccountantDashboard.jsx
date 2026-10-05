import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { BootstrapAlert } from '../components/BootstrapAlert';
import { DashboardSidebarDrawer } from '../components/DashboardSidebarDrawer';
import { DollarSign, FileText, Send, Plus, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';

export const AccountantDashboard = () => {
  const { currentUser } = useAuth();
  const [financials, setFinancials] = useState([]);
  const [activeTab, setActiveTab] = useState('entries');
  const [alert, setAlert] = useState(null);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('INCOME');
  const [amount, setAmount] = useState('5000');
  const [category, setCategory] = useState('Room Bookings');
  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const f = await dataService.getFinancialRecords();
    setFinancials(f);
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    await dataService.addFinancialRecord({
      title,
      type,
      amount: parseFloat(amount),
      category
    });
    setAlert({ type: 'success', message: 'Financial entry recorded successfully!' });
    setTitle('');
    loadData();
  };

  const handleSendReport = async (e) => {
    e.preventDefault();
    await dataService.sendReport({
      sender_role: 'ACCOUNTANT',
      sender_name: currentUser?.full_name || 'Accountant User',
      report_title: reportTitle,
      content: reportContent
    });
    setAlert({ type: 'success', message: 'Financial audit report transmitted to Main Registrar!' });
    setReportTitle('');
    setReportContent('');
  };

  const totalIncome = financials.filter(f => f.type === 'INCOME').reduce((sum, f) => sum + f.amount, 0);
  const totalExpense = financials.filter(f => f.type === 'EXPENSE').reduce((sum, f) => sum + f.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const tabs = [
    { id: 'entries', label: 'Financial Ledgers & Entries', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'report', label: 'Transmit Audit Report', icon: <Send className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-xs uppercase">
            Accounting Department Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">Accountant Dashboard</h1>
          <p className="text-xs text-slate-300">Welcome, {currentUser?.full_name} ({currentUser?.username})</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold bg-white/10 p-3 rounded-xl border border-white/20">
          <div>
            <span className="text-slate-300 block">Total Income</span>
            <span className="text-lg font-black text-emerald-400">+{totalIncome.toLocaleString()} ETB</span>
          </div>
          <div className="border-l border-white/20 pl-4">
            <span className="text-slate-300 block">Total Expenses</span>
            <span className="text-lg font-black text-red-400">-{totalExpense.toLocaleString()} ETB</span>
          </div>
          <div className="border-l border-white/20 pl-4">
            <span className="text-slate-300 block">Net Balance</span>
            <span className="text-lg font-black text-amber-400">{netBalance.toLocaleString()} ETB</span>
          </div>
        </div>
      </div>

      {alert && <BootstrapAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Left-Side Navigation Drawer */}
      <DashboardSidebarDrawer
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        title="Accountant Navigation Menu"
      />

      {activeTab === 'entries' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="tab-content-entries">
          
          {/* Record Transaction Form */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-500" />
              <span>Record Financial Entry</span>
            </h3>

            <form onSubmit={handleAddRecord} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Transaction Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input text-xs"
                  placeholder="e.g. Daily Room Booking Settlement"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold mb-1">Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="form-input text-xs font-bold">
                    <option value="INCOME">Income (+)</option>
                    <option value="EXPENSE">Expense (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Amount (ETB)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-input text-xs">
                  <option value="Room Bookings">Room Bookings</option>
                  <option value="Food & Restaurant">Food & Restaurant</option>
                  <option value="Payroll & Salaries">Payroll & Salaries</option>
                  <option value="Utilities & Energy">Utilities & Energy</option>
                  <option value="Maintenance & Supplies">Maintenance & Supplies</option>
                </select>
              </div>

              <button type="submit" className="btn-pattern-gold w-full py-2.5 text-xs font-bold">
                Save Financial Record
              </button>
            </form>
          </div>

          {/* Financial Transactions Table */}
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Financial Ledgers History</span>
              <span className="text-xs text-slate-500 font-bold">{financials.length} Entries</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-100 dark:bg-slate-900/60">
                    <th className="p-3">Date</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {financials.map((f) => (
                    <tr key={f.id}>
                      <td className="p-3 font-mono text-[11px]">{f.created_at}</td>
                      <td className="p-3 font-bold">{f.title}</td>
                      <td className="p-3">{f.category}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          f.type === 'INCOME' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {f.type}
                        </span>
                      </td>
                      <td className={`p-3 text-right font-mono font-bold ${
                        f.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {f.type === 'INCOME' ? '+' : '-'}{f.amount.toLocaleString()} ETB
                      </td>
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
            <span>Transmit Accounting Audit Report to Registrar</span>
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
                placeholder="e.g. Monthly Revenue & Tax Settlement Audit"
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
                placeholder="Comprehensive summary of ledger entries, outstanding receivables..."
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
