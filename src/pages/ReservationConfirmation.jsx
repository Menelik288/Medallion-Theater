import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheatreStore } from '../store/useTheatreStore';
import WillCallForm from '../components/WillCallForm';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

export default function ReservationConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { patrons, performances, productions, addReservation, isSeatTaken, setModal } = useTheatreStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null); // null | 'sending' | 'sent' | 'failed'
  const [emailError, setEmailError] = useState(null);
  const formRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: formRef,
    documentTitle: `medallion-reservation-${confirmedReservation?.id}`,
  });

  const { patronId, perfId, seats, total } = location.state || {};

  const patron = patrons.find(p => p.id === patronId);
  const performance = performances.find(perf => perf.id === perfId);
  const production = productions.find(prod => prod.id === performance?.productionId);

  if (!patron || !performance || !production || !seats) {
    if (confirmedReservation) return <SuccessUI />;
    return (
      <div className="flex flex-col items-center justify-center h-full text-on-surface">
        <h2 className="text-2xl mb-4">No pending reservation found.</h2>
        <button
          onClick={() => navigate('/clerk-dashboard')}
          className="bg-primary text-slate-950 px-6 py-2 rounded font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleConfirm = async () => {
    setIsProcessing(true);

    // 1. Re-check availability
    const takenSeats = seats.filter(s => isSeatTaken(perfId, s.id));
    if (takenSeats.length > 0) {
      setIsProcessing(false);
      setModal({
        type: 'error',
        title: 'Seats No Longer Available',
        message: `The following seats were just taken by another clerk: ${takenSeats.map(s => s.label).join(', ')}. Please refresh your selection.`
      });
      return;
    }

    // 2. Save Reservation
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newRes = addReservation({
        patronId,
        performanceId: perfId,
        seats: seats.map(s => s.id),
        totalPrice: total,
        date: new Date().toISOString().split('T')[0]
      });

      setConfirmedReservation(newRes);
      setIsProcessing(false);

      // Dispatch confirmation email to the patron
      sendEmailNotification(newRes, patron, performance, production);
    } catch (error) {
      setIsProcessing(false);
      setModal({
        type: 'error',
        title: 'System Error',
        message: 'Failed to save reservation. Please check your network connection and try again.'
      });
    }
  };

  // Sends a real confirmation email to the patron via EmailJS
  const sendEmailNotification = async (res, patron, performance, production) => {
    const patronEmail = patron.email || '';
    if (!patronEmail) {
      setEmailStatus('failed');
      setEmailError('No email address on file for this patron.');
      return;
    }

    setEmailStatus('sending');
    setEmailError(null);

    const templateParams = {
      to_email: patronEmail,
      patron_name: patron.name || `${patron.firstName} ${patron.lastName}`,
      reservation_id: res.id,
      production_name: production.name,
      performance_date: new Date(performance.date + 'T12:00:00').toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }),
      performance_time: performance.timeType,
      seats: res.seats.join(', '),
      total_price: `ETB ${res.totalPrice.toFixed(2)}`,
    };

    try {
      // Initialise EmailJS with the public key before every send
      emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.info('[Medallion Theatre] EmailJS response:', response.status, response.text);
      if (response.status === 200) {
        setEmailStatus('sent');
      } else {
        throw new Error(`Unexpected status: ${response.status} — ${response.text}`);
      }
    } catch (err) {
      // EmailJS throws an object with {status, text} on API errors
      const detail = err?.text || err?.message || JSON.stringify(err);
      console.error('[Medallion Theatre] EmailJS error:', detail);
      setEmailError(detail);
      setEmailStatus('failed');
    }
  };

  const downloadPDF = async () => {
    if (!formRef.current) return;
    try {
      // Use a brief delay to ensure fonts are fully applied
      await new Promise(resolve => setTimeout(resolve, 200));

      const canvas = await html2canvas(formRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFDE7',
        logging: true,
        allowTaint: true,
        windowWidth: 800,
        windowHeight: 600
      });

      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`medallion-reservation-${confirmedReservation.id}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      setModal({
        type: 'error',
        title: 'PDF Generation Failed',
        message: 'Reservation saved, but PDF generation failed. Please use the Print button and choose "Save as PDF".'
      });
    }
  };

  function SuccessUI() {
    return (
      <div className="pt-6 pb-8 px-md md:px-xl max-w-container-max mx-auto h-full flex flex-col items-center">
        <div className="max-w-4xl w-full mx-auto">
          <div className="glass-panel py-10 px-xl rounded-3xl border-[#C5A059]/30 text-center space-y-8 shadow-2xl shadow-[#C5A059]/10">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <span className="material-symbols-outlined text-emerald-500 text-3xl">verified</span>
              </div>
              <div className="space-y-2">
                <h1 className="font-display-md text-4xl text-[#C5A059] tracking-tight">Reservation Confirmed</h1>
                <p className="font-body-md text-slate-400">
                  The booking for <span className="text-on-surface font-bold">{patron.name || `${patron.firstName} ${patron.lastName}`}</span> is finalized.
                </p>
              </div>

              {/* Email notification status banner */}
              <div className={`flex items-center gap-3 mx-auto px-6 py-3 rounded-xl border text-sm font-medium transition-all duration-700 ${emailStatus === 'sent'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : emailStatus === 'failed'
                    ? 'border-red-500/30 bg-red-500/10 text-red-400'
                    : 'border-[#C5A059]/20 bg-[#C5A059]/5 text-slate-400'
                }`}>
                {emailStatus === 'sending' && (
                  <span className="material-symbols-outlined text-base animate-spin text-[#C5A059]">sync</span>
                )}
                {emailStatus === 'sent' && (
                  <span className="material-symbols-outlined text-base text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
                )}
                {emailStatus === 'failed' && (
                  <span className="material-symbols-outlined text-base text-red-400">mail_off</span>
                )}
                {!emailStatus && (
                  <span className="material-symbols-outlined text-base text-[#C5A059]">forward_to_inbox</span>
                )}
                <span>
                  {emailStatus === 'sending' && `Sending confirmation to ${patron.email || 'patron email'}…`}
                  {emailStatus === 'sent' && `Confirmation email sent to ${patron.email || 'patron email'}`}
                  {emailStatus === 'failed' && (
                    <span>
                      Email delivery failed — please notify patron manually.
                      {emailError && <span className="block text-[10px] text-red-300 mt-0.5 font-mono">{emailError}</span>}
                    </span>
                  )}
                  {!emailStatus && `Preparing confirmation for ${patron.email || 'patron email'}`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-w-2xl mx-auto">
              <div className="text-left bg-slate-950/40 p-6 rounded-2xl border border-white/5 space-y-1">
                <p className="text-label-caps font-label-caps text-slate-500 uppercase tracking-widest text-[9px]">Reservation ID</p>
                <p className="font-display-md text-2xl text-[#C5A059] font-bold whitespace-nowrap">{confirmedReservation.id}</p>
              </div>
              <div className="text-left bg-slate-950/40 p-6 rounded-2xl border border-white/5 space-y-1">
                <p className="text-label-caps font-label-caps text-slate-500 uppercase tracking-widest text-[9px]">Total Collected</p>
                <p className="font-display-md text-2xl text-[#C5A059] font-bold whitespace-nowrap">ETB {confirmedReservation.totalPrice.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-center pt-4 pb-2">
              <button
                onClick={handlePrint}
                className="w-full max-w-2xl bg-gradient-to-r from-[#C5A059] to-[#E9C176] text-slate-950 font-bold py-6 px-12 rounded-2xl font-body-md hover:brightness-110 transition-all flex flex-col items-center justify-center gap-2 shadow-[0_0_40px_rgba(197,160,89,0.3)] animate-gold-pulse"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl">print</span>
                  <span className="text-xl tracking-wider uppercase">Print Will Call</span>
                </div>
                <span className="text-sm opacity-80 uppercase tracking-widest">Reservation Form</span>
              </button>
            </div>

            <button
              onClick={() => navigate('/clerk-dashboard')}
              className="text-slate-500 font-label-caps text-[10px] hover:text-[#C5A059] transition-colors pt-2 flex items-center justify-center gap-2 mx-auto"
            >
              <span className="material-symbols-outlined text-sm">dashboard</span>
              Return to Dashboard
            </button>
          </div>

          {/* Form Preview for PDF Generation (Hidden from UI but present in DOM) */}
          <div className="absolute top-0 left-0 w-0 h-0 overflow-hidden opacity-0">
            <div style={{ width: '800px', background: '#FFFDE7' }}>
              <WillCallForm
                ref={formRef}
                reservation={confirmedReservation}
                patron={patron}
                performance={performance}
                production={production}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-xl px-md md:px-xl max-w-container-max mx-auto h-screen overflow-y-auto scrollbar-hide">
      {confirmedReservation ? (
        <SuccessUI />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
          <div className="lg:col-span-5 space-y-md">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-b from-[#C5A059]/20 to-transparent blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative aspect-[3/4] glass-panel overflow-hidden rounded-lg">
                <img
                  className="w-full h-full object-cover"
                  src={production.image || "https://images.unsplash.com/photo-1503095396549-807039a30b02?auto=format&fit=crop&q=80&w=1000"}
                  alt={production.name}
                />
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="font-label-caps text-label-caps text-primary uppercase mb-xs">Now Showing</p>
                <h1 className="font-display-md text-display-md text-on-surface">{production.name}</h1>
              </div>
              <div className="text-right">
                <p className="font-label-caps text-label-caps text-slate-400 uppercase">Season</p>
                <p className="font-headline-sm text-headline-sm text-[#C5A059]">{production.type || 'Grand Opening'}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col space-y-lg">
            <div className="space-y-sm">
              <h2 className="font-display-md text-display-md text-[#C5A059]">Reservation Summary</h2>
              <p className="font-body-lg text-body-lg text-slate-400">Review your selection before finalizing your reservation for this exclusive performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="glass-panel p-md rounded-lg flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-[#C5A059] mb-sm">person</span>
                  <p className="font-label-caps text-label-caps text-slate-500 uppercase mb-xs">Patron Name</p>
                  <p className="font-body-lg text-body-lg text-on-surface font-medium">
                    {patron.name || `${patron.firstName} ${patron.lastName}`}
                  </p>
                  <p className="text-body-sm text-primary underline underline-offset-2">{patron.email || 'N/A'}</p>
                </div>
              </div>

              <div className="glass-panel p-md rounded-lg flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-[#C5A059] mb-sm">schedule</span>
                  <p className="font-label-caps text-label-caps text-slate-500 uppercase mb-xs">Performance Schedule</p>
                  <p className="font-body-lg text-body-lg text-on-surface font-medium">
                    {performance.date} • {performance.timeType}
                  </p>
                </div>
              </div>

              <div className="glass-panel p-md rounded-lg md:col-span-2 flex items-center justify-between">
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30">
                    <span className="material-symbols-outlined text-[#C5A059]">event_seat</span>
                  </div>
                  <div>
                    <p className="font-label-caps text-label-caps text-slate-500 uppercase mb-xs">Selected Seats</p>
                    <p className="font-body-lg text-body-lg text-on-surface font-medium">
                      {seats.map(s => s.label || `Row ${s.row}, Seat ${s.num}`).join(', ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-label-caps text-label-caps text-[#C5A059] px-sm py-xs border border-[#C5A059]/30 rounded-full bg-[#C5A059]/5">
                    PREMIUM SECTION
                  </span>
                </div>
              </div>

              <div className="glass-panel md:col-span-2 rounded-lg overflow-hidden">
                <div className="p-md border-b border-[#C5A059]/10">
                  <h3 className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Order Breakdown</h3>
                </div>
                <div className="p-md space-y-sm">
                  <div className="flex justify-between font-table-data text-table-data text-slate-400">
                    <span>{seats.length}x Premium Seats</span>
                    <span>ETB {(total - 24.50).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-table-data text-table-data text-slate-400">
                    <span>Processing Fee</span>
                    <span>ETB 24.50</span>
                  </div>
                  <div className="pt-sm border-t border-[#C5A059]/20 flex justify-between items-end">
                    <div>
                      <p className="font-label-caps text-label-caps text-slate-500 uppercase mb-xs">Total Price</p>
                      <p className="font-display-md text-display-md text-[#C5A059]">ETB {total.toFixed(2)}</p>
                    </div>
                    <div className="text-right italic font-body-sm text-body-sm text-slate-500">
                      Includes all local taxes and service fees.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-md pt-md">
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-[#C5A059] to-[#E9C176] text-slate-950 font-bold py-5 px-xl rounded-xl font-body-md hover:brightness-110 transition-all duration-300 shadow-lg shadow-[#C5A059]/20 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    Processing Transaction...
                  </>
                ) : (
                  <>
                    Confirm & Process Payment
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span>
                  </>
                )}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 border border-[#C5A059]/30 text-[#C5A059] py-5 px-xl rounded-xl font-body-md hover:bg-[#C5A059]/5 transition-all duration-300"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Map
              </button>
            </div>

            <div className="flex items-center gap-sm text-slate-500 justify-center sm:justify-start">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <p className="font-body-sm text-body-sm">Secure 256-bit SSL encrypted transaction</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
