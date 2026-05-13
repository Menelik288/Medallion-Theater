import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheatreStore } from '../store/useTheatreStore';

export default function PerformanceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productions, performances, addPerformance, updatePerformance, setModal } = useTheatreStore();

  const [formData, setFormData] = useState({
    productionId: '',
    date: '',
    timeType: 'Evening',
    notes: ''
  });

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  useEffect(() => {
    if (id && id !== 'new') {
      const perf = performances.find(p => p.id === id);
      if (perf) {
        setFormData(perf);
      }
    }
  }, [id, performances]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.productionId || !formData.date) {
      setModal({ type: 'error', title: 'Missing Info', message: 'Please select a production and date.' });
      return;
    }

    if (formData.date < todayStr) {
      setModal({ type: 'error', title: 'Invalid Date', message: 'You cannot schedule a performance on a past date. Please select today or a future date.' });
      return;
    }

    const conflict = performances.find(
      p => p.id !== id && p.date === formData.date && p.timeType === formData.timeType
    );
    if (conflict) {
      const conflictProd = productions.find(p => p.id === conflict.productionId);
      setModal({
        type: 'error',
        title: 'Time Slot Already Booked',
        message: `A "${formData.timeType}" performance is already scheduled on ${new Date(formData.date + 'T12:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} for "${conflictProd?.name || 'another production'}". Please choose a different date or time slot.`
      });
      return;
    }
    
    if (id && id !== 'new') {
      updatePerformance(id, formData);
      setModal({ type: 'success', title: 'Updated', message: 'The performance has been updated successfully.' });
    } else {
      addPerformance(formData);
      setModal({ type: 'success', title: 'Scheduled', message: 'New showing added to the calendar.' });
    }
    navigate('/manage-performances');
  };

  const selectedProd = productions.find(p => p.id === formData.productionId);

  return (
    <div className="max-w-6xl mx-auto pt-32 px-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <nav className="flex gap-2 text-[10px] font-label-caps text-[#C5A059] mb-4 uppercase tracking-widest">
            <span className="hover:opacity-70 cursor-pointer" onClick={() => navigate('/manage-performances')}>Scheduling</span>
            <span className="opacity-40">/</span>
            <span className="text-slate-500">{id && id !== 'new' ? 'Edit Show' : 'New Show'}</span>
          </nav>
          <h1 className="font-display-lg text-5xl text-on-surface tracking-tighter leading-none">
            {id && id !== 'new' ? 'Refine Showing' : 'Schedule Showing'}
          </h1>
          <p className="text-slate-500 mt-2 font-body-md italic">
            {id && id !== 'new' ? `Updating details for ${selectedProd?.name || 'performance'}` : 'Add a new performance to the Medallion season.'}
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/manage-performances')}
            className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#C5A059] to-[#E9C176] text-slate-950 rounded-xl text-sm font-bold hover:brightness-110 hover:-translate-y-1 transition-all shadow-xl shadow-[#C5A059]/20"
          >
            <span className="material-symbols-outlined font-bold text-lg">save</span>
            {id && id !== 'new' ? 'SAVE CHANGES' : 'CREATE PERFORMANCE'}
          </button>
        </div>
      </div>

      {/* Form Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Main Form Column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <section className="glass-panel p-8 rounded-2xl border-[#C5A059]/10 bg-slate-950/20">
            <div className="flex items-center gap-4 mb-8 border-b border-[#C5A059]/10 pb-4">
              <span className="material-symbols-outlined text-[#C5A059]">theatre_comedy</span>
              <h3 className="font-display-md text-2xl text-on-surface">Production Details</h3>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Select Production</label>
                <div className="relative">
                  <select 
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-5 py-4 text-on-surface focus:border-[#C5A059] outline-none transition-all appearance-none"
                    value={formData.productionId}
                    onChange={(e) => setFormData({...formData, productionId: e.target.value})}
                  >
                    <option value="" className="bg-slate-950">Select a Production...</option>
                    {productions.map(p => (
                      <option key={p.id} value={p.id} className="bg-slate-950">{p.name} ({p.type})</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Performance Notes</label>
                <textarea 
                  className="w-full bg-slate-950/40 border border-white/10 text-on-surface font-body-md p-6 focus:border-[#C5A059] rounded-2xl resize-none placeholder:text-slate-700 outline-none transition-all leading-relaxed" 
                  placeholder="Internal logistics, stage requirements, or VIP notes for this specific performance..." 
                  rows="6"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                ></textarea>
              </div>
            </div>
          </section>
        </div>

        {/* Side Sidebar Form Column */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <section className="glass-panel p-8 rounded-2xl border-[#C5A059]/10 bg-slate-950/20">
            <div className="flex items-center gap-4 mb-8 border-b border-[#C5A059]/10 pb-4">
              <span className="material-symbols-outlined text-[#C5A059]">schedule</span>
              <h3 className="font-display-md text-2xl text-on-surface">Time & Date</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Performance Date</label>
                <input 
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-5 py-4 text-on-surface focus:border-[#C5A059] outline-none transition-all" 
                  type="date"
                  min={todayStr}
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
                <p className="text-[10px] text-slate-600">Only today and future dates are available.</p>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest block">Performance Slot</label>
                <div className="space-y-3">
                  {['Matinee', 'Evening', 'Late Night'].map(type => (
                    <div 
                      key={type} 
                      onClick={() => setFormData({...formData, timeType: type})}
                      className={`p-4 rounded-xl border transition-all cursor-pointer group flex items-center justify-between ${
                        formData.timeType === type 
                          ? 'bg-[#C5A059]/10 border-[#C5A059] shadow-lg shadow-[#C5A059]/5' 
                          : 'bg-slate-950/40 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full transition-all ${formData.timeType === type ? 'bg-[#C5A059]' : 'bg-slate-700'}`}></div>
                        <span className={`text-sm font-bold uppercase tracking-widest ${formData.timeType === type ? 'text-[#C5A059]' : 'text-slate-500 group-hover:text-slate-400'}`}>
                          {type}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-600 font-mono">
                        {type === 'Matinee' ? '2:00 PM' : type === 'Evening' ? '7:30 PM' : '10:00 PM'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Quick Preview Card */}
          {formData.productionId && formData.date && (
            <div className="glass-panel p-8 rounded-2xl border-emerald-500/20 bg-emerald-500/5 animate-in slide-in-from-top-2 duration-500">
              <div className="flex items-center gap-3 text-emerald-400 mb-4">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Ready to Schedule</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                You are scheduling <span className="text-[#C5A059] font-bold">{selectedProd?.name}</span> for a <span className="text-white font-bold">{formData.timeType}</span> showing on <span className="text-white font-bold">{new Date(formData.date).toLocaleDateString()}</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
