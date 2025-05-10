"use client";
import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import {
  FiBox,
  FiDroplet,
  FiZap,
  FiAlertTriangle,
  FiCopy,
  FiDownload,
  FiSliders,
  FiMinusSquare,
  FiTrash2,
  FiPlus,
  FiInfo,
} from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

Chart.register(...registerables);

interface VoidType {
  id: number;
  count: number;
  length: string;
  width: string;
  height: string;
}

interface InputsType {
  length: string;
  width: string;
  thickness: string;
  unit: string;
  mixRatio: string;
  useRetarder: boolean;
  retarderAmount: string;
  usePlasticizer: boolean;
  plasticizerAmount: string;
  useAccelerator: boolean;
  acceleratorAmount: string;
  cementCost: string;
  sandCost: string;
  aggregateCost: string;
  voids: VoidType[];
}

interface ResultsType {
  volume: number;
  materials: { cement: number; sand: number; aggregate: number; water: number };
  admixtures: { retarder: number; plasticizer: number; accelerator: number };
  costEstimate: number;
  voidVolume: number;
  grossVolume: number;
}

const mixRatios = {
  M5: { cement: 1, sand: 5, aggregate: 10, wcRatio: 0.6 },
  M7_5: { cement: 1, sand: 4, aggregate: 8, wcRatio: 0.55 },
  M10: { cement: 1, sand: 3, aggregate: 6, wcRatio: 0.5 },
  M15: { cement: 1, sand: 2, aggregate: 4, wcRatio: 0.45 },
  M20: { cement: 1, sand: 1.5, aggregate: 3, wcRatio: 0.4 },
  M25: { cement: 1, sand: 1, aggregate: 2, wcRatio: 0.38 },
  M30: { cement: 1, sand: 0.75, aggregate: 1.5, wcRatio: 0.35 },
  M35: { cement: 1, sand: 0.6, aggregate: 1.2, wcRatio: 0.32 },
  M40: { cement: 1, sand: 0.5, aggregate: 1, wcRatio: 0.3 },
  M50: { cement: 1, sand: 0.4, aggregate: 0.8, wcRatio: 0.28 },
  M60: { cement: 1, sand: 0.3, aggregate: 0.6, wcRatio: 0.25 },
  M80: { cement: 1, sand: 0.2, aggregate: 0.4, wcRatio: 0.22 },
};

