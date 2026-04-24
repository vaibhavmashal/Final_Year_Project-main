import { useEffect, useState } from "react";
import axios from "axios";

export default function Companies() {

  const dummyCompanies = [
    { name: "TCS", rounds: 3, details: "Aptitude, Technical Interview, HR" },
    { name: "Infosys", rounds: 2, details: "Online Test, Technical + HR" },
    { name: "Wipro", rounds: 3, details: "Aptitude, Coding Round, HR" }
  ];

  const [experiences, setExperiences] = useState([]);
  const [search, setSearch] = useState("");

  const fetchExperiences = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/experience");

      if (Array.isArray(res.data)) {
        setExperiences(res.data);
      } else {
        setExperiences([]);
      }

    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  // 🔍 Filter Logic
  const filteredDummy = dummyCompanies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredExperiences = experiences.filter((exp) =>
    exp.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      {/* 🔍 Search Bar Left Corner */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          Company Interview Experiences
        </h2>

        <input
          type="text"
          placeholder="Search by company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* Dummy Cards */}
        {filteredDummy.map((c, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow hover:-translate-y-2 hover:shadow-2xl transition"
          >
            <h3 className="text-xl font-bold text-blue-600">{c.name}</h3>
            <p className="mt-2 text-gray-600"><b>Rounds:</b> {c.rounds}</p>
            <p className="text-gray-600 mt-1">{c.details}</p>
          </div>
        ))}

        {/* Dynamic Cards */}
        {filteredExperiences.map((exp, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-indigo-50 to-white 
                       p-6 rounded-xl shadow hover:-translate-y-2 
                       hover:shadow-2xl transition border border-indigo-100"
          >
            <h3 className="text-xl font-bold text-indigo-700">
              {exp.companyName}
            </h3>

            <p className="mt-2 text-gray-700">
              <b>Role:</b> {exp.role}
            </p>

            <p className="mt-1 text-gray-700">
              <b>Rounds:</b> {exp.roundsCount}
            </p>

            <p className="mt-1 text-gray-600 text-sm">
              {exp.overallExperience}
            </p>

            <p className="mt-2 text-sm text-green-600 font-medium">
              💡 {exp.suggestion}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}