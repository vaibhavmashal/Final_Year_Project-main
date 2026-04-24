export default function Jobs() {

  const jobs = [
    { company: "Google", role: "Software Engineer", link: "https://careers.google.com" },
    { company: "Microsoft", role: "Developer", link: "https://careers.microsoft.com" },
    { company: "Amazon", role: "SDE", link: "https://amazon.jobs" }
  ];

  return (
    <div>

      <h2 className="text-2xl font-semibold mb-6">Job Opportunities</h2>

      <div className="grid md:grid-cols-3 gap-6">

        {jobs.map((job, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow">

            <h3 className="text-lg font-bold">{job.company}</h3>

            <p className="text-gray-600">{job.role}</p>

            <a
              href={job.link}
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