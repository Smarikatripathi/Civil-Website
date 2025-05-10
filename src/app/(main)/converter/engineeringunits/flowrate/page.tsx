"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiChevronDown,
  FiRepeat,
  FiDroplet,
  FiWind,
  FiZap,
} from "react-icons/fi";

const FlowRateConverter: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [convertedValue, setConvertedValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState("liter-second");
  const [toUnit, setToUnit] = useState("cubic-meter-hour");
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("volumetric");

  const unitCategories = {
    volumetric: {
      icon: <FiDroplet className="text-blue-500" />,
      units: [
        { id: "liter-second", name: "Liters/Second", symbol: "L/s" },
        { id: "cubic-meter-hour", name: "m³/Hour", symbol: "m³/h" },
        { id: "gallon-minute", name: "Gallons/Minute", symbol: "GPM" },
        { id: "cubic-foot-second", name: "ft³/Second", symbol: "ft³/s" },
        { id: "barrel-day", name: "Barrels/Day", symbol: "bbl/d" },
        { id: "liter-minute", name: "Liters/Minute", symbol: "L/min" },
      ],
    },
    mass: {
      icon: <FiWind className="text-green-500" />,
      units: [
        { id: "kilogram-second", name: "kg/Second", symbol: "kg/s" },
        { id: "ton-hour", name: "Tons/Hour", symbol: "t/h" },
        { id: "pound-hour", name: "Pounds/Hour", symbol: "lb/h" },
        { id: "gram-minute", name: "Grams/Minute", symbol: "g/min" },
        { id: "kilogram-minute", name: "kg/Minute", symbol: "kg/min" },
        { id: "metric-ton-day", name: "Tonnes/Day", symbol: "t/d" },
      ],
    },
  };

  const conversionFactors: { [key: string]: number } = {
    // Volumetric flow rates (base: m³/s)
    "liter-second": 0.001,
    "cubic-meter-hour": 0.000277778,
    "gallon-minute": 0.0000630902,
    "cubic-foot-second": 0.0283168,
    "barrel-day": 1.84013e-6,
    "liter-minute": 0.0000166667,

    // Mass flow rates (base: kg/s)
    "kilogram-second": 1,
    "ton-hour": 0.277778,
    "pound-hour": 0.000125998,
    "gram-minute": 0.0000166667,
    "kilogram-minute": 0.0166667,
    "metric-ton-day": 0.0115741,
  };

  const handleConvert = () => {
    const numericValue = parseFloat(inputValue) || 0;
    const fromFactor = conversionFactors[fromUnit];
    const toFactor = conversionFactors[toUnit];

    if (!fromFactor || !toFactor) {
      setConvertedValue("Invalid units");
      return;
    }

    const result = (numericValue * fromFactor) / toFactor;
    setConvertedValue(`${result.toFixed(6)} ${getUnitSymbol(toUnit)}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConvert();
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const getUnitSymbol = (unit: string) => {
    const category = Object.values(unitCategories).find((cat) =>
      cat.units.some((u) => u.id === unit)
    );
    return category?.units.find((u) => u.id === unit)?.symbol || "";
  };

  const popularConversions = [
    { from: "liter-second", to: "cubic-meter-hour" },
    { from: "gallon-minute", to: "liter-minute" },
    { from: "kilogram-second", to: "ton-hour" },
    { from: "cubic-foot-second", to: "liter-second" },
    { from: "pound-hour", to: "kilogram-minute" },
    { from: "barrel-day", to: "cubic-meter-hour" },
  ];

  const UnitDropdown = ({
    isOpen,
    units,
    onSelect,
    selectedUnit,
  }: {
    isOpen: boolean;
    units: typeof unitCategories;
    onSelect: (unit: string) => void;
    selectedUnit: string;
  }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute w-full mt-2 bg-white rounded-xl shadow-lg z-10 max-h-96 overflow-y-auto"
        >
          {Object.entries(units).map(([category, { icon, units }]) => (
            <div key={category} className="border-b last:border-0">
              <div className="px-4 py-3 bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-600 sticky top-0">
                {icon}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
              {units.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => onSelect(unit.id)}
                  className={`w-full px-6 py-4 text-left hover:bg-blue-50 flex items-center gap-3 ${
                    selectedUnit === unit.id ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  <span className="font-medium">{unit.symbol}</span>
                  <span className="text-gray-600">{unit.name}</span>
                </button>
              ))}
            </div>
          ))}
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

          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 mb-8">
            Flow Rate Converter
          </h1>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
              <FiZap className="text-blue-500" />
              Popular Conversions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {popularConversions.map(({ from, to }) => {
                const fromSymbol = getUnitSymbol(from);
                const toSymbol = getUnitSymbol(to);
                return (
                  <motion.button
                    key={`${from}-${to}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFromUnit(from);
                      setToUnit(to);
                    }}
                    className={`p-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      fromUnit === from && toUnit === to
                        ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <span>
                      {fromSymbol} → {toSymbol}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-1 rounded-2xl">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full px-6 py-4 rounded-xl border-0 bg-white/90 focus:ring-2 focus:ring-blue-500 outline-none text-black placeholder:text-gray-400"
                    placeholder="Enter value..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <button
                    onClick={() => setIsFromOpen(!isFromOpen)}
                    className="w-full flex items-center justify-between px-20 py-4 bg-white/90 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 outline-none hover:bg-gray-50 transition-colors text-black"
                  >
                    <span className="flex items-center gap-2">
                      {
                        unitCategories[
                          activeCategory as keyof typeof unitCategories
                        ].icon
                      }
                      {getUnitSymbol(fromUnit)}
                    </span>
                    <FiChevronDown
                      className={`transform transition-transform ${
                        isFromOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <UnitDropdown
                    isOpen={isFromOpen}
                    units={unitCategories}
                    onSelect={(unit) => {
                      setFromUnit(unit);
                      setIsFromOpen(false);
                    }}
                    selectedUnit={fromUnit}
                  />
                </div>

                <motion.button
                  onClick={swapUnits}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200"
                >
                  <FiRepeat className="text-xl text-gray-600" />
                </motion.button>

                <div className="relative flex-1">
                  <button
                    onClick={() => setIsToOpen(!isToOpen)}
                    className="w-full flex items-center justify-between px-20 py-4 bg-white/90 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 outline-none hover:bg-gray-50 transition-colors text-black"
                  >
                    <span className="flex items-center gap-2">
                      {
                        unitCategories[
                          activeCategory as keyof typeof unitCategories
                        ].icon
                      }
                      {getUnitSymbol(toUnit)}
                    </span>
                    <FiChevronDown
                      className={`transform transition-transform ${
                        isToOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <UnitDropdown
                    isOpen={isToOpen}
                    units={unitCategories}
                    onSelect={(unit) => {
                      setToUnit(unit);
                      setIsToOpen(false);
                    }}
                    selectedUnit={toUnit}
                  />
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleConvert}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-6 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all text-xl"
            >
              CONVERT NOW
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-2xl border border-blue-100"
            >
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  Conversion Result
                </h3>
                <div className="text-4xl font-bold text-gray-900">
                  {convertedValue || "0.000000"}
                </div>
                <p className="text-gray-500 mt-2">
                  {parseFloat(inputValue) || 0} {getUnitSymbol(fromUnit)} ={" "}
                  {convertedValue || "0.000000"}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-blue-100/50 to-green-100/50 border-2 border-dashed border-blue-200 text-center">
            <span className="text-sm text-gray-500 italic">
              Premium Conversion Tools - Ad Placement Available
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FlowRateConverter;
