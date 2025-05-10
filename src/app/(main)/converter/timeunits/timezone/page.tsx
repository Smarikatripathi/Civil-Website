"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiChevronDown,
  FiRepeat,
  FiGlobe,
  FiWatch,
  FiGrid,
} from "react-icons/fi";
import { format } from "date-fns-tz";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

const TimezoneConverter: React.FC = () => {
  const [dateTime, setDateTime] = useState<string>("");
  const [fromZone, setFromZone] = useState("UTC");
  const [toZone, setToZone] = useState("Asia/Kathmandu");
  const [convertedTime, setConvertedTime] = useState<string>("");
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);

  const timeZones = {
    popular: [
      { id: "UTC", name: "Coordinated Universal Time" },
      { id: "Asia/Kathmandu", name: "Nepal Time (UTC+05:45)" },
      { id: "America/New_York", name: "Eastern Time (UTC-05:00)" },
      { id: "Europe/London", name: "British Time (UTC+00:00)" },
      { id: "Asia/Tokyo", name: "Japan Time (UTC+09:00)" },
      { id: "Australia/Sydney", name: "Sydney Time (UTC+10:00)" },
    ],
    all: [
      { id: "Pacific/Honolulu", name: "Hawaii Time (UTC-10:00)" },
      { id: "Europe/Paris", name: "Central European Time (UTC+01:00)" },
      { id: "Asia/Dubai", name: "Dubai Time (UTC+04:00)" },
      { id: "Asia/Kolkata", name: "India Time (UTC+05:30)" },
    ],
  };

  const handleConvert = () => {
    try {
      if (!dateTime) {
        setConvertedTime("Please select a date and time");
        return;
      }

      const utcDate = fromZonedTime(dateTime, fromZone);
      const zonedDate = toZonedTime(utcDate, toZone);
      const pattern = "yyyy-MM-dd HH:mm:ss (OOOO)";
      const output = format(zonedDate, pattern, {
        timeZone: toZone,
      } as { timeZone?: string });

      setConvertedTime(output);
    } catch (error) {
      setConvertedTime("Invalid date/time format");
    }
  };

  const TimezoneDropdown = ({
    isOpen,
    zones,
    onSelect,
  }: {
    isOpen: boolean;
    zones: typeof timeZones.popular;
    onSelect: (zone: string) => void;
  }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute w-full mt-2 bg-white rounded-xl shadow-lg z-10 max-h-96 overflow-y-auto"
        >
          <div className="border-b last:border-0">
            <div className="px-4 py-3 bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-600 sticky top-0">
              <FiGlobe className="text-blue-500" />
              Popular Time Zones
            </div>
            {timeZones.popular.map((zone) => (
              <button
                key={zone.id}
                onClick={() => onSelect(zone.id)}
                className={`w-full px-6 py-4 text-left hover:bg-blue-50 flex flex-col ${
                  fromZone === zone.id || toZone === zone.id
                    ? "bg-blue-50 text-blue-600"
                    : ""
                }`}
              >
                <span className="font-medium">{zone.id.split("/")[1]}</span>
                <span className="text-sm text-gray-600">{zone.name}</span>
              </button>
            ))}
          </div>
          <div className="border-t">
            <div className="px-4 py-3 bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-600 sticky top-0">
              <FiGlobe className="text-green-500" />
              All Time Zones
            </div>
            {timeZones.all.map((zone) => (
              <button
                key={zone.id}
                onClick={() => onSelect(zone.id)}
                className={`w-full px-6 py-4 text-left hover:bg-blue-50 flex flex-col ${
                  fromZone === zone.id || toZone === zone.id
                    ? "bg-blue-50 text-blue-600"
                    : ""
                }`}
              >
                <span className="font-medium">{zone.id.split("/")[1]}</span>
                <span className="text-sm text-gray-600">{zone.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

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
              href="/converter"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium group"
            >
              <FiArrowLeft className="text-lg transition-transform group-hover:-translate-x-1" />
              Back to Converters
            </Link>
          </div>

          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
            Time Zone Converter
          </h1>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
              <FiGrid className="text-blue-500" />
              Popular Conversions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { from: "Asia/Kathmandu", to: "UTC" },
                { from: "America/New_York", to: "Europe/London" },
                { from: "Asia/Tokyo", to: "Australia/Sydney" },
              ].map(({ from, to }) => (
                <motion.button
                  key={`${from}-${to}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFromZone(from);
                    setToZone(to);
                  }}
                  className={`p-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    fromZone === from && toZone === to
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <span>
                    {from.split("/")[1]} → {to.split("/")[1]}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl border-0 bg-white/90 focus:ring-2 focus:ring-blue-500 outline-none text-black"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <button
                    onClick={() => setIsFromOpen(!isFromOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-white/90 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 outline-none hover:bg-gray-50 transition-colors text-black"
                  >
                    <span className="flex items-center gap-2">
                      <FiGlobe className="text-blue-500" />
                      {fromZone.split("/")[1]}
                    </span>
                    <FiChevronDown
                      className={`transform transition-transform ${
                        isFromOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <TimezoneDropdown
                    isOpen={isFromOpen}
                    zones={timeZones.popular}
                    onSelect={(zone) => {
                      setFromZone(zone);
                      setIsFromOpen(false);
                    }}
                  />
                </div>

                <motion.button
                  onClick={() => {
                    const temp = fromZone;
                    setFromZone(toZone);
                    setToZone(temp);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200"
                >
                  <FiRepeat className="text-xl text-gray-600" />
                </motion.button>

                <div className="relative flex-1">
                  <button
                    onClick={() => setIsToOpen(!isToOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-white/90 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 outline-none hover:bg-gray-50 transition-colors text-black"
                  >
                    <span className="flex items-center gap-2">
                      <FiWatch className="text-green-500" />
                      {toZone.split("/")[1]}
                    </span>
                    <FiChevronDown
                      className={`transform transition-transform ${
                        isToOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <TimezoneDropdown
                    isOpen={isToOpen}
                    zones={timeZones.popular}
                    onSelect={(zone) => {
                      setToZone(zone);
                      setIsToOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleConvert}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all text-xl"
            >
              CONVERT TIME
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100"
            >
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  Converted Time
                </h3>
                <div className="text-4xl font-bold text-gray-900">
                  {convertedTime || "Select date/time and zones"}
                </div>
                {convertedTime && (
                  <p className="text-gray-500 mt-2">
                    Original:{" "}
                    {format(new Date(dateTime), "yyyy-MM-dd HH:mm:ss")} (
                    {fromZone})
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-blue-100/50 to-purple-100/50 border-2 border-dashed border-blue-200 text-center">
            <span className="text-sm text-gray-500 italic">
              Premium Time Tools - Ad Placement Available
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TimezoneConverter;
