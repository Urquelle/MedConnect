
import React, { useState, useEffect } from 'react';
import { User, UserRole, MedicalCase } from '../types';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ShieldCheck, ChevronRight, Filter } from 'lucide-react';

const FindDoctor: React.FC<{ user: User }> = ({ user }) => {
  const isPatient = user.role === UserRole.PATIENT;
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (isPatient) {
      // Mock doctors - in a real app this would be an API call
      setItems([
        { id: 'doc1', name: 'Dr. Sarah Mitchell', specialty: 'Neurology', rating: 4.9, reviews: 128, image: 'https://i.pravatar.cc/150?u=sarah' },
        { id: 'doc2', name: 'Dr. James Wilson', specialty: 'Cardiology', rating: 4.8, reviews: 95, image: 'https://i.pravatar.cc/150?u=james' },
        { id: 'doc3', name: 'Dr. Elena Rossi', specialty: 'Dermatology', rating: 5.0, reviews: 210, image: 'https://i.pravatar.cc/150?u=elena' },
        { id: 'doc4', name: 'Dr. David Kim', specialty: 'Orthopedics', rating: 4.7, reviews: 56, image: 'https://i.pravatar.cc/150?u=david' },
      ]);
    } else {
      const allCases = JSON.parse(localStorage.getItem('med_cases') || '[]');
      setItems(allCases.filter((c: MedicalCase) => c.status === 'Open'));
    }
  }, [isPatient]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isPatient ? 'Browse Our Specialist Network' : 'Browse Open Inquiries'}
          </h1>
          <p className="text-slate-500 mt-2">
            {isPatient ? 'Consult with top-rated medical experts anonymously.' : 'Find cases matching your specialization.'}
          </p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder={isPatient ? "Search by specialty or name..." : "Search symptoms or tags..."}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50">
          <Filter size={20} />
          Filters
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {items.filter(item => {
          const searchIn = isPatient ? (item.name + item.specialty) : (item.title + item.description);
          return searchIn.toLowerCase().includes(query.toLowerCase());
        }).map(item => (
          isPatient ? <DoctorCard key={item.id} doctor={item} /> : <CaseCard key={item.id} medicalCase={item} />
        ))}
      </div>
    </div>
  );
};

const DoctorCard: React.FC<{ doctor: any }> = ({ doctor }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg flex items-center gap-6 group hover:shadow-2xl hover:-translate-y-1 transition-all">
    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
      <img src={doctor.image} className="w-full h-full object-cover" />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-lg font-extrabold text-slate-900">{doctor.name}</h3>
        <ShieldCheck size={16} className="text-blue-600" />
      </div>
      <p className="text-sm font-semibold text-blue-600 mb-3">{doctor.specialty}</p>
      
      <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
        <div className="flex items-center gap-1">
          <Star size={14} className="text-amber-500 fill-amber-500" />
          <span className="text-slate-900">{doctor.rating}</span>
          <span className="font-medium text-slate-400">({doctor.reviews} reviews)</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link 
          to="/appointments" 
          className="flex-1 py-2 text-center bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
        >
          Book Appointment
        </Link>
        <button className="px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
);

const CaseCard: React.FC<{ medicalCase: MedicalCase }> = ({ medicalCase }) => (
  <Link 
    to={`/case/${medicalCase.id}`}
    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg group hover:shadow-2xl hover:-translate-y-1 transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        medicalCase.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
      }`}>
        {medicalCase.severity} Priority
      </span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {new Date(medicalCase.createdAt).toLocaleDateString()}
      </span>
    </div>
    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
      {medicalCase.title}
    </h3>
    <p className="text-sm text-slate-500 line-clamp-2 mb-6">
      {medicalCase.description}
    </p>
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {medicalCase.symptoms.slice(0, 2).map(s => (
          <span key={s} className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
            {s}
          </span>
        ))}
        {medicalCase.symptoms.length > 2 && <span className="text-[10px] font-bold text-slate-300">+{medicalCase.symptoms.length - 2} more</span>}
      </div>
      <div className="flex items-center gap-1 text-blue-600 font-bold text-xs uppercase tracking-wider">
        Respond Now
        <ChevronRight size={14} />
      </div>
    </div>
  </Link>
);

export default FindDoctor;
