import React, { useState } from 'react';
import { PanelLeftOpen, PanelLeftClose, X, ChevronRight, LayoutDashboard } from 'lucide-react';

export const DashboardSidebarDrawer = ({ tabs, activeTab, setActiveTab, title = "Dashboard Menu" }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setDrawerOpen(false);
    
    // Smoothly scroll directly to where the intended tab section/form exists instead of page top 0
    setTimeout(() => {
      const targetElem = document.getElementById(`tab-content-${tabId}`) 
        || document.getElementById('dashboard-tab-content')
        || document.getElementById('dashboard-main-content');
      if (targetElem) {
        const yOffset = -20;
        const y = targetElem.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 60);
  };

  return (
    <div className="w-full max-w-full">
      {/* 
        1. MOBILE DASHBOARD DRAWER TOGGLE BUTTON
        Visible on mobile screens (< md or lg) to trigger the left side drawer
      */}
      <div className="flex lg:hidden items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-lg mb-4 border border-amber-500/30">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-extrabold truncate">{title}</span>
        </div>

        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="btn-pattern-gold px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-md"
        >
          {drawerOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          <span>{drawerOpen ? 'Close Menu' : 'Dashboard Menu'}</span>
        </button>
      </div>

      {/* 
        2. DESKTOP STANDARD TABS BAR
        Visible on desktop (lg:flex)
      */}
      <div className="hidden lg:flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSelectTab(tab.id)}
            className={`sidebar-link ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 
        3. LEFT SIDE SLIDE DRAWER (FOR MOBILE SCREENS)
        Expands from left side when drawerOpen is true
      */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Left Side Drawer Content Panel */}
          <div className="relative z-10 w-72 max-w-[85vw] bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-white h-full shadow-2xl flex flex-col justify-between border-r border-amber-500/40 transform transition-transform duration-300 ease-in-out p-4 overflow-y-auto">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white shadow">
                    K
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white leading-tight truncate">{title}</h4>
                    <span className="text-[10px] text-amber-400 font-bold block">Left Navigation Drawer</span>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
                  Dashboard Sections
                </span>
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleSelectTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1 text-white' : 'text-slate-500'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer indicator */}
            <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400 text-center">
              Kebron International Hotel Portal
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
