import { useMemo, useState } from "react";
import axios from "axios";

export default function ResumeCompanyMatcher() {
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const extractedSkills = useMemo(() => result?.extractedSkills || [], [result]);
  const recommendations = useMemo(() => result?.recommendations || [], [result]);
  const prerequisites = useMemo(() => result?.prerequisites || [], [result]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!resumeFile) {
      setError("Please upload a resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/genai/resume-match",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setResult(response.data);
    } catch (apiError) {
      setResult(null);
      setError(apiError.response?.data?.msg || "Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold text-indigo-700">AI Company Fit Predictor</h2>
        <p className="text-gray-600 mt-2">
          Upload your resume to extract skills and get company recommendations using Gemini.
        </p>

        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
            className="w-full border border-gray-300 rounded-lg p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {loading ? "Analyzing Resume..." : "Analyze Resume"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-600 font-medium">{error}</p>
        )}
      </div>

      {result && (
        <>
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Extracted Skills</h3>
            <p className="text-sm text-gray-500">
              Source: {result.extractionSource} | AI refinement: {result.aiSource}
            </p>
            <p className="text-gray-700">{result.extractionSummary}</p>

            <div className="flex flex-wrap gap-2">
              {extractedSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Best Company Matches</h3>
            <p className="text-gray-700">{result.aiNarrative}</p>

            <div className="grid md:grid-cols-2 gap-4">
              {recommendations.map((item) => (
                <div key={item.company} className="border rounded-xl p-4">
                  <p className="text-lg font-semibold text-indigo-700">{item.company}</p>
                  <p className="text-sm text-gray-600">Category: {item.category}</p>
                  <p className="text-sm text-gray-600">Package Band (LPA): {item.packageBandLpa}</p>
                  <p className="text-sm mt-2 text-gray-800">Score: {item.score}/100</p>
                  <p className="text-sm mt-2 text-gray-700">
                    Matched Skills: {item.matchedSkills.join(", ") || "None"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Missing Skills: {item.missingSkills.join(", ") || "None"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow space-y-3">
            <h3 className="text-xl font-bold text-gray-800">Prerequisite Data Needed for Better Prediction</h3>

            <ul className="space-y-3">
              {prerequisites.map((item) => (
                <li key={item.field} className="border-l-4 border-indigo-500 pl-4">
                  <p className="font-semibold text-gray-800">{item.field}</p>
                  <p className="text-sm text-gray-600">{item.why}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
