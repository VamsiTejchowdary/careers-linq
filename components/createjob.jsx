"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function CreateJobForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [reportsTo, setReportsTo] = useState("");
  const [compensationRange, setCompensationRange] = useState("");
  const [about, setAbout] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [niceToHaves, setNiceToHaves] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const departments = ["Engineering", "Sales", "Marketing", "HR", "Operations", "Finance", "Product", "Design"];
  const employmentTypes = ["Full-time", "Part-time", "Contract", "Remote", "Hybrid", "Internship"];
  const compensationRanges = [
    "$50,000 - $75,000",
    "$75,000 - $100,000",
    "$100,000 - $125,000",
    "$125,000 - $150,000",
    "$150,000 - $200,000",
    "$200,000+",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !jobTitle ||
      !location ||
      !department ||
      !employmentType ||
      !reportsTo ||
      !compensationRange ||
      !about ||
      !responsibilities
    ) {
      setError("All required fields are necessary.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Creating job posting...");
      const res = await fetch("api/create-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
          location,
          department,
          employmentType,
          reportsTo,
          compensationRange,
          about,
          responsibilities: responsibilities.split("\n").filter((item) => item.trim()),
          niceToHaves: niceToHaves.split("\n").filter((item) => item.trim()),
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        setJobTitle("");
        setLocation("");
        setDepartment("");
        setEmploymentType("");
        setReportsTo("");
        setCompensationRange("");
        setAbout("");
        setResponsibilities("");
        setNiceToHaves("");
        toast.success("Job posting created successfully!", {
          onClose: () => router.push("/"),
        });
      } else {
        toast.error("Job posting creation failed!");
      }
    } catch (error) {
      console.log("Error during job creation: ", error);
      toast.error("Error during job creation!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center bg-indigo-600 text-white shadow-md">
        <Link href="/">
          <div className="flex items-center">
            <Image
              src="/linq.png"
              alt="Linq Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
        </Link>
        <nav className="ml-auto">
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-indigo-100 hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-indigo-100 hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/careers" className="text-white font-semibold transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-indigo-100 hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            Create a New Job Posting
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new position to the Linq team
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-8">
            <ToastContainer position="top-center" />
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">Job Title*</label>
                  <input
                    onChange={(e) => setJobTitle(e.target.value)}
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">Location*</label>
                  <input
                    onChange={(e) => setLocation(e.target.value)}
                    type="text"
                    placeholder="e.g. San Francisco, CA (Remote)"
                    className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">Department*</label>
                  <select
                    onChange={(e) => setDepartment(e.target.value)}
                    value={department}
                    className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="" disabled>
                      Select Department
                    </option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">Employment Type*</label>
                  <select
                    onChange={(e) => setEmploymentType(e.target.value)}
                    value={employmentType}
                    className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    {employmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">Reports To*</label>
                  <input
                    onChange={(e) => setReportsTo(e.target.value)}
                    type="text"
                    placeholder="e.g. Director of Engineering"
                    className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">Compensation Range*</label>
                  <select
                    onChange={(e) => setCompensationRange(e.target.value)}
                    value={compensationRange}
                    className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="" disabled>
                      Select Range
                    </option>
                    {compensationRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-700 font-medium">About the Role*</label>
                <textarea
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Describe the role, team, and impact..."
                  className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  rows="4"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-700 font-medium">Responsibilities*</label>
                <div className="text-xs text-gray-500 mb-1">Enter one responsibility per line</div>
                <textarea
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="- Lead the development of new features
- Collaborate with product managers
- Design and implement scalable solutions"
                  className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  rows="4"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-700 font-medium">Nice to Haves</label>
                <div className="text-xs text-gray-500 mb-1">Enter one qualification per line (optional)</div>
                <textarea
                  onChange={(e) => setNiceToHaves(e.target.value)}
                  placeholder="- Experience with React
- Knowledge of AWS
- Familiarity with CI/CD pipelines"
                  className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  rows="4"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-600 text-sm py-2 px-4 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="flex gap-4 pt-4">
                <Link
                  href="/careers"
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-all text-center flex-1"
                >
                  Cancel
                </Link>
                <button
                  className="flex-1 bg-indigo-600 text-white font-medium px-6 py-3 rounded-md hover:bg-indigo-700 transition-all flex items-center justify-center"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Job Posting"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="mt-16 py-8 bg-indigo-600 text-white text-center shadow-inner">
        <div className="max-w-6xl mx-auto px-4">
          <Image
            src="/linq.png"
            alt="Linq Logo"
            width={80}
            height={30}
            className="mx-auto mb-4"
          />
          <p className="text-indigo-100 text-sm">© 2025 Linq. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}