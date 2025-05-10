"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiMessageSquare,
  FiSend,
  FiMapPin,
  FiPhone,
  FiCheckCircle,
  FiClock,
  FiLifeBuoy,
} from "react-icons/fi";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.7))] opacity-5" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white backdrop-blur-lg rounded-[2rem] shadow-xl p-8 lg:p-12"
        >
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium group transition-colors"
            >
              <FiArrowLeft className="text-lg transition-transform group-hover:-translate-x-1" />
              Return to Home
            </Link>
          </div>

          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
              Get in Touch
            </h1>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {/* Name Input */}
                    {/* Name Input */}
                    <div className="group relative">
                      <input
                        type="text"
                        id="name"
                        className="w-full pt-6 pb-2 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all peer text-black"
                        placeholder=" "
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                      <label
                        htmlFor="name"
                        className="absolute left-4 top-2 text-sm text-gray-400 pointer-events-none transition-all transform
      peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
      peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
                      >
                        Full Name
                      </label>
                      <FiUser className="absolute right-4 top-4 text-gray-400 peer-focus:text-blue-500 transition-colors text-black" />
                    </div>

                    {/* Email Input */}
                    <div className="group relative">
                      <input
                        type="email"
                        id="email"
                        className="w-full pt-6 pb-2 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all peer text-black"
                        placeholder=" "
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                      <label
                        htmlFor="email"
                        className="absolute left-4 top-2 text-sm text-gray-400 pointer-events-none transition-all transform
      peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
      peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
                      >
                        Email Address
                      </label>
                      <FiMail className="absolute right-4 top-4 text-gray-400 peer-focus:text-blue-500 transition-colors" />
                    </div>

                    {/* Message Textarea */}
                    <div className="group relative">
                      <textarea
                        id="message"
                        className="w-full pt-6 pb-2 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none 
      transition-all peer h-32 resize-none text-black"
                        placeholder=" "
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                      />
                      <label
                        htmlFor="message"
                        className="absolute left-4 top-2 text-sm text-gray-400 pointer-events-none transition-all transform
      peer-placeholder-shown:text-base peer-placeholder-shown:top-6
      peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
                      >
                        Your Message
                      </label>
                      <FiMessageSquare className="absolute right-4 top-4 text-gray-400 peer-focus:text-blue-500 transition-colors" />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl 
                      shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FiSend className="text-lg" />
                    Send Message
                  </motion.button>
                </form>

                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-600 text-sm"
                    >
                      <FiCheckCircle className="text-xl" />
                      Message sent successfully!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-3 bg-white rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <FiMapPin className="text-xl" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          Head Office
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          123 Innovation Boulevard
                          <br />
                          Tech Valley, CA 94016
                          <br />
                          United States
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 bg-white rounded-lg">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <FiPhone className="text-xl" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          Phone
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          +1 (555) 123-4567
                          <br />
                          <span className="text-blue-600">
                            24/7 Support Line
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 bg-white rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <FiMail className="text-xl" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          Email
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          support@converterapp.com
                          <br />
                          sales@converterapp.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 bg-white rounded-lg">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <FiClock className="text-xl" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          Hours
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Mon-Fri: 9AM - 8PM PST
                          <br />
                          Sat-Sun: 10AM - 6PM PST
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-2xl border border-green-200 flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <FiLifeBuoy className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Support Status
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="text-green-600">●</span> All systems
                      operational
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
