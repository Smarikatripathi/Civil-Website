"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiChevronDown,
  FiRepeat,
  FiGrid,
  FiMap,
  FiDroplet,
  FiPackage,
} from "react-icons/fi";

const NepalUnitsConverter: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [convertedValue, setConvertedValue] = useState<string>("");
  const [category, setCategory] = useState<
    "length" | "area" | "volume" | "weight"
  >("area");
  const [fromUnit, setFromUnit] = useState("ropani");
  const [toUnit, setToUnit] = useState("square-meter");
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);

  const unitCategories = {
    length: {
      icon: <FiMap className="text-green-500" />,
      units: [
        { id: "haath", name: "Haath (हात)", symbol: "हात", factor: 0.4572 },
        { id: "kos", name: "Kos (कोस)", symbol: "कोस", factor: 3200 },
        { id: "angul", name: "Angul (अंगुल)", symbol: "अंगुल", factor: 0.0191 },
        { id: "meter", name: "Meters", symbol: "m", factor: 1 },
        { id: "kilometer", name: "Kilometers", symbol: "km", factor: 1000 },
      ],
    },
    area: {
      icon: <FiGrid className="text-blue-500" />,
      units: [
        {
          id: "ropani",
          name: "Ropani (रोपनी)",
          symbol: "रोपनी",
          factor: 508.74,
        },
        { id: "bigha", name: "Bigha (बिघा)", symbol: "बिघा", factor: 6773 },
        {
          id: "kattha",
          name: "Kattha (कठ्ठा)",
          symbol: "कठ्ठा",
          factor: 338.63,
        },
        { id: "dhur", name: "Dhur (धुर)", symbol: "धुर", factor: 16.93 },
        { id: "square-meter", name: "Square Meters", symbol: "m²", factor: 1 },
        { id: "hectare", name: "Hectares", symbol: "ha", factor: 10000 },
      ],
    },
    volume: {
      icon: <FiDroplet className="text-orange-500" />,
      units: [
        { id: "pathi", name: "Pathi (पाथी)", symbol: "पाथी", factor: 4.54 },
        { id: "muri", name: "Muri (मुरी)", symbol: "मुरी", factor: 363.2 },
        { id: "mana", name: "Mana (माना)", symbol: "माना", factor: 2.27 },
        { id: "liter", name: "Liters", symbol: "L", factor: 1 },
        { id: "cubic-meter", name: "Cubic Meters", symbol: "m³", factor: 1000 },
      ],
    },
    weight: {
      icon: <FiPackage className="text-purple-500" />,
      units: [
        {
          id: "dharni",
          name: "Dharni (धार्नी)",
          symbol: "धार्नी",
          factor: 2.5,
        },
        { id: "pau", name: "Pau (पौ)", symbol: "पौ", factor: 0.3125 },
        { id: "tola", name: "Tola (तोला)", symbol: "तोला", factor: 0.01166 },
        { id: "kilogram", name: "Kilograms", symbol: "kg", factor: 1 },
        { id: "gram", name: "Grams", symbol: "g", factor: 0.001 },
      ],
    },
  };

  const handleConvert = () => {
    const numericValue = parseFloat(inputValue) || 0;
    const fromFactor =
      unitCategories[category].units.find((u) => u.id === fromUnit)?.factor ||
      1;
    const toFactor =
      unitCategories[category].units.find((u) => u.id === toUnit)?.factor || 1;

    const result = (numericValue * fromFactor) / toFactor;
    setConvertedValue(`${result.toFixed(4)} ${getUnitSymbol(toUnit)}`);
  };

  // Keep identical utility functions as original area converter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConvert();
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const getUnitSymbol = (unit: string) => {
    const categoryUnits = Object.values(unitCategories).flatMap((c) => c.units);
    return categoryUnits.find((u) => u.id === unit)?.symbol || "";
  };

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
          {Object.entries(units).map(([cat, { icon, units }]) => (
            <div key={cat} className="border-b last:border-0">
              <div className="px-4 py-3 bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-600 sticky top-0">
                {icon}
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
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

          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 mb-8">
            Nepali Traditional Units Converter
          </h1>

          {/* Category Selector */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {Object.entries(unitCategories).map(([cat, { icon }]) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat as any)}
                className={`p-4 rounded-xl flex flex-col items-center transition-colors ${
                  category === cat
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {icon}
                <span className="mt-2 text-sm capitalize">{cat}</span>
              </motion.button>
            ))}
          </div>

          {/* Conversion Interface */}
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
                {/* From Unit Selector */}
                <div className="relative flex-1">
                  <button
                    onClick={() => setIsFromOpen(!isFromOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-white/90 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 outline-none hover:bg-gray-50 transition-colors text-black"
                  >
                    <span className="flex items-center gap-2">
                      {unitCategories[category].icon}
                      {getUnitSymbol(fromUnit)}
                    </span>
                    <FiChevronDown
                      className={`transform ${isFromOpen ? "rotate-180" : ""}`}
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

                {/* To Unit Selector */}
                <div className="relative flex-1">
                  <button
                    onClick={() => setIsToOpen(!isToOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-white/90 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 outline-none hover:bg-gray-50 transition-colors text-black"
                  >
                    <span className="flex items-center gap-2">
                      {unitCategories[category].icon}
                      {getUnitSymbol(toUnit)}
                    </span>
                    <FiChevronDown
                      className={`transform ${isToOpen ? "rotate-180" : ""}`}
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

            {/* Convert Button */}
            <motion.button
              onClick={handleConvert}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-6 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all text-xl"
            >
              CONVERT NOW
            </motion.button>

            {/* Result Display */}
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
                  {convertedValue || "0.0000"}
                </div>
                <p className="text-gray-500 mt-2">
                  {parseFloat(inputValue) || 0} {getUnitSymbol(fromUnit)} ={" "}
                  {convertedValue || "0.0000"}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Ad Space */}
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

export default NepalUnitsConverter;
