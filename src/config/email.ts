export const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 465),
  secure: (process.env.SMTP_SECURE || 'true').toLowerCase() === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  from:
    process.env.EMAIL_FROM ||
    '"Butterfly Authentique" <no-reply@butterflyauthentique.in>',
  adminEmail:
    process.env.ORDERS_ALERT_EMAIL || process.env.SUPPORT_EMAIL || '',
};

export const emailConstants = {
  companyName: process.env.COMPANY_NAME || 'Butterfly Authentique',
  companyEmail:
    process.env.COMPANY_EMAIL || 'support@butterflyauthentique.in',
  companyPhone: process.env.COMPANY_PHONE || '+91 00000 00000',
  websiteUrl:
    process.env.WEBSITE_URL || 'https://www.butterflyauthentique.in',
  logoUrl:
    process.env.LOGO_URL ||
    'https://www.butterflyauthentique.in/logo.png',
  templates: {
    orderConfirmation: {
      subject:
        process.env.EMAIL_SUBJECT_ORDER ||
        'Your order with Butterfly Authentique',
      adminSubject:
        process.env.EMAIL_SUBJECT_ORDER_ADMIN || 'New order received',
    },
  },
};


