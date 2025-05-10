"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Converter {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  gradient: string;
  path: string;
  type: string;
  features: string[];
  usageCount: number;
  lastUsed?: Date;
}

interface CategoryData {
  title: string;
  description: string;
  type: string;
  items: Converter[];
}

interface ConverterCategories {
  [key: string]: CategoryData;
}

const converterTypes = {
  engineering: [
    { id: "length", name: "Length" },
    { id: "area", name: "Area" },
    { id: "volume", name: "Volume" },
    { id: "weight", name: "Weight" },
    { id: "pressure", name: "Pressure" },
    { id: "density", name: "Density" },
    { id: "moment", name: "Moment" },
    { id: "flow", name: "Flow Rate" },
    { id: "angle", name: "Angle" },
    { id: "land-area-nepal", name: "Nepal Land" },
    { id: "stress", name: "Stress" },
    { id: "work", name: "Work & Power" },
  ],
  scientific: [
    { id: "temperature", name: "Temperature" },
    { id: "speed", name: "Speed" },
    { id: "energy", name: "Energy" },
    { id: "power", name: "Power" },
    { id: "force", name: "Force" },
  ],
  time: [
    { id: "time", name: "Time Units" },
    { id: "datetime", name: "Date & Time" },
    { id: "timezone", name: "Time Zones" },
  ],
  business: [
    { id: "currency", name: "Currency" },
    { id: "emi", name: "Emi" },
    { id: "discount", name: "Discount" },
  ],
} as const;

