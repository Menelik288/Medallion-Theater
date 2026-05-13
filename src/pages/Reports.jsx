import React, { useState, useMemo, useEffect } from 'react';
import { useTheatreStore, SEATING_CONFIG } from '../store/useTheatreStore';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

export default function Reports() {
  const productions = useTheatreStore(state => state.productions);
  const performances = useTheatreStore(state => state.performances);
  const reservations = useTheatreStore(state => state.reservations);
  const patrons = useTheatreStore(state => state.patrons);
  
  const [selectedProdId, setSelectedProdId] = useState('');
  const [selectedPerfId, setSelectedPerfId] = useState('');

  // Set initial production
  useEffect(() => {
    if (productions.length > 0 && !selectedProdId) {
      setSelectedProdId(productions[0].id);
    }
  }, [productions, selectedProdId]);

  const currentPerformances = useMemo(() => 
    performances.filter(p => p.productionId === selectedProdId),
    [performances, selectedProdId]
  );

  const handleProductionChange = (prodId) => {
    setSelectedProdId(prodId);
    const newPerfs = performances.filter(p => p.productionId === prodId);
    if (newPerfs.length > 0) {
      setSelectedPerfId(newPerfs[0].id);
    } else {
      setSelectedPerfId('');
    }
  };

  useEffect(() => {
    if (currentPerformances.length > 0) {
      const exists = currentPerformances.find(p => p.id === selectedPerfId);
      if (!exists) {
        setSelectedPerfId(currentPerformances[0].id);
      }
    } else {
      setSelectedPerfId('');
    }
  }, [currentPerformances, selectedPerfId]);

  const activePerf = useMemo(() => 
    performances.find(p => p.id === selectedPerfId),
    [performances, selectedPerfId]
  );
  
  const activeProd = useMemo(() => 
    productions.find(p => p.id === selectedProdId),
    [productions, selectedProdId]
  );

  const perfReservations = useMemo(() => 
    reservations.filter(r => r.performanceId === selectedPerfId && r.status !== 'Cancelled'),
    [reservations, selectedPerfId]
  );
  
  const soldBySection = useMemo(() => {
    const counts = { 'Premium Orchestra': 0, 'Mezzanine': 0, 'Balcony': 0, 'Box': 0 };
    if (!SEATING_CONFIG || !SEATING_CONFIG.sections) return counts;

    perfReservations.forEach(res => {
      if (res.seats && Array.isArray(res.seats)) {
        res.seats.forEach(seatId => {
          Object.entries(SEATING_CONFIG.sections).forEach(([name, config]) => {
            if (seatId.startsWith(config.prefix)) counts[name]++;
          });
        });
      }
    });
    return counts;
  }, [perfReservations]);

  const totalSold = useMemo(() => Object.values(soldBySection).reduce((a, b) => a + b, 0), [soldBySection]);
  const totalAvailable = (SEATING_CONFIG?.total || 0) - totalSold;
  const occupancyRate = totalSold > 0 ? ((totalSold / (SEATING_CONFIG?.total || 1)) * 100).toFixed(1) : 0;

  const occupancyData = useMemo(() => [
    { name: 'Sold', value: totalSold, color: '#C5A059' },
    { name: 'Available', value: totalAvailable, color: '#1E293B' }
  ], [totalSold, totalAvailable]);

  const sectionData = useMemo(() => Object.entries(soldBySection).map(([name, sold]) => ({
    name,
    sold
  })), [soldBySection]);

  const patronPurchases = useMemo(() => {
    return perfReservations.map(res => ({
      ...res,
      patron: patrons.find(p => p.id === res.patronId)
    }));
  }, [perfReservations, patrons]);

  const getStatusLabel = (perfDate) => {
    try {
      const today = new Date();
      today.setHours(0,0,0,0);
      const pDate = new Date(perfDate);
      pDate.setHours(0,0,0,0);
      if (pDate < today) return ' (Closed)';
      if (pDate.getTime() === today.getTime()) return ' (Today)';
      return ' (Upcoming)';
    } catch (e) { return ''; }
  };

  return (
    <div className="pt-32 px-12 pb-20 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="font-display-lg text-5xl text-on-surface tracking-tighter">Performance Analysis</h1>
          <p className="text-slate-500 mt-2 font-body-md">Comprehensive reporting for {activeProd?.name || 'Selected Production'}.</p>
        </div>
        
        <div className="flex gap-4 glass-panel p-4 rounded-2xl border-white/5 bg-slate-950/40">
          <div className="space-y-1">
            <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest ml-1">Production</label>
            <select 
              className="bg-transparent border-none text-on-surface font-bold text-sm focus:ring-0 cursor-pointer outline-none w-48"
              value={selectedProdId}
              onChange={(e) => handleProductionChange(e.target.value)}
            >
              <option value="" disabled>Select Production</option>
              {productions.map(p => <option key={p.id} value={p.id} className="bg-slate-950">{p.name}</option>)}
            </select>
          </div>
          <div className="w-px h-10 bg-white/10 mx-2"></div>
          <div className="space-y-1">
            <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest ml-1">Show Date</label>
            <select 
              className="bg-transparent border-none text-on-surface font-bold text-sm focus:ring-0 cursor-pointer outline-none w-48"
              value={selectedPerfId}
              onChange={(e) => setSelectedPerfId(e.target.value)}
            >
              {currentPerformances.length > 0 ? (
                currentPerformances.map(perf => (
                  <option key={perf.id} value={perf.id} className="bg-slate-950">
                    {new Date(perf.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {perf.timeType}{getStatusLabel(perf.date)}
                  </option>
                ))
              ) : (
                <option value="" className="bg-slate-950">No performances</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {!activePerf ? (
        <div className="glass-panel py-32 text-center rounded-3xl border-white/5 bg-slate-950/20">
          <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">analytics</span>
          <h3 className="text-xl font-display-md text-slate-500">No Performance Selected</h3>
          <p className="text-sm text-slate-600 mt-2">Please select a valid show date to view data.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Seats Sold', value: totalSold, icon: 'confirmation_number', sub: `${totalSold} / ${SEATING_CONFIG?.total}` },
              { label: 'Available', value: totalAvailable, icon: 'event_seat', sub: 'Vacant inventory' },
              { label: 'Occupancy', value: `${occupancyRate}%`, icon: 'analytics', sub: 'Venue fill rate' },
              { label: 'Revenue', value: `ETB ${(totalSold * 150).toLocaleString()}`, icon: 'payments', sub: 'Gross estimate' }
            ].map((card, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl border-white/5 bg-slate-950/20 group hover:border-[#C5A059]/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="material-symbols-outlined text-[#C5A059] bg-[#C5A059]/10 p-2 rounded-lg">{card.icon}</span>
                </div>
                <p className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
                <h3 className="text-3xl font-display-md text-white">{card.value}</h3>
                <p className="text-[10px] text-slate-600 mt-2 font-mono uppercase">{card.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-4 glass-panel p-8 rounded-3xl border-white/5 bg-slate-950/20 flex flex-col h-[450px] relative overflow-hidden">
               <h3 className="font-display-md text-2xl text-on-surface mb-8 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#C5A059] rounded-full"></span>
                Occupancy
              </h3>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={occupancyData} innerRadius={80} outerRadius={120} paddingAngle={8} dataKey="value" stroke="none">
                      {occupancyData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#051424', border: '1px solid rgba(197, 160, 89, 0.2)', borderRadius: '12px' }} itemStyle={{ color: '#d4e4fa' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 flex justify-center gap-8">
                {occupancyData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 glass-panel p-8 rounded-3xl border-white/5 bg-slate-950/20 flex flex-col h-[450px] relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#C5A059]/10 transition-colors duration-1000"></div>
              <h3 className="font-display-md text-2xl text-on-surface mb-8 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#C5A059] rounded-full"></span>
                Section Performance
              </h3>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E9C176" stopOpacity={1} />
                        <stop offset="100%" stopColor="#C5A059" stopOpacity={0.6} />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontWeight: 600 }} dy={15} />
                    <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                    <Tooltip cursor={{ fill: 'rgba(197, 160, 89, 0.03)', radius: 16 }} content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-950/80 backdrop-blur-2xl border border-[#C5A059]/30 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200">
                              <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em] mb-1">{label}</p>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-display-md text-white">{payload[0].value}</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase">Sold</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="sold" fill="url(#goldGradient)" radius={[20, 20, 20, 20]} barSize={32} animationDuration={1000} style={{ filter: 'url(#glow)' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <section className="glass-panel rounded-3xl border-white/5 bg-slate-950/20 overflow-hidden shadow-2xl shadow-black/40">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-display-md text-2xl text-on-surface">Reservation Registry</h3>
              <span className="text-[10px] font-label-caps text-[#C5A059] uppercase tracking-widest">{patronPurchases.length} Active Records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-950/40">
                    <th className="px-8 py-4 text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Patron Details</th>
                    <th className="px-8 py-4 text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Seating Allocation</th>
                    <th className="px-8 py-4 text-[10px] font-label-caps text-slate-500 uppercase tracking-widest text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {patronPurchases.length > 0 ? patronPurchases.map((res, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors">
                          {res.patron?.name || `${res.patron?.firstName} ${res.patron?.lastName}`}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">ID: {res.id.slice(0, 8)}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          {(res.seats || []).map(s => (
                            <span key={s} className="px-2 py-0.5 rounded-md bg-slate-950/60 border border-white/5 text-[9px] font-mono text-slate-400 uppercase">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="text-sm font-bold text-[#C5A059]">ETB {(res.totalPrice || 0).toLocaleString()}</div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="px-8 py-20 text-center text-slate-600 font-body-md italic text-sm">No reservations found for this specific performance.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
