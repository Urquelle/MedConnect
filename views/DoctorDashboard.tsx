
import React, { useState, useEffect } from 'react';
import { User, MedicalCase, Appointment } from '../types';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Activity, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Star
} from 'lucide-react';

const DoctorDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [openCases, setOpenCases] = useState<MedicalCase[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const allCases = JSON.parse(localStorage.getItem('med_cases') || '[]');
    setOpenCases(allCases.filter((c: MedicalCase) => c.status === 'Open'));
    
    const allApps = JSON.parse(localStorage.getItem('med_appointments') || '[]');
    setAppointments(allApps.filter((a: Appointment) => a.doctorId === user.id));
  }, [user.id]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.name}</h1>
          <p className="text-slate-500 mt-1">Reviewing inquiries for {user.specialization}.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold">
            <CheckCircle size={16} /> Verified Physician
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-bold">
            <Star size={16} fill="currentColor" /> {user.rating} (0 reviews)
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard label="Pending Cases" value={openCases.length} sub="Requiring review" color="blue" />
        <StatCard label="Patients Consulted" value="0" sub="Last 30 days" color="emerald" />
        <StatCard label="Today's Appointments" value={appointments.length} sub="Schedule" color="indigo" />
        <StatCard label="Avg. Response" value="2.4h" sub="Efficiency" color="orange" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-blue-600" size={24} />
              Open Inquiries
            </h2>
            <Link to="/find-doctor" className="text-blue-600 text-sm font-semibold hover:underline">Browse All</Link>
          </div>
          
          <div className="space-y-4">
            {openCases.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-100 text-center text-slate-400">
                No open inquiries matching your profile.
              </div>
            ) : (
              openCases.slice(0, 5).map(c => (
                <Link key={c.id} to={`/case/${c.id}`} className="block bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-lg transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Case #{c.id.slice(-6)}</span>
                    <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{c.title}</h3>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex -space-x-2">
                      {c.images.length > 0 && <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">+ {c.images.length}</div>}
                    </div>
                    <span className="text-sm text-slate-500">{c.description.slice(0, 60)}...</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-indigo-600" size={24} />
              Upcoming Appointments
            </h2>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-50">
            {appointments.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="text-slate-200 mx-auto mb-4" size={48} />
                <p className="text-slate-500 font-medium">No appointments scheduled for today.</p>
              </div>
            ) : (
              appointments.map(app => (
                <div key={app.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold">
                      {app.time}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Anonymous Patient</h4>
                      <p className="text-xs text-slate-500">{app.date}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all">
                    Open Consult
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; sub: string; color: string }> = ({ label, value, sub, color }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    indigo: 'bg-indigo-600 text-white',
    orange: 'bg-orange-600 text-white'
  };

  return (
    <div className={`p-6 rounded-3xl shadow-xl flex flex-col justify-between h-40 ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</span>
        <TrendingUp size={16} />
      </div>
      <div>
        <p className="text-3xl font-extrabold">{value}</p>
        <p className="text-xs font-medium opacity-70 mt-1">{sub}</p>
      </div>
    </div>
  );
};

export default DoctorDashboard;
