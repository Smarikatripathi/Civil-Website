"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiClock,
  FiTrendingUp,
  FiX,
  FiArrowRight,
  FiHash,
} from "react-icons/fi";
import type { SearchBarProps } from "./types";

const searchVariants = {
  container: {
    expanded: { width: "400px" },
    collapsed: { width: "40px" },
  },
};

const categories = [
  { id: "all", icon: <FiHash />, label: "All" },
  { id: "structural", icon: "🏗️", label: "Structural" },
  { id: "geotechnical", icon: "⛰️", label: "Geotechnical" },
  { id: "transportation", icon: "🛣️", label: "Transportation" },
];

const recentSearches = [
  { id: "1", text: "Beam Calculator", category: "structural" },
  { id: "2", text: "Column Design", category: "structural" },
  { id: "3", text: "Slab Analysis", category: "structural" },
];

const trendingSearches = [
  {
    id: "1",
    title: "RCC Beam Design",
    category: "Structural",
    views: "2.5k",
    description: "Calculate beam reinforcement and check deflection",
  },
  {
    id: "2",
    title: "Foundation Calculator",
    category: "Geotechnical",
    views: "1.8k",
    description: "Design isolated and strip foundations",
  },
  {
    id: "3",
    title: "Steel Section Design",
    category: "Steel",
    views: "1.2k",
    description: "Design and check steel members",
  },
];

export default function SearchBar({ className = "" }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeCategory, setActiveCategory] = useState("all");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const maxIndex = trendingSearches.length - 1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          handleItemSelect(trendingSearches[selectedIndex]);
        }
        break;
      case "Escape":
        setIsExpanded(false);
        break;
    }
  };

  const handleItemSelect = (item: any) => {
    setSearchQuery(item.title || item.text);
    setIsExpanded(false);
    // Add navigation logic here
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <motion.div
        initial={false}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={searchVariants.container}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div
          className={`flex items-center h-11 rounded-full transition-all duration-300 ${
            isExpanded
              ? "bg-white shadow-lg border border-gray-200/50"
              : "bg-gray-50/80 hover:bg-gray-100/80"
          }`}
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center w-full px-3.5">
            <FiSearch
              className={`w-[18px] h-[18px] ${
                isExpanded ? "text-gray-400" : "text-gray-500"
              }`}
            />
            {isExpanded && (
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search calculations, converters..."
                className="w-full bg-transparent outline-none text-[15px] text-gray-700 placeholder:text-gray-400 ml-3"
                autoFocus
              />
            )}
          </div>
          {isExpanded && searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-2 mr-1 hover:bg-gray-100 rounded-full"
            >
              <FiX className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
            >
              {/* Categories */}
              <div className="flex items-center gap-1 p-2 border-b border-gray-100">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-sm flex items-center space-x-1.5 transition-all
                      ${
                        activeCategory === cat.id
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-50 text-gray-600"
                      }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {!searchQuery ? (
                <>
                  {/* Recent Searches */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <div className="flex items-center">
                        <FiClock className="mr-1.5" />
                        <span>Recent Searches</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700">
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleItemSelect(item)}
                          className="w-full text-left px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between group"
                        >
                          <span>{item.text}</span>
                          <FiArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trending Searches */}
                  <div className="p-3">
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <FiTrendingUp className="mr-1.5" />
                      <span>Popular Calculations</span>
                    </div>
                    <div className="space-y-1">
                      {trendingSearches.map((item, index) => (
                        <button
                          key={item.id}
                          onClick={() => handleItemSelect(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full text-left p-3 rounded-md transition-all ${
                            selectedIndex === index
                              ? "bg-blue-50/50 ring-1 ring-blue-100"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-700">
                                {item.title}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {item.description}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                  {item.category}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {item.views} views
                                </span>
                              </div>
                            </div>
                            <FiArrowRight
                              className={`w-4 h-4 ml-3 transition-all ${
                                selectedIndex === index
                                  ? "text-blue-500"
                                  : "text-gray-400 opacity-0 group-hover:opacity-100"
                              }`}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-2">
                  {/* Add filtered search results here */}
                  <div className="text-sm text-gray-500 px-3 py-2">
                    Searching for "{searchQuery}"...
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
