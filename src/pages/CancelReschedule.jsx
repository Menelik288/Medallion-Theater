import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheatreStore } from '../store/useTheatreStore';

export default function CancelReschedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reservations, performances, productions, patrons, deleteReservation, updateReservation } = useTheatreStore();

  const reservation = reservations.find(r => r.id === id);
  const performance = performances.find(p => p.id === reservation?.performanceId);
  const production = productions.find(p => p.id === performance?.productionId);
  const patron = patrons.find(p => p.id === reservation?.patronId);

  const otherPerformances = performances.filter(p => 
    p.productionId === production?.id && p.id !== performance?.id
  );

  const [newPerfId, setNewPerfId] = useState('');

  if (!reservation) {
    return <div className="p-20 text-center text-display-md text-primary pt-32">Reservation Not Found</div>;
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      deleteReservation(id);
      navigate(`/patron/${patron.id}`);
    }
  };

  const handleReschedule = () => {
    if (!newPerfId) {
      alert('Please select a new performance date');
      return;
    }
    updateReservation(id, { performanceId: newPerfId });
    alert('Reservation rescheduled successfully!');
    navigate(`/patron/${patron.id}`);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto pt-32 px-8 pb-12">
        {/* Header Section */}
        <div className="mb-10">
          <nav className="flex text-label-caps text-on-surface-variant gap-2 mb-4">
            <span className="hover:text-[#C5A059] cursor-pointer" onClick={() => navigate(`/patron/${patron?.id}`)}>PATRON PROFILE</span>
            <span>/</span>
            <span className="text-primary">MANAGE TICKET #{id?.slice(0, 8).toUpperCase()}</span>
          </nav>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Modify Reservation</h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl">Adjust your performance date or cancel your reservation.</p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Current Reservation Card */}
          <div className="col-span-12 lg:col-span-5 glass-panel p-8 rounded-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-label-caps text-[#C5A059] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">event_available</span>
                CURRENT PERFORMANCE
              </div>
              <h2 className="font-headline-sm text-headline-sm mb-1">{production?.name}</h2>
              <p className="text-on-surface-variant font-body-md mb-8">{production?.type}</p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary mt-1">calendar_today</span>
                  <div>
                    <p className="text-label-caps text-slate-500 mb-1">DATE & TIME</p>
                    <p className="font-body-md">{performance?.date}</p>
                    <p className="text-body-sm text-slate-400">{performance?.timeType}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary mt-1">chair_alt</span>
                  <div>
                    <p className="text-label-caps text-slate-500 mb-1">ASSIGNED SEATS</p>
                    <p className="font-body-md">{reservation.seats.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[#C5A059]/10">
                <button 
                  onClick={handleCancel}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 border border-error/50 text-error hover:bg-error/10 transition-all font-medium rounded-lg uppercase tracking-widest text-xs"
                >
                  <span className="material-symbols-outlined">cancel</span>
                  Cancel This Reservation
                </button>
              </div>
            </div>
          </div>

          {/* Reschedule Canvas */}
          <div className="col-span-12 lg:col-span-7 glass-panel p-8 rounded-lg">
            <div className="text-label-caps text-[#C5A059] mb-6">RESCHEDULE PERFORMANCE</div>
            <div className="mb-8">
              <label className="text-label-caps text-slate-500 mb-2 block">SELECT NEW PERFORMANCE DATE</label>
              <div className="relative">
                <select 
                  className="w-full bg-surface-container-low border border-[#C5A059]/30 text-on-surface py-4 px-4 rounded focus:ring-1 focus:ring-[#C5A059] focus:outline-none appearance-none"
                  value={newPerfId}
                  onChange={(e) => setNewPerfId(e.target.value)}
                >
                  <option value="">Select a new date</option>
                  {otherPerformances.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.date} • {p.timeType}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">expand_more</span>
              </div>
            </div>

            <div className="p-6 bg-slate-950/40 rounded-lg mb-8 border border-[#C5A059]/10">
              <p className="text-body-sm text-slate-400 italic">
                * Rescheduling will keep your current seat assignments if available. If seats are taken in the new performance, please cancel and create a new reservation.
              </p>
            </div>

            <div className="flex items-center justify-end">
              <button 
                onClick={handleReschedule}
                className="bg-gradient-to-br from-primary to-[#C5A059] text-slate-950 px-8 py-3 rounded font-bold hover:brightness-110 transition-all flex items-center gap-2 uppercase tracking-widest"
              >
                Confirm Reschedule
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