const converterCategories: ConverterCategories = {
  engineering: {
    title: "Engineering Units",
    description: "Essential unit conversions for civil engineers",
    type: "engineering",
    items: [
      {
        id: "length",
        title: "Length Converter",
        description: "Convert between different length units with precision",
        category: "Engineering",
        type: "engineering",
        icon: "📏",
        gradient: "from-blue-600 via-blue-500 to-cyan-500",
        path: "/converter/engineeringunits/length",
        features: [
          "Meter ↔ Feet, Inch",
          "Kilometer ↔ Mile, Yard",
          "Centimeter ↔ Inch",
          "Millimeter ↔ Points, Picas",
          "Microns ↔ Mils",
          "Nautical Miles",
        ],
        usageCount: 0,
      },
      {
        id: "area",
        title: "Area Converter",
        description: "Calculate areas with ease",
        category: "Engineering",
        type: "engineering",
        icon: "📐",
        gradient: "from-green-600 to-teal-600",
        path: "/converter/engineeringunits/area",
        features: [
          "Square Meter ↔ Square Feet",
          "Acre ↔ Hectare",
          "Square KM ↔ Square Mile",
          "Square CM ↔ Square Inch",
        ],
        usageCount: 0,
      },
      {
        id: "volume",
        title: "Volume Converter",
        description: "Convert volume units accurately",
        category: "Engineering",
        type: "engineering",
        icon: "🧊",
        gradient: "from-purple-600 to-pink-600",
        path: "/converter/engineeringunits/volume",
        features: [
          "Cubic Meter ↔ Cubic Feet",
          "Liter ↔ Gallon",
          "Cubic CM ↔ Cubic Inch",
          "Cubic Yard ↔ Cubic Meter",
        ],
        usageCount: 0,
      },
      {
        id: "weight",
        title: "Weight Converter",
        description: "Measure weights in various units",
        category: "Engineering",
        type: "engineering",
        icon: "⚖️",
        gradient: "from-orange-600 to-red-600",
        path: "/converter/engineeringunits/weight",
        features: [
          "Kilogram ↔ Pound",
          "Metric Ton ↔ Short Ton",
          "Gram ↔ Ounce",
          "Metric Ton ↔ Long Ton",
        ],
        usageCount: 0,
      },
      {
        id: "pressure",
        title: "Pressure Converter",
        description: "Convert between different pressure units",
        category: "Engineering",
        type: "engineering",
        icon: "🎯",
        gradient: "from-sky-600 to-blue-600",
        path: "/converter/engineeringunits/pressure",
        features: ["Pascal ↔ Bar", "MPa ↔ Psi", "kPa ↔ kg/cm²", "Bar ↔ kg/cm²"],
        usageCount: 0,
      },
      {
        id: "density",
        title: "Density Converter",
        description: "Convert between density units",
        category: "Engineering",
        type: "engineering",
        icon: "🔷",
        gradient: "from-cyan-600 to-blue-600",
        path: "/converter/engineeringunits/density",
        features: [
          "kg/m³ ↔ lb/ft³",
          "kg/L ↔ lb/gal",
          "g/cm³ ↔ lb/ft³",
          "kg/m³ ↔ g/cm³",
        ],
        usageCount: 0,
      },
      {
        id: "moment",
        title: "Moment Converter",
        description: "Convert torque and moment units",
        category: "Engineering",
        type: "engineering",
        icon: "🔄",
        gradient: "from-purple-600 to-indigo-600",
        path: "/converter/engineeringunits/moment",
        features: [
          "Newton-meter ↔ lb-ft",
          "kN-m ↔ lb-ft",
          "N-mm ↔ lb-in",
          "kgf-m ↔ lb-ft",
        ],
        usageCount: 0,
      },
      {
        id: "flow",
        title: "Flow Rate Converter",
        description: "Convert fluid flow rate units",
        category: "Engineering",
        type: "engineering",
        icon: "💧",
        gradient: "from-blue-600 to-cyan-600",
        path: "/converter/engineeringunits/flowrate",
        features: ["m³/s ↔ L/min", "m³/h ↔ CFM", "L/s ↔ GPM", "m³/day ↔ MGD"],
        usageCount: 0,
      },
      {
        id: "angle",
        title: "Angle Converter",
        description: "Convert between angle measurements",
        category: "Engineering",
        type: "engineering",
        icon: "📐",
        gradient: "from-yellow-600 to-amber-600",
        path: "/converter/engineeringunits/angle",
        features: [
          "Degree ↔ Radian",
          "Degree ↔ Gradient",
          "Degree ↔ Slope %",
          "Mrad ↔ MOA",
        ],
        usageCount: 0,
      },
      {
        id: "land-area-nepal",
        title: "Nepal Land Units",
        description: "Convert traditional Nepali land measurement units",
        category: "Engineering",
        type: "engineering",
        icon: "🗺️",
        gradient: "from-red-600 to-rose-600",
        path: "/converter/engineeringunits/nepallandunits",
        features: [
          "Ropani to Square Meters",
          "Bigha to Square Meters",
          "Kaththa & Dhur",
          "Anna & Paisa",
        ],
        usageCount: 0,
      },
      {
        id: "stress",
        title: "Stress Converter",
        description: "Convert between stress and pressure units",
        category: "Engineering",
        type: "engineering",
        icon: "🔨",
        gradient: "from-red-600 to-orange-600",
        path: "/converter/engineeringunits/stress",
        features: ["MPa ↔ N/mm²", "kPa ↔ kg/cm²", "MPa ↔ ksi", "N/mm² ↔ psi"],
        usageCount: 0,
      },
      {
        id: "work",
        title: "Work & Power",
        description: "Convert between work and power units",
        category: "Engineering",
        type: "engineering",
        icon: "⚡",
        gradient: "from-yellow-600 to-amber-600",
        path: "/converter/engineeringunits/powerandenergy",
        features: ["kW ↔ HP", "kgf·m/s ↔ HP", "BTU/h ↔ kW", "kW ↔ kcal/h"],
        usageCount: 0,
      },
    ],
  },
  scientific: {
    title: "Scientific Units",
    description: "Precise scientific measurement conversions",
    type: "scientific",
    items: [
      {
        id: "temperature",
        title: "Temperature Converter",
        description: "Convert temperatures seamlessly",
        category: "Scientific",
        type: "scientific",
        icon: "🌡️",
        gradient: "from-indigo-600 to-blue-600",
        path: "converter/scientificunits/temperature",
        features: [
          "Celsius ↔ Fahrenheit",
          "Kelvin ↔ Celsius",
          "Kelvin ↔ Fahrenheit",
          "Celsius ↔ Rankine",
        ],
        usageCount: 0,
      },
      {
        id: "speed",
        title: "Speed Converter",
        description: "Calculate speeds in different units",
        category: "Scientific",
        type: "scientific",
        icon: "🏃",
        gradient: "from-rose-600 to-pink-600",
        path: "/converter/scientificunits/speed",
        features: ["m/s ↔ km/h", "m/s ↔ ft/s", "km/h ↔ mph", "ft/s ↔ mph"],
        usageCount: 0,
      },
      {
        id: "energy",
        title: "Energy Converter",
        description: "Convert between energy units",
        category: "Scientific",
        type: "scientific",
        icon: "⚡",
        gradient: "from-yellow-600 to-amber-600",
        path: "/converter/scientificunits/energy",
        features: [
          "Joule ↔ kiloJoule",
          "Calorie ↔ BTU",
          "kWh ↔ MJ",
          "kcal ↔ BTU",
        ],
        usageCount: 0,
      },
      {
        id: "power",
        title: "Power Converter",
        description: "Convert between power units",
        category: "Scientific",
        type: "scientific",
        icon: "💪",
        gradient: "from-purple-600 to-indigo-600",
        path: "/converter/scientificunits/power",
        features: [
          "Watts & Horsepower",
          "Kilowatts",
          "BTU per Hour",
          "Engineering Units",
        ],
        usageCount: 0,
      },
      {
        id: "force",
        title: "Force Converter",
        description: "Convert between force units",
        category: "Scientific",
        type: "scientific",
        icon: "🔨",
        gradient: "from-green-600 to-emerald-600",
        path: "/converter/scientificunits/force",
        features: [
          "Newton ↔ kiloNewton",
          "kiloNewton ↔ lbf",
          "Newton ↔ kgf",
          "MPa ↔ Psi",
        ],
        usageCount: 0,
      },
    ],
  },
  time: {
    title: "Time Converters",
    description: "Time and date conversion tools",
    type: "time",
    items: [
      {
        id: "time",
        title: "Time Unit Converter",
        description: "Convert between different time units",
        category: "Time",
        type: "time",
        icon: "⏱️",
        gradient: "from-blue-600 to-cyan-600",
        path: "/converter/timeunits/time",
        features: [
          "Seconds to Hours",
          "Days to Weeks",
          "Custom Time Units",
          "Duration Calculator",
        ],
        usageCount: 0,
      },
      {
        id: "datetime",
        title: "Date & Time Calculator",
        description: "Calculate time differences and durations",
        category: "Time",
        type: "time",
        icon: "📅",
        gradient: "from-violet-600 to-purple-600",
        path: "/converter/timeunits/dateconvert",
        features: [
          "Date Difference",
          "Add/Subtract Time",
          "Working Days",
          "Time Intervals",
        ],
        usageCount: 0,
      },
      {
        id: "timezone",
        title: "Time Zone Converter",
        description: "Convert times between different zones",
        category: "Time",
        type: "time",
        icon: "🌍",
        gradient: "from-teal-600 to-green-600",
        path: "/converter/timeunits/timezone",
        features: [
          "World Time Zones",
          "DST Support",
          "Meeting Planner",
          "Local Time Display",
        ],
        usageCount: 0,
      },
    ],
  },
  business: {
    title: "Business Units",
    description: "Financial and business-related conversions",
    type: "business",
    items: [
      {
        id: "currency",
        title: "Currency Converter",
        description: "Exchange rates made simple",
        category: "Business",
        type: "business",
        icon: "💱",
        gradient: "from-cyan-600 to-blue-600",
        path: "/converter/businessunits/currency",
        features: [
          "Live Exchange Rates",
          "Major Currencies",
          "Cost Estimation",
          "Budget Planning",
        ],
        usageCount: 0,
      },
      {
        id: "discount",
        title: "Discount Calculator",
        description: "Calculate discounts effectively",
        category: "Business",
        type: "business",
        icon: "🏷️",
        gradient: "from-violet-600 to-indigo-600",
        path: "/converter/businessunits/discount",
        features: [
          "Percentage Off",
          "Net Price",
          "Bulk Discounts",
          "Tax Calculations",
        ],
        usageCount: 0,
      },
      {
        id: "EMI",
        title: "EMI Calculator",
        description: "Convert and calculate EMI payments",
        category: "Business",
        type: "business",
        icon: "💰",
        gradient: "from-emerald-600 to-teal-600",
        path: "/converter/businessunits/emi",
        features: [
          "Loan Calculation",
          "Interest Breakdown",
          "Monthly Payments",
          "Repayment Schedule",
        ],
        usageCount: 0,
      },
    ],
  },
};

