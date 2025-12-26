
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, MedicalCase, Diagnosis, UserRole } from '../types';
import { draftDiagnosis } from '../services/geminiService';
import { 
  User as UserIcon, 
  Calendar, 
  ChevronLeft, 
  Stethoscope, 
  CheckCircle, 
  Star, 
  ShieldCheck, 
  MessageSquare, 
  Sparkles,
  Loader2
} from 'lucide-react';

const CaseDetails: React.FC<{ user: User }> = ({ user }) => {
  const { id } = useParams();
  const [medicalCase, setMedicalCase] = useState<MedicalCase | null>(null);
  const [newDiagnosis, setNewDiagnosis] = useState({ content: '', recommendations: '' });
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const allCases = JSON.parse(localStorage.getItem('med_cases') || '[]');
    const found = allCases.find((c: MedicalCase) => c.id === id);
    if (found) setMedicalCase(found);
  }, [id]);

  const handleAiDraft = async () => {
    if (!medicalCase) return;
    setLoadingAi(true);
    try {
      const draft = await draftDiagnosis(medicalCase.description, medicalCase.symptoms);
      setNewDiagnosis(prev => ({ ...prev, content: draft }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAi(false);
    }
  };

  const submitDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicalCase || user.role !== UserRole.DOCTOR) return;

    const diagnosis: Diagnosis = {
      id: `diag_${Date.now()}`,
      doctorId: user.id,
      doctorName: user.name || 'Anonymous Doctor',
      content: newDiagnosis.content,
      recommendations: newDiagnosis.recommendations,
      createdAt: new Date().toISOString()
    };

    const updatedCase = {
      ...medicalCase,
      status: 'Consulted' as const,
      diagnoses: [diagnosis, ...medicalCase.diagnoses]
    };

    const allCases = JSON.parse(localStorage.getItem('med_cases') || '[]');
    const updatedAll = allCases.map((c: MedicalCase) => c.id === id ? updatedCase : c);
    localStorage.setItem('med_cases', JSON.stringify(updatedAll));
    setMedicalCase(updatedCase);
    setNewDiagnosis({ content: '', recommendations: '' });
  };

  if (!medicalCase) return <div className="p-8 text-center text-slate-500">Case not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <Link to="/" className="text-slate-400 hover:text-slate-600 flex items-center gap-2 group transition-all">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Case Description Section */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  Case #{medicalCase.id.slice(-6)}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  medicalCase.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {medicalCase.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <Calendar size={16} />
                {new Date(medicalCase.createdAt).toLocaleDateString()}
              </div>
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">{medicalCase.title}</h1>
            
            <div className="space-y-8">
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {medicalCase.description}
                </p>
              </div>

              {medicalCase.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {medicalCase.images.map((img, i) => (
                    <img key={i} src={img} className="rounded-3xl border border-slate-100 shadow-lg object-cover w-full aspect-square" />
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {medicalCase.symptoms.map((s, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-100 rounded-2xl text-sm font-semibold text-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Expert Diagnoses Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Stethoscope size={28} className="text-blue-600" />
              Expert Replies ({medicalCase.diagnoses.length})
            </h2>

            {medicalCase.diagnoses.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 p-12 rounded-3xl text-center">
                <p className="text-slate-500 font-medium">Waiting for verified specialists to review this case.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {medicalCase.diagnoses.map((diag) => (
                  <DiagnosisCard key={diag.id} diagnosis={diag} />
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-8">
          {/* Doctor Submission Section */}
          {user.role === UserRole.DOCTOR && (
            <div className="bg-white p-8 rounded-[2rem] border border-blue-100 shadow-2xl sticky top-24">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="text-blue-600" />
                Submit Diagnosis
              </h3>
              <form onSubmit={submitDiagnosis} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Diagnosis Content</label>
                  <textarea 
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={newDiagnosis.content}
                    onChange={e => setNewDiagnosis({...newDiagnosis, content: e.target.value})}
                    placeholder="Your professional opinion..."
                  />
                  <button 
                    type="button"
                    onClick={handleAiDraft}
                    disabled={loadingAi}
                    className="mt-2 flex items-center gap-2 text-xs text-blue-600 font-bold"
                  >
                    {loadingAi ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Generate Draft with AI
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Recommendations</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={newDiagnosis.recommendations}
                    onChange={e => setNewDiagnosis({...newDiagnosis, recommendations: e.target.value})}
                    placeholder="Next steps for the patient..."
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                  Post Expert Response
                </button>
              </form>
            </div>
          )}

          <div className="bg-slate-900 text-white p-8 rounded-[2rem] space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-400" />
              Patient Instructions
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Found a diagnosis helpful? Rate the specialist and book an appointment for a deep dive consultation.
            </p>
            <div className="pt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <CheckCircle size={14} className="text-emerald-400" /> All doctors are verified
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <CheckCircle size={14} className="text-emerald-400" /> Encrypted communication
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const DiagnosisCard: React.FC<{ diagnosis: Diagnosis }> = ({ diagnosis }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4">
      <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
        <Star size={14} fill="currentColor" />
        <span className="text-xs font-bold">4.9 Expert Rating</span>
      </div>
    </div>

    <div className="flex items-center gap-4 mb-6">
      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
        <img src={`https://i.pravatar.cc/150?u=${diagnosis.doctorId}`} alt="Doctor" />
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{diagnosis.doctorName}</h4>
        <p className="text-xs text-slate-500 font-medium">Verified Medical Professional</p>
      </div>
    </div>

    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Diagnosis</p>
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{diagnosis.content}</p>
      </div>
      <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Recommendations</p>
        <p className="text-blue-900 leading-relaxed font-medium">{diagnosis.recommendations}</p>
      </div>
    </div>

    <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
      <div className="flex items-center gap-4">
        <button className="text-sm font-bold text-slate-900 hover:text-blue-600 flex items-center gap-2 transition-colors">
          <Star size={16} /> Rate Advice
        </button>
        <Link to="/appointments" className="text-sm font-bold text-blue-600 hover:text-blue-700 px-4 py-2 bg-blue-50 rounded-xl transition-all">
          Book Appointment
        </Link>
      </div>
      <span className="text-xs text-slate-400 font-medium">Responded on {new Date(diagnosis.createdAt).toLocaleDateString()}</span>
    </div>
  </div>
);

export default CaseDetails;
