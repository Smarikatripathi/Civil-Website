"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Calculator {
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

interface SubType {
  id: string;
  name: string;
}

const calculatorTypes = {
  estimation: [
    { id: "concrete", name: "Concrete" },
    { id: "steel", name: "Steel" },
    { id: "brick", name: "Brick" },
    { id: "plaster", name: "Plaster" },
    { id: "paint", name: "Paint" },
    { id: "boq", name: "BOQ" },
    { id: "building", name: "Building" },
  ],
  structural: [
    { id: "beam", name: "Beam" },
    { id: "column", name: "Column" },
    { id: "slab", name: "Slab" },
    { id: "foundation", name: "Foundation" },
    { id: "rcc", name: "RCC Design" },
    { id: "strength", name: "Strength of Materials" },
    { id: "load", name: "Load Analysis" },
  ],
  materials: [
    { id: "concrete-tech", name: "Concrete Technology" },
    { id: "soil", name: "Soil Mechanics" },
    { id: "lab-test", name: "Material Testing" },
  ],
  surveying: [
    { id: "land", name: "Land Area" },
    { id: "leveling", name: "Leveling" },
    { id: "curves", name: "Curves" },
  ],
  civil: [
    { id: "transportation", name: "Transportation" },
    { id: "hydraulics", name: "Hydraulics" },
    { id: "foundation", name: "Foundation" },
    { id: "building-design", name: "Building Design" },
  ],
  utilities: [
    { id: "cutting-length", name: "Cutting Length" },
    { id: "finance", name: "Finance" },
  ],
} as const;

