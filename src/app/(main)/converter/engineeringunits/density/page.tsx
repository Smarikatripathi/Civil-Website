"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiChevronDown,
  FiRepeat,
  FiActivity,
  FiDroplet,
  FiSliders,
  FiGrid,
} from "react-icons/fi";

const DensityConverter: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [convertedValue, setConvertedValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState("kgm3");
  const [toUnit, setToUnit] = useState("gcm3");
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("common");

  const unitCategories = {
    common: {
      icon: <FiActivity className="text-blue-500" />,
      units: [
        { id: "kgm3", name: "kg/m³", symbol: "kg/m³" },
        { id: "gcm3", name: "g/cm³", symbol: "g/cm³" },
        { id: "lbft3", name: "lb/ft³", symbol: "lb/ft³" },
        { id: "lbin3", name: "lb/in³", symbol: "lb/in³" },
      ],
    },
    scientific: {
      icon: <FiSliders className="text-purple-500" />,
      units: [
        { id: "specific-gravity", name: "Specific Gravity", symbol: "SG" },
        { id: "kgl", name: "kg/L", symbol: "kg/L" },
        { id: "tonnem3", name: "tonne/m³", symbol: "t/m³" },
      ],
    },
    other: {
      icon: <FiDroplet className="text-green-500" />,
      units: [
        { id: "lbgal", name: "lb/gal", symbol: "lb/gal" },
        { id: "ozgal", name: "oz/gal", symbol: "oz/gal" },
        { id: "gml", name: "g/mL", symbol: "g/mL" },
      ],
    },
  };

  // Base unit: kg/m³
  const conversionFactors: { [key: string]: number } = {
    // Common
    kgm3: 1,
    gcm3: 1000,
    lbft3: 16.0185,
    lbin3: 27679.9,

    // Scientific
    "specific-gravity": 1000,
    kgl: 1000,
    tonnem3: 1000,

    // Other
    lbgal: 119.826,
    ozgal: 7.48915,
    gml: 1000,
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
    setConvertedValue(`${result.toFixed(4)} ${getUnitSymbol(toUnit)}`);
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
    { from: "kgm3", to: "gcm3" },
    { from: "lbft3", to: "kgm3" },
    { from: "specific-gravity", to: "kgm3" },
    { from: "lbgal", to: "kgm3" },
    { from: "gml", to: "kgm3" },
    { from: "lbin3", to: "gcm3" },
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

          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
            Smart Density Converter
          </h1>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
              <FiGrid className="text-blue-500" />
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
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
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
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
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
                    className="w-full flex items-center justify-between px-15 py-4 bg-white/90 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 outline-none hover:bg-gray-50 transition-colors text-black"
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
                    className="w-full flex items-center justify-between px-15 py-4 bg-white/90 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 outline-none hover:bg-gray-50 transition-colors text-black"
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
              className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all text-xl"
            >
              CONVERT NOW
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100"
            >
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  Conversion Result
                </h3>
                <div className="text-4xl font-bold text-gray-900">
                  {convertedValue || "0.0000"}
                </div>
                <p className="text-gray-500 mt-2">
                  {parseFloat(inputValue) || 0} {getUnitSymbol(fromUnit)} ={" "}
                  {convertedValue || "0.0000"}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-blue-100/50 to-purple-100/50 border-2 border-dashed border-blue-200 text-center">
            <span className="text-sm text-gray-500 italic">
              Premium Conversion Tools - Ad Placement Available
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DensityConverter;
