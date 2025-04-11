"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const PasswordResetPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [bubbles, setBubbles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === "password") setShowPassword(!showPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = [];
      const count = window.innerWidth < 768 ? 10 : 20; // Fewer bubbles on mobile
      for (let i = 0; i < count; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 10 + 3, // Smaller bubbles on mobile
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

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (!/^\d{0,6}$/.test(pastedData)) return;
    const digits = pastedData.split("").slice(0, 6);
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);
    if (digits.length >= 6) {
      document.getElementById("otp-5").focus();
    } else if (digits.length > 0) {
      document.getElementById(`otp-${digits.length - 1}`).focus();
    }
  };

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/emails/forgot-password/request-password-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Email not registered");
      toast.success("OTP sent to your email address!");
      setCurrentStep(2);
    } catch (err) {
      //toast.error(err.message || "Email verification failed");
      setError(err.message || "This email is not registered with us.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/emails/forgot-password/request-password-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to resend OTP");
      toast.success("New OTP sent to your email!");
    } catch (err) {
      //toast.error(err.message || "Failed to resend OTP");
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const otpValue = otp.join("");
      if (otpValue.length !== 6) throw new Error("Please enter a valid 6-digit OTP");
      const response = await fetch("/api/emails/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Invalid OTP");
      toast.success("OTP verified successfully!");
      setCurrentStep(3);
    } catch (err) {
      //toast.error(err.message || "OTP verification failed");
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (newPassword !== confirmPassword) throw new Error("Passwords do not match");
      if (newPassword.length < 8) throw new Error("Password must be at least 8 characters long");
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Password reset failed");
      toast.success("Password reset successful!");
      setResetComplete(true);
    //   setTimeout(() => {
    //     window.location.href = "/user/signin";
    //   }, 3000);
    } catch (err) {
      //toast.error(err.message || "Password reset failed");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const renderForm = () => {
    if (resetComplete) {
      return (
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Password Reset Complete</h2>
          <p className="text-indigo-200 mb-8">
            Your password has been successfully reset. You will be redirected to the login page.
          </p>
          <Link
            href="/user/signin"
            className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:ring-4 focus:ring-indigo-400/50 text-white font-medium rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <form onSubmit={handleEmailVerification}>
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-indigo-200 mb-1">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300 text-sm sm:text-base"
                  />
                </div>
                <p className="mt-2 text-xs sm:text-sm text-indigo-300">
                  We’ll send a verification code to this email
                </p>
              </div>
              {error && (
                <div className="p-4 bg-red-900/30 border-l-4 border-red-500 text-red-100 backdrop-blur-sm rounded-r">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-300 mr-2" />
                    <p className="text-xs sm:text-sm">{error}</p>
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:ring-4 focus:ring-indigo-400/50 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleOtpVerification}>
            <div className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-indigo-200 mb-1">
                  Enter Verification Code
                </label>
                <p className="text-indigo-300 text-xs sm:text-sm mb-4">
                  We sent a 6-digit code to {email}
                </p>
                <div className="flex justify-between space-x-1 sm:space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      autoFocus={index === 0}
                      className="w-10 h-10 sm:w-12 sm:h-12 text-center bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white text-lg sm:text-xl font-bold"
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-indigo-300 hover:text-white disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Didn’t receive code? Resend
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-indigo-300 hover:text-white"
                  >
                    Change email
                  </button>
                </div>
              </div>
              {error && (
                <div className="p-4 bg-red-900/30 border-l-4 border-red-500 text-red-100 backdrop-blur-sm rounded-r">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-300 mr-2" />
                    <p className="text-xs sm:text-sm">{error}</p>
                  </div>
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="flex-1 flex justify-center items-center py-2 sm:py-3 px-4 bg-indigo-800/40 hover:bg-indigo-700/50 border border-indigo-500/30 text-white font-medium rounded-lg transition-colors text-xs sm:text-sm"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otp.join("").length !== 6}
                  className="flex-1 flex justify-center items-center py-2 sm:py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:ring-4 focus:ring-indigo-400/50 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handlePasswordReset}>
            <div className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-indigo-200 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-indigo-300" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-300 hover:text-indigo-100 focus:outline-none transition-colors"
                    onClick={() => togglePasswordVisibility("password")}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-indigo-300">
                  Password must be at least 8 characters long
                </p>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-indigo-200 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <KeyRound className="h-5 w-5 text-indigo-300" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-300 hover:text-indigo-100 focus:outline-none transition-colors"
                    onClick={() => togglePasswordVisibility("confirm")}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="p-4 bg-red-900/30 border-l-4 border-red-500 text-red-100 backdrop-blur-sm rounded-r">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-300 mr-2" />
                    <p className="text-xs sm:text-sm">{error}</p>
                  </div>
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="flex-1 flex justify-center items-center py-2 sm:py-3 px-4 bg-indigo-800/40 hover:bg-indigo-700/50 border border-indigo-500/30 text-white font-medium rounded-lg transition-colors text-xs sm:text-sm"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirmPassword}
                  className="flex-1 flex justify-center items-center py-2 sm:py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:ring-4 focus:ring-indigo-400/50 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Resetting...
                    </>
                  ) : (
                    <>Reset Password</>
                  )}
                </button>
              </div>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
      {/* Background Bubbles */}
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
              x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, Math.random() * 50 - 25, 0],
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
              <div className="h-8 w-8 sm:h-10 sm:w-10 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                  @
                </div>
              </div>
              <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-bold text-white">
                Career Clutch
              </span>
            </Link>
            <Link
              href="/user/signin"
              className="text-indigo-200 hover:text-white flex items-center text-xs sm:text-sm font-medium transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-indigo-900 bg-opacity-20 p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md backdrop-blur-md border border-indigo-500/30"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Reset Password</h1>
            <p className="text-indigo-200 mt-2 text-xs sm:text-sm">
              {currentStep === 1
                ? "Enter your email to receive a verification code"
                : currentStep === 2
                ? "Enter the verification code sent to your email"
                : "Create a new password for your account"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="flex items-center w-full max-w-xs">
              <div className={`flex-1 h-1 ${currentStep >= 1 ? "bg-indigo-400" : "bg-indigo-700"}`}></div>
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 1
                    ? "bg-indigo-500 border-indigo-300 text-white"
                    : "bg-indigo-900 border-indigo-700 text-indigo-400"
                }`}
              >
                1
              </div>
              <div className={`flex-1 h-1 ${currentStep >= 2 ? "bg-indigo-400" : "bg-indigo-700"}`}></div>
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 2
                    ? "bg-indigo-500 border-indigo-300 text-white"
                    : "bg-indigo-900 border-indigo-700 text-indigo-400"
                }`}
              >
                2
              </div>
              <div className={`flex-1 h-1 ${currentStep >= 3 ? "bg-indigo-400" : "bg-indigo-700"}`}></div>
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 3
                    ? "bg-indigo-500 border-indigo-300 text-white"
                    : "bg-indigo-900 border-indigo-700 text-indigo-400"
                }`}
              >
                3
              </div>
              <div className={`flex-1 h-1 ${currentStep > 3 ? "bg-indigo-400" : "bg-indigo-700"}`}></div>
            </div>
          </div>

          {renderForm()}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-indigo-900 bg-opacity-40 backdrop-blur-sm py-4 sm:py-6 border-t border-indigo-500/30 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-indigo-200 text-xs sm:text-sm">
            © {new Date().getFullYear()} Career Clutch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PasswordResetPage;