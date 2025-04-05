"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { formatDistance } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  FileSearch,
  Upload,
  FileText, Loader, 
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

export default function JobDetailPage() {
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    coverLetter: "",
    resume: null, // Can be File object or URL string
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [similarityScore, setSimilarityScore] = useState(null);
  const [isCheckingScore, setIsCheckingScore] = useState(false);
  const fileInputRef = useRef(null);
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const jobRes = await fetch(`/api/create-job?id=${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!jobRes.ok) throw new Error("Failed to fetch job posting");
        const jobData = await jobRes.json();
        setJob(jobData);

        const userRes = await fetch("/api/user-profile", {
          credentials: "include",
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
          setFormData((prev) => ({
            ...prev,
            name: `${userData.user.firstName} ${userData.user.lastName}`,
            email: userData.user.email,
            phone: userData.user.phone || "",
            linkedin: userData.user.linkedin || "",
            resume: userData.user.resume || null, // Use single resume field
          }));
        }
      } catch (err) {
        setError(err.message);
        if (err.message === "Not authenticated") setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      toast.error("Please upload a PDF, DOC, or DOCX file");
      return;
    }
    setFormData((prev) => ({ ...prev, resume: file }));
    setSimilarityScore(null);
    fileInputRef.current.value = null; // Reset input for re-upload
  };

  const handleCheckScore = async () => {
    if (!formData.resume) {
      toast.error("Please select or upload a resume first");
      return;
    }

    setIsCheckingScore(true);
    setSimilarityScore(null);

    const formDataToSend = new FormData();
    formDataToSend.append("jobId", id);
    if (formData.resume instanceof File) {
      formDataToSend.append("resume", formData.resume);
    } else {
      formDataToSend.append("resumeUrl", formData.resume); // Send URL if it’s a string
    }

    try {
      const response = await fetch("/api/resume-score-cal", {
        method: "POST",
        body: formDataToSend,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to check resume match");
      }
      const result = await response.json();
      setSimilarityScore(result.similarityScore);
    } catch (error) {
      console.error("Error checking resume match:", error);
      toast.error(
        error.message || "Failed to check resume match. Please try again."
      );
    } finally {
      setIsCheckingScore(false);
    }
  };

  // ... (rest of the code remains unchanged)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resume) {
      toast.error("Please select or upload a resume.");
      return;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append("name", formData.name || `${user.firstName} ${user.lastName}`);
    data.append("email", formData.email || user.email);
    data.append("phone", formData.phone || user.phone || "");
    data.append("linkedin", formData.linkedin || user.linkedin || "");
    data.append("coverLetter", formData.coverLetter || "");
    if (formData.resume instanceof File) {
      data.append("resume", formData.resume);
    } else {
      data.append("resumeUrl", formData.resume); // Send URL if not a new file
    }
    data.append("jobId", id);
    if (similarityScore !== null)
      data.append("similarityScore", similarityScore);

    try {
      const response = await fetch("/api/apply-job", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
        setFormData((prev) => ({
          ...prev,
          resume: user.resume || null,
          coverLetter: "",
        }));
        setSimilarityScore(null);
      } else {
        toast.error(result.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Link
            href="/careers"
            className="mt-6 inline-block text-indigo-600 hover:text-indigo-800"
          >
            Return to Careers
          </Link>
        </div>
      </div>
    );
  if (!job)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Job Not Found
          </h2>
          <p className="text-gray-600">
            We couldn't find the job posting you're looking for.
          </p>
          <Link
            href="/careers"
            className="mt-6 inline-block text-indigo-600 hover:text-indigo-800"
          >
            Browse all positions
          </Link>
        </div>
      </div>
    );

  const postedDate = job.createdAt ? new Date(job.createdAt) : new Date();
  const daysAgo = formatDistance(postedDate, new Date(), { addSuffix: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
      <Head>
        <title>{job.jobTitle} | Career Clutch Careers</title>
        <meta
          name="description"
          content={`Apply for ${job.jobTitle} at Career Clutch`}
        />
      </Head>

      <header className="w-full px-6 py-4 bg-indigo-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <span className="text-2xl font-bold">Career Clutch</span>
          </Link>
          <Link
            href="/careers"
            className="text-indigo-100 hover:text-white flex items-center"
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Careers
          </Link>
        </div>
      </header>

      <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {job.jobTitle}
                  </h1>
                  <p className="text-gray-500 mt-1">Posted {daysAgo}</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              {user ? (
                <a
                  href="#apply-now"
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-all flex items-center"
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Apply Now
                </a>
              ) : (
                <Link
                  href="/user/signin"
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-all"
                >
                  Sign In to Apply
                </Link>
              )}
            </div>
          </div>
          {/* Job details section omitted for brevity */}
          <div className="flex flex-wrap gap-3 my-6">
            <div className="bg-indigo-100 text-indigo-800 font-medium rounded-full px-4 py-2 text-sm flex items-center">
              <svg
                className="h-4 w-4 mr-1 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              {job.department}
            </div>
            <div className="bg-blue-100 text-blue-800 font-medium rounded-full px-4 py-2 text-sm flex items-center">
              <svg
                className="h-4 w-4 mr-1 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {job.location}
            </div>
            <div className="bg-green-100 text-green-800 font-medium rounded-full px-4 py-2 text-sm flex items-center">
              <svg
                className="h-4 w-4 mr-1 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {job.employmentType}
            </div>
            <div className="bg-purple-100 text-purple-800 font-medium rounded-full px-4 py-2 text-sm flex items-center">
              <svg
                className="h-4 w-4 mr-1 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {job.compensationRange}
            </div>
          </div>

          <div className="md:hidden mt-4">
            {user ? (
              <a
                href="#apply-now"
                className="w-full block text-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-all"
              >
                Apply Now
              </a>
            ) : (
              <Link
                href="/user/signin"
                className="w-full block text-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-all"
              >
                Sign In to Apply
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  About the Role
                </h2>
                <p className="text-gray-700 leading-relaxed">{job.about}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Responsibilities
                </h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {job.niceToHaves.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    Nice to Haves
                  </h2>
                  <ul className="space-y-2">
                    {job.niceToHaves.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Reports To
                </h2>
                <p className="text-gray-700">{job.reportsTo}</p>
              </div>

              <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-100">
                <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Why Join Career Clutch?
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span className="text-gray-700">
                      Health, dental, and vision insurance.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-gray-700">Generous PTO</span>
                  </li>
                  {/* Other benefits omitted for brevity */}
                </ul>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div
              id="apply-now"
              className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="h-5 w-5 mr-2 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {user ? "Apply for This Position" : "Sign In to Apply"}
              </h2>

              <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* For demo purposes - remove in production */}
      {/* <div className="bg-gray-50 px-6 py-3 flex justify-end">
        <button 
          onClick={toggleUser} 
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {user ? 'Demo: Log Out' : 'Demo: Log In'}
        </button>
      </div> */}
      
      <div className="px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Job Application
        </h1>
        
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="signin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100"
            >
              
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Please sign in to your account to apply for this position and track your application status.
              </p>
              <Link
                href="/user/signin"
                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                Sign In to Continue
              </Link>
            </motion.div>
          ) : !isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <label className="block text-base font-medium text-gray-700 mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                    Your Resume *
                  </label>
                  <div className="space-y-3">
                    {user.resume && (
                      <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-md border border-indigo-100">
                        <span className="text-indigo-700 truncate font-medium">
                          {formData.resume?.name ||
                            formData.resume?.split("/").pop() ||
                            "Current Resume"}
                        </span>
                        <a
                          href={formData.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition-all"
                        >
                          <FileText size={20} />
                        </a>
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="flex-1 px-4 py-3 bg-white text-indigo-700 font-medium rounded-md border border-indigo-200 hover:bg-indigo-50 transition-all flex items-center justify-center shadow-sm"
                      >
                        <Upload className="h-4 w-4 mr-2" />{" "}
                        {user.resume ? "Update Resume" : "Upload Resume"}
                      </button>
                      
                      {formData.resume && (
                        <button
                          type="button"
                          onClick={handleCheckScore}
                          disabled={isCheckingScore}
                          className="p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition-all disabled:bg-indigo-400 shadow-sm"
                          title="Check Resume Match"
                          aria-label="Check Resume Match"
                        >
                          {isCheckingScore ? (
                            <Loader className="h-5 w-5 animate-spin" />
                          ) : (
                            <FileSearch size={20} />
                          )}
                        </button>
                      )}
                    </div>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {similarityScore !== null && !isCheckingScore && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center p-3 mt-2 rounded-md"
                        style={{
                          backgroundColor: similarityScore >= 70 ? 'rgba(220, 252, 231, 0.7)' : 'rgba(254, 249, 195, 0.7)',
                          border: `1px solid ${similarityScore >= 70 ? '#86efac' : '#fef08a'}`
                        }}
                      >
                        {similarityScore >= 70 ? (
                          <CheckCircle
                            size={24}
                            className="text-green-600 mr-3 flex-shrink-0"
                          />
                        ) : (
                          <AlertCircle
                            size={24}
                            className="text-yellow-600 mr-3 flex-shrink-0"
                          />
                        )}
                        <div>
                          <span
                            className={`font-semibold block ${
                              similarityScore >= 70
                                ? "text-green-700"
                                : "text-yellow-700"
                            }`}
                          >
                            {similarityScore}% Match with Job Requirements
                          </span>
                          <span className="text-sm text-gray-600">
                            {similarityScore >= 70 
                              ? "Your resume appears to be a good match for this position!" 
                              : "Consider customizing your resume to highlight relevant skills."}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <label className="block text-base font-medium text-gray-700 mb-3 flex items-center">
                    <svg 
                      className="h-5 w-5 mr-2 text-indigo-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Cover Letter (Optional)
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    name="coverLetter"
                    rows="5"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                    placeholder="Explain why you're interested in this position and how your skills align with the requirements..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Pro tip: Personalize your cover letter to highlight relevant experience and show your interest in the role.
                  </p>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-all disabled:bg-indigo-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting Application...
                    </span>
                  ) : (
                    "Submit Application"
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 100,
              }}
              className="text-center py-12 px-6 bg-gray-50 rounded-lg border border-gray-100"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-2"
              >
                <CheckCircle
                  size={60}
                  className="text-green-600"
                />
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-6 text-2xl font-bold text-gray-800"
              >
                Application Successfully Submitted!
              </motion.h2>
              
              {similarityScore !== null && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-4 inline-block px-4 py-2 rounded-full bg-white border"
                >
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 mr-1">Resume Match Score:</span>
                    <span className={`font-bold ${similarityScore >= 80 ? 'text-green-600' : similarityScore >= 70 ? 'text-blue-600' : 'text-yellow-600'}`}>
                      {similarityScore}/100
                    </span>
                  </div>
                </motion.div>
              )}
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-6 p-4 bg-white rounded-md border border-gray-100 max-w-md mx-auto"
              >
                <p className="text-gray-600">
                  We'll review your application and connect with you soon. Thank you for your interest!
                </p>
              </motion.div>
              
              <div className="mt-8 flex gap-4 justify-center">
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-all shadow-md"
                >
                  Apply to Another Job
                </motion.button>
                
                <motion.a
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/dashboard"
                  className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-md border border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
                >
                  View Dashboard
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-900 text-white py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                  L
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
              {["About Us", "Careers", "Blog", "Contact"].map((item) => (
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
    </div>
  );
}
