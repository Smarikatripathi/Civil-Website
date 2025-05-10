"use client";
import React, { useState, useEffect, useMemo } from "react";
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
    { id: "tile", name: "Tile" },
    { id: "stone-masonry", name: "Stone Masonry" },
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
    id: "concrete",
    title: "Concrete Calculator",
    description:
      "Calculate concrete volume, mix ratios, and material requirements",
    category: "estimation",
    icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    gradient: "from-blue-600 to-blue-400",
    path: "/materialestimation/concreteestimation",
    type: "estimation",
    features: [
      "Volume calculator",
      "Different grade ratios",
      "Material estimation",
      "Cost analysis",
    ],
    usageCount: 0,
  },
  {
    id: "steel",
    title: "Steel Calculator",
    description:
      "Calculate steel weight, cutting lengths, and reinforcement requirements",
    category: "estimation",
    icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    gradient: "from-gray-600 to-gray-400",
    path: "/calculators/steel",
    type: "estimation",
    features: [
      "Weight calculator",
      "Bar bending schedule",
      "Reinforcement details",
      "Cost estimation",
    ],
    usageCount: 0,
  },
  {
    id: "brick",
    title: "Brick Calculator",
    description:
      "Calculate number of bricks, mortar quantity, and masonry costs",
    category: "estimation",
    icon: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2zM12 7v10m-3-5h6",
    gradient: "from-red-600 to-orange-400",
    path: "/calculators/brick",
    type: "estimation",
    features: [
      "Brick quantity",
      "Mortar calculation",
      "Different brick sizes",
      "Cost estimation",
    ],
    usageCount: 0,
  },
  {
    id: "plaster",
    title: "Plaster Calculator",
    description: "Calculate plaster area, material quantities, and costs",
    category: "estimation",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    gradient: "from-yellow-600 to-amber-400",
    path: "/calculators/plaster",
    type: "estimation",
    features: [
      "Area calculation",
      "Material estimation",
      "Different plaster types",
      "Cost analysis",
    ],
    usageCount: 0,
  },
  {
    id: "paint",
    title: "Paint Calculator",
    description: "Calculate paint requirements for walls and surfaces",
    category: "estimation",
    icon: "M9 13l-4-4 4-4M5 9h14M9 19l4 4 4-4M19 15H5",
    gradient: "from-purple-600 to-pink-400",
    path: "/calculators/paint",
    type: "estimation",
    features: [
      "Surface area calculation",
      "Paint quantity",
      "Multiple coats",
      "Cost estimation",
    ],
    usageCount: 0,
  },
  {
    id: "tile",
    title: "Tile Calculator",
    description:
      "Calculate tile requirements, cutting waste, and installation costs",
    category: "estimation",
    icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
    gradient: "from-emerald-600 to-teal-400",
    path: "/calculators/tile",
    type: "estimation",
    features: [
      "Tile quantity",
      "Cutting waste",
      "Grout calculation",
      "Cost estimation",
    ],
    usageCount: 0,
  },
  {
    id: "stone-masonry",
    title: "Stone Masonry Calculator",
    description: "Calculate stone requirements and masonry costs",
    category: "estimation",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    gradient: "from-stone-600 to-stone-400",
    path: "/calculators/stone-masonry",
    type: "estimation",
    features: [
      "Stone volume",
      "Mortar calculation",
      "Labor costs",
      "Material estimation",
    ],
    usageCount: 0,
  },
  {
    id: "boq",
    title: "BOQ Generator",
    description:
      "Create detailed Bills of Quantities for construction projects",
    category: "estimation",
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    gradient: "from-indigo-600 to-blue-400",
    path: "/calculators/boq",
    type: "estimation",
    features: [
      "Custom templates",
      "Material lists",
      "Cost breakdowns",
      "Export to PDF",
    ],
    usageCount: 0,
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
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    const savedRecent = localStorage.getItem("recentCalculators");
    if (savedRecent) setRecentCalculators(JSON.parse(savedRecent));
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
    router.push(calculator.path);
  };

  const groupedCalculators = useMemo(() => {
    return calculators.reduce((acc, calc) => {
      if (!acc[calc.type]) acc[calc.type] = [];
      acc[calc.type].push(calc);
      return acc;
    }, {} as Record<string, Calculator[]>);
  }, [calculators]);

  const filteredCalculators = useMemo(() => {
    return calculators.filter((calc) => {
      const matchesSearch =
        calc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        calc.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || calc.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const renderCalculatorTypeButtons = () => (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {Object.entries(calculatorTypes).map(([type, subtypes]) => (
        <button
          key={`calculator-type-${type}`}
          onClick={() => {
            document
              .getElementById(type)
              ?.scrollIntoView({ behavior: "smooth" });
            setActiveCategory(type);
          }}
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
}) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -3 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl border border-gray-100"
  >
    <div className="flex items-center space-x-4">
      <div
        className={`h-12 w-12 bg-gradient-to-br ${calculator.gradient} rounded-xl flex items-center justify-center`}
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
            strokeWidth="1"
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

const CalculatorPreview: React.FC<{
  calculator: Calculator;
  onClose: () => void;
  onUse: () => void;
}> = ({ calculator, onClose, onUse }) => (
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
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">{calculator.title}</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
        >
          ×
        </button>
      </div>
      <p className="text-gray-600 mb-6 leading-relaxed">
        {calculator.description}
      </p>
      <div className="bg-gray-50 rounded-2xl p-6 mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Features</h4>
        <ul className="space-y-3">
          {calculator.features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-600">
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
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onUse}
        className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Open Calculator
      </button>
    </motion.div>
  </motion.div>
);

const CalculatorCard: React.FC<{
  calculator: Calculator;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}> = ({ calculator, onSelect, isFavorite, onToggleFavorite }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    whileHover={{ y: -5 }}
    className="group relative aspect-[4/5]"
  >
    <div
      className={`absolute -inset-0.5 bg-gradient-to-r ${calculator.gradient} rounded-3xl blur opacity-20 group-hover:opacity-60 transition duration-300`}
    />
    <div className="relative h-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="p-8 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div
            className={`h-16 w-16 bg-gradient-to-br ${calculator.gradient} rounded-2xl p-3`}
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
          </div>
          <button
            onClick={onToggleFavorite}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100"
          >
            <span
              className={`text-xl ${
                isFavorite ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              {isFavorite ? "★" : "☆"}
            </span>
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-3 text-gray-900">
          {calculator.title}
        </h2>
        <p className="text-gray-600 mb-4">{calculator.description}</p>
        <div className="mt-auto">
          <button
            onClick={onSelect}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-4 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Open Calculator
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default CalculatorPage;
