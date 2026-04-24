const companyProfiles = require("../data/companyProfiles");
const { extractResumeText } = require("../utils/resumeParser");
const { scoreCompanies } = require("../services/companyMatcher.service");
const { extractSkillsWithGemini } = require("../services/gemini.service");

const prerequisitesForBetterPrediction = [
  {
    field: "Historical placement data (3-5 years)",
    why: "Needed to learn which companies consistently hire from your college."
  },
  {
    field: "Student profile data",
    why: "CGPA, branch, projects, internships, certifications improve match quality."
  },
  {
    field: "Selection outcomes",
    why: "Final selected vs rejected status is required to train ranking quality."
  },
  {
    field: "Company requirement trends",
    why: "Hiring criteria changes each year; model needs recent pattern updates."
  },
  {
    field: "Resume-to-skill ground truth",
    why: "Human-verified skill labels improve extraction accuracy significantly."
  },
  {
    field: "Interview round feedback",
    why: "Helps estimate readiness gaps for each company."
  }
];

exports.getPredictionPrerequisites = (req, res) => {
  res.json({
    prerequisites: prerequisitesForBetterPrediction
  });
};

exports.recommendFromResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        msg: "Resume file is required"
      });
    }

    const resumeText = await extractResumeText(req.file);

    if (!resumeText || resumeText.length < 80) {
      return res.status(400).json({
        msg: "Resume text too short or unreadable. Use a clearer resume file."
      });
    }

    const skillOutput = await extractSkillsWithGemini(resumeText);
    const ranked = scoreCompanies(skillOutput.skills, companyProfiles);
    const topRecommendations = ranked.slice(0, 5);

    const recommendationNarrative =
      skillOutput.source === "gemini"
        ? "Skills were extracted with Gemini. Company recommendations are ranked using local college placement matching."
        : "Skills were extracted using local fallback. Company recommendations are ranked using local college placement matching.";

    return res.json({
      extractedSkills: skillOutput.skills,
      extractionSummary: skillOutput.summary,
      extractionSource: skillOutput.source,
      recommendations: topRecommendations,
      aiNarrative: recommendationNarrative,
      aiRecommendationDetails: [],
      aiSource: "local-matcher",
      prerequisites: prerequisitesForBetterPrediction
    });
  } catch (error) {
    console.error("GenAI resume recommendation error:", error);

    if (error.statusCode === 400) {
      return res.status(400).json({
        msg: error.message
      });
    }

    return res.status(500).json({
      msg: "Failed to process resume and generate recommendations",
      error: error.message
    });
  }
};
