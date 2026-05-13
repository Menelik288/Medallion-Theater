import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheatreStore } from '../store/useTheatreStore';
import FormModal from '../components/FormModal';

export default function ProductionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getProductionById, 
    getPerformancesByProductionId, 
    addPerformance, 
    updatePerformance,
    deletePerformance,
    setModal 
  } = useTheatreStore();

  const production = getProductionById(id);
  const performances = getPerformancesByProductionId(id);

  const [isPerfModalOpen, setIsPerfModalOpen] = useState(false);
  const [editingPerf, setEditingPerf] = useState(null);
  const [perfData, setPerfData] = useState({ date: '', timeType: 'Evening', notes: '' });

  if (!production) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-700">error</span>
        <h2 className="text-2xl font-bold text-slate-400">Production Not Found</h2>
        <button onClick={() => navigate('/manage-productions')} className="text-[#C5A059] font-bold border-b border-[#C5A059] pb-1 uppercase text-xs tracking-widest">Back to Productions</button>
      </div>
    );
  }

  const openAddPerf = () => {
    setEditingPerf(null);
    setPerfData({ date: '', timeType: 'Evening', notes: '' });
    setIsPerfModalOpen(true);
  };

  const openEditPerf = (perf) => {
    setEditingPerf(perf);
    setPerfData({ date: perf.date, timeType: perf.timeType, notes: perf.notes || '' });
    setIsPerfModalOpen(true);
  };

  const handleSavePerf = (e) => {
    e.preventDefault();
    if (!perfData.date) {
      setModal({ type: 'error', title: 'Missing Date', message: 'Please select a date for the performance.' });
      return;
    }

    if (editingPerf) {
      updatePerformance(editingPerf.id, perfData);
      setModal({ type: 'success', title: 'Updated', message: 'Performance details have been updated.' });
    } else {
      addPerformance({ ...perfData, productionId: id });
      setModal({ type: 'success', title: 'Scheduled', message: 'The performance has been added to the calendar.' });
    }
    setIsPerfModalOpen(false);
  };

  const handleDeletePerf = (perfId, perfDate) => {
    setModal({
      type: 'confirm',
      title: 'Cancel Performance',
      message: `Are you sure you want to cancel the performance on ${new Date(perfDate).toLocaleDateString()}? This will also cancel any active reservations for this showing.`,
      onConfirm: () => {
        deletePerformance(perfId);
        setModal({ type: 'success', title: 'Cancelled', message: 'Performance and related reservations have been cancelled.' });
      }
    });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Production Header Hero */}
      <div className="relative h-[400px] rounded-3xl overflow-hidden border border-[#C5A059]/20 shadow-2xl">
        <img 
          src={production.image || 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=2000'} 
          className="w-full h-full object-cover opacity-30 blur-[2px]"
          alt={production.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md ${
                  production.status === 'On Sale' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  production.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                  'bg-slate-500/20 text-slate-400 border-slate-500/30'
                }`}>
                  {production.status}
                </span>
                <span className="text-slate-400 text-xs font-label-caps uppercase tracking-widest">{production.type}</span>
              </div>
              <h1 className="font-display-lg text-6xl text-on-surface tracking-tighter leading-none">{production.name}</h1>
              <p className="text-slate-300 font-body-md max-w-2xl italic leading-relaxed">
                {production.description || 'No description available for this production.'}
              </p>
              <div className="flex items-center gap-6 text-slate-500 text-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span>{production.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">event</span>
                  <span>{performances.length} Showings Scheduled</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/manage-productions')}
                className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                Back to Registry
              </button>
              <button 
                onClick={openAddPerf}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#C5A059] to-[#E9C176] text-slate-950 rounded-xl text-sm font-bold hover:brightness-110 hover:-translate-y-1 transition-all shadow-xl shadow-[#C5A059]/20"
              >
                <span className="material-symbols-outlined">calendar_add_on</span>
                ADD PERFORMANCE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performances Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#C5A059]/10 pb-4">
          <h2 className="font-display-md text-3xl text-[#C5A059] tracking-tight">Scheduled Performances</h2>
          <div className="flex items-center gap-2 text-[10px] font-label-caps text-slate-600 uppercase tracking-widest">
            <span>Parent ID:</span>
            <span className="text-slate-400 font-mono">{production.id.slice(0, 8)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {performances.length > 0 ? performances.map((perf) => (
            <div key={perf.id} className="glass-panel p-8 rounded-2xl border-[#C5A059]/10 hover:border-[#C5A059]/40 transition-all group relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] border border-[#C5A059]/20">
                  <span className="material-symbols-outlined">event</span>
                </div>
                <div className="flex gap-2 transition-opacity">
                  <button onClick={() => openEditPerf(perf)} className="w-9 h-9 rounded-lg bg-slate-900 border border-white/5 text-slate-400 hover:text-[#C5A059] hover:border-[#C5A059] transition-all flex items-center justify-center" title="Edit Performance">
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button onClick={() => handleDeletePerf(perf.id, perf.date)} className="w-9 h-9 rounded-lg bg-slate-900 border border-white/5 text-slate-400 hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center" title="Delete Performance">
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-display-md text-2xl text-on-surface leading-tight">
                    {new Date(perf.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                      perf.timeType === 'Evening' ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {perf.timeType}
                    </span>
                    <span className="text-slate-700 opacity-40">•</span>
                    <span className="text-[10px] text-slate-500 font-label-caps uppercase tracking-widest">Reserved Seating</span>
                  </div>
                </div>

                {perf.notes && (
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                    <p className="text-body-sm text-slate-400 italic leading-relaxed">
                      "{perf.notes}"
                    </p>
                  </div>
                )}

                <button 
                  onClick={() => navigate(`/reserve-tickets/${perf.id}`)}
                  className="w-full py-4 rounded-xl bg-slate-950 border border-[#C5A059]/30 text-[#C5A059] font-bold text-[10px] uppercase tracking-widest hover:bg-[#C5A059] hover:text-slate-950 transition-all mt-4 flex items-center justify-center gap-3 shadow-lg"
                >
                  <span className="material-symbols-outlined text-lg">confirmation_number</span>
                  MANAGE TICKETS
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center glass-panel rounded-3xl border-dashed border-2 border-white/5">
              <span className="material-symbols-outlined text-7xl text-slate-800 mb-6">event_busy</span>
              <h3 className="text-2xl font-bold text-slate-500 mb-2">No Showings Scheduled</h3>
              <p className="text-slate-600 mb-8 max-w-sm mx-auto">This production is currently in the registry but has no live performances scheduled on the calendar.</p>
              <button onClick={openAddPerf} className="text-[#C5A059] font-bold uppercase text-[10px] tracking-widest border-b-2 border-[#C5A059] pb-1 hover:opacity-70 transition-opacity">
                Schedule Opening Night
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Performance Form Modal */}
      <FormModal 
        isOpen={isPerfModalOpen} 
        onClose={() => setIsPerfModalOpen(false)}
        title={editingPerf ? "Edit Performance" : "Schedule Show"}
        footer={
          <div className="flex gap-4 w-full">
            <button 
              onClick={() => setIsPerfModalOpen(false)}
              className="flex-1 py-4 px-6 rounded-xl border border-white/10 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSavePerf}
              className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E9C176] text-slate-950 font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-[#C5A059]/20"
            >
              {editingPerf ? "Update Schedule" : "Schedule Performance"}
            </button>
          </div>
        }
      >
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Performance Date</label>
            <input 
              type="date"
              className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-6 py-5 text-on-surface focus:border-[#C5A059] outline-none transition-all text-lg"
              value={perfData.date}
              onChange={(e) => setPerfData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Time Slot</label>
            <div className="grid grid-cols-3 gap-3">
              {['Matinee', 'Evening', 'Late Night'].map(t => (
                <button
                  key={t}
                  onClick={() => setPerfData(prev => ({ ...prev, timeType: t }))}
                  className={`py-4 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all ${
                    perfData.timeType === t 
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]' 
                      : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Internal Production Notes</label>
            <textarea 
              rows="4"
              placeholder="e.g. Stage maintenance at 6PM, Special guest arrival..."
              className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-6 py-5 text-on-surface focus:border-[#C5A059] outline-none transition-all resize-none leading-relaxed"
              value={perfData.notes}
              onChange={(e) => setPerfData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
