import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheatreStore } from '../store/useTheatreStore';

export default function SearchPatron() {
  const [searchTerm, setSearchTerm] = useState('');
  const patrons = useTheatreStore((state) => state.patrons);
  const navigate = useNavigate();

  const filteredPatrons = patrons.filter((p) => {
    const term = searchTerm.toLowerCase();
    const fullName = p.name ? p.name.toLowerCase() : `${p.firstName} ${p.lastName}`.toLowerCase();
    return (
      fullName.includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <div className="max-w-7xl mx-auto px-8 pt-32 pb-12">
        {/* Search Area */}
        <div className="glass-panel p-8 rounded-xl mb-10">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block font-label-caps text-label-caps text-primary mb-3">Search Patron Name or ID</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
                <input 
                  className="w-full bg-surface-container-low border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface py-4 pl-12 transition-all font-body-md placeholder:text-slate-600" 
                  placeholder="e.g. Sebastian Thorne or #MT-9021" 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/register-patron')}
                className="px-8 py-4 border border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-all uppercase tracking-widest text-xs"
              >
                Register New
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="glass-panel rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50 border-b border-[#C5A059]/20">
                <th className="px-8 py-5 font-label-caps text-label-caps text-[#C5A059] uppercase tracking-widest">Patron Details</th>
                <th className="px-8 py-5 font-label-caps text-label-caps text-[#C5A059] uppercase tracking-widest">ID Number</th>
                <th className="px-8 py-5 font-label-caps text-label-caps text-[#C5A059] uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-5 font-label-caps text-label-caps text-[#C5A059] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredPatrons.length > 0 ? filteredPatrons.map((patron) => {
                const displayName = patron.name || `${patron.firstName} ${patron.lastName}`;
                const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();
                return (
                  <tr key={patron.id} className="hover:bg-[#C5A059]/5 transition-colors group cursor-pointer" onClick={() => navigate(`/patron/${patron.id}`)}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/30">
                          <span className="text-[#C5A059] font-serif text-lg">{initials.slice(0, 2)}</span>
                        </div>
                        <div>
                          <div className="text-on-surface text-base font-medium group-hover:text-[#C5A059] transition-colors">{displayName}</div>
                          <div className="text-slate-500 text-xs">{patron.tier} Tier Member</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-slate-300 font-mono text-sm">#{patron.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-on-surface">{patron.email}</span>
                        <span className="text-slate-500 text-xs">{patron.phone}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/patron/${patron.id}`); }}
                          className="text-primary hover:bg-[#C5A059]/10 px-4 py-2 rounded transition-all font-label-caps text-xs border border-transparent hover:border-[#C5A059]/30"
                        >
                          VIEW PROFILE
                        </button>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            useTheatreStore.getState().setModal({
                              type: 'confirm',
                              title: 'Remove Patron?',
                              message: `Are you sure you want to permanently delete ${patron.name || (patron.firstName + ' ' + patron.lastName)}? This will also cancel all associated reservations.`,
                              onConfirm: () => useTheatreStore.getState().deletePatron(patron.id)
                            });
                          }}
                          className="text-error/60 hover:text-error hover:bg-error/10 px-4 py-2 rounded transition-all font-label-caps text-xs border border-transparent"
                        >
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-slate-500 font-body-md italic">No patrons match your search criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div className="px-8 py-4 bg-surface-container-high/30 border-t border-[#C5A059]/10">
            <span className="text-xs text-slate-500 font-label-caps">Showing {filteredPatrons.length} of {patrons.length} Registered Patrons</span>
          </div>
        </div>

        {/* Quick Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="glass-panel p-6 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-[#C5A059]/20 rounded-full flex items-center justify-center text-[#C5A059]">
              <span className="material-symbols-outlined">person_add</span>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-label-caps uppercase tracking-wider mb-1">Total Patrons</div>
              <div className="text-2xl font-display-md text-on-surface">{patrons.length}</div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-[#C5A059]/20 rounded-full flex items-center justify-center text-[#C5A059]">
              <span className="material-symbols-outlined">star</span>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-label-caps uppercase tracking-wider mb-1">Elite Members</div>
              <div className="text-2xl font-display-md text-on-surface">{patrons.filter(p => p.tier !== 'Bronze').length}</div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-[#C5A059]/20 rounded-full flex items-center justify-center text-[#C5A059]">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-label-caps uppercase tracking-wider mb-1">Active This Month</div>
              <div className="text-2xl font-display-md text-on-surface">14</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
