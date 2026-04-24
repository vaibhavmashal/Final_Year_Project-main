const User = require("../models/user.model");
const { sendMeetingNotificationMail } = require("../services/mail.service");
const {
  buildMeetingNotificationTemplate
} = require("../templates/meetingNotification.template");

function isValidGoogleMeetLink(link) {
  if (!link || typeof link !== "string") {
    return false;
  }

  return /^https:\/\/meet\.google\.com\/[a-z0-9-]+$/i.test(link.trim());
}

exports.notifyStudentsForMeeting = async (req, res) => {
  try {
    const { title, description, meetingLink, scheduledAt } = req.body;

    if (!isValidGoogleMeetLink(meetingLink)) {
      return res.status(400).json({
        msg: "Please provide a valid Google Meet link. Example: https://meet.google.com/abc-defg-hij"
      });
    }

    const alumni = await User.findById(req.user.id).select("name email");
    if (!alumni) {
      return res.status(404).json({ msg: "Alumni user not found" });
    }

    const students = await User.find({
      role: "student",
      email: { $exists: true, $ne: null }
    }).select("email");

    const recipients = students
      .map((student) => student.email)
      .filter((email) => typeof email === "string" && email.trim().length > 0);

    if (recipients.length === 0) {
      return res.status(404).json({ msg: "No student emails found" });
    }

    const subject = `[Alumni Meeting] ${title || "New Guidance Session"}`;
    const { html, text } = buildMeetingNotificationTemplate({
      alumniName: alumni.name || "Alumni",
      title,
      description,
      meetingLink: meetingLink.trim(),
      scheduledAt
    });

    const mailResult = await sendMeetingNotificationMail({
      recipients,
      subject,
      html,
      text
    });

    return res.status(200).json({
      msg: "Meeting notification email sent to all students",
      sentCount: mailResult.sentCount
    });
  } catch (error) {
    console.error("Meeting notification error:", error);
    return res.status(500).json({
      msg: "Failed to send meeting notifications",
      error: error.message
    });
  }
};
