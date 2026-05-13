import React from 'react';
import { useTheatreStore } from '../store/useTheatreStore';

export default function Modal() {
  const { modal, closeModal } = useTheatreStore();

  if (!modal.isOpen) return null;

  const getIcon = () => {
    switch (modal.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'confirm': return 'help';
      default: return 'info';
    }
  };

  const getIconColor = () => {
    switch (modal.type) {
      case 'success': return 'text-emerald-500';
      case 'error': return 'text-error';
      case 'confirm': return 'text-[#C5A059]';
      default: return 'text-primary';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Blur Overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={modal.type !== 'confirm' ? closeModal : undefined}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-[#0d1c2d] border border-[#C5A059]/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-md w-full min-w-[320px] overflow-hidden transform transition-all duration-300">
        <div className="h-1.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent w-full opacity-60"></div>
        
        <div className="p-8 flex flex-col items-center text-center">
          <span className={`material-symbols-outlined text-6xl mb-4 ${getIconColor()} opacity-90`} style={{ fontSize: '64px' }}>
            {getIcon()}
          </span>
          
          <h2 className="font-display-md text-3xl text-on-surface mb-3 font-bold tracking-tight">
            {modal.title}
          </h2>
          
          <p className="font-body-md text-slate-300 leading-relaxed mb-8 px-2">
            {modal.message}
          </p>
          
          <div className="flex gap-4 w-full">
            {modal.type === 'confirm' && (
              <button 
                onClick={closeModal}
                className="flex-1 border border-white/10 text-slate-400 font-label-caps py-4 rounded-xl hover:bg-white/5 transition-all uppercase tracking-widest text-[10px] font-bold"
              >
                Cancel
              </button>
            )}
            <button 
              onClick={() => {
                if (modal.onConfirm) modal.onConfirm();
                closeModal();
              }}
              className={`flex-1 font-label-caps py-4 rounded-xl transition-all uppercase tracking-widest text-[10px] font-bold ${
                modal.type === 'error' 
                  ? 'bg-red-600 text-white hover:bg-red-500' 
                  : 'bg-[#C5A059] text-slate-950 hover:brightness-110 shadow-lg shadow-[#C5A059]/20'
              }`}
            >
              {modal.type === 'confirm' ? 'Confirm Action' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
