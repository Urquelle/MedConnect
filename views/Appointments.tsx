
import React, { useState, useEffect } from 'react';
import { User, Appointment, UserRole } from '../types';
import { Calendar, Clock, User as UserIcon, CheckCircle, XCircle, ChevronRight, AlertCircle } from 'lucide-react';

const Appointments: React.FC<{ user: User }> = ({ user }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [newApp, setNewApp] = useState({ date: '', time: '', doctorId: 'doc1', doctorName: 'Dr. Sarah Mitchell' });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('med_appointments') || '[]');
    setAppointments(saved.filter((a: Appointment) => 
      user.role === UserRole.PATIENT ? a.patientId === user.id : a.doctorId === user.id
    ));
  }, [user]);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const app: Appointment = {
      id: `app_${Date.now()}`,
      patientId: user.id,
      doctorId: newApp.doctorId,
      doctorName: newApp.doctorName,
      date: newApp.date,
      time: newApp.time,
      status: 'Upcoming'
    };

    const updated = [app, ...appointments];
    setAppointments(updated);
    localStorage.setItem('med_appointments', JSON.stringify([app, ...JSON.parse(localStorage.getItem('med_appointments') || '[]')]));
    setIsBooking(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
          <p className="text-slate-500 mt-1">Manage your virtual and physical consultations.</p>
        </div>
        {user.role === UserRole.PATIENT && (
          <button 
            onClick={() => setIsBooking(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            Schedule New
          </button>
        )}
      </header>

      {isBooking && (
        <div className="bg-white p-8 rounded-3xl border-2 border-blue-100 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold mb-6">Schedule Consultation</h2>
          <form onSubmit={handleBook} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Date</label>
              <input 
                required
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={newApp.date}
                onChange={e => setNewApp({...newApp, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Time</label>
              <input 
                required
                type="time"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={newApp.time}
                onChange={e => setNewApp({...newApp, time: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100">Confirm Booking</button>
              <button type="button" onClick={() => setIsBooking(false)} className="px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="bg-white p-20 border border-dashed border-slate-200 rounded-[2.5rem] text-center">
            <Calendar className="text-slate-200 mx-auto mb-6" size={64} />
            <h3 className="text-xl font-bold text-slate-900">No scheduled visits</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">Book a slot with one of our verified specialists for a private consultation.</p>
          </div>
        ) : (
          appointments.map(app => (
            <div key={app.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <Calendar size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {user.role === UserRole.PATIENT ? app.doctorName : 'Anonymous Patient'}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {app.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {app.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  app.status === 'Upcoming' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                }`}>
                  {app.status}
                </span>
                <button className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                  <XCircle size={20} />
                </button>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-all" />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100 flex gap-6 items-start">
        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 shrink-0">
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="text-lg font-bold text-blue-900 mb-2">Private Consultation Policy</h4>
          <p className="text-sm text-blue-700 leading-relaxed">
            All appointments are conducted via our secure, HIPAA-compliant video link that expires after each session. 
            No video data is recorded or stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
