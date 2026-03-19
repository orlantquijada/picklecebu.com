import { Resend } from "resend";

import { env } from "../env";

const resend = new Resend(env.RESEND_API_KEY);

const formatHour = (hour: number): string => {
  const period = hour >= 12 ? "PM" : "AM";
  const baseHour = hour === 0 ? 12 : hour;
  const h = hour > 12 ? hour - 12 : baseHour;
  return `${h}:00 ${period}`;
};

const formatCentavos = (centavos: number): string =>
  `₱${(centavos / 100).toFixed(2)}`;

export const sendBookingConfirmationToPlayer = async (params: {
  playerEmail: string;
  playerName: string;
  courtName: string;
  bookingDate: string;
  startHour: number;
  endHour: number;
  totalAmount: number;
  bookingId: string;
}): Promise<void> => {
  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Booking Confirmed!</h2>
        <p>Hi ${params.playerName},</p>
        <p>Your pickleball court booking has been confirmed.</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Court</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${params.courtName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Date</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${params.bookingDate}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Time</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${formatHour(params.startHour)} – ${formatHour(params.endHour)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Total Paid</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${formatCentavos(params.totalAmount)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Booking Reference</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace;">${params.bookingId}</td></tr>
        </table>
        <p style="color: #dc2626; margin-top: 16px;"><strong>⚠️ No Refund Policy:</strong> Cancellations are not eligible for refunds. Please arrive on time.</p>
        <p>See you on the court! 🏓</p>
        <p style="color: #6b7280; font-size: 12px;">PickleCebu — Cebu's Pickleball Booking Platform</p>
      </div>
    `,
    subject: `Booking Confirmed — ${params.courtName}`,
    to: params.playerEmail,
  });
};

export const sendBookingNotificationToOwner = async (params: {
  ownerEmail: string;
  ownerName: string;
  courtName: string;
  playerName: string;
  playerEmail: string;
  playerPhone: string;
  bookingDate: string;
  startHour: number;
  endHour: number;
  totalAmount: number;
  bookingId: string;
}): Promise<void> => {
  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Booking Received</h2>
        <p>Hi ${params.ownerName},</p>
        <p>You have a new confirmed booking for <strong>${params.courtName}</strong>.</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Player</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${params.playerName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${params.playerEmail}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${params.playerPhone}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Date</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${params.bookingDate}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Time</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${formatHour(params.startHour)} – ${formatHour(params.endHour)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Total</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${formatCentavos(params.totalAmount)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Booking ID</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace;">${params.bookingId}</td></tr>
        </table>
        <p style="color: #6b7280; font-size: 12px;">PickleCebu Dashboard: ${process.env.WEB_URL ?? "http://localhost:3000"}/dashboard</p>
      </div>
    `,
    subject: `New Booking — ${params.courtName} on ${params.bookingDate}`,
    to: params.ownerEmail,
  });
};
