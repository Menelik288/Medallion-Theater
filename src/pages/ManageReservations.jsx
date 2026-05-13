import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheatreStore } from '../store/useTheatreStore';
import { useReactToPrint } from 'react-to-print';
import WillCallForm from '../components/WillCallForm';

export default function ManageReservations() {
  const navigate = useNavigate();
  const { reservations, patrons, performances, productions } = useTheatreStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeResForPrint, setActiveResForPrint] = useState(null);
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: activeResForPrint ? `medallion-reservation-${activeResForPrint.res.id}` : 'reservation',
  });

  const triggerDownload = (res, patron, perf, prod) => {
    setActiveResForPrint({ res, patron, perf, prod });
    // Brief timeout to allow the hidden form to update its props
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const filteredReservations = reservations.filter(res => {
    const patron = patrons.find(p => p.id === res.patronId);
    const prod = productions.find(p => p.id === performances.find(perf => perf.id === res.performanceId)?.productionId);
    const searchStr = `${patron?.name || ''} ${patron?.id || ''} ${prod?.name || ''} ${res.id}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h1 className="font-display-lg text-display-lg text-on-surface">Manage Reservations</h1>
        <button
          onClick={() => navigate('/search-patron')}
          className="flex items-center gap-2 px-6 py-2 bg-[#C5A059] text-slate-950 rounded-lg text-sm font-bold hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-[#C5A059]/20"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Reservation
        </button>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel p-6 rounded-xl flex gap-4 items-center">
        <div className="flex-1 flex items-center bg-surface-container px-4 py-2 rounded-lg border border-outline-variant/30">
          <span className="material-symbols-outlined text-[#C5A059] mr-2">search</span>
          <input
            type="text"
            placeholder="Search by patron name, ID, production, or reservation ID..."
            className="bg-transparent border-none focus:ring-0 text-body-sm w-full text-on-surface placeholder-outline"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Reservations List */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#C5A059]/10 bg-slate-900/50">
              <th className="px-8 py-4 text-label-caps font-label-caps text-primary uppercase tracking-widest">ID</th>
              <th className="px-8 py-4 text-label-caps font-label-caps text-primary uppercase tracking-widest">Patron</th>
              <th className="px-8 py-4 text-label-caps font-label-caps text-primary uppercase tracking-widest">Production</th>
              <th className="px-8 py-4 text-label-caps font-label-caps text-primary uppercase tracking-widest">Seats</th>
              <th className="px-8 py-4 text-label-caps font-label-caps text-primary uppercase tracking-widest">Date</th>
              <th className="px-8 py-4 text-label-caps font-label-caps text-primary uppercase tracking-widest text-right">Total</th>
              <th className="px-8 py-4 text-label-caps font-label-caps text-primary uppercase tracking-widest text-center">PDF</th>
              <th className="px-8 py-4 text-label-caps font-label-caps text-primary uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-8 py-12 text-center text-slate-500 italic">
                  No reservations found matching your search.
                </td>
              </tr>
            ) : (
              filteredReservations.map((res) => {
                const patron = patrons.find(p => p.id === res.patronId);
                const perf = performances.find(p => p.id === res.performanceId);
                const prod = productions.find(p => p.id === perf?.productionId);
                return (
                  <tr key={res.id} className="border-b border-[#C5A059]/5 hover:bg-[#C5A059]/5 transition-colors group">
                    <td className="px-8 py-6 font-table-data text-table-data text-on-surface font-mono text-xs opacity-60">#{res.id.slice(0, 8)}</td>
                    <td className="px-8 py-6">
                      <div className="font-body-md font-medium text-on-surface">{patron?.name || `${patron?.firstName} ${patron?.lastName}`}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">{patron?.id}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-body-md text-on-surface">{prod?.name || 'Deleted Production'}</div>
                      <div className="text-body-sm text-slate-400">{perf?.date}</div>
                    </td>
                    <td className="px-8 py-6 font-table-data text-table-data text-on-surface">
                      {res.seats.length} Tickets
                    </td>
                    <td className="px-8 py-6 font-table-data text-table-data text-slate-400">
                      {new Date(res.date).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right font-table-data text-table-data text-primary font-bold">
                      ETB {res.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => triggerDownload(res, patron, perf, prod)}
                        className="material-symbols-outlined text-[#C5A059] hover:scale-110 transition-transform cursor-pointer"
                        title="Download Reservation PDF"
                      >
                        download
                      </button>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => navigate(`/reservation/${res.id}/manage`)}
                        className="material-symbols-outlined text-slate-500 hover:text-primary transition-colors cursor-pointer"
                      >
                        edit_calendar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Hidden Print Content */}
      <div className="hidden">
        {activeResForPrint && (
          <WillCallForm
            ref={printRef}
            reservation={activeResForPrint.res}
            patron={activeResForPrint.patron}
            performance={activeResForPrint.perf}
            production={activeResForPrint.prod}
          />
        )}
      </div>
    </div>
  );
}
