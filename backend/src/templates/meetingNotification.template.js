function formatMeetingDate(value) {
  if (!value) {
    return "To be announced";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "To be announced";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short"
  });
}

function buildMeetingNotificationTemplate({
  alumniName,
  title,
  description,
  meetingLink,
  scheduledAt
}) {
  const safeTitle = title || "Alumni Guidance Session";
  const safeDescription = description || "Please join the meeting using the link below.";
  const formattedDate = formatMeetingDate(scheduledAt);

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #f7f9fc; padding: 24px;">
      <div style="background: #ffffff; border-radius: 10px; padding: 24px; border: 1px solid #e5e7eb;">
        <h2 style="margin-top: 0; color: #0f172a;">New Alumni Meeting Invitation</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">
          Hello Student,<br/><br/>
          <strong>${alumniName}</strong> has scheduled a meeting for students.
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px; color: #0f172a;"><strong>Title:</strong> ${safeTitle}</p>
          <p style="margin: 0 0 8px; color: #0f172a;"><strong>Date & Time:</strong> ${formattedDate}</p>
          <p style="margin: 0; color: #0f172a;"><strong>Details:</strong> ${safeDescription}</p>
        </div>

        <a href="${meetingLink}" style="display: inline-block; text-decoration: none; background: #2563eb; color: #ffffff; padding: 12px 18px; border-radius: 8px; font-weight: 600;">
          Join on Google Meet
        </a>

        <p style="margin-top: 20px; color: #64748b; font-size: 13px;">
          If the button does not work, copy and paste this link in your browser:<br/>
          <span style="word-break: break-all;">${meetingLink}</span>
        </p>
      </div>
    </div>
  `;

  const text = [
    "New Alumni Meeting Invitation",
    `Alumni: ${alumniName}`,
    `Title: ${safeTitle}`,
    `Date & Time: ${formattedDate}`,
    `Details: ${safeDescription}`,
    `Google Meet Link: ${meetingLink}`
  ].join("\n");

  return { html, text };
}

module.exports = {
  buildMeetingNotificationTemplate
};
