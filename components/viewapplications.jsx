"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronDown,
  Building2,
  ChevronUp,
  Briefcase,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Linkedin,
  FileText,
  MessageSquare,
  User,
  Menu,
  X,
} from "lucide-react";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/get-job-applications");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch applications");
        }

        setApplications(data.applications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Loading state with animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <div className="flex items-center justify-center h-[calc(100vh-140px)]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="relative w-16 h-16 mx-auto mb-4">
              <motion.div
                className="absolute inset-0 rounded-full border-t-4 border-blue-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <p className="text-xl font-semibold text-gray-700">
              Loading applications...
            </p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <div className="flex items-center justify-center h-[calc(100vh-140px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Data
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Job Applications
            </h1>
            <div className="bg-blue-100 px-4 py-2 rounded-md">
              <span className="text-blue-800 font-medium">
                {applications.length} Applications
              </span>
            </div>
          </div>

          {applications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md p-10 text-center"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                No Applications Yet
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                When candidates apply for your open positions, they'll appear
                here.
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence>
                {applications.map((app, index) => (
                  <motion.div
                    key={app._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    
                    {/* Card header - always visible */}
<div
  className={`p-6 cursor-pointer transition-colors ${
    expandedId === app._id
      ? "bg-blue-50"
      : "hover:bg-gray-50"
  }`}
  onClick={() => toggleExpand(app._id)}
>
  <div className="flex flex-col md:flex-row md:items-center justify-between">
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          {app.name}
        </h2>
      </div>
      <div className="flex flex-wrap items-center mt-2 text-gray-600">
        <div className="flex items-center mr-4 mb-2 md:mb-0">
          <Briefcase className="h-4 w-4 mr-1 text-blue-600" />
          <span>
            {app.jobId
              ? app.jobId.jobTitle
              : "Job Not Found"}
          </span>
        </div>
        {app.jobId?.department && (
          <div className="flex items-center mr-4 mb-2 md:mb-0">
            <Building2 className="h-4 w-4 mr-1 text-blue-600" />
            <span>{app.jobId.department}</span>
          </div>
        )}
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-blue-600" />
          <span className="text-sm">
            {new Date(app.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center mt-4 md:mt-0">
      {/* Resume Score Badge */}
      <div 
        className={`
          mr-3 px-3 py-1 rounded-full text-sm font-semibold
          ${
            app.similarityScore >= 70 
              ? 'bg-green-100 text-green-800' 
              : app.similarityScore >= 40 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
          }
        `}
        title="Resume Match Score"
      >
        {app.similarityScore}%
      </div>
      
      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-3">
        New
      </div>
      
      {expandedId === app._id ? (
        <ChevronUp className="h-5 w-5 text-gray-500" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-500" />
      )}
    </div>
  </div>
</div>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {expandedId === app._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                  Contact Information
                                </h3>
                                <div className="space-y-3">
                                  <div className="flex items-start">
                                    <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Email
                                      </p>
                                      <p className="text-gray-800">
                                        {app.email}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <Phone className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Phone
                                      </p>
                                      <p className="text-gray-800">
                                        {app.phone || "Not provided"}
                                      </p>
                                    </div>
                                  </div>
                                  {app.linkedin && (
                                    <div className="flex items-start">
                                      <Linkedin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          LinkedIn
                                        </p>
                                        <a
                                          href={app.linkedin}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline"
                                        >
                                          {app.linkedin.replace(
                                            /^https?:\/\/(www\.)?linkedin\.com\//,
                                            ""
                                          )}
                                        </a>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                  Documents
                                </h3>
                                <div className="space-y-4">
                                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-start">
                                    <FileText className="h-6 w-6 text-blue-600 mr-3" />
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-800">
                                        Resume
                                      </p>
                                      <a
                                        href={app.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center mt-1"
                                      >
                                        <span>View resume</span>
                                        <svg
                                          className="h-4 w-4 ml-1"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </a>
                                    </div>
                                  </div>

                                  {app.coverLetter && (
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                      <div className="flex items-start mb-2">
                                        <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
                                        <p className="font-medium text-gray-800">
                                          Cover Letter
                                        </p>
                                      </div>
                                      <p className="text-gray-700 pl-9 text-sm">
                                        {app.coverLetter.length > 150
                                          ? `${app.coverLetter.substring(
                                              0,
                                              150
                                            )}...`
                                          : app.coverLetter}
                                      </p>
                                      {app.coverLetter.length > 150 && (
                                        <button className="text-blue-600 hover:underline text-sm pl-9 mt-1">
                                          Read more
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                                Archive
                              </button>
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                Contact Candidate
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

// Header Component
const Header = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-10 w-10 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                @
              </div>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">
              Career Clutch
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/careers"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Careers
            </Link>
            <Link
              href="/postjob"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Post Job
            </Link>
            <Link
              href="/applications"
              className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
            >
              Applications
            </Link>
          </nav>

          {/* User Profile */}
          <div className="hidden md:flex items-center">
            <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 shadow-inner bg-gray-50">
              <Link
                href="/careers"
                className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Careers
              </Link>
              <Link
                href="/postjob"
                className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Post Job
              </Link>
              <Link
                href="/applications"
                className="bg-blue-50 text-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Applications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div>
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                @
              </div>
            </div>
            <span className="ml-3 text-xl font-bold">Career Clutch</span>
          </div>
          <p className="text-gray-400 mb-6">
            Building the future of professional connections.
          </p>
          <div className="flex space-x-4">
            {[
              {
                icon: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
                platform: "Facebook",
                url: "https://www.facebook.com/thelinqapp",
              },
              {
                icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
                platform: "Twitter",
                url: "https://x.com/thelinqapp",
              },
              {
                icon: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
                platform: "LinkedIn",
                url: "https://www.linkedin.com/company/linqapp/",
              },
            ].map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={social.platform}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox={social.viewBox || "0 0 24 24"} // Use custom viewBox if provided, else default to 24x24
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={social.icon}></path>
                </svg>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-6">Company</h4>
          <ul className="space-y-4">
            {["Careers", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-6">Legal</h4>
          <ul className="space-y-4">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center">
        <p className="text-gray-500">
          © {new Date().getFullYear()} Career Clutch. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default ApplicationsPage;
