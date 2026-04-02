import { env } from '../config/env.js';

type SendEventRegistrationEmailInput = {
  to: string;
  recipientName: string;
  eventTitle: string;
  organizer: string;
  eventDate: string;
  address: string;
};

type EmailSendResult =
  | { status: 'sent'; provider: 'resend' }
  | { status: 'skipped'; reason: string };

async function sendViaResend({
  to,
  recipientName,
  eventTitle,
  organizer,
  eventDate,
  address,
}: SendEventRegistrationEmailInput): Promise<EmailSendResult> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    return {
      status: 'skipped',
      reason: 'Email provider is not configured',
    };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [to],
      subject: `"${eventTitle}" etkinligi icin katilim bildirimi`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Etkinlik Katilimi Onaylandi</h2>
          <p>Merhaba ${recipientName},</p>
          <p><strong>${eventTitle}</strong> etkinligine katilim talebiniz alindi.</p>
          <p><strong>Duzenleyen:</strong> ${organizer}</p>
          <p><strong>Tarih:</strong> ${eventDate}</p>
          <p><strong>Adres:</strong> ${address}</p>
          <p>Etkinlikte gorusmek uzere.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email via Resend: ${errorText}`);
  }

  return {
    status: 'sent',
    provider: 'resend',
  };
}

export const emailService = {
  async sendEventRegistrationEmail(
    input: SendEventRegistrationEmailInput,
  ): Promise<EmailSendResult> {
    return sendViaResend(input);
  },
};
