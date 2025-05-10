"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiArrowRight,
  FiStar,
  FiGrid,
  FiSliders,
} from "react-icons/fi";

const MaterialEstimationPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: "all", name: "All Tools" },
    { id: "estimation", name: "Material Estimation" },
    { id: "structural", name: "Structural Analysis" },
    { id: "materials", name: "Material Science" },
    { id: "project", name: "Project Planning" },
  ];

  const tools = [
    {
      id: "concrete",
      title: "Concrete Calculator",
      category: "estimation",
      description: "Precise cement, sand, and aggregate calculations",
      icon: <FiGrid className="w-6 h-6" />,
      gradient: "from-blue-600 to-cyan-500",
      path: "/calculator/materialestimation/concretemix",
      features: [
        "Mix ratios",
        "3D visualization",
        "Cost analysis",
        "Volume optimization",
      ],
    },
    {
      id: "steel",
      title: "Steel Estimator",
      category: "estimation",
      description: "Reinforcement calculations & bar bending schedules",
      icon: <FiSliders className="w-6 h-6" />,
      gradient: "from-purple-600 to-indigo-600",
      path: "/steel",
      features: [
        "BBS generation",
        "Weight calculations",
        "Lapping details",
        "Wastage analysis",
      ],
    },
    {
      id: "paint",
      title: "Paint Calculator",
      category: "estimation",
      description: "Surface area calculations with wastage factors",
      icon: <FiGrid className="w-6 h-6" />,
      gradient: "from-green-600 to-teal-600",
      path: "/paint",
      features: [
        "Multi-coat estimation",
        "Primer calculation",
        "Surface textures",
        "Brand comparisons",
      ],
    },
    {
      id: "foundation",
      title: "Foundation Design",
      category: "structural",
      description: "Structural foundation calculations and analysis",
      icon: <FiSliders className="w-6 h-6" />,
      gradient: "from-amber-600 to-yellow-500",
      path: "/foundation",
      features: [
        "Load capacity",
        "Soil analysis",
        "Reinforcement",
        "Safety factors",
      ],
    },
    {
      id: "beam",
      title: "Beam Calculator",
      category: "structural",
      description: "Structural beam analysis and design",
      icon: <FiGrid className="w-6 h-6" />,
      gradient: "from-red-600 to-pink-600",
      path: "/beam",
      features: [
        "Load distribution",
        "Deflection",
        "Reinforcement",
        "Shear strength",
      ],
    },
  ];

  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return tools.filter((tool) => {
      const matchesSearch =
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.features.some((ft) => ft.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const toolVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    hover: { y: -5, scale: 1.02 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.7))] opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 leading-tight">
            Smart Construction Suite
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto font-medium"
          >
            Professional-grade calculation tools powered by civil engineering
            expertise
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative max-w-2xl mx-auto mt-8"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/90 backdrop-blur-sm pl-14 pr-6 text-gray-600"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>
          </motion.div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex flex-wrap gap-2 mb-12 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Tools Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + searchQuery}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={categoryVariants}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.id}
                variants={toolVariants}
                whileHover="hover"
                className="group relative"
              >
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${tool.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300`}
                />

                <div className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${tool.gradient} text-white`}
                    >
                      {tool.icon}
                    </div>
                    <button
                      onClick={() => toggleFavorite(tool.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <FiStar
                        className={`w-5 h-5 ${
                          favorites.includes(tool.id)
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{tool.description}</p>

                  <motion.div
                    className="border-t border-gray-100 pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ul className="space-y-2">
                      {tool.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-center text-sm text-gray-600"
                          initial={{ x: -10 }}
                          animate={{ x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <FiArrowRight className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <Link
                    href={tool.path}
                    className="mt-4 inline-block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Open Tool
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-500 text-lg mb-4">
              No tools found matching your criteria
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-1 rounded-2xl inline-block">
            <div className="bg-white/90 px-8 py-6 rounded-xl backdrop-blur-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Unlock Professional Features
              </h2>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                Get AI-powered insights, advanced reporting, and priority
                support with Pro
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Upgrade to Pro
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MaterialEstimationPage;
