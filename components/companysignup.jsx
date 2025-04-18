"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Mail, 
  Lock, 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  Linkedin, 
  Globe, 
  Briefcase,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2
} from "lucide-react";

const CompanySignupPage = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    country: "",
    industry: "",
    companySize: "",
    website: "",
    linkedin: "",
    logo: null,
    password: "",
    confirmPassword: ""
  });
  
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [logoName, setLogoName] = useState("");
  const [bubbles, setBubbles] = useState([]);
  
  const passwordStrengthLabels = ["Weak", "Medium", "Strong", "Very Strong"];
  const passwordStrengthColors = ["bg-red-500", "bg-yellow-500", "bg-green-500", "bg-green-600"];
  
  // Countries list
  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", 
    "Germany", "France", "India", "China", "Japan", "Brazil",
    // Add more countries as needed
  ];

  // Industries list
  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
    "Retail", "Marketing", "Entertainment", "Transportation", "Construction"
    // Add more industries as needed
  ];

  // Company sizes
  const companySizes = [
    "1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"
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

  // Check password match when either password field changes
  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    }
    
    // Simple password strength check
    const strength = calculatePasswordStrength(formData.password);
    setPasswordStrength(strength);
  }, [formData.password, formData.confirmPassword]);

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 1;
    // Contains number
    if (/\d/.test(password)) strength += 1;
    // Contains special char
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    // Mix of upper and lowercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    
    return Math.min(3, strength); // 0-3 scale
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      setLogoName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Check passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API request with timeout
    try {
      // Here you would make your actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, just log the form data
      console.log(formData);
      
      // Redirect after successful signup
      window.location.href = "/signin?registered=true";
    } catch (err) {
      setError("There was an error creating your account. Please try again.");
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
            {/* Logo */}
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

            {/* Return to sign in */}
            <Link
              href="/signin"
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
              <h1 className="text-3xl font-bold text-white">Create Company Account</h1>
              <p className="text-indigo-200 mt-2">Join Career Clutch to post jobs and find talented candidates</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border-l-4 border-red-500 text-red-100 backdrop-blur-sm rounded-r">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-indigo-200 mb-1">
                  Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Building2 className="h-5 w-5 text-indigo-300" />
                  </div>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Acme Corporation"
                    className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                  />
                </div>
              </div>

              {/* Contact Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-indigo-200 mb-1">
                    Contact Person
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-indigo-300" />
                    </div>
                    <input
                      id="contactName"
                      name="contactName"
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                    />
                  </div>
                </div>
                
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
                      placeholder="contact@company.com"
                      className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                    />
                  </div>
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

              {/* Industry & Company Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-indigo-200 mb-1">
                    Industry
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Briefcase className="h-5 w-5 text-indigo-300" />
                    </div>
                    <select
                      id="industry"
                      name="industry"
                      required
                      value={formData.industry}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                    >
                      <option value="">Select Industry</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="companySize" className="block text-sm font-medium text-indigo-200 mb-1">
                    Company Size
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-indigo-300" />
                    </div>
                    <select
                      id="companySize"
                      name="companySize"
                      required
                      value={formData.companySize}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                    >
                      <option value="">Select Size</option>
                      {companySizes.map((size) => (
                        <option key={size} value={size}>
                          {size} employees
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Website & LinkedIn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-indigo-200 mb-1">
                    Company Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Globe className="h-5 w-5 text-indigo-300" />
                    </div>
                    <input
                      id="website"
                      name="website"
                      type="url"
                      required
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourcompany.com"
                      className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-indigo-200 mb-1">
                    LinkedIn Page (Optional)
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
                      placeholder="https://linkedin.com/company/yourcompany"
                      className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                    />
                  </div>
                </div>
              </div>

              {/* Company Logo Upload */}
              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-indigo-200 mb-1">
                  Company Logo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-indigo-500/30 border-dashed rounded-lg bg-indigo-800/20">
                  <div className="space-y-2 text-center">
                    <div className="flex justify-center">
                      <FileText className="h-12 w-12 text-indigo-300" />
                    </div>
                    <div className="flex text-sm text-indigo-200">
                      <label htmlFor="logo" className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-300 hover:text-white transition-colors focus-within:outline-none">
                        <span>Upload logo</span>
                        <input 
                          id="logo" 
                          name="logo" 
                          type="file" 
                          required
                          accept=".jpg,.jpeg,.png,.svg" 
                          className="sr-only"
                          onChange={handleFileChange} 
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-indigo-300">
                      PNG, JPG, SVG up to 5MB
                    </p>
                    {logoName && (
                      <div className="flex items-center justify-center space-x-2 text-sm text-green-300">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{logoName}</span>
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
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                    />
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
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border ${!passwordMatch && formData.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-indigo-500/50'} rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300`}
                    />
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
                  <>Create Company Account</>
                )}
              </button>

              {/* Sign In Link */}
              <div className="text-center mt-6">
                <p className="text-indigo-200">
                  Already have an account?{" "}
                  <Link href="/signin" className="font-medium text-indigo-300 hover:text-white transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>

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

            {/* Looking for a job? */}
            <div className="mt-8 text-center">
              <p className="text-indigo-200 mb-4">Looking for a job instead?</p>
              <Link 
                href="/user/signup"
                className="inline-flex items-center justify-center py-3 px-6 bg-indigo-800/40 hover:bg-indigo-700/50 border border-indigo-500/50 rounded-lg transition-colors text-white font-medium"
              >
                <User className="h-5 w-5 mr-2" />
                Sign up as Job Seeker
              </Link>
            </div>
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

export default CompanySignupPage;