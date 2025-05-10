"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiChevronDown,
  FiCalendar,
  FiClock,
  FiPlus,
  FiMinus,
  FiBriefcase,
  FiGlobe,
} from "react-icons/fi";

// Simplified Nepali date conversion (for demonstration)
const bsConverter = {
  adToBs: (date: Date) => {
    // Actual conversion logic would go here
    return "2080-05-15";
  },
  bsToAd: (bsDate: string) => {
    return new Date("2023-09-01");
  },
};

const DateTimeCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState("addSubtract");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [daysToAdd, setDaysToAdd] = useState(0);
  const [daysToSubtract, setDaysToSubtract] = useState(0);
  const [result, setResult] = useState("");
  const [bsDate, setBsDate] = useState("");
  const [adDate, setAdDate] = useState("");

  const calculateDateDifference = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diff / (1000 * 3600 * 24));

    const years = end.getFullYear() - start.getFullYear();
    const months = (end.getMonth() + 12 - start.getMonth()) % 12;

    setResult(`${years} years, ${months} months, ${days} days`);
  };

  const calculateWorkingDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;

    while (start <= end) {
      const day = start.getDay();
      if (day !== 0 && day !== 6) count++;
      start.setDate(start.getDate() + 1);
    }

    setResult(`${count} working days`);
  };

  const handleAddDays = () => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + daysToAdd);
    setResult(date.toDateString());
  };

  const handleSubtractDays = () => {
    const date = new Date(startDate);
    date.setDate(date.getDate() - daysToSubtract);
    setResult(date.toDateString());
  };

  const convertADtoBS = () => {
    setResult(bsConverter.adToBs(new Date(startDate)));
  };

  const convertBStoAD = () => {
    setResult(bsConverter.bsToAd(bsDate).toDateString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.7))] opacity-5" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8"
        >
          <div className="mb-8">
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium group"
            >
              <FiArrowLeft className="text-lg transition-transform group-hover:-translate-x-1" />
              Back to Calculators
            </Link>
          </div>

          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
            Advanced Date & Time Calculator
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-black">
            {[
              {
                id: "addSubtract",
                label: "Add/Subtract Days",
                icon: <FiPlus />,
              },
              { id: "difference", label: "Date Difference", icon: <FiMinus /> },
              {
                id: "workingDays",
                label: "Working Days",
                icon: <FiBriefcase />,
              },
              { id: "conversion", label: "AD/BS Convert", icon: <FiGlobe /> },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3 rounded-xl flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {tab.icon}
                <span className="text-sm">{tab.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="space-y-8">
            {activeTab === "addSubtract" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl bg-white/90"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={daysToAdd}
                      onChange={(e) => setDaysToAdd(Number(e.target.value))}
                      className="flex-1 px-4 py-2 rounded-lg border"
                      placeholder="Add days"
                    />
                    <button
                      onClick={handleAddDays}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={daysToSubtract}
                      onChange={(e) =>
                        setDaysToSubtract(Number(e.target.value))
                      }
                      className="flex-1 px-4 py-2 rounded-lg border"
                      placeholder="Subtract days"
                    />
                    <button
                      onClick={handleSubtractDays}
                      className="px-6 py-2 bg-purple-500 text-white rounded-lg"
                    >
                      Subtract
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "difference" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-white/90"
                    />
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-white/90"
                    />
                  </div>
                  <button
                    onClick={calculateDateDifference}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl"
                  >
                    Calculate Difference
                  </button>
                </div>
              </div>
            )}

            {activeTab === "workingDays" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-white/90"
                    />
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-white/90"
                    />
                  </div>
                  <button
                    onClick={calculateWorkingDays}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl"
                  >
                    Calculate Working Days
                  </button>
                </div>
              </div>
            )}

            {activeTab === "conversion" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
                    <input
                      type="date"
                      value={adDate}
                      onChange={(e) => setAdDate(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-white/90"
                      placeholder="AD Date"
                    />
                  </div>
                  <button
                    onClick={convertADtoBS}
                    className="w-full py-3 bg-blue-500 text-white rounded-xl"
                  >
                    Convert to BS
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
                    <input
                      type="text"
                      value={bsDate}
                      onChange={(e) => setBsDate(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-white/90"
                      placeholder="BS Date (YYYY-MM-DD)"
                    />
                  </div>
                  <button
                    onClick={convertBStoAD}
                    className="w-full py-3 bg-purple-500 text-white rounded-xl"
                  >
                    Convert to AD
                  </button>
                </div>
              </div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100"
              >
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">
                    Result
                  </h3>
                  <div className="text-3xl font-bold text-gray-900">
                    {result}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-blue-100/50 to-purple-100/50 border-2 border-dashed border-blue-200 text-center">
            <span className="text-sm text-gray-500 italic">
              Premium Date Tools - Ad Placement Available
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DateTimeCalculator;
