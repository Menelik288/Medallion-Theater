import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheatreStore } from '../store/useTheatreStore';
import FormModal from '../components/FormModal';
import ImageUpload from '../components/ImageUpload';

export default function ManageProductions() {
  const navigate = useNavigate();
  const { productions, addProduction, updateProduction, deleteProduction, setModal } = useTheatreStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProd, setEditingProd] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Play',
    duration: '',
    status: 'Upcoming',
    description: '',
    image: null
  });

  const openAddForm = () => {
    setEditingProd(null);
    setFormData({
      name: '',
      type: 'Play',
      duration: '',
      status: 'Upcoming',
      description: '',
      image: null
    });
    setIsFormOpen(true);
  };

  const openEditForm = (prod) => {
    setEditingProd(prod);
    setFormData({
      name: prod.name,
      type: prod.type,
      duration: prod.duration,
      status: prod.status,
      description: prod.description || '',
      image: prod.image || null
    });
    setIsFormOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.duration) {
      setModal({ type: 'error', title: 'Missing Info', message: 'Please fill in the name and duration.' });
      return;
    }

    if (editingProd) {
      updateProduction(editingProd.id, formData);
      setModal({ type: 'success', title: 'Updated', message: `"${formData.name}" has been updated.` });
    } else {
      addProduction(formData);
      setModal({ type: 'success', title: 'Created', message: `"${formData.name}" is now in the registry.` });
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id, name) => {
    setModal({
      type: 'confirm',
      title: 'Delete Production',
      message: `Warning: Deleting "${name}" will permanently cancel all scheduled performances and active reservations associated with it. This action cannot be undone.`,
      onConfirm: () => {
        deleteProduction(id);
        setModal({ type: 'success', title: 'Deleted', message: 'Production and all related records have been removed.' });
      }
    });
  };

  const filteredProductions = productions.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display-lg text-display-lg text-[#C5A059] mb-2 tracking-tight">Productions Registry</h1>
          <p className="text-slate-500 font-body-md max-w-2xl">
            Maintain the elite calendar of Medallion Theatre.
          </p>
        </div>
        <button 
          onClick={openAddForm}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#C5A059] to-[#E9C176] text-slate-950 rounded-xl text-sm font-bold hover:brightness-110 hover:-translate-y-1 transition-all shadow-xl shadow-[#C5A059]/20"
        >
          <span className="material-symbols-outlined font-bold">add</span>
          CREATE NEW PRODUCTION
        </button>
      </div>

      <div className="glass-panel p-6 rounded-2xl flex flex-wrap gap-6 items-center border-[#C5A059]/10">
        <div className="flex-1 min-w-[300px] flex items-center bg-slate-950/40 px-5 py-3 rounded-xl border border-white/5 group focus-within:border-[#C5A059] transition-all">
          <span className="material-symbols-outlined text-[#C5A059]/60 mr-3 group-focus-within:text-[#C5A059]">search</span>
          <input 
            type="text"
            placeholder="Search productions..."
            className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-surface placeholder-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Status</span>
          <div className="flex bg-slate-950/40 p-1 rounded-lg border border-white/5">
            {['All', 'Upcoming', 'On Sale', 'Closed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${statusFilter === status ? 'bg-[#C5A059] text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProductions.map((prod) => (
          <div 
            key={prod.id}
            className="group glass-panel rounded-2xl overflow-hidden border-[#C5A059]/10 hover:border-[#C5A059]/40 transition-all duration-500 flex flex-col h-full cursor-pointer hover:shadow-2xl hover:shadow-[#C5A059]/10"
            onClick={() => navigate(`/production/${prod.id}`)}
          >
            <div className="relative aspect-[2/3] overflow-hidden">
              {prod.image ? (
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center gap-4 text-slate-700">
                  <span className="material-symbols-outlined text-6xl opacity-20">theatre_comedy</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Poster Available</span>
                </div>
              )}
              
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border backdrop-blur-md ${
                  prod.status === 'On Sale' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  prod.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                  'bg-slate-500/20 text-slate-400 border-slate-500/30'
                }`}>
                  {prod.status}
                </span>
              </div>

              <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm translate-y-4 group-hover:translate-y-0">
                <button 
                  onClick={(e) => { e.stopPropagation(); openEditForm(prod); }}
                  className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#C5A059] hover:text-slate-950 transition-all"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(prod.id, prod.name); }}
                  className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col">
              <div className="space-y-1">
                <h3 className="font-display-md text-xl text-on-surface group-hover:text-[#C5A059] transition-colors line-clamp-1">{prod.name}</h3>
                <div className="flex items-center gap-2 text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">
                  <span>{prod.type}</span>
                  <span className="text-[#C5A059] opacity-40">•</span>
                  <span>{prod.duration}</span>
                </div>
              </div>
              <p className="text-body-sm text-slate-400 line-clamp-2 flex-1 italic">
                "{prod.description || 'No description available for this production.'}"
              </p>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[9px] text-slate-600 uppercase tracking-tighter">ID: {prod.id.slice(0, 8)}</span>
                <span className="text-[#C5A059] text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  MANAGE <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title={editingProd ? "Edit Production" : "Curate New Production"}
        footer={
          <div className="flex gap-4 w-full">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="flex-1 py-4 px-6 rounded-xl border border-white/10 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E9C176] text-slate-950 font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-[#C5A059]/20"
            >
              {editingProd ? "Save Changes" : "Create Production"}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <ImageUpload 
              value={formData.image} 
              onChange={(val) => setFormData(prev => ({ ...prev, image: val }))} 
            />
          </div>
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Production Title</label>
              <input 
                type="text"
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-5 py-4 text-on-surface focus:border-[#C5A059] outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Type</label>
                <select 
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-5 py-4 text-on-surface focus:border-[#C5A059] outline-none transition-all"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="Play">Play</option>
                  <option value="Musical">Musical</option>
                  <option value="Concert">Concert</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Duration</label>
                <input 
                  type="text"
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-5 py-4 text-on-surface focus:border-[#C5A059] outline-none transition-all"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Status</label>
              <div className="flex gap-2">
                {['Upcoming', 'On Sale', 'Closed'].map(s => (
                  <button
                    key={s}
                    onClick={() => setFormData(prev => ({ ...prev, status: s }))}
                    className={`flex-1 py-3 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${
                      formData.status === s ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]' : 'border-white/5 text-slate-500 hover:border-white/10'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">Description</label>
              <textarea 
                rows="4"
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-5 py-4 text-on-surface focus:border-[#C5A059] outline-none transition-all resize-none"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
