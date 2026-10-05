import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { BootstrapAlert } from '../components/BootstrapAlert';
import { DashboardSidebarDrawer } from '../components/DashboardSidebarDrawer';
import { Boxes, Plus, Send, Layers, Tag, CheckCircle2 } from 'lucide-react';

export const StoreManagerDashboard = () => {
  const { currentUser } = useAuth();
  const [storeAssets, setStoreAssets] = useState([]);
  const [storeCategories, setStoreCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [alert, setAlert] = useState(null);

  // Asset Form
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Plastic Chairs');
  const [color, setColor] = useState('White');
  const [qtyNormal, setQtyNormal] = useState('100');
  const [qtyDefective, setQtyDefective] = useState('0');
  const [remarks, setRemarks] = useState('');

  // Custom Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Report Form
  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const assets = await dataService.getStoreAssets();
    setStoreAssets(assets);

    const cats = await dataService.getStoreCategories();
    setStoreCategories(cats);
    if (cats.length > 0 && !category) {
      setCategory(cats[0].name);
    }
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    await dataService.saveStoreAsset({
      item_name: itemName,
      category,
      color,
      quantity_normal: parseInt(qtyNormal),
      quantity_defective: parseInt(qtyDefective),
      remarks
    });
    setAlert({ type: 'success', message: `Store asset item "${itemName}" updated in inventory!` });
    setItemName('');
    setRemarks('');
    loadData();
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const created = await dataService.createStoreCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim()
    });

    setAlert({
      type: 'success',
      message: `Custom store category "${created.name}" created and added to dropdown list!`
    });
    setNewCatName('');
    setNewCatDesc('');
    setCategory(created.name);
    loadData();
  };

  const handleSendReport = async (e) => {
    e.preventDefault();
    await dataService.sendReport({
      sender_role: 'STORE_MANAGER',
      sender_name: currentUser?.full_name || 'Store Manager User',
      report_title: reportTitle,
      content: reportContent
    });
    setAlert({ type: 'success', message: 'Inventory status report transmitted to Main Registrar Admin!' });
    setReportTitle('');
    setReportContent('');
  };

  const tabs = [
    { id: 'inventory', label: 'Store Asset Inventory', icon: <Boxes className="w-4 h-4" /> },
    { id: 'categories', label: 'Item Custom Categories', icon: <Layers className="w-4 h-4" /> },
    { id: 'report', label: 'Transmit Store Audit Report', icon: <Send className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-purple-500 text-white font-extrabold text-xs uppercase">
            Store & Inventory Division
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">Store Manager Dashboard</h1>
          <p className="text-xs text-slate-300">Welcome, {currentUser?.full_name} ({currentUser?.username})</p>
        </div>
      </div>

      {alert && <BootstrapAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Left-Side Navigation Drawer */}
      <DashboardSidebarDrawer
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        title="Store Navigation Menu"
      />

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="tab-content-inventory">
          
          {/* Add Item Form */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-500" />
              <span>Record Store Item</span>
            </h3>

            <form onSubmit={handleAddAsset} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Item Description Name *</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="form-input text-xs"
                  placeholder="e.g. Garden Party Chairs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold">Category</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('categories')}
                    className="text-[10px] text-purple-600 font-extrabold hover:underline"
                  >
                    + Add New Category
                  </button>
                </div>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-input text-xs font-bold">
                  {storeCategories.map((cat) => (
                    <option key={cat.id || cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Color</label>
                <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="form-input text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold mb-1">Normal Quantity</label>
                  <input type="number" value={qtyNormal} onChange={(e) => setQtyNormal(e.target.value)} className="form-input text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-red-500">Defective Quantity</label>
                  <input type="number" value={qtyDefective} onChange={(e) => setQtyDefective(e.target.value)} className="form-input text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Location / Remarks</label>
                <input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} className="form-input text-xs" placeholder="e.g. Main Event Hall" />
              </div>

              <button type="submit" className="btn-pattern-gold w-full py-2.5 text-xs font-bold">
                Update Asset Record
              </button>
            </form>
          </div>

          {/* Inventory Table */}
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Hotel Assets & Furniture Stock</span>
              <span className="text-xs text-slate-500 font-bold">{storeAssets.length} Items</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-100 dark:bg-slate-900/60">
                    <th className="p-3">Item Description</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Color</th>
                    <th className="p-3 text-center text-emerald-600">Normal Qty</th>
                    <th className="p-3 text-center text-red-600">Defective Qty</th>
                    <th className="p-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {storeAssets.map((asset) => (
                    <tr key={asset.id}>
                      <td className="p-3 font-bold">{asset.item_name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-extrabold text-[10px]">
                          {asset.category}
                        </span>
                      </td>
                      <td className="p-3">{asset.color}</td>
                      <td className="p-3 text-center font-bold text-emerald-600">{asset.quantity_normal}</td>
                      <td className="p-3 text-center font-bold text-red-600">{asset.quantity_defective}</td>
                      <td className="p-3 text-slate-500">{asset.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 1. STORE CUSTOM CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="tab-content-categories">
          {/* Create Custom Category Form */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-500" />
              <span>Create Item Custom Category</span>
            </h3>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="form-input text-xs"
                  placeholder="e.g. Curtains & Drapery"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Description / Notes</label>
                <textarea
                  rows="3"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="form-input text-xs"
                  placeholder="Details regarding this asset classification..."
                ></textarea>
              </div>

              <button type="submit" className="btn-pattern-gold w-full py-2.5 text-xs font-bold shadow-md">
                Add & Save Category in Database
              </button>
            </form>
          </div>

          {/* Active Store Categories List */}
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Configured Store Asset Categories</span>
              <span className="text-xs text-slate-500 font-bold">{storeCategories.length} Categories</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {storeCategories.map((cat, idx) => (
                <div key={cat.id || idx} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      <span>{cat.name}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {cat.description || "Custom category configured for store inventory items."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="glass-card p-6 space-y-4 max-w-2xl" id="tab-content-report">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-purple-500" />
            <span>Transmit Store Audit Report to Main Registrar</span>
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
                placeholder="e.g. Monthly Furniture & Electronic Defective Audit"
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
                placeholder="Details regarding asset repairs, plastic chair replacements..."
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
