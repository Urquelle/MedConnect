
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Shield, UserPlus, Fingerprint, Stethoscope, ChevronRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onAuth: (user: User) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuth }) => {
  const [view, setView] = useState<'home' | 'doctor-reg'>('home');

  const handlePatientLogin = () => {
    const newUser: User = {
      id: `pat_${Math.random().toString(36).substr(2, 9)}`,
      role: UserRole.PATIENT,
      isVerified: false
    };
    localStorage.setItem('med_user', JSON.stringify(newUser));
    onAuth(newUser);
  };

  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newUser: User = {
      id: `doc_${Math.random().toString(36).substr(2, 9)}`,
      role: UserRole.DOCTOR,
      name: formData.get('name') as string,
      specialization: formData.get('specialty') as string,
      isVerified: true,
      rating: 5.0,
      reviewCount: 0,
      avatar: 'https://picsum.photos/200/200'
    };
    localStorage.setItem('med_user', JSON.stringify(newUser));
    onAuth(newUser);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center max-w-6xl mx-auto px-4">
      {view === 'home' ? (
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold tracking-wide uppercase">
                Secure & Anonymous
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                Medical Advice <br /> <span className="text-blue-600">Without Compromise.</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-lg">
                Submit symptoms anonymously. Get verified expert diagnoses. Manage your health journey with complete privacy.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handlePatientLogin}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                <Fingerprint size={24} />
                Enter Anonymously
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setView('doctor-reg')}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-all"
              >
                <Stethoscope size={24} />
                Doctor Portal
              </button>
            </div>

            <div className="flex gap-6 pt-4">
              <Feature text="100% Anonymous" />
              <Feature text="Verified Pros" />
              <Feature text="AI-Powered" />
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-blue-600 blur-[100px] opacity-10 rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" 
              alt="Medical Professional" 
              className="relative z-10 rounded-3xl shadow-2xl border-8 border-white"
            />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
          <button onClick={() => setView('home')} className="text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-2">
            ← Back to start
          </button>
          <h2 className="text-3xl font-bold mb-2">Doctor Registration</h2>
          <p className="text-slate-500 mb-8">Join our network of verified medical professionals providing anonymous second opinions.</p>
          
          <form onSubmit={handleDoctorLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
              <input required name="name" type="text" placeholder="Dr. John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Specialization</label>
              <select name="specialty" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option>General Medicine</option>
                <option>Dermatology</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Orthopedics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Verification Code</label>
              <input required type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-200 mt-4">
              Verify & Enter
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const Feature: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-2">
    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
      <CheckCircle2 size={12} className="text-green-600" />
    </div>
    <span className="text-sm font-medium text-slate-600">{text}</span>
  </div>
);

export default LandingPage;
