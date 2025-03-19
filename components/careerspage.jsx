// pages/careers/index.jsx
"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function CareersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define all possible departments
  const allDepartments = [
    "Engineering",
    "Sales",
    "Marketing",
    "HR",
    "Operations",
    "Finance",
    "Product",
    "Design",
  ];

  // Fetch job postings from the API
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await fetch("/api/create-job", {
          // Changed from /api/job-postings
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch job postings");
        }

        const data = await res.json();
        setPositions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  // Get unique departments with job postings
  const departmentsWithPostings = Array.from(
    new Set(positions.map((position) => position.department))
  ).filter((dept) => allDepartments.includes(dept));

  // Normalize case in the filter
  const filteredPositions =
    activeTab === "all"
      ? positions
      : positions.filter(
          (position) => position.department.toLowerCase() === activeTab
        );

  console.log("Active Tab:", activeTab);
  console.log("Filtered Positions:", filteredPositions);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Head>
        <title>Careers at Linq | Join Our Team</title>
        <meta
          name="description"
          content="Join the Linq team and help us build the future of professional connections"
        />
      </Head>

      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/team-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full animate-ping opacity-75"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-3/4 left-1/3 w-3 h-3 bg-white rounded-full animate-ping opacity-75"
            style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-1/3 left-2/3 w-5 h-5 bg-white rounded-full animate-ping opacity-75"
            style={{ animationDuration: "2.8s", animationDelay: "0.3s" }}
          ></div>
          <div
            className="absolute top-2/3 left-3/4 w-4 h-4 bg-white rounded-full animate-ping opacity-75"
            style={{ animationDuration: "3.2s", animationDelay: "0.7s" }}
          ></div>
        </div>
        <div className="absolute w-64 h-64 bg-white/5 rounded-full -top-20 -left-20 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 bg-white/5 rounded-full -bottom-32 -right-32 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="relative flex h-full items-center justify-center px-8">
          <div className="text-center max-w-4xl transform transition-all duration-700 animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeInUp">
              <span className="text-white inline-block relative overflow-hidden">
                <span className="relative z-10">
                  Join the Future of Connections
                </span>
                <span
                  className="absolute bottom-0 left-0 w-full h-1 bg-white transform translate-x-full animate-slideInFromRight"
                  style={{ animationDelay: "0.5s", animationDuration: "1s" }}
                ></span>
              </span>
            </h1>
            <p
              className="text-xl md:text-2xl text-white/90 mb-10 transform transition-all duration-500 animate-fadeInUp"
              style={{ animationDelay: "0.3s" }}
            >
              Help us build the next generation of professional networking tools
              that connect people in ways never before possible.
            </p>
            <a
              href="#openings"
              className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block animate-fadeInUp relative overflow-hidden group"
              style={{ animationDelay: "0.6s" }}
            >
              <span className="relative z-10">See Open Positions</span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full"
          >
            <path
              fill="#fff"
              fillOpacity="1"
              d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,181.3C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Vision Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Vision
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              At Linq, we're revolutionizing the way professionals connect in
              the digital age. Our platform bridges the gap between virtual and
              in-person networking, creating seamless experiences that feel
              natural and effective.
            </p>
            <p className="text-xl text-gray-700 mb-6">
              We believe that meaningful connections are the foundation of
              career growth and business development. Our team is dedicated to
              creating tools that make these connections possible for everyone,
              everywhere.
            </p>
            <p className="text-xl text-gray-700">
              Join us in our mission to create a more connected professional
              world.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative h-96 w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center">
                <svg
                  className="w-1/2 h-1/2 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="openings" className="py-24 px-8 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
      Open Positions
    </h2>

    {loading ? (
      <div className="text-center text-gray-600">Loading job postings...</div>
    ) : error ? (
      <div className="text-center text-red-600">Error: {error}</div>
    ) : (
      <>
        {/* Department Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 rounded-full text-lg font-medium transition-all ${
              activeTab === "all"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Teams
          </button>
          {departmentsWithPostings.map((department) => (
            <button
              key={department}
              onClick={() => setActiveTab(department.toLowerCase())}
              className={`px-6 py-3 rounded-full text-lg font-medium transition-all ${
                activeTab === department.toLowerCase()
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {department}
            </button>
          ))}
        </div>

        {/* Job Listings */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredPositions.length > 0 ? (
            filteredPositions.map((position) => (
              <Link
                href={`/careers/${position._id}`}
                key={position._id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {position.jobTitle}
                  </h3>
                  <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {position.department}
                  </span>
                </div>
                <div className="mb-6">
                  <div className="flex items-center text-gray-600 mb-2">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    {position.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    {position.employmentType}
                  </div>
                </div>
                <div className="flex justify-end">
                  <span className="text-indigo-600 font-medium flex items-center">
                    View Position
                    <svg
                      className="w-5 h-5 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-gray-600 col-span-2">
              No job postings available for this department.
            </div>
          )}
        </div>
      </>
    )}
  </div>
</section>

      {/* Life at Linq Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Life at Linq
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 shadow-lg">
              <div className="bg-blue-500 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Collaborative Culture
              </h3>
              <p className="text-gray-700">
                We believe in the power of teamwork. Our open and inclusive
                culture encourages collaboration across departments, fostering
                innovation and creating a supportive environment.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 shadow-lg">
              <div className="bg-purple-500 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Growth & Development
              </h3>
              <p className="text-gray-700">
                At Linq, we're committed to helping our team members grow
                professionally. From mentorship programs to continuous learning
                opportunities, we invest in your success.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-3xl p-8 shadow-lg">
              <div className="bg-green-500 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Comprehensive Benefits
              </h3>
              <p className="text-gray-700">
                We offer competitive compensation, health benefits, flexible
                work arrangements, and other perks to ensure our team members
                thrive both professionally and personally.
              </p>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-indigo-400 to-purple-500"></div>
            <div className="rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-blue-400 to-indigo-500"></div>
            <div className="rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-purple-400 to-pink-500"></div>
            <div className="rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-pink-400 to-red-500"></div>
          </div>
          <div className="mt-16 bg-white rounded-3xl p-10 shadow-xl">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0"></div>
              <div>
                <p className="text-xl text-gray-700 italic mb-4">
                  "Joining Linq was the best career decision I've made. The
                  culture here encourages innovation, the work is challenging in
                  the best way, and I've grown more professionally in one year
                  than in my previous three jobs combined."
                </p>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Sarah Johnson
                  </h4>
                  <p className="text-gray-600">
                    Senior Software Engineer, 2 years at Linq
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">
            Ready to Build the Future with Us?
          </h2>
          <p className="text-xl mb-10 text-white/90">
            We're always looking for talented individuals to join our team.
            Check out our open positions or drop us a line to start a
            conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#openings"
              className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View Open Positions
            </a>
            <a
              href="mailto:careers@linqapp.com"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all"
            >
              Contact Recruiting
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Linq</h3>
            <p className="text-gray-400 mb-6">
              Building the future of professional connections
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.992 18.166c-.227.49-.697.715-1.187.49-3.281-2.003-7.394-2.458-12.225-1.347-.49.113-1.002-.17-1.114-.662-.113-.49.17-1.002.662-1.114 5.285-1.214 9.848-.682 13.47 1.57.49.227.717.697.49 1.187v-.014zm1.594-3.536c-.283.632-.904.917-1.537.634-3.759-2.303-9.462-2.976-13.895-1.624-.565.17-1.159-.17-1.328-.733-.17-.565.17-1.158.733-1.327 5.055-1.53 11.344-.783 15.622 1.91.632.283.917.904.634 1.537l.057-.283-.057.283zm.113-3.686C15.61 8.43 9.055 8.213 5.28 9.348c-.68.114-1.345-.342-1.458-1.02-.114-.68.341-1.346 1.02-1.458C9.563 5.507 16.802 5.764 21.4 8.938c.622.342.85 1.117.51 1.74-.341.622-1.117.85-1.74.51l.398-.244-.398.244z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Press
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Legal</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500">
            © {new Date().getFullYear()} Linq. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
