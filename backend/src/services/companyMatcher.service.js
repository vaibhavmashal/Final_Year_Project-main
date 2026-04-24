function normalizeSkill(skill) {
  return skill.toLowerCase().trim();
}

function scoreCompanies(skills = [], companyProfiles = []) {
  const normalizedSkills = new Set(skills.map(normalizeSkill));

  return companyProfiles
    .map((company) => {
      const preferred = company.preferredSkills.map(normalizeSkill);
      const matchedSkills = preferred.filter((skill) => normalizedSkills.has(skill));

      const skillCoverage = preferred.length > 0 ? matchedSkills.length / preferred.length : 0;
      const score = Math.round(
        skillCoverage * 75 + (company.historicalHiringStrength || 0) * 25
      );

      return {
        company: company.name,
        category: company.category,
        packageBandLpa: company.packageBandLpa,
        score,
        matchedSkills,
        missingSkills: preferred.filter((skill) => !normalizedSkills.has(skill))
      };
    })
    .sort((a, b) => b.score - a.score);
}

module.exports = {
  scoreCompanies
};
