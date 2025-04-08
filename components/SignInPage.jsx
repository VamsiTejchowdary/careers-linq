"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import {
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { set } from "mongoose";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [bubbles, setBubbles] = useState([]);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/user-signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Sign-in failed.");
      }
      toast.success("Sign-in successful!");
      setTimeout(() => {
        window.location.href = "/careers";
      }, 1000);
    } catch (err) {
      toast.error(err.message || "Sign-in failed.");
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
              href="/"
              className="text-indigo-200 hover:text-white flex items-center text-sm font-medium transition-colors"
            >
              Browse Careers
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-indigo-900 bg-opacity-20 p-8 sm:p-10 rounded-2xl shadow-xl max-w-md w-full backdrop-blur-md border border-indigo-500/30"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-indigo-200 mt-2">
              Sign in to your Career Clutch account
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-3 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                  />
                </div>
              </div>

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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-3 bg-indigo-800/30 border border-indigo-500/50 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-300"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-300 hover:text-indigo-100 focus:outline-none transition-colors"
                    onClick={togglePasswordVisibility}
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
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-500 border-indigo-400 rounded focus:ring-indigo-400"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-indigo-200"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-indigo-300 hover:text-white transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              {error && (
            <div className="mb-6 p-4 bg-red-900/30 border-l-4 border-red-500 text-red-100 backdrop-blur-sm rounded-r">
              <p>{error}</p>
            </div>
          )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:ring-4 focus:ring-indigo-400/50 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>Sign In</>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-indigo-500/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-indigo-900/20 text-indigo-200">
                  Or sign in as
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-6">
              <Link
                href="#"
                className="flex items-center justify-center py-3 px-4 border border-indigo-500/30 rounded-lg shadow-sm bg-indigo-800/20 hover:bg-indigo-700/30 text-white transition-colors"
              >
                <Building2 className="h-5 w-5 text-indigo-300 mr-2" />
                <span className="font-medium">Company</span>
              </Link>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-indigo-200">
              Don't have an account?{" "}
              <Link
                href="/user/signup"
                className="font-medium text-indigo-300 hover:text-white transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 bg-indigo-900 bg-opacity-40 backdrop-blur-sm py-6 border-t border-indigo-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-indigo-200 text-sm">
            © {new Date().getFullYear()} Career Clutch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SignInPage;
