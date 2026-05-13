import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheatreStore } from '../store/useTheatreStore';

export default function PatronDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patrons, reservations, performances, productions, deleteReservation } = useTheatreStore();

  const patron = patrons.find(p => p.id === id);
  const patronReservations = reservations.filter(r => r.patronId === id);

  if (!patron) {
    return <div className="p-20 text-center text-display-md text-primary">Patron Not Found</div>;
  }

  const upcoming = patronReservations.filter(r => {
    const perf = performances.find(p => p.id === r.performanceId);
    return perf && new Date(perf.date) >= new Date();
  });

  const past = patronReservations.filter(r => {
    const perf = performances.find(p => p.id === r.performanceId);
    return perf && new Date(perf.date) < new Date();
  });

  const lifetimeValue = patronReservations.reduce((sum, r) => sum + r.totalPrice, 0);

  const handleCancel = (resId) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      deleteReservation(resId);
    }
  };

  return (
    <>
      <div className="pt-32 px-8 pb-12 max-w-7xl mx-auto">
        {/* Patron Profile Header */}
        <div className="mb-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-xl">
              <div className="relative">
                <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-[#C5A059] bg-slate-900 flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#C5A059] uppercase select-none tracking-widest">
                    {(patron.name || `${patron.firstName || ''} ${patron.lastName || ''}`).trim().split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#C5A059] text-slate-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  {patron.tier || 'Member'}
                </div>
              </div>
              <div>
                <p className="font-body-lg text-slate-400 mb-4 flex items-center gap-4">
                  <span>{patron.email}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-600"></span>
                  <span>{patron.phone}</span>
                </p>
                <div className="space-y-1">
                  <h1 className="font-display-lg text-display-lg text-[#C5A059] leading-none mb-2">
                    {patron.name || `${patron.firstName} ${patron.lastName}`}
                  </h1>
                  <p className="font-table-data text-headline-sm text-[#C5A059] opacity-80 uppercase tracking-tighter">
                    Registered Since: {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="glass-panel border border-[#C5A059]/20 px-4 py-2 rounded-lg">
                      <p className="text-label-caps font-label-caps text-slate-500 mb-1">Total Bookings</p>
                      <p className="font-display-md text-headline-sm text-[#C5A059]">{patronReservations.length}</p>
                    </div>
                    <div className="glass-panel border border-[#C5A059]/20 px-4 py-2 rounded-lg">
                      <p className="text-label-caps font-label-caps text-slate-500 mb-1">Lifetime Value</p>
                      <p className="font-display-md text-headline-sm text-[#C5A059]">ETB {lifetimeValue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate(`/reserve-tickets/${patron.id}`)}
                className="w-full bg-[#C5A059] text-slate-950 font-label-caps py-3 px-8 rounded-lg hover:brightness-110 transition-all uppercase tracking-widest font-bold shadow-lg shadow-[#C5A059]/20 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                New Reservation
              </button>
            </div>
          </div>
        </div>

        {/* Reservations */}
        <div className="space-y-12">
          <section id="reservations-section">
            <div className="flex items-center justify-between mb-md">
              <h2 className="font-display-md text-display-md text-on-surface">Reservations</h2>
              <span className="text-label-caps font-label-caps text-[#C5A059] px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded">
                {patronReservations.length} TOTAL
              </span>
            </div>

            <div className="glass-panel rounded-xl overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-[#C5A059]/10">
                    <th className="p-md text-label-caps font-label-caps text-[#C5A059] uppercase tracking-widest">Performance</th>
                    <th className="p-md text-label-caps font-label-caps text-[#C5A059] uppercase tracking-widest">Date</th>
                    <th className="p-md text-label-caps font-label-caps text-[#C5A059] uppercase tracking-widest">Seats</th>
                    <th className="p-md text-label-caps font-label-caps text-[#C5A059] uppercase tracking-widest">Total Paid</th>
                    <th className="p-md text-label-caps font-label-caps text-[#C5A059] uppercase tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {patronReservations.length > 0 ? patronReservations.map(res => {
                    const perf = performances.find(p => p.id === res.performanceId);
                    const prod = productions.find(p => p.id === perf?.productionId);
                    return (
                      <tr key={res.id} className="hover:bg-slate-800/20 transition-colors group">
                        <td className="p-md">
                          <p className="font-body-md text-on-surface font-medium">{prod?.name}</p>
                          <p className="text-body-sm text-slate-500">{perf?.timeType}</p>
                        </td>
                        <td className="p-md">
                          <p className="font-table-data text-table-data text-slate-400">
                            {new Date(res.date || perf?.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </td>
                        <td className="p-md">
                          <p className="font-table-data text-table-data text-slate-400">{res.seats.length} Tickets</p>
                          <p className="text-[10px] text-slate-600 font-mono uppercase tracking-tighter">{res.seats.join(', ')}</p>
                        </td>
                        <td className="p-md">
                          <p className="font-table-data text-table-data text-primary font-bold">ETB {(res.totalPrice || 0).toFixed(2)}</p>
                        </td>
                        <td className="p-md text-center">
                          <button 
                            onClick={() => {
                              useTheatreStore.getState().setModal({
                                type: 'confirm',
                                title: 'Cancel Reservation?',
                                message: 'Are you sure you want to cancel this booking? This action cannot be undone.',
                                onConfirm: () => useTheatreStore.getState().deleteReservation(res.id)
                              });
                            }}
                            className="material-symbols-outlined text-error/40 hover:text-error transition-all p-2 rounded-full hover:bg-error/10"
                            title="Cancel Reservation"
                          >
                            cancel
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="5" className="p-xl text-center text-slate-500 italic">No reservations found for this patron.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