const ConcreteVolumeCalculator = () => {
  const [inputs, setInputs] = useState<InputsType>({
    length: "10",
    width: "10",
    thickness: "0.2",
    unit: "m",
    mixRatio: "M20",
    useRetarder: false,
    retarderAmount: "0.3",
    usePlasticizer: false,
    plasticizerAmount: "0.5",
    useAccelerator: false,
    acceleratorAmount: "0.4",
    cementCost: "0.3",
    sandCost: "0.05",
    aggregateCost: "0.03",
    voids: [
      { id: Date.now(), count: 1, length: "1", width: "1", height: "0.1" },
    ],
  });

  const [results, setResults] = useState<ResultsType | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const unitConversion: Record<string, number> = {
    m: 1,
    cm: 0.01,
    mm: 0.001,
    ft: 0.3048,
    inch: 0.0254,
  };

  const validateInputs = () => {
    const errors = [];
    if (!inputs.length || !inputs.width || !inputs.thickness) {
      errors.push("Main dimensions are required");
    }
    if (
      inputs.voids.some((v) => (v.length && !v.width) || (v.width && !v.height))
    ) {
      errors.push("Incomplete void dimensions");
    }
    return errors;
  };

  const calculateVolume = useCallback(() => {
    const errors = validateInputs();
    if (errors.length > 0) {
      alert(`Validation errors:\n${errors.join("\n")}`);
      return;
    }

    const conversion = unitConversion[inputs.unit] || 1;
    const length = parseFloat(inputs.length) || 0;
    const width = parseFloat(inputs.width) || 0;
    const thickness = parseFloat(inputs.thickness) || 0;

    const mainVolume = length * width * thickness * Math.pow(conversion, 3);

    let voidVolume = 0;
    inputs.voids.forEach((voidItem) => {
      const voidLength = parseFloat(voidItem.length) || 0;
      const voidWidth = parseFloat(voidItem.width) || 0;
      const voidHeight = parseFloat(voidItem.height) || 0;
      const count = voidItem.count || 1;

      const vol =
        voidLength * voidWidth * voidHeight * Math.pow(conversion, 3) * count;
      voidVolume += vol;
    });

    const netVolume = Math.max(mainVolume - voidVolume, 0);
    const selectedMix = mixRatios[inputs.mixRatio as keyof typeof mixRatios];
    const totalParts =
      selectedMix.cement + selectedMix.sand + selectedMix.aggregate;

    const cement = (netVolume * 1440 * selectedMix.cement) / totalParts;
    const materials = {
      cement: Math.ceil(cement),
      sand: Math.ceil(cement * selectedMix.sand),
      aggregate: Math.ceil(cement * selectedMix.aggregate),
      water: Math.ceil(cement * selectedMix.wcRatio),
    };

    const admixtures = {
      retarder: inputs.useRetarder
        ? parseFloat(inputs.retarderAmount) * cement
        : 0,
      plasticizer: inputs.usePlasticizer
        ? parseFloat(inputs.plasticizerAmount) * cement
        : 0,
      accelerator: inputs.useAccelerator
        ? parseFloat(inputs.acceleratorAmount) * cement
        : 0,
    };

    const cementPrice = parseFloat(inputs.cementCost) || 0.3;
    const sandPrice = parseFloat(inputs.sandCost) || 0.05;
    const aggregatePrice = parseFloat(inputs.aggregateCost) || 0.03;

    const costEstimate = Math.round(
      materials.cement * cementPrice +
        materials.sand * sandPrice +
        materials.aggregate * aggregatePrice +
        admixtures.retarder * 2.5 +
        admixtures.plasticizer * 3 +
        admixtures.accelerator * 4
    );

    setResults({
      volume: netVolume,
      materials,
      admixtures,
      costEstimate,
      voidVolume,
      grossVolume: mainVolume,
    });
  }, [inputs, unitConversion]);

  const handleAddVoid = () => {
    setInputs((prev) => ({
      ...prev,
      voids: [
        ...prev.voids,
        {
          id: Date.now(),
          count: 1,
          length: "",
          width: "",
          height: "",
        },
      ],
    }));
  };

  const handleRemoveVoid = (id: number) => {
    setInputs((prev) => ({
      ...prev,
      voids: prev.voids.filter((voidItem) => voidItem.id !== id),
    }));
  };

  const handleVoidChange = (
    id: number,
    field: keyof VoidType,
    value: string | number
  ) => {
    setInputs((prev) => ({
      ...prev,
      voids: prev.voids.map((voidItem) =>
        voidItem.id === id ? { ...voidItem, [field]: value } : voidItem
      ),
    }));
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      if (!resultRef.current) return;

      const canvas = await html2canvas(resultRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("concrete-report.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const ToggleSwitch = ({
    enabled,
    setEnabled,
  }: {
    enabled: boolean;
    setEnabled: (v: boolean) => void;
  }) => (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`${enabled ? "bg-indigo-600" : "bg-gray-200"}
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
    >
      <span
        className={`${enabled ? "translate-x-6" : "translate-x-1"}
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  );

  const InputLabel = ({
    label,
    tooltip,
  }: {
    label: string;
    tooltip: string;
  }) => (
    <div className="flex items-center gap-1 mb-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="group relative">
        <FiInfo className="text-gray-400 h-4 w-4" />
        <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md w-48 text-center">
          {tooltip}
        </div>
      </div>
    </div>
  );

  const materialChartData = {
    labels: ["Cement", "Sand", "Aggregate", "Water"],
    datasets: [
      {
        data: results
          ? [
              results.materials.cement,
              results.materials.sand,
              results.materials.aggregate,
              results.materials.water,
            ]
          : [],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(52, 211, 153, 0.8)",
          "rgba(59, 130, 246, 0.8)",
        ],
      },
    ],
  };

  const admixChartData = {
    labels: ["Retarder", "Plasticizer", "Accelerator"],
    datasets: [
      {
        label: "Admixtures (kg)",
        data: results
          ? [
              results.admixtures.retarder,
              results.admixtures.plasticizer,
              results.admixtures.accelerator,
            ]
          : [],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto my-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Smart Concrete Estimator
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Professional-grade concrete calculations with advanced features
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-2xl border border-indigo-50 bg-gradient-to-br from-white to-indigo-50">
            <div className="flex items-center mb-6">
              <FiSliders className="text-indigo-600 mr-3 text-xl" />
              <h2 className="text-2xl font-bold text-gray-800">
                Project Setup
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <InputLabel
                  label="Concrete Mix Ratio"
                  tooltip="Select standard concrete mix grade (M5 to M80)"
                />
                <select
                  value={inputs.mixRatio}
                  onChange={(e) =>
                    setInputs({ ...inputs, mixRatio: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-black bg-white"
                >
                  {Object.keys(mixRatios).map((ratio) => (
                    <option key={ratio} value={ratio}>
                      {ratio}
                    </option>
                  ))}
                </select>
              </div>

              <motion.div layout className="grid grid-cols-3 gap-4">
                {["length", "width", "thickness"].map((dim) => (
                  <div key={dim}>
                    <InputLabel
                      label={dim.charAt(0).toUpperCase() + dim.slice(1)}
                      tooltip={`${dim} of the concrete slab in ${inputs.unit}`}
                    />
                    <input
                      type="number"
                      value={inputs[dim as "length" | "width" | "thickness"]}
                      onChange={(e) =>
                        setInputs({ ...inputs, [dim]: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-black"
                      placeholder="0"
                    />
                  </div>
                ))}
              </motion.div>

              <div>
                <InputLabel
                  label="Measurement Unit"
                  tooltip="Select your preferred measurement unit"
                />
                <select
                  value={inputs.unit}
                  onChange={(e) =>
                    setInputs({ ...inputs, unit: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-black"
                >
                  {Object.entries({
                    m: "Meters",
                    cm: "Centimeters",
                    mm: "Millimeters",
                    ft: "Feet",
                    inch: "Inches",
                  }).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                    <FiMinusSquare className="mr-2 text-indigo-600" />
                    Void Adjustments
                  </h3>
                  <button
                    onClick={handleAddVoid}
                    className="text-indigo-600 text-sm px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center"
                  >
                    <FiPlus className="mr-1" /> Add Void
                  </button>
                </div>

                <AnimatePresence>
                  {inputs.voids.map((voidItem) => (
                    <motion.div
                      key={voidItem.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="grid grid-cols-12 gap-2 items-center">
                        {["length", "width", "height"].map((dim) => (
                          <div key={dim} className="col-span-3">
                            <input
                              type="number"
                              value={voidItem[dim as keyof VoidType]}
                              onChange={(e) =>
                                handleVoidChange(
                                  voidItem.id,
                                  dim as keyof VoidType,
                                  e.target.value
                                )
                              }
                              placeholder={dim}
                              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-400 text-black"
                            />
                          </div>
                        ))}
                        <div className="col-span-2">
                          <input
                            type="number"
                            value={voidItem.count}
                            onChange={(e) =>
                              handleVoidChange(
                                voidItem.id,
                                "count",
                                e.target.value
                              )
                            }
                            placeholder="Count"
                            className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-400 text-black"
                          />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button
                            onClick={() => handleRemoveVoid(voidItem.id)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <motion.div layout className="grid grid-cols-3 gap-4">
                {[
                  { id: "cementCost", label: "Cement", unit: "$/kg" },
                  { id: "sandCost", label: "Sand", unit: "$/kg" },
                  { id: "aggregateCost", label: "Aggregate", unit: "$/kg" },
                ].map((cost) => (
                  <div key={cost.id}>
                    <InputLabel
                      label={`${cost.label} (${cost.unit})`}
                      tooltip={`Current market price for ${cost.label.toLowerCase()}`}
                    />
                    <input
                      type="number"
                      value={
                        inputs[
                          cost.id as "cementCost" | "sandCost" | "aggregateCost"
                        ]
                      }
                      onChange={(e) =>
                        setInputs({ ...inputs, [cost.id]: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-black"
                      placeholder="0"
                    />
                  </div>
                ))}
              </motion.div>

              <div className="space-y-4">
                {[
                  {
                    id: "retarder",
                    label: "Retarder",
                    amount: inputs.retarderAmount,
                    enabled: inputs.useRetarder,
                    setEnabled: (value: boolean) =>
                      setInputs({ ...inputs, useRetarder: value }),
                  },
                  {
                    id: "plasticizer",
                    label: "Plasticizer",
                    amount: inputs.plasticizerAmount,
                    enabled: inputs.usePlasticizer,
                    setEnabled: (value: boolean) =>
                      setInputs({ ...inputs, usePlasticizer: value }),
                  },
                  {
                    id: "accelerator",
                    label: "Accelerator",
                    amount: inputs.acceleratorAmount,
                    enabled: inputs.useAccelerator,
                    setEnabled: (value: boolean) =>
                      setInputs({ ...inputs, useAccelerator: value }),
                  },
                ].map((adm) => (
                  <div
                    key={adm.id}
                    className="grid grid-cols-12 gap-4 items-center"
                  >
                    <div className="col-span-4">
                      <label className="text-sm font-medium text-gray-700">
                        {adm.label}
                      </label>
                    </div>
                    <div className="col-span-3">
                      <ToggleSwitch
                        enabled={adm.enabled}
                        setEnabled={adm.setEnabled}
                      />
                    </div>
                    <div className="col-span-5">
                      <input
                        type="number"
                        value={adm.amount}
                        onChange={(e) =>
                          setInputs({
                            ...inputs,
                            [`${adm.id}Amount`]: e.target.value,
                          })
                        }
                        className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-400 text-black"
                        disabled={!adm.enabled}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={calculateVolume}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-3
                          font-semibold text-lg shadow-lg hover:shadow-xl transition-all rounded-lg mt-4
                          hover:from-indigo-700 hover:to-blue-700"
              >
                Calculate Volume
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-2xl border border-indigo-50 bg-gradient-to-br from-white to-blue-50 p-6">
            {results ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                ref={resultRef}
                className="space-y-6"
              >
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(JSON.stringify(results))
                    }
                    className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 rounded-lg px-4 py-2 flex items-center"
                  >
                    <FiCopy className="mr-2" /> Copy Data
                  </button>
                  <button
                    onClick={generatePDF}
                    disabled={isGeneratingPDF}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg px-4 py-2 flex items-center
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiDownload className="mr-2" />
                    {isGeneratingPDF ? "Generating..." : "PDF Report"}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-indigo-50 p-5 rounded-xl shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FiBox className="mr-2 text-indigo-600" />
                      Volume Analysis
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Gross Volume:</span>
                        <span className="text-gray-800 font-medium">
                          {results.grossVolume.toFixed(2)} m³
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Void Volume:</span>
                        <span className="text-orange-600 font-medium">
                          {results.voidVolume.toFixed(2)} m³
                        </span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-800 font-semibold">
                            Net Volume:
                          </span>
                          <span className="text-indigo-600 font-bold text-xl">
                            {results.volume.toFixed(2)} m³
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-green-50 p-5 rounded-xl shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FiZap className="mr-2 text-green-600" />
                      Material Requirements
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Cement:</span>
                        <span className="text-gray-800 font-medium">
                          {results.materials.cement} kg
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Sand:</span>
                        <span className="text-gray-800 font-medium">
                          {results.materials.sand} kg
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Aggregate:</span>
                        <span className="text-gray-800 font-medium">
                          {results.materials.aggregate} kg
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Water:</span>
                        <span className="text-gray-800 font-medium">
                          {results.materials.water} L
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <AnimatePresence>
                  {!inputs.useRetarder &&
                    !inputs.usePlasticizer &&
                    !inputs.useAccelerator && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                      >
                        <p className="text-sm text-yellow-800 flex items-center">
                          <FiAlertTriangle className="mr-2 text-yellow-600" />
                          Official recommendation: Apply Waterproof Fixit 101
                          during casting
                        </p>
                      </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <h4 className="text-md font-semibold text-gray-800 mb-4">
                      Material Distribution
                    </h4>
                    <div className="h-64">
                      <Pie data={materialChartData} options={chartOptions} />
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <h4 className="text-md font-semibold text-gray-800 mb-4">
                      Admixture Usage
                    </h4>
                    <div className="h-64">
                      <Bar data={admixChartData} options={chartOptions} />
                    </div>
                  </div>
                </motion.div>

                <div className="bg-indigo-50 p-5 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center ">
                    <FiBox className="mr-2 text-indigo-600" />
                    Cost Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Material Costs:</span>
                      <span className="text-gray-800 font-medium">
                        ${results.costEstimate.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Admixture Costs:</span>
                      <span className="text-gray-800 font-medium">
                        $
                        {(
                          results.admixtures.retarder * 2.5 +
                          results.admixtures.plasticizer * 3 +
                          results.admixtures.accelerator * 4
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 font-semibold">
                          Total Estimated Cost:
                        </span>
                        <span className="text-indigo-600 font-bold text-xl">
                          ${results.costEstimate.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-10"
              >
                <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                    Ready to Calculate
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Enter your project details and click "Calculate Volume" to
                    generate a comprehensive report.
                  </p>
                  <ul className="text-left text-gray-700 space-y-2 mb-4">
                    <li className="flex items-center">
                      <FiBox className="text-indigo-500 mr-2" /> Enter
                      dimensions
                    </li>
                    <li className="flex items-center">
                      <FiMinusSquare className="text-indigo-500 mr-2" /> Add
                      voids (like doors, windows)
                    </li>
                    <li className="flex items-center">
                      <FiZap className="text-indigo-500 mr-2" /> Get material
                      requirements
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcreteVolumeCalculator;