const calculators: Calculator[] = [
  {
    id: "material-estimation",
    title: "Material Estimation",
    description:
      "Accurate material quantity calculations for construction projects",
    category: "Estimation",
    type: "estimation",
    features: [
      "Concrete Quantities",
      "Steel Requirements",
      "Masonry Works",
      "Finishing Items",
      "Automated Reports",
      "Graphical Visualization",
    ],
    usageCount: 0,
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    gradient: "from-blue-600 via-blue-500 to-cyan-500",
    path: "/calculator/materialestimation",
  },
  {
    id: "cost-estimation",
    title: "Cost Estimation",
    description:
      "Comprehensive construction cost estimation and budgeting tools",
    category: "Estimation",
    type: "estimation",
    features: [
      "Project Costing",
      "Budget Analysis",
      "Cost Breakdown",
      "Unit Rate Calculator",
      "Cost Comparison",
      "Timeline Integration",
    ],
    usageCount: 0,
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    gradient: "from-emerald-600 via-emerald-500 to-teal-500",
    path: "/calculator/estimation/cost",
  },
  {
    id: "rate-analysis",
    title: "Rate Analysis",
    description:
      "Detailed construction rate analysis and work item calculations",
    category: "Estimation",
    type: "estimation",
    features: [
      "Labor Rates",
      "Material Rates",
      "Equipment Costs",
      "Overhead Calculator",
      "Profit Analysis",
      "Market Rate Updates",
    ],
    usageCount: 0,
    icon: "M9 7h6m0 10h-6m-3-3h12M9 17h6M3 3h18v18H3V3z",
    gradient: "from-violet-600 via-violet-500 to-purple-500",
    path: "/calculator/rateanalysis",
  },
  {
    id: "bbs-generator",
    title: "Bar Bending Schedule",
    description:
      "Comprehensive BBS generator with detailed calculations and drawings",
    category: "Steel",
    type: "bbs",
    features: [
      "Schedule Generation",
      "Bar Details",
      "Weight Calculation",
      "Drawing Export",
    ],
    usageCount: 0,
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    gradient: "from-purple-600 via-purple-500 to-indigo-600",
    path: "/calculator/bbs",
  },
  {
    id: "structural",
    title: "Structural Analysis",
    description:
      "Advanced structural engineering calculations and analysis tools",
    category: "Structural",
    type: "structural",
    features: [
      "Beam Analysis",
      "Column Design",
      "Slab Calculations",
      "Foundation Design",
    ],
    usageCount: 0,
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    gradient: "from-green-600 via-green-500 to-teal-600",
    path: "/calculator/structural",
  },
  {
    id: "land-area",
    title: "Land Area Calculator",
    description:
      "Calculate land areas, plot dimensions and surveying measurements",
    category: "Surveying",
    type: "surveying",
    features: [
      "Area Calculation",
      "Plot Dimensions",
      "Coordinate System",
      "Area Conversion",
    ],
    usageCount: 0,
    icon: "M3 3h18v18H3V3z M9 9h6v6H9V9z",
    gradient: "from-green-600 via-green-500 to-emerald-500",
    path: "/calculator/surveying/land-area",
  },
  {
    id: "transportation",
    title: "Transportation Engineering",
    description:
      "Calculate road geometrics, traffic analysis and pavement design",
    category: "Civil",
    type: "civil",
    features: [
      "Road Geometrics",
      "Traffic Analysis",
      "Pavement Design",
      "Highway Capacity",
    ],
    usageCount: 0,
    icon: "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z",
    gradient: "from-amber-600 via-amber-500 to-yellow-500",
    path: "/calculator/civil/transportation",
  },
  {
    id: "rcc-design",
    title: "RCC Design Calculator",
    description: "Comprehensive RCC structural element design tools",
    category: "Structural",
    type: "structural",
    features: [
      "Beam Design",
      "Column Design",
      "Slab Design",
      "Foundation Design",
      "Reinforcement Details",
      "Design Reports",
    ],
    usageCount: 0,
    icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z",
    gradient: "from-blue-600 via-blue-500 to-indigo-500",
    path: "/calculator/structural/rcc",
  },
  {
    id: "cutting-length",
    title: "Cutting Length Calculator",
    description:
      "Calculate accurate cutting lengths for construction materials",
    category: "Utilities",
    type: "utilities",
    features: [
      "Bar Cutting Length",
      "Wastage Calculator",
      "Optimization Tools",
      "Cost Savings Analysis",
    ],
    usageCount: 0,
    icon: "M14 5l7 7m0 0l-7 7m7-7H3",
    gradient: "from-gray-600 via-gray-500 to-zinc-500",
    path: "/calculator/utilities/cutting-length",
  },
  {
    id: "boq-maker",
    title: "BOQ Generator",
    description:
      "Comprehensive Bill of Quantities generator with detailed itemization",
    category: "Estimation",
    type: "estimation",
    features: [
      "Item Breakdown",
      "Quantity Takeoff",
      "Cost Analysis",
      "Report Generation",
      "Excel Export",
    ],
    usageCount: 0,
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    gradient: "from-teal-600 via-teal-500 to-green-500",
    path: "/calculator/estimation/boq",
  },
  {
    id: "material-testing",
    title: "Material Lab Tests",
    description:
      "Construction material testing calculators and result analyzers",
    category: "Materials",
    type: "materials",
    features: [
      "Concrete Tests",
      "Soil Tests",
      "Aggregate Tests",
      "Result Analysis",
      "Quality Control",
    ],
    usageCount: 0,
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    gradient: "from-orange-600 via-orange-500 to-amber-500",
    path: "/calculator/materials/lab-test",
  },
  {
    id: "building-estimator",
    title: "Building Estimator",
    description: "Complete building cost and quantity estimation tools",
    category: "Estimation",
    type: "estimation",
    features: [
      "Material Quantities",
      "Labor Costs",
      "Building Components",
      "Detailed Reports",
      "Cost Analysis",
    ],
    usageCount: 0,
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    gradient: "from-blue-600 via-blue-500 to-indigo-500",
    path: "/calculator/estimation/building",
  },
  {
    id: "concrete-mix",
    title: "Concrete Mix Design",
    description: "Advanced concrete mix design and property calculators",
    category: "Materials",
    type: "materials",
    features: [
      "Mix Design",
      "Strength Calculator",
      "Curing Time",
      "Quality Control",
      "Test Analysis",
    ],
    usageCount: 0,
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    gradient: "from-cyan-600 via-cyan-500 to-blue-500",
    path: "/calculator/mixdesign/concretemix",
  },
  {
    id: "soil-mechanics",
    title: "Soil Mechanics",
    description: "Soil properties and foundation engineering calculators",
    category: "Materials",
    type: "materials",
    features: [
      "Soil Classification",
      "Bearing Capacity",
      "Settlement Analysis",
      "Permeability",
      "Compaction Tests",
    ],
    usageCount: 0,
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    gradient: "from-yellow-600 via-yellow-500 to-amber-500",
    path: "/calculator/materials/soil",
  },
  {
    id: "hydraulics",
    title: "Hydraulics Calculator",
    description: "Fluid mechanics and water resource engineering calculations",
    category: "Civil",
    type: "civil",
    features: [
      "Flow Analysis",
      "Pipe Design",
      "Channel Flow",
      "Pump Design",
      "Pressure Calc",
    ],
    usageCount: 0,
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    gradient: "from-blue-600 via-blue-500 to-cyan-500",
    path: "/calculator/civil/hydraulics",
  },
  {
    id: "load-calculator",
    title: "Load Calculator",
    description: "Structural load analysis and distribution calculator",
    category: "Structural",
    type: "structural",
    features: [
      "Dead Loads",
      "Live Loads",
      "Wind Loads",
      "Seismic Analysis",
      "Load Combinations",
    ],
    usageCount: 0,
    icon: "M19 8l-7 7-7-7",
    gradient: "from-red-600 via-red-500 to-orange-500",
    path: "/calculator/structural/load",
  },
  {
    id: "finance",
    title: "Construction Finance",
    description: "Construction project financial analysis and planning tools",
    category: "Utilities",
    type: "utilities",
    features: [
      "Cost Analysis",
      "ROI Calculator",
      "Cash Flow",
      "Project Budget",
      "Financial Reports",
    ],
    usageCount: 0,
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    gradient: "from-green-600 via-green-500 to-emerald-500",
    path: "/calculator/utilities/finance",
  },
];

const CalculatorPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentCalculators, setRecentCalculators] = useState<Calculator[]>([]);
  const [selectedCalculator, setSelectedCalculator] =
    useState<Calculator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
    const savedFavorites = localStorage.getItem("calculatorFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    const savedRecent = localStorage.getItem("recentCalculators");
    if (savedRecent) {
      setRecentCalculators(JSON.parse(savedRecent));
    }
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem("calculatorFavorites", JSON.stringify(newFavorites));
  };

  const trackUsage = (calculator: Calculator) => {
    const updatedCalc = {
      ...calculator,
      usageCount: calculator.usageCount + 1,
      lastUsed: new Date(),
    };
    const updatedRecent = [
      updatedCalc,
      ...recentCalculators.filter((c) => c.id !== calculator.id),
    ].slice(0, 5);
    setRecentCalculators(updatedRecent);
    localStorage.setItem("recentCalculators", JSON.stringify(updatedRecent));
  };

  const groupedCalculators = useMemo(() => {
    return calculators.reduce((acc, calc) => {
      if (!acc[calc.type]) acc[calc.type] = [];
      acc[calc.type].push(calc);
      return acc;
    }, {} as Record<string, Calculator[]>);
  }, [calculators]);

  const filteredCalculators = calculators.filter((calc) => {
    const matchesSearch =
      calc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || calc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const renderCalculatorTypeButtons = () => (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {Object.entries(calculatorTypes).map(([type, subtypes]) => (
        <button
          key={`calculator-type-${type}`}
          onClick={() =>
            document
              .getElementById(type)
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="px-6 py-2 rounded-full text-sm font-medium transition-all bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );

  const renderCalculatorSection = (type: string, calcs: Calculator[]) => (
    <section key={`section-${type}`} id={type} className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-bold mb-6 capitalize text-gray-900">
        {type.charAt(0).toUpperCase() + type.slice(1)} Calculators
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {calcs.map((calc) => (
          <CalculatorCard
            key={`calc-${calc.id}`}
            calculator={calc}
            onSelect={() => setSelectedCalculator(calc)}
            isFavorite={favorites.includes(calc.id)}
            onToggleFavorite={() => toggleFavorite(calc.id)}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.7))] opacity-5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-24">
          <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-violet-600 to-purple-700 mb-8 animate-fade-in">
            Smart Construction Calculators
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Professional-grade calculators designed specifically for
            construction and engineering needs. Choose the tool that fits your
            requirements.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-16 space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search calculators..."
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
          {renderCalculatorTypeButtons()}
        </div>

        {recentCalculators.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span>Recently Used</span>
              <span className="ml-2 text-sm text-gray-500">(Last 7 days)</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentCalculators.map((calc) => (
                <QuickAccessCard key={`recent-${calc.id}`} calculator={calc} />
              ))}
            </div>
          </section>
        )}

        <AnimatePresence mode="wait">
          {selectedCalculator && (
            <CalculatorPreview
              key={`preview-${selectedCalculator.id}`}
              calculator={selectedCalculator}
              onClose={() => setSelectedCalculator(null)}
              onUse={() => {
                trackUsage(selectedCalculator);
                router.push(selectedCalculator.path);
              }}
            />
          )}
        </AnimatePresence>

        {Object.entries(groupedCalculators).map(([type, calcs]) =>
          renderCalculatorSection(type, calcs)
        )}
      </div>
    </div>
  );
};

const QuickAccessCard: React.FC<{ calculator: Calculator }> = ({
  calculator,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl border border-gray-100"
    >
      <div className="flex items-center space-x-4">
        <div
          className={`h-12 w-12 bg-gradient-to-br ${calculator.gradient} rounded-xl flex items-center justify-center transform transition-transform group-hover:rotate-6`}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={calculator.icon}
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {calculator.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1">
            {calculator.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const PreviewFeatureList: React.FC<{ calculator: Calculator }> = ({
  calculator,
}) => (
  <ul className="space-y-3">
    {calculator.features.map((feature, index) => (
      <motion.li
        key={`preview-${calculator.id}-${index}-${feature.replace(
          /\s+/g,
          "-"
        )}`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex items-center text-gray-600"
      >
        <svg
          className="w-5 h-5 mr-3 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        {feature}
      </motion.li>
    ))}
  </ul>
);

const CalculatorPreview: React.FC<{
  calculator: Calculator;
  onClose: () => void;
  onUse: () => void;
}> = ({ calculator, onClose, onUse }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -20 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-20" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {calculator.title}
            </h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
            >
              ×
            </motion.button>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {calculator.description}
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Features
            </h4>
            <PreviewFeatureList calculator={calculator} />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUse}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Open Calculator
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FeatureList: React.FC<{ calculator: Calculator }> = ({ calculator }) => (
  <ul className="grid grid-cols-2 gap-2">
    {calculator.features.slice(0, 4).map((feature, index) => (
      <motion.li
        key={`feature-${calculator.id}-${index}-${feature.replace(
          /\s+/g,
          "-"
        )}`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
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
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        {feature}
      </motion.li>
    ))}
  </ul>
);

const CalculatorCard: React.FC<{
  calculator: Calculator;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}> = ({ calculator, onSelect, isFavorite, onToggleFavorite }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      className="group relative aspect-[4/5]"
    >
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${calculator.gradient} rounded-3xl blur opacity-20 group-hover:opacity-60 transition duration-300`}
      />
      <div className="relative h-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`h-16 w-16 bg-gradient-to-br ${calculator.gradient} rounded-2xl p-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
            >
              <svg
                className="w-full h-full text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={calculator.icon}
                />
              </svg>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleFavorite}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span
                className={`text-xl ${
                  isFavorite ? "text-yellow-500" : "text-gray-400"
                }`}
              >
                {isFavorite ? "★" : "☆"}
              </span>
            </motion.button>
          </div>

          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
              {calculator.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {calculator.description}
            </p>

            <div className="hidden group-hover:block animate-fadeIn">
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Key Features:
                </h3>
                <FeatureList calculator={calculator} />
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSelect}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              Open Calculator
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CalculatorPage;
