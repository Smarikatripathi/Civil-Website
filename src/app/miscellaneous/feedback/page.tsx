"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiStar,
  FiSmile,
  FiFrown,
  FiCheckCircle,
} from "react-icons/fi";

const FeedbackPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    feedback: "",
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

          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-8">
              Share Your Feedback
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="group relative">
                  <input
                    type="text"
                    id="name"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none transition-all peer"
                    placeholder=" "
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all 
                      peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal
                      peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-purple-600"
                  >
                    Your Name
                  </label>
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-purple-500 transition-colors" />
                </div>

                <div className="group relative">
                  <input
                    type="email"
                    id="email"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none transition-all peer"
                    placeholder=" "
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all 
                      peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal
                      peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-purple-600"
                  >
                    Email Address
                  </label>
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-purple-500 transition-colors" />
                </div>

                <div className="group relative">
                  <div className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl peer-focus-within:border-purple-500">
                    <label className="text-sm text-gray-600">
                      How would you rate your experience?
                    </label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              rating: star.toString(),
                            })
                          }
                          className={`p-2 rounded-lg ${
                            formData.rating >= star.toString()
                              ? "bg-purple-100 text-purple-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <FiStar className="text-xl" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <FiStar className="absolute left-4 top-8 text-gray-400" />
                </div>

                <div className="group relative">
                  <textarea
                    id="feedback"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none 
                      transition-all peer h-32 resize-none"
                    placeholder=" "
                    value={formData.feedback}
                    onChange={(e) =>
                      setFormData({ ...formData, feedback: e.target.value })
                    }
                  />
                  <label
                    htmlFor="feedback"
                    className="absolute left-12 top-6 text-gray-400 pointer-events-none transition-all 
                      peer-placeholder-shown:text-base peer-placeholder-shown:font-normal
                      peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-purple-600"
                  >
                    Your Feedback
                  </label>
                  <FiSmile className="absolute left-4 top-6 text-gray-400 peer-focus:text-purple-500 transition-colors" />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl 
                  shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <FiCheckCircle className="text-lg" />
                Submit Feedback
              </motion.button>
            </form>

            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-600 text-sm mt-4"
                >
                  <FiCheckCircle className="text-xl" />
                  Thank you! Your feedback has been recorded.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackPage;
