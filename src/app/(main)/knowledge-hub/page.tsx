"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  FiBookOpen,
  FiCode,
  FiTool,
  FiDatabase,
  FiArrowRight,
} from "react-icons/fi";

const KnowledgeHubPage = () => {
  const categories = [
    {
      title: "Structural Engineering",
      icon: <FiTool className="w-10 h-10" />,
      topics: ["Beam Design", "Foundation Types", "Seismic Analysis"],
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Construction Materials",
      icon: <FiDatabase className="w-10 h-10" />,
      topics: ["Concrete Grades", "Steel Specifications", "Soil Testing"],
      gradient: "from-emerald-500 to-cyan-500",
    },
    {
      title: "Project Management",
      icon: <FiBookOpen className="w-10 h-10" />,
      topics: ["CPM Techniques", "Cost Estimation", "Quality Control"],
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "Software Guides",
      icon: <FiCode className="w-10 h-10" />,
      topics: ["AutoCAD Tips", "STAAD Pro Tutorials", "Revit Basics"],
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Civil Engineering Knowledge Hub
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Your comprehensive repository for engineering expertise, featuring
            curated resources and interactive learning modules
          </p>
        </motion.header>

        {/* Category Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {categories.map((category) => (
            <motion.div
              key={category.title}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`bg-gradient-to-br ${category.gradient} p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300`}
            >
              <div className="mb-6 text-white/90">{category.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-5">
                {category.title}
              </h3>
              <ul className="space-y-3">
                {category.topics.map((topic) => (
                  <motion.li
                    key={topic}
                    whileHover={{ x: 5 }}
                    className="flex items-center group cursor-pointer"
                  >
                    <FiArrowRight className="text-white/80 mr-2 transition-transform group-hover:translate-x-1" />
                    <span className="text-white/90 hover:text-white transition-colors">
                      {topic}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Articles */}
        <section className="mb-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-12 text-gray-800"
          >
            Featured Insights
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                title: "Modern Bridge Design Principles",
                desc: "Innovative approaches in contemporary bridge engineering...",
                time: "8 min read",
                level: "Advanced",
              },
              {
                title: "Sustainable Construction Practices",
                desc: "Implementing eco-friendly solutions in modern construction...",
                time: "12 min read",
                level: "Intermediate",
              },
            ].map((article, idx) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="mb-4">
                  <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-5">
                    {article.desc}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{article.time}</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                      {article.level}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Learning Paths */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-12 text-gray-800"
          >
            Learning Journeys
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Foundational Civil Engineering",
              "Professional Certification",
              "Software Mastery",
            ].map((path, idx) => (
              <motion.div
                key={path}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="mb-6">
                  <div className="w-full h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-6" />
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {path}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Structured curriculum with real-world applications and
                    expert guidance
                  </p>
                  <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium group">
                    Explore Path
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default KnowledgeHubPage;
