"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Head from "next/head";
import {
  ChevronDown,
  ChevronUp,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  Linkedin,
  Globe,
  FileText,
  Percent,
  X,
  Loader2,
  ArrowLeft,
  User,
} from "lucide-react";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/verify-token", {
          credentials: "include",
        });
        if (response.ok) {
          setIsSignedIn(true);
          const userData = await fetch("/api/user-profile", {
            credentials: "include",
          });
          if (userData.ok) {
            const data = await userData.json();
            setUser(data.user);
          }
        } else {
          setIsSignedIn(false);
          setUser(null);
        }
      } catch (err) {
        setIsSignedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setIsSignedIn(false);
    setUser(null);
    router.push("/appliedjobs");
  };

  // Fetch applied jobs if signed in
  useEffect(() => {
    if (isSignedIn && user?.email) {
      const fetchAppliedJobs = async () => {
        try {
          const response = await fetch(
            `/api/applied-jobs?email=${user.email}`,
            {
              credentials: "include",
            }
          );
          if (!response.ok) throw new Error("Failed to fetch applied jobs");
          const { data } = await response.json();
          setAppliedJobs(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchAppliedJobs();
    }
  }, [isSignedIn, user]);

  const toggleExpand = (jobId) => {
    setExpandedId(expandedId === jobId ? null : jobId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
          <p className="mt-4 text-xl text-slate-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Head>
          <title>Applied Jobs | Career Clutch</title>
        </Head>

        {/* Header */}
        <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0 flex items-center">
                  <div className="h-10 w-10 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                      <span>@</span>
                    </div>
                  </div>
                  <span className="ml-3 text-xl font-bold text-gray-900">
                    Career Clutch
                  </span>
                </Link>
              </div>
              <div className="flex items-center">
                <Link
                  href="/user/signin"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl p-10 text-center max-w-md mx-4 mt-16"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Please Sign In
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be signed in to view your applied jobs.
            </p>
            <Link
              href="/user/signin"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head>
        <title>Applied Jobs | Career Clutch</title>
      </Head>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                    <span>@</span>
                  </div>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">
                  Career Clutch
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              {user && (
                <div className="hidden md:flex md:items-center md:space-x-4 md:mr-4">
                  <Link
                    href="/careers"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-500 transition-colors duration-200"
                  >
                    <svg
                      className="h-5 w-5 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Careers
                  </Link>
                  <Link
                    href="/appliedjobs"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-500 transition-colors duration-200"
                  >
                    <svg
                      className="h-5 w-5 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Applied Jobs
                  </Link>
                </div>
              )}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white overflow-hidden">
                      {user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={`${user.firstName}'s profile`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold">
                          {user?.firstName?.charAt(0)}
                          {user?.lastName?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user?.firstName}
                    </span>
                    <svg
                      className="h-4 w-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 ring-1 ring-black ring-opacity-5">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="mr-3 h-5 w-5 text-gray-400" />
                        Profile
                      </Link>
                      <Link
                        href="/appliedjobs"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg
                          className="mr-3 h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Applied Jobs
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                      >
                        <X className="mr-3 h-5 w-5 text-gray-400" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/user/signin"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex-grow mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <Link
                href="/careers"
                className="mr-4 p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold text-slate-800">
                My Applications
              </h1>
            </div>
            <div className="ml-0 sm:ml-4 bg-blue-100 px-4 py-2 rounded-md text-blue-700 font-medium">
              {appliedJobs.length} Jobs Applied
            </div>
          </div>

          {error && appliedJobs.length !== 0 && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded flex items-center">
              <X className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          )}

          {appliedJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-10 text-center"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                No Applications Yet
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                When you apply for jobs, they'll appear here. Start exploring
                open positions now!
              </p>
              <Link
                href="/careers"
                className="mt-6 inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Browse Jobs
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence>
                {appliedJobs.map((job, index) => (
                  <motion.div
                    key={job.applicationId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <div
                      className={`p-6 cursor-pointer transition-colors ${
                        expandedId === job.applicationId
                          ? "bg-gray-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => toggleExpand(job.applicationId)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900">
                            {job.jobDetails.jobTitle}
                          </h2>
                          <div className="flex flex-wrap items-center mt-2 text-gray-500">
                            <div className="flex items-center mr-4 mb-2 md:mb-0">
                              <Building2 className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{job.jobDetails.department}</span>
                            </div>
                            <div className="flex items-center mr-4 mb-2 md:mb-0">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{job.jobDetails.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              <span className="text-sm">
                                Applied on{" "}
                                {new Date(job.appliedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mt-4 md:mt-0">
                          <div
                            className={`
                              mr-3 px-3 py-1 rounded-full text-sm font-semibold flex items-center
                              ${
                                job.similarityScore >= 70
                                  ? "bg-green-100 text-green-700"
                                  : job.similarityScore >= 40
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }
                            `}
                            title="Resume Match Score"
                          >
                            <Percent className="h-3 w-3 mr-1" />
                            {job.similarityScore}%
                          </div>
                          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mr-3">
                            {job.jobDetails.employmentType}
                          </div>
                          {expandedId === job.applicationId ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedId === job.applicationId && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-gray-200 p-6 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                  About the Position
                                </h3>
                                <p className="text-gray-600 mb-6">
                                  {job.jobDetails.about}
                                </p>
                                <div className="mb-6">
                                  <h4 className="font-medium text-gray-900 mb-2">
                                    Compensation
                                  </h4>
                                  <div className="flex items-center">
                                    <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                                    <span className="text-gray-700">
                                      {job.jobDetails.compensationRange}
                                    </span>
                                  </div>
                                </div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Responsibilities
                                </h4>
                                <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-6">
                                  {job.jobDetails.responsibilities
                                    .slice(0, 3)
                                    .map((resp, idx) => (
                                      <li key={idx}>{resp}</li>
                                    ))}
                                  {job.jobDetails.responsibilities.length >
                                    3 && (
                                    <li className="text-blue-600 hover:underline cursor-pointer">
                                      +
                                      {job.jobDetails.responsibilities.length -
                                        3}{" "}
                                      more
                                    </li>
                                  )}
                                </ul>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                  Your Application
                                </h3>
                                <div className="space-y-4">
                                  {job.resume && (
                                    <div className="p-4 bg-white rounded-lg border border-gray-200 flex items-start shadow-sm">
                                      <FileText className="h-6 w-6 text-blue-600 mr-3" />
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                          Resume
                                        </p>
                                        <div className="flex justify-between items-center mt-1">
                                          <a
                                            href={job.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
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
                                          <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                            Match: {job.similarityScore}%
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <div className="space-y-3 mt-6">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                      Submitted Information
                                    </h4>
                                    {job.linkedin && (
                                      <div className="flex items-start">
                                        <Linkedin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                                        <div>
                                          <p className="text-sm text-gray-500">
                                            LinkedIn
                                          </p>
                                          <a
                                            href={job.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                          >
                                            {job.linkedin.replace(
                                              /^https?:\/\/(www\.)?linkedin\.com\//,
                                              ""
                                            )}
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                    {job.portfolio && (
                                      <div className="flex items-start">
                                        <Globe className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                                        <div>
                                          <p className="text-sm text-gray-500">
                                            Portfolio
                                          </p>
                                          <a
                                            href={job.portfolio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                          >
                                            {job.portfolio.replace(
                                              /^https?:\/\/(www\.)?/,
                                              ""
                                            )}
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="mt-6">
                                  <h4 className="font-medium text-gray-900 mb-2">
                                    Nice-to-Haves
                                  </h4>
                                  <ul className="text-gray-600 pl-0">
                                    {job.jobDetails.niceToHaves.map(
                                      (item, idx) => (
                                        <li
                                          key={idx}
                                          className="flex items-start mb-2"
                                        >
                                          <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                            <span className="text-xs font-bold">
                                              ✓
                                            </span>
                                          </div>
                                          {item}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap justify-between gap-4">
                              <div className="text-gray-500 text-sm">
                                Application ID:{" "}
                                {job.applicationId.substring(0, 8)}...
                              </div>
                              <div className="flex space-x-3">
                                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                  Withdraw Application
                                </button>
                                {job && job.jobDetails && (
  <Link
    href={`/careers/${job.jobId}`}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
  >
    View Job Posting
  </Link>
)}
                              </div>
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 w-full mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="flex items-center">
                <div className="h-10 w-10 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                    @
                  </div>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">
                  Career Clutch
                </span>
              </Link>
              <p className="mt-2 text-gray-600 text-sm">
                Connecting talent with opportunity.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Quick Links</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/appliedjobs"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    My Applications
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Contact</h3>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-blue-600" />
                  <a
                    href="mailto:support@careerclutch.com"
                    className="hover:text-blue-600 transition-colors"
                  >
                    support@careerclutch.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Linkedin className="h-5 w-5 mr-2 text-blue-600" />
                  <a
                    href="https://www.linkedin.com/in/vamsitejchowdary/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Career Clutch. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppliedJobs;
