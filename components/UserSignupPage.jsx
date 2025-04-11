"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Linkedin,
  FileText,
  Globe,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Building2,
  Eye,
  EyeOff,
  AlertTriangle,
  X,
} from "lucide-react";

const UserSignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    linkedin: "",
    portfolio: "",
    resume: null,
    password: "",
    confirmPassword: "",
  });
  const [resumeName, setResumeName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [bubbles, setBubbles] = useState([]);
  const router = useRouter();

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const otpInputs = useRef([]);

  const passwordStrengthLabels = ["Weak", "Medium", "Strong", "Very Strong"];
  const passwordStrengthColors = [
    "bg-red-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-green-500",
  ];
  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "India",
    "China",
    "Japan",
    "Brazil",
  ];

  // Generate animated background bubbles (unchanged)
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

  // Password strength calculation (unchanged)
  useEffect(() => {
    const strength = calculatePasswordStrength(formData.password);
    setPasswordStrength(strength);
  }, [formData.password]);

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    if (password.length < 8) return 0;
    let score = 0;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(3, score);
  };

  const passwordMatch =
    !formData.confirmPassword || formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, resume: file });
      setResumeName(file.name);
    }
  };

  // File drag-and-drop handlers (unchanged)
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (["pdf", "doc", "docx"].includes(fileExtension)) {
        setFormData({ ...formData, resume: file });
        setResumeName(file.name);
      } else {
        alert("Please upload a PDF, DOC, or DOCX file");
      }
    }
  };

  const handleZoneClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (showOtpModal && otpInputs.current[0]) {
      setTimeout(() => otpInputs.current[0].focus(), 100);
    }
  }, [showOtpModal]);

  // OTP Input Handling
  const handleOtpChange = (index, value) => {
    // Allow all characters
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Call verify-email API
      const verifyResponse = await fetch(
        "/api/emails/user-signup-verify/user-verify-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const verifyResult = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyResult.message || "Failed to send OTP");
      }

      // Show OTP modal
      setShowOtpModal(true);
    } catch (err) {
      setError(
        err.message || "There was an error sending the OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowOtpModal(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");
    const otpCode = otp.join("");

    if (!/^[A-Za-z0-9]{4}$/.test(otpCode)) {
      setOtpError("Please enter a valid 4-character alphanumeric OTP");
      return;
    }

    setIsLoading(true);

    try {
      // Step 2: Verify OTP
      const verifyOtpResponse = await fetch(
        "/api/emails/user-signup-verify/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp: otpCode }),
        }
      );

      const verifyOtpResult = await verifyOtpResponse.json();

      if (!verifyOtpResponse.ok) {
        throw new Error(verifyOtpResult.message || "Invalid OTP");
      }

      // Step 3: Proceed with signup
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("linkedin", formData.linkedin);
      formDataToSend.append("portfolio", formData.portfolio);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("confirmPassword", formData.confirmPassword);
      formDataToSend.append("resume", formData.resume);

      const signupResponse = await fetch("/api/user-signup", {
        method: "POST",
        body: formDataToSend,
      });

      const signupResult = await signupResponse.json();

      if (!signupResponse.ok) {
        throw new Error(signupResult.message || "Failed to create account");
      }

      setShowOtpModal(false);

      toast.success("Email Verified successfully!");
      setTimeout(() => {
        window.location.href = "/careers";
      }, 2000);
    } catch (err) {
      setOtpError(
        err.message || "There was an error verifying the OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpInputs.current[index - 1].focus();
    }
    // Navigate with arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      otpInputs.current[index - 1].focus();
    }
    if (e.key === "ArrowRight" && index < 3) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (pastedData.length < 4) return;

    const chars = pastedData.slice(0, 4).split("");
    setOtp(chars);
    otpInputs.current[3].focus();
  };

  const emailObfuscated = formData?.email
    ? formData.email.replace(/(.{3})(.*)(@.*)/, "$1***$3")
    : "your email";

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 w-full h-full">
        <ToastContainer
          position="top-center"
          autoClose={2000}
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
              <span className="ml-3 text-xl font-bold text-white">
                Career Clutch
              </span>
            </Link>
            <Link
              href="/user/signin"
              className="text-indigo-200 hover:text-white flex items-center text-sm font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-indigo-900 bg-opacity-20 p-8 rounded-2xl shadow-xl backdrop-blur-md border border-indigo-500/30"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white">
                Create Your Account
              </h1>
              <p className="text-indigo-200 mt-2">
                Join Career Clutch to discover exciting opportunities
              </p>
            </div>

            

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Fields (Unchanged) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-indigo-200 mb-1"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-indigo-300" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-indigo-200 mb-1"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-indigo-300" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-indigo-200 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-indigo-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-indigo-200 mb-1"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="h-5 w-5 text-indigo-300" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(123) 456-7890"
                      className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-indigo-200 mb-1"
                  >
                    Country
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="h-5 w-5 text-indigo-300" />
                    </div>
                    <select
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="linkedin"
                    className="block text-sm font-medium text-indigo-200 mb-1"
                  >
                    LinkedIn Profile (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Linkedin className="h-5 w-5 text-indigo-300" />
                    </div>
                    <input
                      id="linkedin"
                      name="linkedin"
                      type="url"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="portfolio"
                    className="block text-sm font-medium text-indigo-200 mb-1"
                  >
                    Portfolio URL (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Globe className="h-5 w-5 text-indigo-300" />
                    </div>
                    <input
                      id="portfolio"
                      name="portfolio"
                      type="url"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                      className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-indigo-200 mb-1"
                >
                  Upload Resume
                </label>
                <div
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                    isDragging
                      ? "border-indigo-400 bg-indigo-800/40"
                      : "border-indigo-500/30 bg-indigo-800/20"
                  } border-dashed rounded-lg cursor-pointer transition-colors duration-200`}
                  onClick={handleZoneClick}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="space-y-2 text-center">
                    <div className="flex justify-center">
                      <FileText
                        className={`h-12 w-12 ${isDragging ? "text-indigo-200" : "text-indigo-300"} transition-colors duration-200`}
                      />
                    </div>
                    <div className="flex text-sm text-indigo-200">
                      <label
                        htmlFor="resume"
                        className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-300 hover:text-white transition-colors focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="resume"
                          name="resume"
                          type="file"
                          ref={fileInputRef}
                          required
                          accept=".pdf,.doc,.docx"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-indigo-300">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                    {resumeName && (
                      <div className="flex items-center justify-center space-x-2 text-sm text-green-300">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{resumeName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-indigo-200 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-indigo-300" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-10 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-300 hover:text-indigo-100"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-indigo-200">
                          Password strength:
                        </span>
                        <span
                          className={`font-medium ${
                            passwordStrength === 0
                              ? "text-red-400"
                              : passwordStrength === 1
                                ? "text-yellow-400"
                                : "text-green-400"
                          }`}
                        >
                          {passwordStrengthLabels[passwordStrength]}
                        </span>
                      </div>
                      <div className="w-full bg-indigo-800/40 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${passwordStrengthColors[passwordStrength]}`}
                          style={{ width: `${(passwordStrength + 1) * 25}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-indigo-200 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-indigo-300" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`block w-full pl-10 pr-10 py-3 bg-indigo-800/30 border ${
                        !passwordMatch && formData.confirmPassword
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-indigo-500/50"
                      } rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-300 hover:text-indigo-100"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {!passwordMatch && formData.confirmPassword && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-indigo-200">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-indigo-300 hover:text-white transition-colors"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-indigo-300 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
              {error && (
              <div className="mb-6 p-4 bg-red-900/30 border-l-4 border-red-500 text-red-100 backdrop-blur-sm rounded-r">
                <p>{error}</p>
              </div>
            )}
              <button
                type="submit"
                disabled={
                  isLoading || (formData.confirmPassword && !passwordMatch)
                }
                className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:ring-4 focus:ring-indigo-400/50 text-white font-medium rounded-lg text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Sending OTP...
                  </>
                ) : (
                  <>Create Account</>
                )}
              </button>
              <div className="text-center mt-6">
                <p className="text-indigo-200">
                  Already have an account?{" "}
                  <Link
                    href="/user/signin"
                    className="font-medium text-indigo-300 hover:text-white transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-indigo-500/30"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-indigo-900/20 text-indigo-200">
                      Or
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-indigo-200 mb-4">Hiring talent instead?</p>
                <Link
                  href="/company/signup"
                  className="inline-flex items-center justify-center py-3 px-6 bg-indigo-800/40 hover:bg-indigo-700/50 border border-indigo-500/50 rounded-lg transition-colors text-white font-medium"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  Sign up as Company
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      {/* OTP Modal */}
      {showOtpModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3"
        onKeyDown={handleKeyDown}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-indigo-950 to-purple-900 p-4 sm:p-6 rounded-xl shadow-xl backdrop-blur-xl border border-indigo-500/40 w-full max-w-xs sm:max-w-sm relative"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <div className="bg-indigo-600/30 p-2 rounded-full mb-3">
              <Mail className="h-6 w-6 text-indigo-200" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
              Verify Your Email
            </h2>
            <p className="text-indigo-200 text-center mt-1 text-sm sm:text-base">
              We sent a code to {emailObfuscated}
            </p>
          </div>

          {otpError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-2 bg-red-900/40 border-l-4 border-red-500 text-red-100 rounded-r flex items-start gap-2"
            >
              <AlertTriangle className="h-4 w-4 text-red-300 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm">{otpError}</p>
            </motion.div>
          )}

          <form onSubmit={handleOtpSubmit} className="space-y-4 sm:space-y-5">
            <div
              className="flex justify-center space-x-2 sm:space-x-3"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  ref={(el) => (otpInputs.current[index] = el)}
                  className="w-12 sm:w-14 h-12 sm:h-14 text-center text-lg sm:text-xl font-bold text-white bg-indigo-800/30 border-2 border-indigo-500/50 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 placeholder-indigo-400/50 transition-all"
                  placeholder="•"
                  aria-label={`Character ${index + 1} of verification code`}
                />
              ))}
            </div>

            <div className="bg-indigo-900/40 rounded-lg p-2 sm:p-3 border border-indigo-600/30">
              <p className="text-indigo-200 text-xs sm:text-sm flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-indigo-300 shrink-0 mt-0.5" />
                <span>Can't find the email? Check your spam folder.</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isLoading || otp.some((char) => char === "")}
                className="w-full flex justify-center items-center py-2.5 sm:py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:ring-4 focus:ring-indigo-400/50 text-white font-medium rounded-lg text-sm sm:text-base transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/30"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>Verify Code</>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full flex justify-center items-center py-2.5 sm:py-3 px-4 bg-indigo-800/50 hover:bg-indigo-800/70 focus:ring-4 focus:ring-indigo-400/50 text-indigo-100 font-medium rounded-lg text-sm sm:text-base transition-all shadow-lg shadow-indigo-900/30"
              >
                Cancel
              </button>
            </div>

            <div className="text-center">
              <p className="text-indigo-200 text-xs sm:text-sm">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-indigo-300 hover:text-white font-medium transition-colors focus:outline-none focus:underline"
                  disabled={isLoading}
                >
                  Resend
                </button>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    )}

      {/* Footer */}
      <footer className="relative z-10 bg-indigo-900 bg-opacity-40 backdrop-blur-sm py-6 border-t border-indigo-500/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-indigo-200 text-sm">
            © {new Date().getFullYear()} Career Clutch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserSignupPage;
