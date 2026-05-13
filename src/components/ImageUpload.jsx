import React, { useRef, useState, useEffect } from 'react';

export default function ImageUpload({ value, onChange, label = "Production Image" }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(value);

  // Sync internal state with external value when it changes (e.g. opening different edit forms)
  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-label-caps text-slate-500 uppercase tracking-widest">{label}</label>
      <div className="relative group">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`w-full aspect-[2/3] max-w-[200px] rounded-xl border-2 border-dashed border-[#C5A059]/30 bg-slate-900/50 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#C5A059] hover:bg-[#C5A059]/5 transition-all overflow-hidden ${preview ? 'border-none' : ''}`}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <span className="material-symbols-outlined text-4xl text-[#C5A059]/40">image</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Click to upload poster</span>
            </>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {preview && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              removeImage();
            }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 border border-red-500/50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl z-10"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
