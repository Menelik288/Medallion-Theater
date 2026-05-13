import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheatreStore } from '../store/useTheatreStore';
import FormModal from '../components/FormModal';

export default function ManagePerformances() {
  const navigate = useNavigate();
  const { 
    performances, 
    productions, 
    reservations, 
    addPerformance, 
    deletePerformance, 
    setModal 
  } = useTheatreStore();
  
  const [filterProdId, setFilterProdId] = useState('All');
  const [filterTime, setFilterTime] = useState('ALL');
  const [isAdding, setIsAdding] = useState(false);
  const [newPerf, setNewPerf] = useState({ productionId: '', date: '', timeType: 'Evening', notes: '' });

  const filteredPerformances = performances.filter(perf => {
    const matchesProd = filterProdId === 'All' || perf.productionId === filterProdId;
    const matchesTime = filterTime === 'ALL' || perf.timeType.toUpperCase() === filterTime;
    return matchesProd && matchesTime;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const getPerfStats = (perfId) => {
    const perfReservations = reservations.filter(r => r.performanceId === perfId && r.status !== 'Cancelled');
    const ticketsSold = perfReservations.reduce((sum, r) => sum + r.seats.length, 0);
    const revenue = perfReservations.reduce((sum, r) => sum + r.totalPrice, 0);
    const capacity = 500; 
    const occupancy = (ticketsSold / capacity) * 100;
    return { ticketsSold, revenue, occupancy };
  };

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newPerf.productionId || !newPerf.date) {
      setModal({ type: 'error', title: 'Missing Info', message: 'Please select a production and date.' });
      return;
    }

    // Block past dates (extra guard beyond the HTML min attribute)
    if (newPerf.date < todayStr) {
      setModal({ type: 'error', title: 'Invalid Date', message: 'You cannot schedule a performance on a past date. Please select today or a future date.' });
      return;
    }

    // Check for a conflicting performance on the same date and time slot
    const conflict = performances.find(
      p => p.date === newPerf.date && p.timeType === newPerf.timeType
    );
    if (conflict) {
      const conflictProd = productions.find(p => p.id === conflict.productionId);
      setModal({
        type: 'error',
        title: 'Time Slot Already Booked',
        message: `A "${newPerf.timeType}" performance is already scheduled on ${new Date(newPerf.date + 'T12:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} for "${conflictProd?.name || 'another production'}". Please choose a different date or time slot.`
      });
      return;
    }

    addPerformance(newPerf);
    const prod = productions.find(p => p.id === newPerf.productionId);
    setModal({ type: 'success', title: 'Performance Scheduled', message: `A new showing for "${prod?.name}" has been added.` });
    setIsAdding(false);
    setNewPerf({ productionId: '', date: '', timeType: 'Evening', notes: '' });
  };

  const handleDelete = (perfId, date, prodName) => {
    setModal({
      type: 'confirm',
      title: 'Delete Performance',
      message: `Are you sure you want to delete the "${prodName}" performance on ${new Date(date).toLocaleDateString()}? This will permanently cancel all associated reservations.`,
      onConfirm: () => {
        deletePerformance(perfId);
        setModal({ type: 'success', title: 'Deleted', message: 'The performance has been removed from the schedule.' });
      }
    });
  };

  const avgOccupancy = filteredPerformances.length > 0
    ? filteredPerformances.reduce((sum, p) => sum + getPerfStats(p.id).occupancy, 0) / filteredPerformances.length
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display-lg text-display-lg text-[#C5A059] mb-2 tracking-tight">Performance Scheduling</h1>
          <p className="text-slate-500 font-body-md max-w-2xl">
            Coordinate showtimes and track audience engagement across the Medallion season.
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#C5A059] to-[#E9C176] text-slate-950 rounded-xl text-sm font-bold hover:brightness-110 hover:-translate-y-1 transition-all shadow-xl shadow-[#C5A059]/20"
        >
          <span className="material-symbols-outlined font-bold">event_available</span>
          SCHEDULE PERFORMANCE
        </button>
      </div>

      {/* Stats & Filters Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-center border-[#C5A059]/10">
          <div className="flex-1 w-full">
            <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest block mb-3">Filter by Production</label>
            <select 
              className="w-full bg-slate-950/40 border border-white/5 rounded-xl px-5 py-3 text-on-surface focus:border-[#C5A059] outline-none transition-all"
              value={filterProdId}
              onChange={(e) => setFilterProdId(e.target.value)}
            >
              <option value="All">All Active Productions</option>
              {productions.map(prod => (
                <option key={prod.id} value={prod.id}>{prod.name}</option>
              ))}
            </select>
          </div>
          
          <div className="w-px h-12 bg-white/5 hidden md:block"></div>

          <div className="flex-1 w-full">
            <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest block mb-3">Time of Day</label>
            <div className="flex bg-slate-950/40 p-1 rounded-lg border border-white/5">
              {['ALL', 'MATINEE', 'EVENING'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterTime(t)}
                  className={`flex-1 py-2 rounded-md text-[10px] font-bold transition-all uppercase tracking-widest ${filterTime === t ? 'bg-[#C5A059] text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 glass-panel p-8 rounded-2xl flex items-center justify-between border-[#C5A059]/20 bg-gradient-to-br from-slate-900 to-slate-950">
          <div>
            <span className="text-[10px] font-label-caps text-[#C5A059] uppercase tracking-widest block mb-1">Global Occupancy</span>
            <span className="font-display-md text-4xl text-white tracking-tighter">{avgOccupancy.toFixed(1)}%</span>
            <div className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              <span>Trending High</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-full border-2 border-[#C5A059]/20 flex items-center justify-center relative">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${28 * 2 * Math.PI}`}
                strokeDashoffset={`${28 * 2 * Math.PI * (1 - avgOccupancy / 100)}`}
                className="text-[#C5A059] transition-all duration-1000"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#C5A059] opacity-40">AVG</span>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border-[#C5A059]/10">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#C5A059]/20 bg-slate-900/50">
              <th className="px-8 py-6 text-[10px] font-label-caps text-[#C5A059] uppercase tracking-widest">PRODUCTION</th>
              <th className="px-8 py-6 text-[10px] font-label-caps text-[#C5A059] uppercase tracking-widest">DATE & TIME</th>
              <th className="px-8 py-6 text-[10px] font-label-caps text-[#C5A059] uppercase tracking-widest">OCCUPANCY</th>
              <th className="px-8 py-6 text-[10px] font-label-caps text-[#C5A059] uppercase tracking-widest text-right">GROSS REVENUE</th>
              <th className="px-8 py-6 text-[10px] font-label-caps text-[#C5A059] uppercase tracking-widest text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredPerformances.length > 0 ? filteredPerformances.map(perf => {
              const prod = productions.find(p => p.id === perf.productionId);
              const { ticketsSold, revenue, occupancy } = getPerfStats(perf.id);
              return (
                <tr key={perf.id} className="hover:bg-[#C5A059]/5 transition-colors group cursor-pointer" onClick={() => navigate(`/performance/${perf.id}`)}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-16 bg-slate-900 rounded-lg overflow-hidden border border-white/5 shadow-xl transition-transform group-hover:scale-105">
                        <img src={prod?.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt={prod?.name} />
                      </div>
                      <div>
                        <div className="font-display-md text-lg text-on-surface group-hover:text-[#C5A059] transition-colors">{prod?.name}</div>
                        <div className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">{prod?.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-body-md text-on-surface">{new Date(perf.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${perf.timeType === 'Evening' ? 'bg-[#C5A059]' : 'bg-blue-400'}`}></span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{perf.timeType}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="w-full max-w-[160px] space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{ticketsSold} / 500</span>
                        <span className="text-xs font-bold text-[#C5A059]">{occupancy.toFixed(0)}%</span>
                      </div>
                      <div className="h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className={`h-full transition-all duration-1000 ${occupancy > 80 ? 'bg-emerald-500' : occupancy > 40 ? 'bg-[#C5A059]' : 'bg-red-500'}`} 
                          style={{ width: `${occupancy}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="font-display-md text-lg text-on-surface font-mono tracking-tight">ETB {revenue.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        className="w-10 h-10 rounded-lg bg-slate-950 border border-white/5 text-slate-500 hover:text-[#C5A059] hover:border-[#C5A059] transition-all flex items-center justify-center"
                        onClick={(e) => { e.stopPropagation(); navigate(`/performance/${perf.id}`); }}
                        title="Edit Performance"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button 
                        className="w-10 h-10 rounded-lg bg-slate-950 border border-white/5 text-slate-500 hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center"
                        onClick={(e) => { e.stopPropagation(); handleDelete(perf.id, perf.date, prod?.name); }}
                        title="Delete Performance"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                      <button 
                        className="w-10 h-10 rounded-lg bg-slate-950 border border-white/5 text-slate-500 hover:text-emerald-400 hover:border-emerald-400 transition-all flex items-center justify-center"
                        onClick={(e) => { e.stopPropagation(); navigate(`/reserve-tickets/${perf.id}`); }}
                        title="Book Tickets"
                      >
                        <span className="material-symbols-outlined text-lg">confirmation_number</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 text-slate-700">
                    <span className="material-symbols-outlined text-5xl">event_busy</span>
                    <span className="text-sm font-bold uppercase tracking-widest">No performances match your criteria</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <FormModal 
        isOpen={isAdding} 
        onClose={() => setIsAdding(false)}
        title="Schedule New Performance"
        footer={
          <div className="flex gap-4 w-full">
            <button 
              onClick={() => setIsAdding(false)}
              className="flex-1 py-4 px-6 rounded-xl border border-white/10 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleAdd}
              className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E9C176] text-slate-950 font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-[#C5A059]/20"
            >
              Schedule Show
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Select Production</label>
            <select 
              className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-5 py-4 text-on-surface focus:border-[#C5A059] outline-none transition-all"
              value={newPerf.productionId}
              onChange={(e) => setNewPerf(prev => ({ ...prev, productionId: e.target.value }))}
            >
              <option value="">Select a production...</option>
              {productions.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Performance Date</label>
            <input 
              type="date"
              min={todayStr}
              className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-5 py-4 text-on-surface focus:border-[#C5A059] outline-none transition-all"
              value={newPerf.date}
              onChange={(e) => setNewPerf(prev => ({ ...prev, date: e.target.value }))}
            />
            <p className="text-[10px] text-slate-600">Only today and future dates are available.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Time Slot</label>
            <div className="grid grid-cols-3 gap-3">
              {['Matinee', 'Evening', 'Late Night'].map(t => (
                <button
                  key={t}
                  onClick={() => setNewPerf(prev => ({ ...prev, timeType: t }))}
                  className={`py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                    newPerf.timeType === t 
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]' 
                      : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10'
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
              rows="3"
              placeholder="Internal notes for this showing..."
              className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-5 py-4 text-on-surface focus:border-[#C5A059] outline-none transition-all resize-none"
              value={newPerf.notes}
              onChange={(e) => setNewPerf(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
