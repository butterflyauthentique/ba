import 'server-only';
import nodemailer, { Transporter } from 'nodemailer';
import { emailConfig } from '@/config/email';

// Types
export interface EmailService {
  sendEmail(options: { to: string; subject: string; html: string; text?: string; bcc?: string }): Promise<{ success: boolean; error?: Error }>;
}

// Create a transporter instance
let transporter: Transporter | null = null;

// Initialize the email service
function createEmailService(): EmailService {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });

    // Verify connection configuration
    transporter.verify((error) => {
      if (error) {
        console.error('Email service connection error:', error);
      } else {
        console.log('Email service is ready to send messages');
      }
    });
  }

  return {
    sendEmail: async (options) => {
      if (!transporter) {
        const error = new Error('Email service not initialized');
        console.error('Email service error:', error);
        return { success: false, error };
      }

      try {
        const fallbackBcc = process.env.ORDERS_ALERT_EMAIL;
        await transporter.sendMail({
          from: emailConfig.from,
          to: options.to,
          bcc: options.bcc || fallbackBcc || undefined,
          subject: options.subject,
          html: options.html,
          text: options.text || '',
        });
        return { success: true };
      } catch (error) {
        console.error('Error sending email:', error);
        return { 
          success: false, 
          error: error instanceof Error ? error : new Error('Unknown email error') 
        };
      }
    },
  };
}

// Export a singleton instance
export default createEmailService();
