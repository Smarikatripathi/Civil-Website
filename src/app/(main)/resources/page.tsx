"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  FiDownload,
  FiFileText,
  FiSearch,
  FiFolder,
  FiCalendar,
  FiArrowRight,
} from "react-icons/fi";

interface Resource {
  id: string;
  title: string;
  category: string;
  date: string;
  fileUrl: string;
  size: string;
  downloads: number;
}

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Mock data
  const resources: Resource[] = [
    {
      id: "1",
      title: "2024 District Rate Schedule",
      category: "District Rates",
      date: "15 Mar 2024",
      fileUrl: "#",
      size: "2.4 MB",
      downloads: 142,
    },
    // ... other resources
  ];

  const filteredResources = resources.filter(
    (resource) =>
      (resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (activeCategory === "All" || resource.category === activeCategory)
  );

  const categories = [
    { name: "All", count: resources.length },
    // ... other categories
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Engineering Resources
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Instant access to critical documents, regulatory updates, and
            official communications
          </p>
        </motion.header>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12 max-w-3xl mx-auto"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
            <FiSearch className="absolute left-5 top-5 text-gray-400 h-6 w-6" />
            <input
              type="text"
              placeholder="Search documents, notices, regulations..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-2"
          >
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="font-semibold mb-5 text-gray-900 flex items-center text-lg">
                <FiFolder className="mr-3 text-blue-600 w-6 h-6" />
                Categories
              </h3>
              <motion.ul className="space-y-2">
                {categories.map((category) => (
                  <motion.li
                    key={category.name}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      setActiveCategory(
                        category.name === "All" ? "" : category.name
                      )
                    }
                    className={`flex justify-between items-center px-4 py-3.5 rounded-xl cursor-pointer transition-all ${
                      activeCategory === category.name ||
                      (category.name === "All" && !activeCategory)
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-sm ${
                        activeCategory === category.name
                          ? "bg-white/20 text-white/90"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {category.count}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>

          {/* Resource Grid */}
          <div className="lg:col-span-3">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-5"
            >
              {filteredResources.map((resource) => (
                <motion.div
                  key={resource.id}
                  variants={cardVariants}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                >
                  <div className="flex items-start gap-5">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-xl border border-blue-50">
                      <FiFileText className="w-8 h-8 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                          {resource.category}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <FiCalendar className="mr-2 w-4 h-4" />
                          {resource.date}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {resource.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{resource.size}</span>
                        <span>•</span>
                        <span>
                          {resource.downloads.toLocaleString()} downloads
                        </span>
                      </div>
                    </div>

                    <motion.a
                      href={resource.fileUrl}
                      download
                      whileHover={{ scale: 1.1 }}
                      className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all"
                    >
                      <FiDownload className="w-6 h-6 text-blue-600" />
                    </motion.a>
                  </div>
                </motion.div>
              ))}

              {filteredResources.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="mx-auto mb-8 text-gray-400">
                    <FiSearch className="h-20 w-20 mx-auto opacity-75" />
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900 mb-3">
                    No documents found
                  </h4>
                  <p className="text-gray-600 max-w-md mx-auto text-lg">
                    Try adjusting your search terms or select a different
                    category
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
