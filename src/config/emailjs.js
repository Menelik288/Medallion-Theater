// ─────────────────────────────────────────────────────────────────────────────
// EmailJS Configuration — Medallion Theatre
// ─────────────────────────────────────────────────────────────────────────────
// 1. Create a free account at https://www.emailjs.com
// 2. Add an Email Service (Gmail, Outlook, etc.) → copy the Service ID
// 3. Create an Email Template (see template variables below) → copy the Template ID
// 4. Go to Account → API Keys → copy your Public Key
// ─────────────────────────────────────────────────────────────────────────────

export const EMAILJS_CONFIG = {
  SERVICE_ID:  'service_yh4f4lh',
  TEMPLATE_ID: 'template_uvxmzpj',
  PUBLIC_KEY:  'Sk5Va7JvR2Sk5ZEaa',
};

// ─────────────────────────────────────────────────────────────────────────────
// REQUIRED EmailJS Template Variables
// Paste this into your EmailJS template body:
// ─────────────────────────────────────────────────────────────────────────────
//
//  To:       {{to_email}}
//  Subject:  Your Medallion Theatre Reservation — {{reservation_id}}
//
//  Dear {{patron_name}},
//
//  Your reservation at Medallion Theatre has been confirmed!
//
//  🎭 Production:    {{production_name}}
//  📅 Date:          {{performance_date}}
//  🕐 Time Slot:     {{performance_time}}
//  💺 Seats:         {{seats}}
//  💰 Total Paid:    {{total_price}}
//  🔖 Reservation:   {{reservation_id}}
//
//  Please bring this confirmation to the box office.
//  We look forward to seeing you!
//
//  — Medallion Theatre Box Office
// ─────────────────────────────────────────────────────────────────────────────
