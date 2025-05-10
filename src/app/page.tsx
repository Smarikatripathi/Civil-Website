"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  LazyMotion,
  domAnimation,
} from "framer-motion";
import ClientNavbar from "@/components/ClientNavbar";
import AuthModal from "../components/auth/AuthModal";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");

  const openAuthModal = (mode: "signin" | "signup" | "register") => {
    setAuthMode(mode === "register" ? "signup" : mode);
    setShowAuthModal(true);
  };

  const getStartedButton = (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => openAuthModal("register")}
      className="inline-flex w-full items-center justify-center px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.45)]"
    >
      Get started for free
      <svg
        className="ml-2 -mr-1 w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </motion.button>
  );

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        <div className="bg-white overflow-hidden">
          <ClientNavbar />

          {/* Hero Section */}
          <div className="relative isolate">
            {/* Background decorative elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_0%,#e4f2ff,transparent)]" />
              <div
                aria-hidden="true"
                className="absolute inset-y-0 inset-x-0 h-full w-full overflow-hidden opacity-[0.05]"
              >
                <div className="absolute h-[40rem] w-[150rem] rotate-[-12deg] translate-y-[-25%]">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="h-px w-full bg-gradient-to-r from-blue-500/0 via-blue-500/70 to-blue-500/0"
                      style={{
                        marginTop: `${i * 4}rem`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 lg:py-40"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  variants={fadeInLeft}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="max-w-2xl"
                >
                  <div className="mb-8">
                    <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      New Features Available
                    </span>
                  </div>
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800"
                  >
                    Engineering calculations{" "}
                    <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                      made simple
                    </span>
                  </motion.h1>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    Advanced tools for structural analysis, quantity estimation,
                    and construction management - all in one place.
                  </p>
                  <div className="flex items-center gap-4 mb-8 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Certified
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      99.9% Accuracy
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.div className="flex-1">
                      {getStartedButton}
                    </motion.div>
                    <Link
                      href="/calculator"
                      className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-base font-medium rounded-lg text-gray-900 bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      View features
                    </Link>
                  </div>
                </motion.div>
                <div className="grid grid-cols-2 gap-8 mt-8 lg:mt-0">
                  {[
                    { number: "10K+", label: "Engineers Trust Us" },
                    { number: "99%", label: "Calculation Accuracy" },
                    { number: "24/7", label: "Expert Support" },
                    { number: "50+", label: "Engineering Tools" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 * (index + 1) }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                      }}
                      className="bg-gradient-to-br from-white via-white to-blue-50/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60 hover:border-blue-200 hover:bg-gradient-to-br hover:from-white hover:via-blue-50/20 hover:to-blue-100/20 transition-all duration-300"
                    >
                      <dt className="text-4xl font-bold text-blue-600 mb-2">
                        {stat.number}
                      </dt>
                      <dd className="text-sm text-gray-600">{stat.label}</dd>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto mt-8 max-w-7xl px-6 sm:mt-16 lg:px-8"
          >
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">
                Faster Calculations
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need for civil engineering calculations
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {[
                  {
                    name: "Structural Analysis",
                    description:
                      "Beam analysis, column design, and foundation calculations with detailed reports.",
                  },
                  {
                    name: "Quantity Estimation",
                    description:
                      "Accurate material quantity calculations and cost estimation tools.",
                  },
                  {
                    name: "Construction Planning",
                    description:
                      "Project scheduling and resource allocation calculators.",
                  },
                  {
                    name: "Unit Conversion",
                    description:
                      "Quick and accurate conversion between different engineering units.",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 * index }}
                    whileHover={{ scale: 1.02 }}
                    className="relative pl-16 p-6 rounded-xl bg-gradient-to-br from-white via-white to-transparent hover:from-blue-50/50 hover:via-blue-50/20 hover:to-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <dt className="text-base font-semibold leading-7 text-gray-900">
                      {feature.name}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">
                      {feature.description}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </motion.div>

          {/* Testimonials Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-7xl px-6 py-24 bg-gradient-to-b from-gray-50"
          >
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
              What Our Users Say
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Join thousands of satisfied engineers who trust our platform
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  rating: "5.0",
                  review:
                    "This platform has revolutionized our calculation workflow. The accuracy and speed are remarkable.",
                  name: "Senior Engineer",
                  role: "Structural Division",
                  initials: "SE",
                  color: "bg-blue-600",
                },
                {
                  rating: "5.0",
                  review:
                    "The most comprehensive suite of engineering tools I've encountered. Saves hours of manual calculations.",
                  name: "Project Manager",
                  role: "Construction Group",
                  initials: "PM",
                  color: "bg-green-600",
                },
                {
                  rating: "5.0",
                  review:
                    "Incredibly reliable and user-friendly. The integrated tools have become essential to our daily operations.",
                  name: "Civil Engineer",
                  role: "Design Team",
                  initials: "CE",
                  color: "bg-purple-600",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
                  }}
                  className="bg-gradient-to-br from-white via-white to-blue-50/20 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/60 hover:border-blue-200 hover:bg-gradient-to-br hover:from-white hover:via-blue-50/30 hover:to-blue-100/20 transition-all duration-300"
                >
                  <div className="flex items-center text-yellow-400 mb-4 text-lg">
                    ★★★★★
                    <span className="text-gray-400 text-sm ml-2">
                      {testimonial.rating}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    {testimonial.review}
                  </p>
                  <div className="flex items-center">
                    <div
                      className={`h-10 w-10 rounded-full ${testimonial.color} flex items-center justify-center text-white font-semibold`}
                    >
                      {testimonial.initials}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24 text-center bg-gradient-to-br from-blue-50/80 via-blue-50/50 to-white/90 backdrop-blur-sm p-12 rounded-2xl shadow-lg border border-white/60"
            >
              <h3 className="text-3xl font-bold mb-6 text-gray-800">
                Ready to Transform Your Engineering Workflow?
              </h3>
              <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                Join the community of engineers who are already working smarter,
                not harder.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openAuthModal("register")}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.45)]"
                >
                  Start Free Trial
                  <span className="ml-2">→</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </AnimatePresence>
    </LazyMotion>
  );
}
