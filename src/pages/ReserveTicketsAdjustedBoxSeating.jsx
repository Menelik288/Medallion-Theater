import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheatreStore, SEATING_CONFIG } from '../store/useTheatreStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SEAT_COLORS = {
  available: '#22c55e',
  taken: '#ef4444', 
  selected: '#3b82f6'
};

const Seat = React.memo(({ seat, isTaken, isSelected, onToggle }) => {
  return (
    <rect 
      x={seat.x} 
      y={seat.y} 
      width={seat.w || 16} 
      height={seat.h || 12} 
      rx="3"
      fill={isSelected ? SEAT_COLORS.selected : (isTaken ? SEAT_COLORS.taken : SEAT_COLORS.available)}
      className={cn("cursor-pointer transition-colors duration-150 shadow-sm hover:brightness-125", isTaken && "pointer-events-none opacity-20")}
      onClick={() => !isTaken && onToggle(seat)}
    />
  );
});

export default function ReserveTicketsAdjustedBoxSeating() {
  const { id: patronId } = useParams();
  const navigate = useNavigate();
  
  const productions = useTheatreStore(state => state.productions);
  const performances = useTheatreStore(state => state.performances);
  const patrons = useTheatreStore(state => state.patrons);
  const reservations = useTheatreStore(state => state.reservations);

  const availableProductions = useMemo(() => 
    productions.filter(p => performances.some(perf => perf.productionId === p.id)),
    [productions, performances]
  );

  const [selectedProdId, setSelectedProdId] = useState('');
  const [selectedPerfId, setSelectedPerfId] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);

  const currentProduction = useMemo(() => 
    productions.find(p => p.id === selectedProdId),
    [productions, selectedProdId]
  );

  useEffect(() => {
    if (availableProductions.length > 0 && !selectedProdId) {
      setSelectedProdId(availableProductions[0].id);
    }
  }, [availableProductions, selectedProdId]);

  const currentPerformances = useMemo(() => 
    performances.filter(p => p.productionId === selectedProdId),
    [performances, selectedProdId]
  );

  useEffect(() => {
    if (currentPerformances.length > 0) {
      const exists = currentPerformances.find(p => p.id === selectedPerfId);
      if (!exists) setSelectedPerfId(currentPerformances[0].id);
    } else {
      setSelectedPerfId('');
    }
  }, [currentPerformances, selectedPerfId]);

  const takenSeatsSet = useMemo(() => {
    if (!selectedPerfId) return new Set();
    const perfRes = reservations.filter(r => r.performanceId === selectedPerfId && r.status !== 'Cancelled');
    const taken = new Set();
    perfRes.forEach(res => {
      if (res.seats) res.seats.forEach(s => taken.add(s));
    });
    return taken;
  }, [reservations, selectedPerfId]);

  const handleProductionChange = (prodId) => {
    setSelectedProdId(prodId);
    setSelectedPerfId('');
    setSelectedSeats([]);
  };

  const toggleSeat = (seat) => {
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.id === seat.id);
      if (exists) return prev.filter(s => s.id !== seat.id);
      return [...prev, seat];
    });
  };

  const removeSeat = (id) => {
    setSelectedSeats(prev => prev.filter(s => s.id !== id));
  };

  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const processingFee = subtotal > 0 ? 24.50 : 0;
  const total = subtotal + processingFee;

  // INCREASED SIZE AND SPACING FOR SEATS
  const orchestraSeats = useMemo(() => {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    rows.forEach((row, r) => {
      const y = 160 + (r * 22);
      for(let s=0; s<6; s++) seats.push({ id: `orch-${row.toLowerCase()}-${s+1}`, label: `Orchestra ${row}${s+1}`, x: 140 + (s * 20), y, section: 'Premium Orchestra', price: 65 });
      for(let s=0; s<18; s++) seats.push({ id: `orch-${row.toLowerCase()}-${s+7}`, label: `Orchestra ${row}${s+7}`, x: 300 + (s * 20), y, section: 'Premium Orchestra', price: 65 });
      for(let s=0; s<6; s++) seats.push({ id: `orch-${row.toLowerCase()}-${s+25}`, label: `Orchestra ${row}${s+25}`, x: 700 + (s * 20), y, section: 'Premium Orchestra', price: 65 });
    });
    return seats;
  }, []);

  const mezzanineSeats = useMemo(() => {
    const seats = [];
    const rows = ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
    rows.forEach((row, r) => {
      const y = 330 + (r * 22);
      for(let s=0; s<9; s++) seats.push({ id: `mezz-${row.toLowerCase()}-${s+1}`, label: `Mezzanine ${row}${s+1}`, x: 120 + (s * 20), y, section: 'Mezzanine', price: 55 });
      for(let s=0; s<11; s++) seats.push({ id: `mezz-${row.toLowerCase()}-${s+10}`, label: `Mezzanine ${row}${s+10}`, x: 345 + (s * 20), y, section: 'Mezzanine', price: 55 });
      for(let s=0; s<9; s++) seats.push({ id: `mezz-${row.toLowerCase()}-${s+21}`, label: `Mezzanine ${row}${s+21}`, x: 605 + (s * 20), y, section: 'Mezzanine', price: 55 });
    });
    return seats;
  }, []);

  const balconySeats = useMemo(() => {
    const seats = [];
    const rows = ['AA', 'BB', 'CC', 'DD', 'EE', 'FF'];
    rows.forEach((row, r) => {
      const y = 540 + (r * 22);
      let offset = 0;
      let countL = 6, countC = 17, countR = 6;
      if (row === 'DD') { offset = 20; countL = 5; countC = 17; countR = 5; }
      if (row === 'EE') { offset = 40; countL = 4; countC = 17; countR = 4; }
      if (row === 'FF') { offset = 60; countL = 3; countC = 17; countR = 3; }
      for(let s=0; s<countL; s++) seats.push({ id: `balc-${row.toLowerCase()}-${s+1}`, label: `Balcony ${row}${s+1}`, x: 140 + offset + (s * 20), y, section: 'Balcony', price: 40 });
      for(let s=0; s<countC; s++) seats.push({ id: `balc-${row.toLowerCase()}-${s+countL+1}`, label: `Balcony ${row}${s+countL+1}`, x: 300 + (s * 20), y, section: 'Balcony', price: 40 });
      for(let s=0; s<countR; s++) seats.push({ id: `balc-${row.toLowerCase()}-${s+countL+countC+1}`, label: `Balcony ${row}${s+countL+countC+1}`, x: 700 + (s * 20), y, section: 'Balcony', price: 40 });
    });
    return seats;
  }, []);

  const boxSeats = useMemo(() => {
    const seats = [];
    for(let b=0; b<4; b++) {
      for(let s=0; s<2; s++) {
        const boxNum = b + 1;
        seats.push({ id: `box-${boxNum}-seat-${s+1}`, label: `Box ${boxNum}, Seat ${s+1}`, x: 50 + (s * 25), y: 160 + (b * 50), section: `Box ${boxNum}`, price: 85, w: 20, h: 16 });
      }
    }
    for(let b=0; b<4; b++) {
      for(let s=0; s<2; s++) {
        const boxNum = b + 9;
        seats.push({ id: `box-${boxNum}-seat-${s+1}`, label: `Box ${boxNum}, Seat ${s+1}`, x: 890 + (s * 25), y: 160 + (b * 50), section: `Box ${boxNum}`, price: 85, w: 20, h: 16 });
      }
    }
    return seats;
  }, []);

  const handleProceed = () => {
    if (selectedSeats.length === 0 || !patronId) return;
    navigate('/reservation-confirmation', { 
      state: { patronId, perfId: selectedPerfId, seats: selectedSeats, total } 
    });
  };

  const currentPerformance = useMemo(() => 
    performances.find(p => p.id === selectedPerfId),
    [performances, selectedPerfId]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-background">
      <section className="h-24 glass-panel border-x-0 border-t-0 border-b border-[#C5A059]/20 flex items-center px-12 gap-12 z-20 shrink-0">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Production</span>
          <select className="bg-transparent border-none p-0 text-xl font-bold text-primary focus:ring-0 cursor-pointer" value={selectedProdId} onChange={(e) => handleProductionChange(e.target.value)}>
            {availableProductions.map(p => <option key={p.id} value={p.id} className="bg-slate-950">{p.name}</option>)}
          </select>
        </div>
        <div className="h-10 w-px bg-white/10"></div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Performance</span>
          <select className="bg-transparent border-none p-0 text-sm font-bold text-on-surface focus:ring-0 cursor-pointer outline-none" value={selectedPerfId} onChange={(e) => setSelectedPerfId(e.target.value)}>
            {currentPerformances.map(perf => (
              <option key={perf.id} value={perf.id} className="bg-slate-950">
                {new Date(perf.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} - {perf.timeType}
              </option>
            ))}
          </select>
        </div>
        
        <div className="ml-auto flex items-center gap-12">
          <div className="h-10 w-px bg-white/10"></div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">Select Patron</span>
            <select 
              className="bg-transparent border-none p-0 text-sm font-bold text-white focus:ring-0 cursor-pointer outline-none text-right"
              value={patronId || ""}
              onChange={(e) => navigate(`/reserve-tickets/${e.target.value}`)}
            >
              <option value="" className="bg-slate-950 text-slate-500">Choose a Patron...</option>
              {patrons.map(p => (
                <option key={p.id} value={p.id} className="bg-slate-950">
                  {p.firstName} {p.lastName} ({p.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="flex flex-1 overflow-hidden">
        <section className="flex-1 bg-slate-950/20 relative overflow-auto py-12 scrollbar-hide">
          <div className="flex flex-col items-center min-h-full p-6 w-full">
            <div className="glass-panel p-20 rounded-3xl shadow-2xl shadow-black/80 w-full max-w-[1300px] border-white/5 bg-slate-950/40 relative overflow-hidden min-h-[850px]">
              <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/5 to-transparent pointer-events-none"></div>
              
              <svg className="w-full h-auto" viewBox="0 0 1000 750" xmlns="http://www.w3.org/2000/svg">
                <path d="M150 20 L850 20 L865 70 L135 70 Z" fill="#0f172a" stroke="#C5A059" strokeWidth="1.5" />
                <text fill="#C5A059" fontFamily="Inter" fontSize="18" fontWeight="900" letterSpacing="12" textAnchor="middle" x="500" y="52">STAGE</text>
                
                <g transform="translate(500, 100)">
                  <g transform="translate(-160, 0)">
                    <rect width="20" height="16" rx="4" fill="#22c55e" />
                    <text x="30" y="12" fill="#ffffff" fontSize="10" fontWeight="bold" opacity="0.8">AVAILABLE</text>
                  </g>
                  <g transform="translate(-40, 0)">
                    <rect width="20" height="16" rx="4" fill="#ef4444" opacity="0.4" />
                    <text x="30" y="12" fill="#ffffff" fontSize="10" fontWeight="bold" opacity="0.8">RESERVED</text>
                  </g>
                  <g transform="translate(80, 0)">
                    <rect width="20" height="16" rx="4" fill="#3b82f6" />
                    <text x="30" y="12" fill="#ffffff" fontSize="10" fontWeight="bold" opacity="0.8">SELECTED</text>
                  </g>
                </g>

                {/* ORCHESTRA SECTION */}
                <text fill="#ffffff" fontFamily="Inter" fontSize="14" fontWeight="900" letterSpacing="4" opacity="0.8" textAnchor="middle" x="500" y="150">ORCHESTRA</text>
                {['A', 'B', 'C', 'D', 'E', 'F'].map((row, i) => (
                  <React.Fragment key={row}>
                    <text fill="#C5A059" fontSize="11" fontWeight="bold" textAnchor="middle" x="275" y={172 + (i * 22)}>{row}</text>
                    <text fill="#C5A059" fontSize="11" fontWeight="bold" textAnchor="middle" x="675" y={172 + (i * 22)}>{row}</text>
                  </React.Fragment>
                ))}
                <g id="orchestra-seats">
                  {orchestraSeats.map(seat => (
                    <Seat key={seat.id} seat={seat} isTaken={takenSeatsSet.has(seat.id)} isSelected={selectedSeats.some(s => s.id === seat.id)} onToggle={toggleSeat} />
                  ))}
                </g>

                {/* MEZZANINE SECTION */}
                <text fill="#ffffff" fontFamily="Inter" fontSize="14" fontWeight="900" letterSpacing="4" opacity="0.8" textAnchor="middle" x="500" y="320">MEZZANINE</text>
                {['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'].map((row, i) => (
                  <React.Fragment key={row}>
                    <text fill="#C5A059" fontSize="11" fontWeight="bold" textAnchor="middle" x="315" y={345 + (i * 22)}>{row}</text>
                    <text fill="#C5A059" fontSize="11" fontWeight="bold" textAnchor="middle" x="575" y={345 + (i * 22)}>{row}</text>
                  </React.Fragment>
                ))}
                <g id="mezzanine-seats">
                  {mezzanineSeats.map(seat => (
                    <Seat key={seat.id} seat={seat} isTaken={takenSeatsSet.has(seat.id)} isSelected={selectedSeats.some(s => s.id === seat.id)} onToggle={toggleSeat} />
                  ))}
                </g>

                {/* BALCONY SECTION */}
                <text fill="#ffffff" fontFamily="Inter" fontSize="14" fontWeight="900" letterSpacing="4" opacity="0.8" textAnchor="middle" x="500" y="530">BALCONY</text>
                {['AA', 'BB', 'CC', 'DD', 'EE', 'FF'].map((row, i) => (
                  <React.Fragment key={row}>
                    <text fill="#C5A059" fontSize="10" fontWeight="bold" textAnchor="middle" x="275" y={555 + (i * 22)}>{row}</text>
                    <text fill="#C5A059" fontSize="10" fontWeight="bold" textAnchor="middle" x="675" y={555 + (i * 22)}>{row}</text>
                  </React.Fragment>
                ))}
                <g id="balcony-seats">
                  {balconySeats.map(seat => (
                    <Seat key={seat.id} seat={seat} isTaken={takenSeatsSet.has(seat.id)} isSelected={selectedSeats.some(s => s.id === seat.id)} onToggle={toggleSeat} />
                  ))}
                </g>

                <text fill="#C5A059" fontSize="24" fontWeight="bold" textAnchor="middle" transform="rotate(-90, 25, 220)" x="25" y="220">BOX 1-8</text>
                <text fill="#C5A059" fontSize="24" fontWeight="bold" textAnchor="middle" transform="rotate(90, 960, 220)" x="960" y="220">BOX 9-16</text>
                <g id="boxes">
                  {boxSeats.map(seat => (
                    <Seat key={seat.id} seat={seat} isTaken={takenSeatsSet.has(seat.id)} isSelected={selectedSeats.some(s => s.id === seat.id)} onToggle={toggleSeat} />
                  ))}
                </g>
              </svg>
            </div>
          </div>
        </section>

        <aside className="w-[420px] h-full border-l border-white/5 flex flex-col bg-slate-950/60 backdrop-blur-2xl shrink-0">
          <div className="p-10 flex-1 overflow-y-auto scrollbar-hide">
            <h2 className="font-display-md text-3xl text-white mb-8 tracking-tighter">Reservation</h2>
            
            {currentProduction?.image && (
              <div className="mb-8 rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl relative group">
                <img src={currentProduction.image} alt={currentProduction.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
              </div>
            )}

            <div className="space-y-8">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-2">Selected Performance</p>
                <h4 className="text-xl font-display-md text-white">{currentProduction?.name}</h4>
                <p className="text-sm text-slate-400 mt-1">{currentPerformance?.date} • {currentPerformance?.timeType}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex justify-between">
                  <span>Selected Seats</span>
                  <span className="text-white">{selectedSeats.length}</span>
                </h3>
                <div className="space-y-3">
                  {selectedSeats.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                       <span className="material-symbols-outlined text-3xl text-slate-800 mb-2">event_seat</span>
                       <p className="text-xs text-slate-600 italic">Select seats on the map</p>
                    </div>
                  ) : (
                    selectedSeats.map(seat => (
                      <div key={seat.id} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 group">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white">{seat.label}</span>
                          <span className="text-[10px] text-slate-500 uppercase">{seat.section}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-mono text-[#C5A059]">ETB {seat.price}</span>
                          <button onClick={() => removeSeat(seat.id)} className="p-1 rounded-md hover:bg-error/20 text-error/40 hover:text-error transition-colors">
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 space-y-4">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-mono">ETB {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Fees</span>
                  <span className="font-mono">ETB {processingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-display-md text-white">Total</span>
                  <span className="text-2xl font-display-md text-[#C5A059]">ETB {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 border-t border-white/5 bg-slate-900/40 shrink-0">
            <button 
              onClick={handleProceed} 
              disabled={selectedSeats.length === 0 || !patronId} 
              className="w-full bg-gradient-to-r from-[#C5A059] to-[#E9C176] text-slate-950 py-5 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-20 disabled:pointer-events-none shadow-2xl shadow-[#C5A059]/20"
            >
              {!patronId ? 'Select Patron to Continue' : 'Confirm Reservation'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
