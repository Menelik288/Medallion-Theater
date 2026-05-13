import React from 'react';

export default function FormModal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-[#0d1c2d] border border-[#C5A059]/30 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-950/20">
          <div>
            <h2 className="text-3xl font-display-md text-white tracking-tight">{title}</h2>
            <div className="h-1 w-12 bg-[#C5A059] mt-2 rounded-full"></div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-8 border-t border-white/5 bg-slate-950/40">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
