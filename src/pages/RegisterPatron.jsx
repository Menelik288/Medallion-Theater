import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheatreStore } from '../store/useTheatreStore';

export default function RegisterPatron() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    tier: 'Bronze'
  });
  
  const addPatron = useTheatreStore((state) => state.addPatron);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPatron = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`.trim()
    };
    const addedPatron = addPatron(newPatron);
    useTheatreStore.getState().setModal({
      type: 'success',
      title: 'Registration Complete',
      message: `${newPatron.name} has been successfully added to the Medallion Elite system.`,
      onConfirm: () => navigate(`/patron/${addedPatron.id}`)
    });
  };

  return (
    <>

{/* Decorative Background Element */}
<div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-primary-container/5 rounded-full blur-[100px] pointer-events-none"></div>
<div className="max-w-[1000px] mx-auto py-lg">

{/* Registration Form Card */}
<div className="bg-surface-container-low/60 backdrop-blur-2xl border border-[#C5A059]/30 rounded-xl overflow-hidden shadow-2xl">
<div className="h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent w-full opacity-50"></div>
<div className="p-xl">
<form className="grid grid-cols-12 gap-x-md gap-y-xl" onSubmit={handleSubmit}>
{/* Personal Information Section */}
<div className="col-span-12">
<h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-3 mb-base">
<span className="material-symbols-outlined text-[#C5A059]">person</span>
                Identity Details
              </h2>
<div className="h-[1px] w-full bg-gradient-to-r from-[#C5A059]/30 to-transparent mb-md"></div>
</div>
<div className="col-span-6 flex flex-col gap-2">
<label className="font-label-caps text-xs text-slate-400">First Name</label>
<div className="relative group">
<input 
  className="w-full bg-surface-container border-b border-[#C5A059]/30 px-0 py-3 text-on-surface focus:outline-none focus:border-[#C5A059] focus:ring-0 transition-all placeholder:text-slate-600 font-body-md" 
  placeholder="e.g. Julian" 
  type="text"
  name="firstName"
  value={formData.firstName}
  onChange={handleChange}
  required
/>
<div className="absolute bottom-0 left-0 h-0.5 bg-[#C5A059] w-0 group-focus-within:w-full transition-all duration-500 shadow-[0_0_8px_rgba(197,160,89,0.5)]"></div>
</div>
</div>
<div className="col-span-6 flex flex-col gap-2">
<label className="font-label-caps text-xs text-slate-400">Last Name</label>
<div className="relative group">
<input 
  className="w-full bg-surface-container border-b border-[#C5A059]/30 px-0 py-3 text-on-surface focus:outline-none focus:border-[#C5A059] focus:ring-0 transition-all placeholder:text-slate-600 font-body-md" 
  placeholder="e.g. Thorne" 
  type="text"
  name="lastName"
  value={formData.lastName}
  onChange={handleChange}
  required
/>
<div className="absolute bottom-0 left-0 h-0.5 bg-[#C5A059] w-0 group-focus-within:w-full transition-all duration-500 shadow-[0_0_8px_rgba(197,160,89,0.5)]"></div>
</div>
</div>
{/* Contact Information Section */}
<div className="col-span-12 mt-base">
<h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-3 mb-base">
<span className="material-symbols-outlined text-[#C5A059]">contact_mail</span>
                Communication Channels
              </h2>
<div className="h-[1px] w-full bg-gradient-to-r from-[#C5A059]/30 to-transparent mb-md"></div>
</div>
<div className="col-span-12 md:col-span-7 flex flex-col gap-2">
<label className="font-label-caps text-xs text-slate-400">Email Address</label>
<div className="relative group">
<input 
  className="w-full bg-surface-container border-b border-[#C5A059]/30 px-0 py-3 text-on-surface focus:outline-none focus:border-[#C5A059] focus:ring-0 transition-all placeholder:text-slate-600 font-body-md" 
  placeholder="julian.thorne@prestige.com" 
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  required
/>
<div className="absolute bottom-0 left-0 h-0.5 bg-[#C5A059] w-0 group-focus-within:w-full transition-all duration-500 shadow-[0_0_8px_rgba(197,160,89,0.5)]"></div>
</div>
</div>
<div className="col-span-12 md:col-span-5 flex flex-col gap-2">
<label className="font-label-caps text-xs text-slate-400">Phone Number</label>
<div className="relative group">
<input 
  className="w-full bg-surface-container border-b border-[#C5A059]/30 px-0 py-3 text-on-surface focus:outline-none focus:border-[#C5A059] focus:ring-0 transition-all placeholder:text-slate-600 font-body-md" 
  placeholder="+1 (555) 000-0000" 
  type="tel"
  name="phone"
  value={formData.phone}
  onChange={handleChange}
  required
/>
<div className="absolute bottom-0 left-0 h-0.5 bg-[#C5A059] w-0 group-focus-within:w-full transition-all duration-500 shadow-[0_0_8px_rgba(197,160,89,0.5)]"></div>
</div>
</div>
{/* Address Section */}
<div className="col-span-12 mt-base">
<h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-3 mb-base">
<span className="material-symbols-outlined text-[#C5A059]">location_on</span>
                Primary Residence
              </h2>
<div className="h-[1px] w-full bg-gradient-to-r from-[#C5A059]/30 to-transparent mb-md"></div>
</div>
<div className="col-span-12 flex flex-col gap-2">
<label className="font-label-caps text-xs text-slate-400">Street Address</label>
<div className="relative group">
<input 
  className="w-full bg-surface-container border-b border-[#C5A059]/30 px-0 py-3 text-on-surface focus:outline-none focus:border-[#C5A059] focus:ring-0 transition-all placeholder:text-slate-600 font-body-md" 
  placeholder="123 Performance Way, Upper West Side" 
  type="text"
  name="address"
  value={formData.address}
  onChange={handleChange}
  required
/>
<div className="absolute bottom-0 left-0 h-0.5 bg-[#C5A059] w-0 group-focus-within:w-full transition-all duration-500 shadow-[0_0_8px_rgba(197,160,89,0.5)]"></div>
</div>
</div>
<div className="col-span-5 flex flex-col gap-2">
<label className="font-label-caps text-xs text-slate-400">City</label>
<div className="relative group">
<input 
  className="w-full bg-surface-container border-b border-[#C5A059]/30 px-0 py-3 text-on-surface focus:outline-none focus:border-[#C5A059] focus:ring-0 transition-all placeholder:text-slate-600 font-body-md" 
  placeholder="New York" 
  type="text"
  name="city"
  value={formData.city}
  onChange={handleChange}
  required
/>
<div className="absolute bottom-0 left-0 h-0.5 bg-[#C5A059] w-0 group-focus-within:w-full transition-all duration-500 shadow-[0_0_8px_rgba(197,160,89,0.5)]"></div>
</div>
</div>
<div className="col-span-3 flex flex-col gap-2">
<label className="font-label-caps text-xs text-slate-400">State</label>
<div className="relative group">
<input 
  className="w-full bg-surface-container border-b border-[#C5A059]/30 px-0 py-3 text-on-surface focus:outline-none focus:border-[#C5A059] focus:ring-0 transition-all placeholder:text-slate-600 font-body-md" 
  placeholder="NY" 
  type="text"
  name="state"
  value={formData.state}
  onChange={handleChange}
  required
/>
<div className="absolute bottom-0 left-0 h-0.5 bg-[#C5A059] w-0 group-focus-within:w-full transition-all duration-500 shadow-[0_0_8px_rgba(197,160,89,0.5)]"></div>
</div>
</div>
<div className="col-span-4 flex flex-col gap-2">
<label className="font-label-caps text-xs text-slate-400">Postal Code</label>
<div className="relative group">
<input 
  className="w-full bg-surface-container border-b border-[#C5A059]/30 px-0 py-3 text-on-surface focus:outline-none focus:border-[#C5A059] focus:ring-0 transition-all placeholder:text-slate-600 font-body-md" 
  placeholder="10023" 
  type="text"
  name="zip"
  value={formData.zip}
  onChange={handleChange}
  required
/>
<div className="absolute bottom-0 left-0 h-0.5 bg-[#C5A059] w-0 group-focus-within:w-full transition-all duration-500 shadow-[0_0_8px_rgba(197,160,89,0.5)]"></div>
</div>
</div>
{/* Form Actions */}
<div className="col-span-12 mt-lg flex justify-end gap-6 items-center">
<button 
  className="font-label-caps text-xs text-slate-400 hover:text-[#C5A059] transition-colors uppercase tracking-widest px-4 py-2" 
  type="reset"
  onClick={() => setFormData({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', tier: 'Bronze'
  })}
>Clear Fields</button>
<button className="bg-gradient-to-r from-[#C5A059] to-[#8C6B3E] text-slate-950 px-12 py-4 rounded-sm font-label-caps uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(197,160,89,0.3)] hover:shadow-[0_4px_25px_rgba(197,160,89,0.5)] hover:scale-[1.02] active:scale-100 transition-all duration-300" type="submit">
                Register Patron
              </button>
</div>
</form>
</div>
</div>
{/* Feature Highlight / Bento Secondary Section */}
<div className="grid grid-cols-12 gap-md mt-xl">
<div className="col-span-8 bg-surface-container-low/40 backdrop-blur-md border border-[#C5A059]/10 p-md rounded flex gap-6 items-center">
<div className="w-20 h-20 bg-primary-container/10 border border-[#C5A059]/30 flex items-center justify-center rounded">
<span className="material-symbols-outlined text-[#C5A059] text-4xl">verified_user</span>
</div>
<div>
<h4 className="text-[#C5A059] font-headline-sm mb-1">Membership Tier: {formData.tier}</h4>
<p className="text-slate-400 text-sm">Once registered, this patron will be eligible for Gold Tier benefits including priority balcony seating and lounge access.</p>
</div>
</div>
<div className="col-span-4 relative group rounded overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="A high-contrast, moody image of a luxury theatre seat in plush red velvet with ornate golden scrollwork on the armrest. The lighting is focused and dramatic, capturing the minimalist luxury and exclusive atmosphere of the Medallion Theatre's elite seating." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDef9O6Y2otNI3GjuGxPbGv2s77awamQG3p5Vcbmgbci4Q95_D8eSkjmISFB0SaoPQiYh360kKvoyP_KyLsgKtukA4qTk2bfa0HRyY3IvWnKUo9kV3Aed0Ou5Kax-StPcW8kn1TWpR5KbxfgeQbnV1JIyyCUH8hJEoI39EAirmY21I52p5pSmwAhOB4E1itiYuc6uviC8MxXLrz_4TXJXNtQ-Q6DsODen9vIj2Rb6FeAfXMQocpKUkA48qBYyTZ2b_eMdwKb3OQP3FD"/>
<div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent flex items-end p-6">
<span className="font-label-caps text-white text-[10px]">Elite Access Preview</span>
</div>
</div>
</div>
</div>

    </>
  );
}
