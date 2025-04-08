"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Globe,
  Edit2,
  Save,
  X,
  Loader2,
  ArrowLeft,
  FileText,
  Upload,
  Download,
  Award,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Generate animated background bubbles
  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = [];
      const count = window.innerWidth < 768 ? 15 : 25;
      for (let i = 0; i < count; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 12 + 4,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5,
        });
      }
      setBubbles(newBubbles);
    };
    generateBubbles();
    window.addEventListener("resize", generateBubbles);
    return () => window.removeEventListener("resize", generateBubbles);
  }, []);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user-profile", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setUser(data.user);
        setFormData(data.user);
      } catch (err) {
        setError(err.message);
        router.push("/user/signin"); // Redirect if not signed in
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaveLoading(true);

    const data = new FormData();
    for (const key in formData) {
      if (key !== "resume") { // Exclude resume field since it's handled separately
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch("/api/user-profile", {
        method: "PUT",
        body: data,
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      const result = await response.json();
      setUser(result.user);
      setIsEditing(false);
      toast.success("Updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
      setError(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setUploadLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/user-profile", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to upload resume");
      }

      const data = await response.json();
      setUser(data.user); // Update user with new resume URL
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      toast.success("Resume Updated successfully!");
    } catch (err) {
      toast.error("Failed to upload resume");
      setError(err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-white mx-auto" />
          <p className="mt-4 text-xl text-white">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    const fields = ["firstName", "lastName", "email", "phone", "linkedin", "portfolio", "resume"];
    const filledFields = fields.filter((field) => user[field]).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      <Head>
        <title>Profile | Career Clutch</title>
      </Head>

      {/* Animated background bubbles */}
      <div className="absolute inset-0 w-full h-full">
      <ToastContainer 
              position="top-center" 
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: `${bubble.size}rem`,
              height: `${bubble.size}rem`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: bubble.duration,
              ease: "easeInOut",
              repeat: Infinity,
              delay: bubble.delay,
            }}
          />
          
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-indigo-900 bg-opacity-40 shadow-md backdrop-blur-sm border-b border-indigo-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                  @
                </div>
              </div>
              <span className="ml-3 text-xl font-bold text-white">Career Clutch</span>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/appliedjobs" className="text-indigo-200 hover:text-white transition-colors">
                Applied Jobs
              </Link>
              <Link href="/careers" className="text-indigo-200 hover:text-white transition-colors">
                Careers
              </Link>
              <Link href="/profile" className="text-white font-medium">
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Page header with back button */}
          <div className="mb-8 flex items-center">
            <button
              onClick={() => router.push("/")}
              className="mr-4 p-2 rounded-full bg-indigo-800/30 hover:bg-indigo-700/40 border border-indigo-500/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-indigo-200" />
            </button>
            <h1 className="text-3xl font-bold text-white">Your Profile</h1>
          </div>

          {/* Notification banners */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border-l-4 border-red-500 text-red-100 backdrop-blur-sm rounded-r flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          )}
          {uploadSuccess && (
            <div className="mb-6 p-4 bg-green-900/30 border-l-4 border-green-500 text-green-100 backdrop-blur-sm rounded-r flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <p>Resume uploaded successfully!</p>
            </div>
          )}

          {/* Main profile card */}
          <div className="bg-indigo-900 bg-opacity-20 rounded-2xl shadow-xl backdrop-blur-md border border-indigo-500/30 overflow-hidden mb-8">
            {/* Profile header section with stats */}
            <div className="bg-gradient-to-r from-indigo-600/40 to-purple-600/40 p-8 border-b border-indigo-500/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="h-20 w-20 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-white">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-indigo-200 flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      Member since {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="bg-indigo-900/30 rounded-lg p-3 border border-indigo-500/30 w-full md:w-auto">
                  <p className="text-sm text-indigo-200 mb-1">Profile Completion</p>
                  <div className="h-2 w-full bg-indigo-800/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-indigo-200 mt-1">{completionPercentage}%</p>
                </div>
              </div>
            </div>

            {/* Profile content */}
            <div className="p-8">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-1">First Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="h-5 w-5 text-indigo-300" />
                        </div>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName || ""}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-1">Last Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="h-5 w-5 text-indigo-300" />
                        </div>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName || ""}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-1">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="h-5 w-5 text-indigo-300" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ""}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-1">Phone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Phone className="h-5 w-5 text-indigo-300" />
                        </div>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone || ""}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                          required
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-indigo-200 mb-1">LinkedIn Profile</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Briefcase className="h-5 w-5 text-indigo-300" />
                        </div>
                        <input
                          type="url"
                          name="linkedin"
                          value={formData.linkedin || ""}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-indigo-200 mb-1">Portfolio Website</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Globe className="h-5 w-5 text-indigo-300" />
                        </div>
                        <input
                          type="url"
                          name="portfolio"
                          value={formData.portfolio || ""}
                          onChange={handleChange}
                          placeholder="https://yourportfolio.com"
                          className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg focus:ring-4 focus:ring-indigo-400/50 transition-colors flex items-center shadow-lg"
                      disabled={saveLoading}
                    >
                      {saveLoading ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-3 bg-indigo-800/30 border border-indigo-500/50 text-white rounded-lg hover:bg-indigo-700/40 focus:ring-4 focus:ring-indigo-400/50 transition-colors flex items-center"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-indigo-800/20 rounded-xl p-6 border border-indigo-500/30 shadow-md">
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2 text-indigo-300" />
                        Personal Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-indigo-300">Full Name</p>
                          <p className="text-white font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-indigo-300">Email Address</p>
                          <p className="text-white overflow-hidden text-ellipsis">{user?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-indigo-300">Phone Number</p>
                          <p className="text-white">{user?.phone || "Not provided"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-800/20 rounded-xl p-6 border border-indigo-500/30 shadow-md">
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Globe className="h-5 w-5 mr-2 text-indigo-300" />
                        Online Presence
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-indigo-300">LinkedIn Profile</p>
                          {user?.linkedin ? (
                            <a
                              href={user.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-300 hover:text-white transition-colors overflow-hidden text-ellipsis block"
                            >
                              {user.linkedin}
                            </a>
                          ) : (
                            <p className="text-indigo-400 italic">Not provided</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-indigo-300">Portfolio Website</p>
                          {user?.portfolio ? (
                            <a
                              href={user.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-300 hover:text-white transition-colors overflow-hidden text-ellipsis block"
                            >
                              {user.portfolio}
                            </a>
                          ) : (
                            <p className="text-indigo-400 italic">Not provided</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resume Section */}
                  <div className="mt-8">
                    <div className="bg-indigo-800/20 rounded-xl p-6 border border-indigo-500/30 shadow-md">
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-indigo-300" />
                        Resume
                      </h3>

                      {user?.resume ? (
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-4 md:mb-0">
                            <p className="text-sm text-indigo-300 mb-1">Current Resume</p>
                            <p className="text-white">
                              {user.resume.split("/").pop().split("-").slice(-1)[0]}
                            </p>
                            <p className="text-xs text-indigo-300 mt-1">
                              Last updated: {new Date().toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={() => setResumePreviewOpen(true)}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Resume
                            </button>
                            <a
                              href={user.resume}
                              download
                              className="px-4 py-2 bg-indigo-700/50 hover:bg-indigo-700/70 border border-indigo-500/50 text-white rounded-lg transition-colors flex items-center justify-center"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                            <button
                              onClick={triggerFileInput}
                              className="px-4 py-2 bg-indigo-800/50 hover:bg-indigo-700/70 border border-indigo-500/50 text-white rounded-lg transition-colors flex items-center justify-center"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Update
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 bg-indigo-900/20 rounded-lg border border-dashed border-indigo-500/50">
                          <FileText className="h-12 w-12 text-indigo-400 mb-3" />
                          <p className="text-indigo-300 mb-3">No resume uploaded yet</p>
                          <button
                            onClick={triggerFileInput}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Resume (PDF)
                          </button>
                        </div>
                      )}

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="hidden"
                      />

                      {uploadLoading && (
                        <div className="mt-4 flex items-center justify-center text-indigo-300">
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Uploading your resume...
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg focus:ring-4 focus:ring-indigo-400/50 transition-colors flex items-center shadow-lg"
                    >
                      <Edit2 className="h-5 w-5 mr-2" />
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Profile completion tips */}
          {!isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-indigo-900/20 rounded-2xl shadow-xl backdrop-blur-md border border-indigo-500/30 p-6"
            >
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-indigo-300" />
                Career Profile Enhancement Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {!user?.resume && (
                  <div className="bg-indigo-800/20 rounded-lg p-4 border border-indigo-500/30 hover:border-indigo-400/50 transition-colors">
                    <h4 className="text-indigo-200 font-medium mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Upload your resume
                    </h4>
                    <p className="text-indigo-300 text-sm">
                      A well-crafted resume increases your chances of getting noticed by recruiters.
                    </p>
                  </div>
                )}
                {!user?.linkedin && (
                  <div className="bg-indigo-800/20 rounded-lg p-4 border border-indigo-500/30 hover:border-indigo-400/50 transition-colors">
                    <h4 className="text-indigo-200 font-medium mb-2 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Add your LinkedIn
                    </h4>
                    <p className="text-indigo-300 text-sm">
                      Connect with recruiters and employers by linking your professional profile.
                    </p>
                  </div>
                )}
                {!user?.portfolio && (
                  <div className="bg-indigo-800/20 rounded-lg p-4 border border-indigo-500/30 hover:border-indigo-400/50 transition-colors">
                    <h4 className="text-indigo-200 font-medium mb-2 flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Showcase your work
                    </h4>
                    <p className="text-indigo-300 text-sm">
                      Add your portfolio to highlight your projects and achievements.
                    </p>
                  </div>
                )}
                <div className="bg-indigo-800/20 rounded-lg p-4 border border-indigo-500/30 hover:border-indigo-400/50 transition-colors">
                  <h4 className="text-indigo-200 font-medium mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Complete your profile
                  </h4>
                  <p className="text-indigo-300 text-sm">
                    Profiles with complete information are 40% more likely to be viewed by recruiters.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Resume Preview Modal */}
      {resumePreviewOpen && user?.resume && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-indigo-900 bg-opacity-90 rounded-2xl shadow-xl p-6 w-full max-w-4xl h-[80vh] flex flex-col border border-indigo-500/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Resume Preview</h3>
              <button
                onClick={() => setResumePreviewOpen(false)}
                className="p-2 rounded-full bg-indigo-800/50 hover:bg-indigo-700/70 text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-grow bg-white rounded-lg overflow-hidden">
              <iframe
                src={user.resume}
                className="w-full h-full"
                title="Resume Preview"
              />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <a
                href={user.resume}
                download
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
              <button
                onClick={() => setResumePreviewOpen(false)}
                className="px-4 py-2 bg-indigo-800/50 hover:bg-indigo-700/70 border border-indigo-500/50 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}