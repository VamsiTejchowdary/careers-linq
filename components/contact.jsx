"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    setError("");

    if (!name || !email || !subject || !message) {
      setError("All fields are required.");
      toast.error("Please fill in all required fields");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending contact message...");
    //   const res = await fetch("api/contact", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });

      if (true) {
        toast.success("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 6000);
      } else {
        toast.error("Failed to send message. Please try again later.");
      }
    } catch (error) {
      console.log("Error sending message: ", error);
      toast.error("Error sending message!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFocus = (field) => setFocused(field);
  const handleBlur = () => setFocused("");

  const inputClasses = (fieldName) => `
    w-full p-3 rounded-lg 
    bg-white border ${
      focused === fieldName ? "border-indigo-500" : "border-gray-300"
    } 
    text-gray-900 placeholder-gray-400
    focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
    transition-all duration-300
    hover:border-indigo-300
  `;

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const thankYouVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  
  return (
    <div  id="contact-section" className="w-full bg-white py-12 px-6 md:px-8 rounded-xl shadow-lg mb-12">
      <div className="container max-w-screen-md mx-auto">
        <ToastContainer 
          position="top-center" 
          autoClose={4000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          theme="light"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
        </motion.div>
        
        {!isSubmitted ? (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            className="max-w-md mx-auto"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus("name")}
                  onBlur={handleBlur}
                  placeholder="Your Name"
                  className={inputClasses("name")}
                  disabled={isLoading}
                  required
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={handleBlur}
                  placeholder="Your Email"
                  className={inputClasses("email")}
                  disabled={isLoading}
                  required
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => handleFocus("subject")}
                  onBlur={handleBlur}
                  placeholder="Subject"
                  className={inputClasses("subject")}
                  disabled={isLoading}
                  required
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus("message")}
                  onBlur={handleBlur}
                  placeholder="Your Message"
                  className={`${inputClasses("message")} min-h-[120px] resize-y`}
                  disabled={isLoading}
                  required
                />
              </motion.div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 border border-red-200 text-red-600 text-sm py-3 px-4 rounded-lg flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </motion.div>
              )}
              
              <motion.div
                className="mt-2 flex justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-70"
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
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={thankYouVariants}
            className="text-center py-12 max-w-md mx-auto"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">Your message has been sent successfully. We'll get back to you soon.</p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors flex items-center mx-auto"
            >
              <span>Send another message</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}