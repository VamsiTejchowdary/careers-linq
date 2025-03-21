"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Menu,
  X,
} from "lucide-react";


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
  const [formProgress, setFormProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();
  const departments = ["Engineering", "Sales", "Marketing", "HR", "Operations", "Finance", "Product", "Design"];
  const employmentTypes = ["Full-time", "Part-time", "Contract", "Remote", "Hybrid", "Internship"];
  const compensationRanges = [
    "Less than $50,000",
    "$50,000 - $75,000",
    "$75,000 - $100,000",
    "$100,000 - $125,000",
    "$125,000 - $150,000",
    "$150,000 - $200,000",
    "$200,000+",
  ];

  // Calculate form completion progress
  useEffect(() => {
    const requiredFields = [
      jobTitle, 
      location, 
      department, 
      employmentType, 
      reportsTo,
      compensationRange, 
      about, 
      responsibilities
    ];
    
    const filledFieldsCount = requiredFields.filter(field => field.trim() !== "").length;
    setFormProgress((filledFieldsCount / requiredFields.length) * 100);
  }, [jobTitle, location, department, employmentType, reportsTo, compensationRange, about, responsibilities]);

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
      toast.error("Please fill in all required fields");
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="max-w-4xl mx-auto px-4 py-12"
      >
        <div className="mb-8 text-center">
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl font-bold text-gray-800 mb-2"
          >
            Create a New Job Posting
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="text-gray-600 text-lg"
          >
            Add a new position to the Linq team
          </motion.p>
          
          {/* Progress bar */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${formProgress}%` }}
            className="h-1 bg-indigo-600 mt-6 mx-auto rounded-full max-w-md transition-all duration-500 ease-in-out"
          >
          </motion.div>
          <motion.p 
            variants={fadeInUp}
            className="text-sm text-gray-500 mt-2"
          >
            {formProgress < 100 ? `${Math.round(formProgress)}% complete` : "Ready to submit! 🎉"}
          </motion.p>
        </div>

        <motion.div 
          variants={fadeInUp}
          className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
        >
          <div className="p-8">
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
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <motion.div variants={fadeInUp} className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">Job Title*</label>
                  <input
                    onChange={(e) => setJobTitle(e.target.value)}
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </motion.div>
                
                <motion.div variants={fadeInUp} className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">Location*</label>
                  <input
                    onChange={(e) => setLocation(e.target.value)}
                    type="text"
                    placeholder="e.g. San Francisco, CA (Remote)"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </motion.div>
                
                <motion.div variants={fadeInUp} className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">Department*</label>
                  <select
                    onChange={(e) => setDepartment(e.target.value)}
                    value={department}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-no-repeat bg-right"
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "2.5rem"
                    }}
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
                </motion.div>
                
                <motion.div variants={fadeInUp} className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">Employment Type*</label>
                  <select
                    onChange={(e) => setEmploymentType(e.target.value)}
                    value={employmentType}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-no-repeat bg-right"
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "2.5rem"
                    }}
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
                </motion.div>
                
                <motion.div variants={fadeInUp} className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">Reports To*</label>
                  <input
                    onChange={(e) => setReportsTo(e.target.value)}
                    type="text"
                    placeholder="e.g. Director of Engineering"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </motion.div>
                
                <motion.div variants={fadeInUp} className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">Compensation Range*</label>
                  <select
                    onChange={(e) => setCompensationRange(e.target.value)}
                    value={compensationRange}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-no-repeat bg-right"
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "2.5rem"
                    }}
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
                </motion.div>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="space-y-2">
                <label className="text-sm text-gray-700 font-medium">About the Role*</label>
                <textarea
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Describe the role, team, and impact..."
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  rows="4"
                />
              </motion.div>
              
              <motion.div variants={fadeInUp} className="space-y-2">
                <label className="text-sm text-gray-700 font-medium">Responsibilities*</label>
                <div className="text-xs text-gray-500 mb-1">Enter one responsibility per line</div>
                <textarea
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="- Lead the development of new features
- Collaborate with product managers
- Design and implement scalable solutions"
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  rows="4"
                />
              </motion.div>
              
              <motion.div variants={fadeInUp} className="space-y-2">
                <label className="text-sm text-gray-700 font-medium">Nice to Haves</label>
                <div className="text-xs text-gray-500 mb-1">Enter one qualification per line (optional)</div>
                <textarea
                  onChange={(e) => setNiceToHaves(e.target.value)}
                  placeholder="- Experience with React
- Knowledge of AWS
- Familiarity with CI/CD pipelines"
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  rows="4"
                />
              </motion.div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-300 text-red-600 text-sm py-3 px-4 rounded-lg flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </motion.div>
              )}
              
              <motion.div 
                variants={fadeInUp} 
                className="flex gap-4 pt-6"
              >
                <Link
                  href="/careers"
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all duration-300 text-center flex-1 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Cancel
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
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
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Create Job Posting
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>

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
              <span className="ml-3 text-xl font-bold">Linq</span>
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
            © {new Date().getFullYear()} Linq. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
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
                L
              </div>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">Linq</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/careers" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Careers
            </Link>
            <Link href="/postjob" className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
              Post Job
            </Link>
            <Link href="/applications" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
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
                className="bg-blue-50 text-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Post Job
              </Link>
              <Link
                href="/applications"
                className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
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