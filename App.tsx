
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole, MedicalCase, Appointment } from './types';
import LandingPage from './views/LandingPage';
import PatientDashboard from './views/PatientDashboard';
import DoctorDashboard from './views/DoctorDashboard';
import CaseDetails from './views/CaseDetails';
import NewCase from './views/NewCase';
import FindDoctor from './views/FindDoctor';
import Appointments from './views/Appointments';
import { 
  Activity, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  Search, 
  Calendar, 
  PlusCircle,
  Stethoscope
} from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('med_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('med_user');
    setUser(null);
    window.location.hash = '/';
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50">
        {user && <Header user={user} onLogout={handleLogout} />}
        
        <main className="flex-1 flex overflow-hidden">
          {user && <Sidebar user={user} />}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={!user ? <LandingPage onAuth={setUser} /> : user.role === UserRole.PATIENT ? <PatientDashboard user={user} /> : <DoctorDashboard user={user} />} />
              <Route path="/new-case" element={<NewCase user={user!} />} />
              <Route path="/case/:id" element={<CaseDetails user={user!} />} />
              <Route path="/find-doctor" element={<FindDoctor user={user!} />} />
              <Route path="/appointments" element={<Appointments user={user!} />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

const Header: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => (
  <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
        <Activity className="text-white" size={24} />
      </div>
      <span className="text-xl font-bold text-slate-800 tracking-tight">MedConnect</span>
    </div>
    
    <div className="flex items-center gap-4">
      <div className="hidden md:flex flex-col items-end">
        <span className="text-sm font-semibold text-slate-700">
          {user.role === UserRole.PATIENT ? 'Anonymous Patient' : user.name}
        </span>
        <span className="text-xs text-slate-500 uppercase tracking-wider">{user.role}</span>
      </div>
      <button 
        onClick={onLogout}
        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <LogOut size={20} />
      </button>
    </div>
  </header>
);

const Sidebar: React.FC<{ user: User }> = ({ user }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-20 md:w-64 bg-white border-r border-slate-200 hidden sm:flex flex-col py-6">
      <nav className="flex-1 px-4 space-y-2">
        <SidebarLink 
          to="/" 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active={isActive('/')} 
        />
        
        {user.role === UserRole.PATIENT && (
          <>
            <SidebarLink 
              to="/new-case" 
              icon={<PlusCircle size={20} />} 
              label="New Inquiry" 
              active={isActive('/new-case')} 
            />
            <SidebarLink 
              to="/find-doctor" 
              icon={<Search size={20} />} 
              label="Find Specialist" 
              active={isActive('/find-doctor')} 
            />
          </>
        )}

        {user.role === UserRole.DOCTOR && (
          <SidebarLink 
            to="/find-doctor" // Doctors use it to browse cases
            icon={<Stethoscope size={20} />} 
            label="Open Cases" 
            active={isActive('/find-doctor')} 
          />
        )}

        <SidebarLink 
          to="/appointments" 
          icon={<Calendar size={20} />} 
          label="Appointments" 
          active={isActive('/appointments')} 
        />
      </nav>
      
      <div className="px-4 mt-auto">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hidden md:block">
          <p className="text-xs font-medium text-slate-500 uppercase mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-semibold text-slate-700">
              {user.isVerified ? 'Verified Pro' : 'Active'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean }> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
    }`}
  >
    {icon}
    <span className="font-medium hidden md:block">{label}</span>
  </Link>
);

export default App;
