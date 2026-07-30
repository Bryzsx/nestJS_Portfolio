import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('MAIL_HOST');
    const user = this.config.get<string>('MAIL_USER');
    const pass = this.config.get<string>('MAIL_PASS');
    const from = this.config.get<string>('MAIL_FROM');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.config.get<number>('MAIL_PORT', 587),
        secure: this.config.get<string>('MAIL_SECURE', 'false') === 'true',
        auth: { user, pass },
      });
      this.logger.log('Mail transporter initialized');
    } else {
      this.logger.warn('Mail not configured — set MAIL_HOST, MAIL_USER, MAIL_PASS env vars');
    }
  }

  async sendContactNotification(data: { name: string; email: string; subject: string; message: string }): Promise<void> {
    if (!this.transporter) {
      this.logger.warn('Mail not configured, skipping notification');
      return;
    }

    const to = this.config.get<string>('MAIL_FROM') || this.config.get<string>('MAIL_USER');
    if (!to) return;

    try {
      await this.transporter.sendMail({
        from: `"Portfolio Contact" <${this.config.get<string>('MAIL_USER')}>`,
        to,
        subject: `Portfolio: ${data.subject}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <h2 style="margin-bottom:24px">New Contact Message</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 12px;font-weight:600;color:#555;width:80px">Name</td><td style="padding:8px 12px">${escapeHtml(data.name)}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:600;color:#555">Email</td><td style="padding:8px 12px"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
              <tr><td style="padding:8px 12px;font-weight:600;color:#555">Subject</td><td style="padding:8px 12px">${escapeHtml(data.subject)}</td></tr>
            </table>
            <div style="margin-top:20px;padding:16px;background:#f5f5f5;border-radius:8px;white-space:pre-wrap">${escapeHtml(data.message)}</div>
            <p style="margin-top:24px;font-size:12px;color:#999">Sent from your portfolio contact form</p>
          </div>
        `,
      });
      this.logger.log(`Contact notification sent: ${data.subject}`);
    } catch (err) {
      this.logger.error('Failed to send contact notification', err);
    }
  }
}
