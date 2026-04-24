export default function Internships() {

  const internships = [
    { company: "Google", role: "Software Intern", link: "https://careers.google.com" },
    { company: "Microsoft", role: "Intern", link: "https://careers.microsoft.com" },
    { company: "Amazon", role: "Intern", link: "https://amazon.jobs" }
  ];

  return (
    <div>

      <h2 className="text-2xl font-semibold mb-6">
        Internship Opportunities
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {internships.map((intern, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow">

            <h3 className="font-bold text-lg">{intern.company}</h3>

            <p className="text-gray-600">{intern.role}</p>

            <a
              href={intern.link}
              className="text-blue-600 mt-2 inline-block hover:underline"
            >
              Apply →
            </a>

          </div>
        ))}

      </div>

    </div>
  );
}