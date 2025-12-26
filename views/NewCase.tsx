
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MedicalCase } from '../types';
import { analyzeSymptoms } from '../services/geminiService';
// Fix: Added missing Shield icon import from lucide-react
import { Upload, X, Camera, AlertCircle, Sparkles, Loader2, ArrowRight, Shield } from 'lucide-react';

const NewCase: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    symptoms: '',
    severity: 'Medium' as MedicalCase['severity']
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Fix: Explicitly typing 'file' as File to resolve the 'unknown' to 'Blob' error in readAsDataURL
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const runAiAnalysis = async () => {
    if (!formData.description) return;
    setLoading(true);
    try {
      const result = await analyzeSymptoms(formData.description, images);
      setAiSuggestions(result);
      setFormData(prev => ({
        ...prev,
        severity: result.urgencyLevel
      }));
    } catch (error) {
      console.error(error);
      alert("AI Analysis failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: MedicalCase = {
      id: `case_${Date.now()}`,
      patientId: user.id,
      title: formData.title,
      description: formData.description,
      symptoms: formData.symptoms.split(',').map(s => s.trim()),
      severity: formData.severity,
      images: images,
      status: 'Open',
      createdAt: new Date().toISOString(),
      diagnoses: []
    };

    const existing = JSON.parse(localStorage.getItem('med_cases') || '[]');
    localStorage.setItem('med_cases', JSON.stringify([newCase, ...existing]));
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">New Medical Inquiry</h1>
        <p className="text-slate-500 mt-2">Provide as much detail as possible for our specialists to review. Your identity remains 100% anonymous.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Brief Headline</label>
                <input 
                  required
                  placeholder="e.g., Persistent lower back pain after exercise"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Detailed Description</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Describe your symptoms, how long you've had them, and anything that makes them better or worse..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={runAiAnalysis}
                  disabled={loading || !formData.description}
                  className="mt-2 flex items-center gap-2 text-sm text-blue-600 font-bold hover:text-blue-700 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Refine with Smart AI Assistant
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tags / Specific Symptoms (Comma separated)</label>
                <input 
                  placeholder="Pain, swelling, fever, fatigue"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.symptoms}
                  onChange={e => setFormData({...formData, symptoms: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Upload Medical Imaging / Photos</label>
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200">
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-400 hover:text-blue-500">
                    <Upload size={24} />
                    <span className="text-[10px] font-bold mt-1">UPLOAD</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              Post Inquiry Privately
              <ArrowRight size={20} />
            </button>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-xl space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Shield size={20} />
              Privacy Note
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              Our platform uses end-to-end encryption. Your IP address and personal metadata are stripped before any doctor sees your inquiry.
            </p>
          </div>

          {aiSuggestions && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-600" />
                  AI Preview
                </h3>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                  aiSuggestions.urgencyLevel === 'Low' ? 'bg-green-100 text-green-700' : 
                  aiSuggestions.urgencyLevel === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                }`}>
                  {aiSuggestions.urgencyLevel} Urgency
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Recommended Specialists</p>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.suggestedSpecialties.map((s: string) => (
                      <span key={s} className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Brief Analysis</p>
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    "{aiSuggestions.preliminaryObservations}"
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4">
            <AlertCircle className="text-amber-500 shrink-0" size={24} />
            <p className="text-xs text-amber-800 font-medium leading-relaxed">
              If you are experiencing severe pain, shortness of breath, or chest pain, please visit your nearest emergency room immediately.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewCase;
