"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Contact from "../components/contact";
import { useRouter } from "next/navigation";

export default function CareersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCTA, setActiveCTA] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const ctaSliderRef = useRef(null);
  const router = useRouter();

  const ctaContent = [
    {
      title: "Join Our Team",
      description:
        "Discover exciting opportunities to grow your career with us",
      buttonText: "View Positions",
      buttonLink: "#openings",
      bgColor: "from-indigo-600 to-purple-600",
    },
    {
      title: "Work Remotely",
      description: "Enjoy flexibility with our hybrid and remote work options",
      buttonText: "Learn More",
      buttonLink: "#benefits",
      bgColor: "from-blue-600 to-indigo-600",
    },
    {
      title: "Innovative Culture",
      description: "Be part of a team that's shaping the future of connections",
      buttonText: "Our Values",
      buttonLink: "#culture",
      bgColor: "from-purple-600 to-pink-600",
    },
  ];

  const allDepartments = [
    "Engineering",
    "Sales",
    "Marketing",
    "HR",
    "Operations",
    "Finance",
    "Product",
    "Design",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCTA((prev) => (prev + 1) % ctaContent.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ctaContent.length]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroElements = document.querySelectorAll(".parallax-element");

      heroElements.forEach((element) => {
        const speed = element.getAttribute("data-speed") || 0.2;
        element.style.transform = `translateY(${scrollPosition * speed}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await fetch("/api/create-job", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch job postings");
        }

        const data = await res.json();
        setPositions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const animateElements = document.querySelectorAll(".animate-on-scroll");
    animateElements.forEach((el) => observer.observe(el));

    return () => {
      animateElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

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
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setIsSignedIn(false);
    setUser(null);
    router.push("/");
  };

  const departmentsWithPostings = Array.from(
    new Set(positions.map((position) => position.department))
  ).filter((dept) => allDepartments.includes(dept));

  const filteredPositions =
    activeTab === "all"
      ? positions
      : positions.filter(
          (position) => position.department.toLowerCase() === activeTab
        );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Head>
        <title>Career Clutch | Join Our Team</title>
        <meta
          name="description"
          content="Join the Career Clutch team and help us build the future of professional connections"
        />
      </Head>

      <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                    <span>@</span>
                  </div>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">
                  Career Clutch
                </span>
              </Link>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  href="/careers"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-indigo-600"
                >
                  Careers
                </Link>
                <Link
                  href="#contact-section"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#contact-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {/* Improved Profile/Sign-In Component */}
              <div className="relative">
                {isSignedIn ? (
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white overflow-hidden">
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
                ) : (
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Sign In</span>
                  </button>
                )}

                {/* Improved Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-200 ease-out">
                    {isSignedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm text-gray-500">Signed in as</p>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Profile
                        </Link>
                        <Link
                          href="/appliedjobs"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <svg
                            className="mr-3 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
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
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/user/signin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
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
                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign In
                        </Link>
                        <Link
                          href="/user/signup"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
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
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              {/* <div className="-mr-2 flex items-center md:hidden ml-4">
                <button
                  onClick={() => setIsNavOpen(!isNavOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                  aria-expanded={isNavOpen}
                >
                  <span className="sr-only">
                    {isNavOpen ? "Close menu" : "Open menu"}
                  </span>
                  <svg
                    className={`${isNavOpen ? "hidden" : "block"} h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <svg
                    className={`${isNavOpen ? "block" : "hidden"} h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Improved Mobile menu */}
        <div
          className={`${
            isNavOpen ? "block" : "hidden"
          } md:hidden transform transition-all duration-300 ease-in-out`}
        >
          <div className="pt-2 pb-3 space-y-1 border-t border-gray-200">
            <Link
              href="/careers"
              className="block pl-3 pr-4 py-2 border-l-4 border-indigo-500 text-base font-medium text-indigo-700 bg-indigo-50"
            >
              Careers
            </Link>
            <Link
              href="#contact-section"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector("#contact-section")
                  ?.scrollIntoView({ behavior: "smooth" });
                setIsNavOpen(false);
              }}
            >
              Contact
            </Link>
            {isSignedIn ? (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white overflow-hidden">
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
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Link
                      href="/user/profile"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                      onClick={() => setIsNavOpen(false)}
                    >
                      Profile
                    </Link>
                    {/* <Link
                href="/user/settings"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsNavOpen(false)}
              >
                Settings
              </Link> */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsNavOpen(false);
                      }}
                      className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-red-300 hover:text-red-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex flex-col space-y-2 px-2">
                  <Link
                    href="/user/signin"
                    className="flex items-center justify-center px-4 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/user/signup"
                    className="flex items-center justify-center px-4 py-2 rounded-md text-base font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Rest of the page remains unchanged */}
      <div className="relative h-[90vh] w-full overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full animate-ping opacity-75 parallax-element"
            data-speed="0.5"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-3/4 left-1/3 w-3 h-3 bg-white rounded-full animate-ping opacity-75 parallax-element"
            data-speed="0.3"
            style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-1/3 left-2/3 w-5 h-5 bg-white rounded-full animate-ping opacity-75 parallax-element"
            data-speed="0.2"
            style={{ animationDuration: "2.8s", animationDelay: "0.3s" }}
          ></div>
          <div
            className="absolute top-2/3 left-3/4 w-4 h-4 bg-white rounded-full animate-ping opacity-75 parallax-element"
            data-speed="0.4"
            style={{ animationDuration: "3.2s", animationDelay: "0.7s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/5 w-6 h-6 bg-white/30 rounded-full animate-pulse opacity-50 parallax-element"
            data-speed="0.15"
          ></div>
          <div
            className="absolute top-1/6 left-1/2 w-8 h-8 bg-white/20 rounded-full animate-pulse opacity-40 parallax-element"
            data-speed="0.25"
          ></div>
          <div
            className="absolute top-3/4 left-1/6 w-12 h-12 bg-white/10 rounded-full animate-pulse opacity-30 parallax-element"
            data-speed="0.35"
          ></div>
        </div>
        <div
          className="absolute w-64 h-64 bg-white/5 rounded-full -top-20 -left-20 animate-pulse parallax-element"
          data-speed="0.1"
        ></div>
        <div
          className="absolute w-96 h-96 bg-white/5 rounded-full -bottom-32 -right-32 animate-pulse parallax-element"
          data-speed="0.15"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-40 h-40 bg-white/5 rounded-full top-1/4 right-1/4 animate-pulse parallax-element"
          data-speed="0.2"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div className="relative flex h-full items-center justify-center px-8">
          <div className="text-center max-w-4xl transform transition-all duration-700 animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeInUp">
              <span className="text-white inline-block relative overflow-hidden">
                <span className="relative z-10">
                  Join the Future of Connections
                </span>
                <span
                  className="absolute bottom-0 left-0 w-full h-1 bg-white transform translate-x-full animate-slideInFromRight"
                  style={{ animationDelay: "0.5s", animationDuration: "1s" }}
                ></span>
              </span>
            </h1>
            <p
              className="text-xl md:text-2xl text-white/90 mb-10 transform transition-all duration-500 animate-fadeInUp"
              style={{ animationDelay: "0.3s" }}
            >
              Help us build the next generation of professional networking tools
              that connect people in ways never before possible.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full"
          >
            <path
              fill="#fff"
              fillOpacity="1"
              d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,181.3C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      <section className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeCTA * 100}%)` }}
              ref={ctaSliderRef}
            >
              {ctaContent.map((cta, index) => (
                <div
                  key={index}
                  className={`w-full flex-shrink-0 bg-gradient-to-r ${cta.bgColor} p-8 md:p-16`}
                >
                  <div className="max-w-xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      {cta.title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-8">
                      {cta.description}
                    </p>
                    <a
                      href={cta.buttonLink}
                      className="px-6 py-3 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block"
                    >
                      {cta.buttonText}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {ctaContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCTA(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeCTA ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Vision
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              At Career Clutch, we're revolutionizing the way professionals
              connect in the digital age. Our platform bridges the gap between
              virtual and in-person networking, creating seamless experiences
              that feel natural and effective.
            </p>
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              We believe that meaningful connections are the foundation of
              career growth and business development. Our team is dedicated to
              creating tools that make these connections possible for everyone,
              everywhere.
            </p>
            <p className="text-lg md:text-xl text-gray-700">
              Join us in our mission to create a more connected professional
              world.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 animate-on-scroll">
            <div className="relative h-96 w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-32 h-32 mx-auto text-white/50 mb-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                      fill="currentColor"
                    />
                  </svg>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Our Mission
                  </h3>
                  <p className="text-white/80 px-8">
                    Creating meaningful professional connections in a digital
                    world
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="text-center">
                  <svg
                    className="w-32 h-32 mx-auto text-white/50 mb-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z"
                      fill="currentColor"
                    />
                  </svg>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Our Growth
                  </h3>
                  <p className="text-white/80 px-8">
                    Expanding our reach to connect professionals worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Key Values
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              These principles guide everything we do at Career Clutch and shape
              our company culture
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg
                    className="w-10 h-10 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    ></path>
                  </svg>
                ),
                title: "Excellence",
                description:
                  "We strive for excellence in everything we do, constantly pushing the boundaries of what's possible.",
              },
              {
                icon: (
                  <svg
                    className="w-10 h-10 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    ></path>
                  </svg>
                ),
                title: "Innovation",
                description:
                  "We embrace change and continuously innovate to stay ahead in a rapidly evolving digital landscape.",
              },
              {
                icon: (
                  <svg
                    className="w-10 h-10 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                ),
                title: "Collaboration",
                description:
                  "We work together across teams and disciplines to achieve our shared vision and goals.",
              },
              {
                icon: (
                  <svg
                    className="w-10 h-10 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                ),
                title: "Integrity",
                description:
                  "We act with honesty and transparency in all our interactions, building trust with our team and users.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 animate-on-scroll"
              >
                <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="openings" className="py-16 md:py-24 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Explore opportunities to join our innovative team and make an
              impact.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-gray-600 animate-pulse">
              Loading job postings...
            </div>
          ) : error ? (
            <div className="text-center text-red-600">Error: {error}</div>
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 md:mb-16 animate-on-scroll">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-lg font-medium transition-all shadow-md ${
                    activeTab === "all"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  All Teams
                </button>
                {departmentsWithPostings.map((department) => (
                  <button
                    key={department}
                    onClick={() => setActiveTab(department.toLowerCase())}
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-lg font-medium transition-all shadow-md ${
                      activeTab === department.toLowerCase()
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {department}
                  </button>
                ))}
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPositions.length > 0 ? (
                  filteredPositions.map((position) => (
                    <Link
                      href={`/careers/${position._id}`}
                      key={position._id}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 animate-on-scroll"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                          {position.jobTitle}
                        </h3>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                          {position.department}
                        </span>
                      </div>
                      <div className="text-gray-600 mb-6 space-y-2">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                          </svg>
                          {position.location}
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          {position.employmentType}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <span className="text-indigo-600 font-medium flex items-center hover:underline">
                          View Position
                          <svg
                            className="w-5 h-5 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            ></path>
                          </svg>
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-600 animate-on-scroll">
                    No job postings available for this department.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <section id="culture" className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Life at Career Clutch
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Discover what makes working at Career Clutch a unique and
              rewarding experience.
            </p>
          </div>

          <div id="benefits" className="grid gap-6 md:grid-cols-3 mb-16">
            {[
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
                title: "Collaborative Culture",
                desc: "Thrive in an open, inclusive environment that fosters innovation.",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                ),
                title: "Growth & Development",
                desc: "Access mentorship and learning opportunities to advance your career.",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Comprehensive Benefits",
                desc: "Enjoy competitive pay, health benefits, and flexible work arrangements.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all animate-on-scroll"
              >
                <div className="bg-indigo-500 rounded-2xl w-14 h-14 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl animate-on-scroll">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              <div>
                <p className="text-lg md:text-xl text-gray-700 italic mb-4">
                  "Joining Career Clutch has been a game-changer. The supportive
                  culture and innovative projects have accelerated my growth
                  beyond what I imagined."
                </p>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Sarah Johnson
                  </h4>
                  <p className="text-gray-600">
                    Senior Software Engineer, 2 years at Career Clutch
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Contact id="contact" />
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
                  url: "#",
                },
                {
                  icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
                  platform: "Twitter",
                  url: "#",
                },
                {
                  icon: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
                  platform: "LinkedIn",
                  url: "https://www.linkedin.com/in/vamsitejchowdary/",
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
                    viewBox={social.viewBox || "0 0 24 24"}
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
