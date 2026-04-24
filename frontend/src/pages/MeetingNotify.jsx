import { Link } from "react-router-dom";
import MeetingNotificationForm from "../components/MeetingNotificationForm";

export default function MeetingNotify() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Alumni Meeting Notifications</h1>
            <p className="text-slate-600 mt-1">
              Schedule a session and email all students directly from this page.
            </p>
          </div>

          <Link
            to="/alumni"
            className="inline-flex items-center rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-900"
          >
            Back to Alumni Dashboard
          </Link>
        </div>

        <MeetingNotificationForm />
      </div>
    </div>
  );
}
