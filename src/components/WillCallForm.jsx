import React, { forwardRef } from 'react';

const WillCallForm = forwardRef(({ reservation, patron, performance, production }, ref) => {
  if (!reservation || !patron || !performance || !production) return null;

  return (
    <div ref={ref} className="will-call-form bg-[#FFFDE7] p-10 text-slate-900 font-sans border-[3px] border-slate-950 w-[800px] mx-auto overflow-hidden">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 overflow-hidden rounded-full">
            <img src="/src/assets/image copy.png" alt="Medallion Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mt-4">Will Call Reservation Form</h1>
        <div className="w-20"></div>
      </div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-8">
        <div className="flex items-end gap-2 border-b border-slate-900 pb-1">
          <span className="font-bold whitespace-nowrap min-w-[100px] text-sm">First Name</span>
          <span className="font-['Kalam'] text-lg px-2 flex-1">{patron.firstName}</span>
        </div>
        <div className="flex items-end gap-2 border-b border-slate-900 pb-1">
          <span className="font-bold whitespace-nowrap min-w-[100px] text-sm">Last Name</span>
          <span className="font-['Kalam'] text-lg px-2 flex-1">{patron.lastName}</span>
        </div>
        
        <div className="col-span-2 flex items-end gap-2 border-b border-slate-900 pb-1">
          <span className="font-bold whitespace-nowrap min-w-[120px] text-sm">Street Address</span>
          <span className="font-['Kalam'] text-lg px-2 flex-1">{patron.address}</span>
        </div>

        <div className="col-span-2 grid grid-cols-12 gap-4">
          <div className="col-span-5 flex items-end gap-2 border-b border-slate-900 pb-1">
            <span className="font-bold whitespace-nowrap min-w-[40px] text-sm">City</span>
            <span className="font-['Kalam'] text-lg px-2 flex-1">{patron.city}</span>
          </div>
          <div className="col-span-3 flex items-end gap-2 border-b border-slate-900 pb-1">
            <span className="font-bold whitespace-nowrap min-w-[40px] text-sm">State</span>
            <span className="font-['Kalam'] text-lg px-2 flex-1">{patron.state}</span>
          </div>
          <div className="col-span-4 flex items-end gap-2 border-b border-slate-900 pb-1">
            <span className="font-bold whitespace-nowrap min-w-[30px] text-sm">Zip</span>
            <span className="font-['Kalam'] text-lg px-2 flex-1">{patron.zip}</span>
          </div>
        </div>

        <div className="flex items-end gap-2 border-b border-slate-900 pb-1">
          <span className="font-bold whitespace-nowrap min-w-[110px] text-sm">Phone Number</span>
          <span className="font-['Kalam'] text-base px-2 flex-1">{patron.phone}</span>
        </div>
        <div className="flex items-end gap-2 border-b border-slate-900 pb-1">
          <span className="font-bold whitespace-nowrap min-w-[110px] text-sm">Email address</span>
          <span className="font-['Kalam'] text-base px-2 flex-1 lowercase">{patron.email}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-y-6 mb-8">
        <div className="col-span-5 flex items-end gap-2 border-b border-slate-900 pb-1">
          <span className="font-bold whitespace-nowrap min-w-[100px] text-sm">Performance</span>
          <span className="font-['Kalam'] text-lg px-2 flex-1">{production.name}</span>
        </div>
        <div className="col-span-4 flex items-end gap-2 border-b border-slate-900 pb-1 mx-4">
          <span className="font-bold whitespace-nowrap min-w-[40px] text-sm">Date</span>
          <span className="font-['Kalam'] text-lg px-2 flex-1">{performance.date}</span>
        </div>
        <div className="col-span-3 flex items-end gap-2 border-b border-slate-900 pb-1">
          <span className="font-bold whitespace-nowrap min-w-[40px] text-sm">Time</span>
          <span className="font-['Kalam'] text-lg px-2 flex-1">{performance.timeType}</span>
        </div>

        <div className="col-span-7 flex items-end gap-2 border-b border-slate-900 pb-1 mt-2">
          <span className="font-bold whitespace-nowrap min-w-[50px] text-sm">Seats</span>
          <span className="font-['Kalam'] text-lg px-2 flex-1 tracking-widest">{reservation.seats.join(', ')}</span>
        </div>
      </div>

      <div className="flex justify-between items-end mt-12">
        <div className="flex items-end gap-4">
          <span className="text-lg font-bold">Total to be Collected</span>
          <div className="border-b border-slate-900 min-w-[150px] flex items-center">
            <span className="text-xl mr-2 font-bold">ETB</span>
            <span className="font-['Kalam'] text-2xl">{reservation.totalPrice.toFixed(2)}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-tight">Reservation ID: {reservation.id}</p>
          <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-tight">Patron ID: {patron.id}</p>
        </div>
      </div>
    </div>
  );
});

export default WillCallForm;
