const nodemailer = require("nodemailer");

function getMailTransporter() {
  const {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_SECURE,
    MAIL_USER,
    MAIL_PASS,
    GMAIL_USER,
    GMAIL_PASSWORD
  } = process.env;

  const useGmailFallback = !MAIL_HOST && !MAIL_PORT && GMAIL_USER && GMAIL_PASSWORD;

  if (useGmailFallback) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASSWORD
      }
    });
  }

  if (!MAIL_HOST || !MAIL_PORT || !(MAIL_USER || GMAIL_USER) || !(MAIL_PASS || GMAIL_PASSWORD)) {
    throw new Error(
      "Email configuration missing. Set MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS or use GMAIL_USER and GMAIL_PASSWORD."
    );
  }

  return nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: MAIL_SECURE === "true",
    auth: {
      user: MAIL_USER || GMAIL_USER,
      pass: MAIL_PASS || GMAIL_PASSWORD
    }
  });
}

async function sendMeetingNotificationMail({ recipients, subject, html, text }) {
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return { sentCount: 0 };
  }

  const transporter = getMailTransporter();
  const sender = process.env.MAIL_FROM || process.env.MAIL_USER || process.env.GMAIL_USER;

  const info = await transporter.sendMail({
    from: sender,
    // Keep recipient list private by using BCC for all student addresses.
    to: sender,
    bcc: recipients,
    subject,
    text,
    html
  });

  return {
    sentCount: recipients.length,
    messageId: info.messageId
  };
}

module.exports = {
  sendMeetingNotificationMail
};
