"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Building2, Eye, EyeOff,
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
    confirmPassword: ""
  });
  const [resumeName, setResumeName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [bubbles, setBubbles] = useState([]);
  const router = useRouter();
  
  const passwordStrengthLabels = ['Weak', 'Medium', 'Strong', 'Very Strong'];
  const passwordStrengthColors = ['bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-500'];
  // Countries list
  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", 
    "Germany", "France", "India", "China", "Japan", "Brazil",
    // Add more countries as needed
  ];

  // Generate animated background bubbles
  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = [];
      const count = window.innerWidth < 768 ? 15 : 25; // fewer bubbles on mobile
      
      for (let i = 0; i < count; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * 100, // position as percentage of viewport
          y: Math.random() * 100,
          size: Math.random() * 12 + 4, // size between 4-16
          duration: Math.random() * 20 + 10, // animation duration between 10-30s
          delay: Math.random() * 5
        });
      }
      
      setBubbles(newBubbles);
    };
    
    generateBubbles();
    window.addEventListener('resize', generateBubbles);
    
    return () => window.removeEventListener('resize', generateBubbles);
  }, []);

  // Check password match and strength
  useEffect(() => {
    const strength = calculatePasswordStrength(formData.password);
    setPasswordStrength(strength);
  }, [formData.password, formData.confirmPassword]);

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
  
  const passwordMatch = !formData.confirmPassword || formData.password === formData.confirmPassword;
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      // Simple password strength calculation
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
    //const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, resume: file });
      setResumeName(file.name);
    }
  };

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
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (['pdf', 'doc', 'docx'].includes(fileExtension)) {
        setFormData({ ...formData, resume: file });
        setResumeName(file.name);
      } else {
        // Optional: Add error handling for invalid file types
        alert('Please upload a PDF, DOC, or DOCX file');
      }
    }
  };

  const handleZoneClick = () => {
    fileInputRef.current.click();
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
      // Create FormData object to handle multipart/form-data
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
      formDataToSend.append("resume", formData.resume); // File object from input
  
      // Send the request to the API
      const response = await fetch("/api/user-signup", {
        method: "POST",
        body: formDataToSend,
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to create account");
      }
  
      // Redirect to sign-in page on success
      router.push("/careers");
    } catch (err) {
      setError(err.message || "There was an error creating your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 w-full h-full">
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
              <h1 className="text-3xl font-bold text-white">Create Your Account</h1>
              <p className="text-indigo-200 mt-2">Join Career Clutch to discover exciting opportunities</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border-l-4 border-red-500 text-red-100 backdrop-blur-sm rounded-r">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-indigo-200 mb-1">
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
                  <label htmlFor="lastName" className="block text-sm font-medium text-indigo-200 mb-1">
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

              {/* Email */}
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
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                  />
                </div>
              </div>

              {/* Phone & Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-indigo-200 mb-1">
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
                  <label htmlFor="country" className="block text-sm font-medium text-indigo-200 mb-1">
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

              {/* LinkedIn & Portfolio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-indigo-200 mb-1">
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
                  <label htmlFor="portfolio" className="block text-sm font-medium text-indigo-200 mb-1">
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

              {/* Resume Upload */}
              <div>
      <label htmlFor="resume" className="block text-sm font-medium text-indigo-200 mb-1">
        Upload Resume
      </label>
      <div 
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-indigo-400 bg-indigo-800/40' : 'border-indigo-500/30 bg-indigo-800/20'} border-dashed rounded-lg cursor-pointer transition-colors duration-200`}
        onClick={handleZoneClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <FileText className={`h-12 w-12 ${isDragging ? 'text-indigo-200' : 'text-indigo-300'} transition-colors duration-200`} />
          </div>
          <div className="flex text-sm text-indigo-200">
            <label htmlFor="resume" className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-300 hover:text-white transition-colors focus-within:outline-none">
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

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-indigo-200 mb-1">
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
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-indigo-200">Password strength:</span>
              <span className={`font-medium ${passwordStrength === 0 ? 'text-red-400' : 
                passwordStrength === 1 ? 'text-yellow-400' : 
                'text-green-400'}`}>
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
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-indigo-200 mb-1">
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
            className={`block w-full pl-10 pr-10 py-3 bg-indigo-800/30 border ${!passwordMatch && formData.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-indigo-500/50'} rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300`}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-300 hover:text-indigo-100"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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

              {/* Terms Agreement */}
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
                    <a href="#" className="text-indigo-300 hover:text-white transition-colors">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-indigo-300 hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || (formData.confirmPassword && !passwordMatch)}
                className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:ring-4 focus:ring-indigo-400/50 text-white font-medium rounded-lg text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Creating account...
                  </>
                ) : (
                  <>Create Account</>
                )}
              </button>

              {/* Sign In Link */}
              <div className="text-center mt-6">
                <p className="text-indigo-200">
                  Already have an account?{" "}
                  <Link href="/user/signin" className="font-medium text-indigo-300 hover:text-white transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Divider */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-indigo-500/30"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-indigo-900/20 text-indigo-200">Or</span>
                  </div>
                </div>
              </div>

              {/* Sign up as Company */}
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