export default function ConverterHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("engineering");
  const router = useRouter();

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return Object.entries(converterCategories).reduce<ConverterCategories>(
      (acc, [key, category]) => {
        const filteredItems = category.items.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.features.some((f) => f.toLowerCase().includes(query))
        );
        if (filteredItems.length > 0) {
          acc[key] = { ...category, items: filteredItems };
        }
        return acc;
      },
      {}
    );
  }, [searchQuery]);

  const renderConverterTypeButtons = () => (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {Object.entries(converterTypes).map(([type, subtypes]) => (
        <button
          key={`converter-type-${type}`}
          onClick={() => {
            setActiveType(type);
            document
              .getElementById(type)
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all
            ${
              activeType === type
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.7))] opacity-2"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-24">
          <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-violet-600 to-purple-700 mb-8">
            Smart Unit Converters
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Professional-grade unit converters designed for construction and
            engineering needs.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-16 space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search converters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white/90 backdrop-blur-sm pl-14"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {renderConverterTypeButtons()}
        </div>

        {Object.entries(filteredCategories).map(([type, category]) => (
          <motion.section
            key={type}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-16"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {category.title}
              </h2>
              <p className="text-gray-600">{category.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-xl blur opacity-20 group-hover:opacity-60 transition duration-300`}
                  />
                  <div className="relative p-6 bg-white/90 backdrop-blur-xl rounded-xl">
                    <motion.div
                      layout
                      whileHover={{ y: -5 }}
                      className="flex items-start space-x-4"
                    >
                      <motion.div
                        whileHover={{ scale: 1.3, rotate: 5 }}
                        className={`h-12 w-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-110 duration-300 shadow-lg`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                      </motion.div>
                      <div className="flex-">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="hidden group-hover:block animate-fadeIn">
                          <div className="space-y-1">
                            {item.features.slice(0, 4).map((feature, idx) => (
                              <div
                                key={idx}
                                className="text-xs text-gray-600 flex items-center"
                              >
                                <svg
                                  className="w-3 h-3 mr-1 text-green-500 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span className="leading-tight">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
