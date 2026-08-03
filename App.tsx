import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { BuildingsView } from './components/BuildingsView';
import { SmartUnitsView } from './components/SmartUnitsView';
import { GardenSimulatorView } from './components/GardenSimulatorView';
import { InvoicesView } from './components/InvoicesView';
import { CCTVView } from './components/CCTVView';
import { GeminiWellbeingView } from './components/GeminiWellbeingView';
import { EmergencySOSView } from './components/EmergencySOSView';
import { MaintenancePredictiveView } from './components/MaintenancePredictiveView';
import { UserManagementView } from './components/UserManagementView';
import { Cpu, Wifi, ShieldCheck, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, userRole } = useApp();

  // Tenant cleanup constraint: if tenant lands on hidden admin tabs (0, 1, 3, 9), show Smart Units view (2)
  let currentTab = activeTab;
  if (userRole === 'tenant' && (activeTab === 0 || activeTab === 1 || activeTab === 3 || activeTab === 9)) {
    currentTab = 2;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
      {currentTab === 0 && <DashboardView />}
      {currentTab === 1 && <BuildingsView />}
      {currentTab === 2 && <SmartUnitsView />}
      {currentTab === 3 && <GardenSimulatorView />}
      {currentTab === 4 && <InvoicesView />}
      {currentTab === 5 && <CCTVView />}
      {currentTab === 6 && <GeminiWellbeingView />}
      {currentTab === 7 && <EmergencySOSView />}
      {currentTab === 8 && <MaintenancePredictiveView />}
      {currentTab === 9 && <UserManagementView />}
    </main>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-3 px-6 text-slate-500 text-xs mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-indigo-600">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            منظومة T-Balanced Smart Real Estate
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            مزامنة الداتا بيز نشطة
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-slate-500" /> Wi-Fi Mesh
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> حماية الخصوصية
          </span>
          <span>Gemini AI Engine v3.6</span>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col dir-rtl" dir="rtl">
        <Header />
        <Navigation />
        <MainContent />
        <Footer />
      </div>
    </AppProvider>
  );
}

