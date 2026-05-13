import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheatreStore, SEATING_CONFIG } from '../store/useTheatreStore';

export default function ClerkDashboard() {
  const navigate = useNavigate();
  const { reservations, productions, patrons, performances } = useTheatreStore();

  // Calculate Stats
  // Calculate Stats
  const totalTickets = reservations.reduce((acc, res) => acc + res.seats.length, 0);
  const totalRevenue = reservations.reduce((acc, res) => acc + (res.totalPrice || 0), 0);
  const activeProductionsCount = productions.filter(p => performances.some(perf => perf.productionId === p.id)).length;
  const venueCapacity = activeProductionsCount * SEATING_CONFIG.total;
  const occupancyRate = venueCapacity > 0 ? ((totalTickets / venueCapacity) * 100).toFixed(1) : 0;

  // Recent Reservations
  const recentReservations = [...reservations]
    .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
    .slice(0, 5);

  return (
    <div className="pt-32 px-8 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display-lg text-display-lg text-on-surface">Clerk Dashboard</h1>
          <button 
            onClick={() => navigate('/search-patron')}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#C5A059] to-[#E9C176] text-slate-950 rounded-lg text-sm font-bold hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-[#C5A059]/20"
          >
            <span className="material-symbols-outlined text-sm font-bold">add</span>
            NEW RESERVATION
          </button>
        </div>
        {/* Bento Grid Quick Stats */}
        <div className="grid grid-cols-12 gap-md mb-xl">
          <div className="col-span-12 md:col-span-4 glass-panel p-md rounded-xl flex flex-col justify-between h-48 group hover:border-[#C5A059]/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[#C5A059]/10">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-[#C5A059] bg-[#C5A059]/10 p-3 rounded-full group-hover:scale-110 transition-transform">confirmation_number</span>
              <span className="text-green-500 text-xs font-bold">+12% vs last show</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-slate-500 uppercase">Total Tickets Sold</p>
              <p className="font-display-md text-display-md text-on-surface">{totalTickets}</p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 glass-panel p-md rounded-xl flex flex-col justify-between h-48 group hover:border-[#C5A059]/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[#C5A059]/10">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-[#C5A059] bg-[#C5A059]/10 p-3 rounded-full group-hover:scale-110 transition-transform">payments</span>
              <span className="text-green-500 text-xs font-bold">+8% today</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-slate-500 uppercase">Total Revenue</p>
              <p className="font-display-md text-display-md text-on-surface">ETB {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 glass-panel p-md rounded-xl flex flex-col justify-between h-48 group hover:border-[#C5A059]/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[#C5A059]/10">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-[#C5A059] bg-[#C5A059]/10 p-3 rounded-full group-hover:scale-110 transition-transform">theater_comedy</span>
              <span className="text-[#C5A059] text-xs font-bold">{activeProductionsCount} Active</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-slate-500 uppercase">Scheduled Productions</p>
              <p className="font-display-md text-display-md text-on-surface">{productions.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-md">
          {/* Reservations List Table */}
          <section className="col-span-12 bg-slate-950/40 backdrop-blur-xl border border-[#C5A059]/20 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#C5A059]/10 flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm text-[#C5A059]">Recent Reservations</h3>
              <button 
                onClick={() => navigate('/manage-reservations')}
                className="text-[#C5A059] font-label-caps text-xs flex items-center gap-2 hover:opacity-70"
              >
                VIEW ALL <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-[#C5A059]/10">
                    <th className="p-6 font-label-caps text-label-caps text-[#C5A059] uppercase tracking-widest">Patron Name</th>
                    <th className="p-6 font-label-caps text-label-caps text-[#C5A059] uppercase tracking-widest">Production</th>
                    <th className="p-6 font-label-caps text-label-caps text-[#C5A059] uppercase tracking-widest">Performance</th>
                    <th className="p-6 font-label-caps text-label-caps text-[#C5A059] uppercase tracking-widest">Seats</th>
                    <th className="p-6 font-label-caps text-label-caps text-[#C5A059] uppercase tracking-widest text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C5A059]/5">
                  {recentReservations.length > 0 ? recentReservations.map(res => {
                    const patron = patrons.find(p => p.id === res.patronId);
                    const performance = performances.find(p => p.id === res.performanceId);
                    const production = productions.find(p => p.id === performance?.productionId);
                    return (
                      <tr 
                        key={res.id} 
                        className="hover:bg-[#C5A059]/5 transition-colors cursor-pointer group"
                        onClick={() => navigate(`/patron/${patron?.id}`)}
                      >
                        <td className="p-6">
                          <div className="font-body-md text-on-surface group-hover:text-[#C5A059]">{patron?.name || `${patron?.firstName} ${patron?.lastName}`}</div>
                          <div className="text-xs text-slate-500">{patron?.email}</div>
                        </td>
                        <td className="p-6 text-body-md text-slate-300">{production?.name}</td>
                        <td className="p-6 text-body-md text-slate-300">{performance?.date}</td>
                        <td className="p-6 text-body-md text-slate-300">{res.seats.length} Tickets</td>
                        <td className="p-6 text-right font-table-data text-[#C5A059]">ETB {(res.totalPrice || 0).toLocaleString()}</td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-slate-500 font-body-md">No recent reservations found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
  );
}
