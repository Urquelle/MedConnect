
import React, { useState, useEffect } from 'react';
import { User, MedicalCase } from '../types';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  MessageCircle, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Plus, 
  Stethoscope, 
  Star 
} from 'lucide-react';

const PatientDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [cases, setCases] = useState<MedicalCase[]>([]);

  useEffect(() => {
    const savedCases = JSON.parse(localStorage.getItem('med_cases') || '[]');
    setCases(savedCases.filter((c: MedicalCase) => c.patientId === user.id));
  }, [user.id]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Health Overview</h1>
          <p className="text-slate-500 mt-1">Manage your inquiries and reviews privately.</p>
        </div>
        <Link 
          to="/new-case" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          New Medical Inquiry
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Active Consultations" 
          value={cases.filter(c => c.status === 'Open').length} 
          icon={<MessageCircle className="text-blue-600" size={24} />}
        />
        <StatCard 
          label="Diagnoses Received" 
          value={cases.reduce((acc, c) => acc + c.diagnoses.length, 0)} 
          icon={<Stethoscope className="text-emerald-600" size={24} />}
        />
        <StatCard 
          label="Avg. Doctor Rating" 
          value="4.8/5" 
          icon={<Star className="text-amber-500 fill-amber-500" size={24} />}
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Recent Inquiries</h2>
          <Link to="/history" className="text-blue-600 text-sm font-semibold hover:underline">View All History</Link>
        </div>

        {cases.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No cases yet</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">Submit your first medical inquiry to get started with professional advice.</p>
            <Link to="/new-case" className="mt-6 inline-block text-blue-600 font-bold">Start Now →</Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {cases.map((c) => (
              <CaseCard key={c.id} medicalCase={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
    <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
    <div>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const CaseCard: React.FC<{ medicalCase: MedicalCase }> = ({ medicalCase }) => {
  const severityColors = {
    Low: 'bg-green-100 text-green-700',
    Medium: 'bg-amber-100 text-amber-700',
    High: 'bg-orange-100 text-orange-700',
    Emergency: 'bg-red-100 text-red-700'
  };

  return (
    <Link 
      to={`/case/${medicalCase.id}`}
      className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-between group"
    >
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
          <FileText className="text-blue-600" size={28} />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-slate-900">{medicalCase.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${severityColors[medicalCase.severity]}`}>
              {medicalCase.severity}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              {new Date(medicalCase.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={14} />
              {medicalCase.diagnoses.length} Expert Replies
            </div>
          </div>
        </div>
      </div>
      <ChevronRight size={24} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
    </Link>
  );
};

export default PatientDashboard;
