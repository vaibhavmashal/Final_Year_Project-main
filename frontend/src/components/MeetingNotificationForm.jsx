import { useState } from "react";

const initialState = {
  title: "",
  description: "",
  meetingLink: "",
  scheduledAt: ""
};

export default function MeetingNotificationForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/api/meetings/notify-students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          meetingLink: form.meetingLink,
          scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({
          type: "error",
          message: data.msg || "Failed to send notification"
        });
      } else {
        setResult({
          type: "success",
          message: `${data.msg}. Sent to ${data.sentCount} students.`
        });
        setForm(initialState);
      }
    } catch (error) {
      setResult({
        type: "error",
        message: "Server error while sending notification"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-2">Schedule Student Meeting</h2>
      <p className="text-sm text-gray-600 mb-6">
        Send a single email notification to all registered students with your Google Meet link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          type="text"
          placeholder="Session title (e.g. Resume Review)"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="Meeting description"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <input
          name="meetingLink"
          value={form.meetingLink}
          onChange={handleChange}
          type="url"
          required
          placeholder="https://meet.google.com/abc-defg-hij"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <input
          name="scheduledAt"
          value={form.scheduledAt}
          onChange={handleChange}
          type="datetime-local"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-3 rounded-lg text-white font-semibold ${
            loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Sending..." : "Send Notification Email"}
        </button>
      </form>

      {result && (
        <p
          className={`mt-4 text-sm font-medium ${
            result.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {result.message}
        </p>
      )}
    </div>
  );
}
