import { useEffect, useState } from "react";

export default function MentorChat() {

  // 🔥 dummy data
  const dummyAlumni = [
    {
      id: "d1",
      name: "Rahul Sharma",
      company: "Google",
      role: "SDE",
      expertise: "DSA, System Design",
      type: "dummy"
    },
    {
      id: "d2",
      name: "Priya Mehta",
      company: "Microsoft",
      role: "Frontend Engineer",
      expertise: "React, UI/UX",
      type: "dummy"
    }
  ];

  // 🔥 real DB alumni
  const [dbAlumni, setDbAlumni] = useState([]);

  const [completed, setCompleted] = useState({});

  // ✅ fetch from backend
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/alumni");
        const data = await res.json();
        setDbAlumni(data);
      } catch (err) {
        console.log("Error fetching alumni:", err);
      }
    };

    fetchAlumni();
  }, []);

  // 🔥 merge both
  const allAlumni = [...dummyAlumni, ...dbAlumni.map(a => ({
    ...a,
    type: "db"
  }))];

  const handleChat = (name) => {
    alert(`💬 Chat opened with ${name}`);
  };

  const handleDoubt = (name) => {
    const q = prompt(`Ask your doubt to ${name}:`);
    if (q) {
      alert(`Sent: "${q}" to ${name}`);
    }
  };

  const handleMeet = (id, name) => {
    const time = prompt(`Schedule meeting with ${name}:`);

    if (time) {
      alert(`📅 Meeting scheduled with ${name} at ${time}`);

      setCompleted((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold text-indigo-700 mb-2">
        Mentor Chat 🗣️
      </h1>

      <p className="text-gray-600 mb-6">
        Chat, ask doubts, and schedule meetings with alumni mentors.
      </p>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {allAlumni.map((a) => (
          <div
            key={a.id}
            className={`p-5 rounded-2xl shadow-lg bg-white border-l-4 
              ${a.type === "db" ? "border-green-500" : "border-blue-500"}
            `}
          >

            {/* Name */}
            <h2 className="text-xl font-bold">{a.name}</h2>

            <p className="text-gray-500 text-sm">
              {a.role} at {a.company}
            </p>

            <p className="text-indigo-600 text-sm mt-2">
              {a.expertise}
            </p>

            {/* Badge */}
            <p className="text-xs mt-2">
              {a.type === "db" ? "🔥 Registered Alumni" : "🧪 Demo Data"}
            </p>

            {/* Completed */}
            <div className="mt-2 text-green-600 text-sm">
              Meetings Completed: {completed[a.id] || 0}
            </div>

            {/* Buttons */}
            <div className="mt-4 space-y-2">

              <button
                onClick={() => handleChat(a.name)}
                className="w-full bg-indigo-600 text-white py-2 rounded-xl"
              >
                💬 Chat
              </button>

              <button
                onClick={() => handleDoubt(a.name)}
                className="w-full bg-yellow-500 text-white py-2 rounded-xl"
              >
                ❓ Ask Doubt
              </button>

              <button
                onClick={() => handleMeet(a.id, a.name)}
                className="w-full bg-green-500 text-white py-2 rounded-xl"
              >
                📅 Schedule Meeting
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}