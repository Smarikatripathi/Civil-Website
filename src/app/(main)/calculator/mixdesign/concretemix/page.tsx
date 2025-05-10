"use client"; // Essential directive for Next.js App Router components using hooks

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import {
  FiDownload,
  FiPrinter,
  FiCopy,
  FiInfo,
  FiCheckCircle,
  FiAlertTriangle,
  FiLayers,
  FiBarChart2,
  FiActivity,
  FiSliders,
  FiZap,
  FiBox,
  FiThermometer,
  FiMaximize2,
  FiFeather,
  FiHeart,
} from "react-icons/fi";
import { MdWaterDrop } from "react-icons/md";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Register Chart.js components
Chart.register(...registerables);

// Interface defining the structure of the calculated mix design
interface MixDesign {
  targetStrength: number;
  wcRatio: number;
  cement: number;
  water: number;
  fineAgg: number;
  coarseAgg: number;
  density: number;
  admixtures: {
    retarder: number; // Percentage
    plasticizer: number; // Percentage
    accelerator: number; // Percentage
  };
  aggregates: {
    shape: string;
    grading: string;
    maxSize: number;
  };
  workability: string; // e.g., "Low", "Medium", "High"
  ecoImpact: number; // Example: kg CO2 eq. per m³
  strengthDevelopment: {
    days3: number;
    days7: number;
    days28: number;
    days90: number;
  };
}

// Interface for the input state
interface InputsState {
  strength: string;
  exposure: string;
  aggregateType: string;
  maxSize: string;
  slump: string;
  sustainability: string; // Currently unused placeholder
  useRetarder: boolean;
  retarderAmount: string; // Percentage as string
  usePlasticizer: boolean;
  plasticizerAmount: string; // Percentage as string
  useAccelerator: boolean;
  acceleratorAmount: string; // Percentage as string
  cementType: string;
}

// Helper component for displaying key-value details in the results
const DetailItem = ({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
}) => (
  <li className="flex justify-between items-center py-1.5 border-b border-gray-200 last:border-b-0">
    <span className="text-sm font-medium text-gray-600 flex items-center">
      <Icon className="mr-2 text-indigo-600 w-4 h-4" />
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-800">
      {value} {unit}
    </span>
  </li>
);

// Main Calculator Component
const ConcreteMixCalculator: React.FC = () => {
  // State Management
  const [inputs, setInputs] = useState<InputsState>({
    strength: "30",
    exposure: "mild",
    aggregateType: "crushed",
    maxSize: "20",
    slump: "75",
    sustainability: "3", // Placeholder
    useRetarder: false,
    retarderAmount: "0.4", // Default dosage % string
    usePlasticizer: false,
    plasticizerAmount: "0.6", // Default dosage % string
    useAccelerator: false,
    acceleratorAmount: "0.4", // Default dosage % string
    cementType: "OPC",
  });

  const [mixDesign, setMixDesign] = useState<MixDesign | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("design"); // 'design', 'charts', 'strength'
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null); // Ref for capturing results panel for PDF

  // --- Animation Variants (Framer Motion) ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 }, // Faster stagger
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 15 },
    },
  };

  // --- Mix Design Calculation ---
  // IMPORTANT: This is a simplified educational example. Real-world mix design
  // requires adherence to standards (ACI, Eurocode, IS, etc.), material testing,
  // and consideration of many more factors (specific gravity, absorption, fineness modulus, etc.).
  const calculateMix = () => {
    setLoading(true);
    setMixDesign(null); // Clear previous results

    // Simulate async calculation or API call
    setTimeout(() => {
      try {
        // --- Input Parsing ---
        const strength = parseFloat(inputs.strength) || 30;
        const maxSizeAgg = parseInt(inputs.maxSize) || 20;
        const slump = parseFloat(inputs.slump) || 75;
        const aggType = inputs.aggregateType;
        const exposure = inputs.exposure;

        // --- Core Calculations ---

        // 1. Water-Cement Ratio (W/C) - Highly simplified
        let wcRatio = 0.68 - (strength / 100) * 0.6; // Base inverse relation
        if (exposure === "severe" || exposure === "marine")
          wcRatio = Math.min(wcRatio, 0.45);
        else if (exposure === "moderate") wcRatio = Math.min(wcRatio, 0.55);
        wcRatio = Math.max(0.35, wcRatio); // Practical minimum

        // 2. Water Content - Simplified base + adjustments
        let waterContent = 185; // Base kg/m³ for 20mm crushed agg, medium slump
        if (maxSizeAgg === 10) waterContent += 15;
        else if (maxSizeAgg === 40) waterContent -= 20;
        if (aggType === "rounded") waterContent -= 20; // Rounded needs less water
        if (slump > 100 && slump <= 150) waterContent += 10;
        else if (slump > 150) waterContent += 20; // Higher slump needs more water (before plasticizer)

        // 3. Cement Content - Derived from Water and W/C
        let cement = Math.round(waterContent / wcRatio);
        // Apply minimum cement content based on exposure (example values)
        if (exposure === "severe" || exposure === "marine")
          cement = Math.max(cement, 340);
        else if (exposure === "moderate") cement = Math.max(cement, 300);
        cement = Math.max(cement, 280); // Absolute minimum often applied

        // 4. Admixture Adjustments
        let effectiveWcRatio = wcRatio; // W/C ratio remains the target
        let waterReductionPercent = 0;
        if (inputs.usePlasticizer) {
          // Estimate water reduction based on dosage (highly variable in reality)
          waterReductionPercent =
            Math.min(parseFloat(inputs.plasticizerAmount) * 10, 15) / 100; // e.g., 0.6% -> 6% reduction, capped at 15%
          waterContent = Math.round(waterContent * (1 - waterReductionPercent));
          // Recalculate required cement for the NEW water content at the TARGET W/C ratio
          cement = Math.round(waterContent / effectiveWcRatio);
          // Re-check min cement content after adjustment
          if (exposure === "severe" || exposure === "marine")
            cement = Math.max(cement, 340);
          else if (exposure === "moderate") cement = Math.max(cement, 300);
          cement = Math.max(cement, 280);
        }

        // 5. Aggregate Content - By absolute volume (more accurate approach)
        const cementDensity = 3150; // kg/m³ (typical OPC)
        const waterDensity = 1000; // kg/m³
        const aggSpecificGravity = aggType === "crushed" ? 2.68 : 2.65; // Example SSD values
        const airContentPercent = exposure === "severe" ? 0.04 : 0.02; // Higher air for freeze-thaw (simplified)

        const cementVolume = cement / cementDensity;
        const waterVolume = waterContent / waterDensity;
        const admixturesVolume = 0.001; // Assume negligible volume for simplicity
        const airVolume = airContentPercent;
        const totalVolumeExcludingAgg =
          cementVolume + waterVolume + admixturesVolume + airVolume;

        if (totalVolumeExcludingAgg >= 1.0) {
          console.error(
            "Calculated volume of cement, water, and air exceeds 1m³. Check inputs/logic."
          );
          // Handle error - maybe set an error state, alert user
          setLoading(false);
          return; // Stop calculation
        }

        const totalAggVolume = 1.0 - totalVolumeExcludingAgg;

        // Proportion fine/coarse aggregate (Simplified - depends heavily on grading curves, fineness modulus)
        // Using Fuller's curve idea - more fine agg for smaller max size
        let coarseAggVolumeFraction = 0.6; // Base for 20mm
        if (maxSizeAgg === 10) coarseAggVolumeFraction = 0.52;
        else if (maxSizeAgg === 40) coarseAggVolumeFraction = 0.66;
        // Adjust slightly for workability/WCR (fine tuning)
        coarseAggVolumeFraction += (effectiveWcRatio - 0.5) * 0.05;
        coarseAggVolumeFraction = Math.max(
          0.45,
          Math.min(0.7, coarseAggVolumeFraction)
        ); // Bounds

        // Calculate aggregate weights (Volume * Specific Gravity * Water Density)
        const coarseAggWeight = Math.round(
          totalAggVolume * coarseAggVolumeFraction * aggSpecificGravity * 1000
        );
        const fineAggWeight = Math.round(
          totalAggVolume *
            (1 - coarseAggVolumeFraction) *
            aggSpecificGravity *
            1000
        );

        // 6. Final Properties
        const calculatedDensity = Math.round(
          cement + waterContent + fineAggWeight + coarseAggWeight
        ); // kg/m³
        const workabilityStr =
          slump <= 50 ? "Low" : slump <= 125 ? "Medium" : "High";
        // Simplified CO2 estimate (kg CO2 eq / m³) - depends HEAVILY on cement type, SCMs, region
        let cementCO2Factor =
          inputs.cementType === "PPC" || inputs.cementType === "PSC"
            ? 0.7
            : 0.85;
        const ecoImpact = Math.round(cement * cementCO2Factor);

        // 7. Strength Development Estimate
        let earlyStrengthFactor = 1.0;
        if (inputs.useRetarder) earlyStrengthFactor *= 0.8; // Slower early gain
        if (inputs.useAccelerator) earlyStrengthFactor *= 1.2; // Faster early gain
        // Adjust base percentages (typical for OPC)
        const strengthDev = {
          days3: Math.round(strength * 0.45 * earlyStrengthFactor),
          days7: Math.round(strength * 0.65 * (inputs.useRetarder ? 0.9 : 1.0)), // Retarder effect lingers
          days28: Math.round(strength * 1.0), // Target
          days90: Math.round(strength * 1.15), // Typical gain beyond 28d
        };

        // Create the final mix design object
        const finalMix: MixDesign = {
          targetStrength: strength,
          wcRatio: Number(effectiveWcRatio.toFixed(2)),
          cement: cement,
          water: waterContent,
          fineAgg: fineAggWeight,
          coarseAgg: coarseAggWeight,
          density: calculatedDensity,
          admixtures: {
            retarder: inputs.useRetarder
              ? parseFloat(inputs.retarderAmount)
              : 0,
            plasticizer: inputs.usePlasticizer
              ? parseFloat(inputs.plasticizerAmount)
              : 0,
            accelerator: inputs.useAccelerator
              ? parseFloat(inputs.acceleratorAmount)
              : 0,
          },
          aggregates: {
            shape: aggType === "crushed" ? "Angular" : "Rounded",
            // Grading estimation is complex, simplifying here
            grading:
              maxSizeAgg > 20
                ? "Coarser"
                : maxSizeAgg < 20
                ? "Finer"
                : "Medium",
            maxSize: maxSizeAgg,
          },
          workability: workabilityStr,
          ecoImpact: ecoImpact,
          strengthDevelopment: strengthDev,
        };

        setMixDesign(finalMix);
        setActiveTab("design"); // Switch to results tab
      } catch (error) {
        console.error("Error during mix calculation:", error);
        // Optionally set an error state to display to the user
      } finally {
        setLoading(false);
      }
    }, 1000); // Simulate calculation time
  };

  // --- Chart Data ---
  // Memoize chart data to prevent recalculation unless mixDesign changes
  const materialChartData = React.useMemo(
    () => ({
      labels: ["Cement", "Water", "Fine Agg.", "Coarse Agg."],
      datasets: [
        {
          label: "Materials (kg/m³)",
          data: mixDesign
            ? [
                mixDesign.cement,
                mixDesign.water,
                mixDesign.fineAgg,
                mixDesign.coarseAgg,
              ]
            : [],
          backgroundColor: [
            "rgba(99, 102, 241, 0.8)", // Indigo
            "rgba(59, 130, 246, 0.8)", // Blue
            "rgba(251, 191, 36, 0.8)", // Amber
            "rgba(107, 114, 128, 0.8)", // Gray
          ],
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    }),
    [mixDesign]
  );

  const strengthChartData = React.useMemo(
    () => ({
      labels: ["3 Days", "7 Days", "28 Days", "90 Days"],
      datasets: [
        {
          label: `Strength Development (Target: ${
            mixDesign?.targetStrength || "-"
          } N/mm²)`,
          data: mixDesign
            ? [
                mixDesign.strengthDevelopment.days3,
                mixDesign.strengthDevelopment.days7,
                mixDesign.strengthDevelopment.days28,
                mixDesign.strengthDevelopment.days90,
              ]
            : [],
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          pointBackgroundColor: "rgb(99, 102, 241)",
          pointBorderColor: "#fff",
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(99, 102, 241)",
          fill: true,
          tension: 0.3, // Slightly less curvy lines
        },
      ],
    }),
    [mixDesign]
  );

  // --- Common Chart Options ---
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { color: "#374151", boxWidth: 12, padding: 20 },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "rgb(229, 231, 235)",
        bodyColor: "rgb(209, 213, 219)",
        borderColor: "rgba(55, 65, 81, 1)",
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          // Example tooltip customization: add unit
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              // Check if it's the strength chart to add N/mm²
              if (context.dataset.label.startsWith("Strength")) {
                label += `${context.parsed.y} N/mm²`;
              } else {
                label += `${context.parsed.y} kg/m³`; // Assume material chart
              }
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(209, 213, 219, 0.6)" }, // Lighter grid lines
        ticks: { color: "#4b5563", precision: 0 }, // Gray ticks, no decimals
      },
      x: {
        grid: { display: false }, // Hide vertical grid lines
        ticks: { color: "#4b5563" },
      },
    },
    // interaction: { // Optional: Enhance hover/tooltip behavior
    //   mode: 'index' as const,
    //   intersect: false,
    // },
  };

  // --- Event Handlers ---
  const handleCopy = () => {
    if (!mixDesign) return;
    // Create a more detailed text summary for copying
    const designText = `--- Concrete Mix Design Summary ---
Target Strength (28d): ${mixDesign.targetStrength} N/mm²
Exposure Class: ${
      inputs.exposure.charAt(0).toUpperCase() + inputs.exposure.slice(1)
    }
Cement Type: ${inputs.cementType}

Proportions per m³:
  Cement: ${mixDesign.cement} kg
  Water: ${mixDesign.water} kg
  Fine Aggregate (${mixDesign.aggregates.shape}): ${mixDesign.fineAgg} kg
  Coarse Aggregate (${mixDesign.aggregates.maxSize}mm Max): ${
      mixDesign.coarseAgg
    } kg
  Water/Cement Ratio (W/C): ${mixDesign.wcRatio}

Properties:
  Estimated Density: ${mixDesign.density} kg/m³
  Workability (Slump ~${inputs.slump}mm): ${mixDesign.workability}
  Est. CO₂ Impact: ${mixDesign.ecoImpact} kg eq./m³

Admixtures (% by cement weight):
  Retarder: ${
    mixDesign.admixtures.retarder > 0
      ? `${mixDesign.admixtures.retarder}%`
      : "None"
  }
  Plasticizer/Superplasticizer: ${
    mixDesign.admixtures.plasticizer > 0
      ? `${mixDesign.admixtures.plasticizer}%`
      : "None"
  }
  Accelerator: ${
    mixDesign.admixtures.accelerator > 0
      ? `${mixDesign.admixtures.accelerator}%`
      : "None"
  }

Estimated Strength Development:
  3 Days: ${mixDesign.strengthDevelopment.days3} N/mm²
  7 Days: ${mixDesign.strengthDevelopment.days7} N/mm²
  28 Days: ${mixDesign.strengthDevelopment.days28} N/mm²
  90 Days: ${mixDesign.strengthDevelopment.days90} N/mm²

Note: This is a calculated estimate based on simplified models. Actual performance requires lab verification.
Generated on: ${new Date().toLocaleString()}
`;
    navigator.clipboard
      .writeText(designText.trim())
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500); // Reset feedback after 2.5 seconds
      })
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  const handleDownloadPDF = () => {
    if (!resultRef.current || !mixDesign) {
      alert("Please generate a mix design first.");
      return;
    }

    const reportTitle = "Concrete Mix Design Report";
    const inputSummary = `Parameters Used: Strength=${inputs.strength} N/mm², Exposure=${inputs.exposure}, Max Agg.=${inputs.maxSize}mm, Slump=${inputs.slump}mm, Cement=${inputs.cementType}, Agg. Type=${inputs.aggregateType}`;
    const generatedTime = `Report generated on: ${new Date().toLocaleString()}`;
    const disclaimer =
      "Disclaimer: This report is based on simplified calculations. Verify with lab tests before use.";

    html2canvas(resultRef.current, {
      scale: 2, // Improve image resolution
      useCORS: true,
      backgroundColor: "#ffffff", // Ensure canvas has a white background
      logging: false, // Suppress console logging from html2canvas
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png", 0.95); // Slightly compressed PNG
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 40;
        const contentWidth = pdfWidth - margin * 2;
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

        let currentHeight = margin;

        // --- PDF Header ---
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text(reportTitle, pdfWidth / 2, currentHeight, { align: "center" });
        currentHeight += 30;

        // --- Input Parameters Used ---
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(9);
        pdf.setTextColor(100); // Gray color
        pdf.text(inputSummary, margin, currentHeight, {
          maxWidth: contentWidth,
        });
        currentHeight += 20;

        // --- Add Generated Image of Results ---
        const maxImageHeight = pdfHeight - currentHeight - margin - 30; // Space for footer
        if (imgHeight <= maxImageHeight) {
          pdf.addImage(
            imgData,
            "PNG",
            margin,
            currentHeight,
            contentWidth,
            imgHeight
          );
          currentHeight += imgHeight;
        } else {
          // If image is too tall, add what fits and note truncation or consider splitting
          console.warn(
            "PDF Export Warning: Results panel content is too long to fit completely on one page. Image may be cropped."
          );
          pdf.addImage(
            imgData,
            "PNG",
            margin,
            currentHeight,
            contentWidth,
            maxImageHeight,
            undefined,
            "FAST"
          );
          currentHeight += maxImageHeight;
          pdf.setFont("helvetica", "italic");
          pdf.setFontSize(8);
          pdf.setTextColor(150);
          pdf.text(
            "(Note: Results panel content truncated to fit page)",
            margin,
            currentHeight + 10
          );
        }

        // --- PDF Footer ---
        currentHeight = pdfHeight - margin; // Position footer at the bottom
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(generatedTime, margin, currentHeight);
        pdf.text(disclaimer, pdfWidth - margin, currentHeight, {
          align: "right",
        });

        // --- Save PDF ---
        pdf.save(
          `Concrete-Mix-Design-${inputs.strength}MPa-${new Date()
            .toISOString()
            .slice(0, 10)}.pdf`
        );
      })
      .catch((err) => {
        console.error("Error generating PDF:", err);
        alert("Failed to generate PDF report. See console for details.");
      });
  };

  // --- JSX Structure ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Advanced Concrete Mix Designer
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">
            Optimize concrete mix proportions based on strength, durability,
            workability, and admixture requirements. (Educational Tool)
          </p>
        </motion.div>
        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Input Panel (Left Side) */}
          <motion.div
            className="lg:col-span-5 bg-white rounded-xl p-6 shadow-lg border border-gray-200"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center mb-6 text-indigo-700">
              <FiSliders className="mr-3 text-2xl flex-shrink-0" />
              <h2 className="text-2xl font-bold text-gray-800">
                Design Parameters
              </h2>
            </div>

            {/* Input Form Fields */}
            <motion.div className="space-y-5" variants={containerVariants}>
              {/* Target Strength */}
              <motion.div variants={itemVariants}>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="strength-input"
                    className="text-sm font-medium text-gray-700 flex items-center"
                  >
                    Target 28-Day Strength{" "}
                    <FiZap className="ml-2 text-yellow-500" />
                  </label>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-0.5 rounded-full text-sm font-semibold tabular-nums">
                    {inputs.strength} N/mm²
                  </span>
                </div>
                <input
                  id="strength-input"
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={inputs.strength}
                  onChange={(e) =>
                    setInputs({ ...inputs, strength: e.target.value })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  aria-label="Target Strength Slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                  <span>20</span> <span>40</span> <span>60</span>{" "}
                  <span>80</span>
                </div>
              </motion.div>

              {/* Environment & Aggregate Settings Grid */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-4"
              >
                {/* Exposure Class */}
                <div>
                  <label
                    htmlFor="exposure-select"
                    className="text-sm font-medium text-gray-700 block mb-1 flex items-center"
                  >
                    <FiThermometer className="mr-1 text-red-500 w-4 h-4" />{" "}
                    Exposure
                  </label>
                  <select
                    id="exposure-select"
                    value={inputs.exposure}
                    onChange={(e) =>
                      setInputs({ ...inputs, exposure: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                  >
                    {["mild", "moderate", "severe", "marine"].map((opt) => (
                      <option key={opt} value={opt} className="capitalize">
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Max Aggregate Size */}
                <div>
                  <label
                    htmlFor="maxsize-select"
                    className="text-sm font-medium text-gray-700 block mb-1 flex items-center"
                  >
                    <FiMaximize2 className="mr-1 text-gray-600 w-4 h-4" /> Max
                    Agg. Size
                  </label>
                  <select
                    id="maxsize-select"
                    value={inputs.maxSize}
                    onChange={(e) =>
                      setInputs({ ...inputs, maxSize: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                  >
                    {["10", "20", "40"].map((size) => (
                      <option key={size} value={size}>
                        {size} mm
                      </option>
                    ))}
                  </select>
                </div>
                {/* Target Slump */}
                <div>
                  <label
                    htmlFor="slump-select"
                    className="text-sm font-medium text-gray-700 block mb-1 flex items-center"
                  >
                    <FiFeather className="mr-1 text-blue-500 w-4 h-4" /> Target
                    Slump
                  </label>
                  <select
                    id="slump-select"
                    value={inputs.slump}
                    onChange={(e) =>
                      setInputs({ ...inputs, slump: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                  >
                    {["25", "50", "75", "100", "125", "150", "175"].map(
                      (
                        sl // Added 175
                      ) => (
                        <option key={sl} value={sl}>
                          {sl} mm
                        </option>
                      )
                    )}
                  </select>
                </div>
                {/* Aggregate Type */}
                <div>
                  <label
                    htmlFor="aggtype-select"
                    className="text-sm font-medium text-gray-700 block mb-1 flex items-center"
                  >
                    <FiBox className="mr-1 text-yellow-700 w-4 h-4" /> Agg. Type
                  </label>
                  <select
                    id="aggtype-select"
                    value={inputs.aggregateType}
                    onChange={(e) =>
                      setInputs({ ...inputs, aggregateType: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                  >
                    <option value="crushed">Crushed (Angular)</option>
                    <option value="rounded">Rounded (Gravel)</option>
                  </select>
                </div>
              </motion.div>

              {/* Cement Type */}
              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                  <FiLayers className="mr-1 text-gray-500 w-4 h-4" /> Cement
                  Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["OPC", "PPC", "PSC"].map(
                    (
                      type // OPC: Ordinary Portland, PPC: Portland Pozzolana, PSC: Portland Slag
                    ) => (
                      <button
                        key={type}
                        type="button" // Important for buttons inside forms/divs
                        onClick={() =>
                          setInputs({ ...inputs, cementType: type })
                        }
                        className={`py-2 px-1 text-sm rounded-lg transition-all duration-200 border ${
                          inputs.cementType === type
                            ? "bg-indigo-600 text-white shadow-md ring-2 ring-offset-1 ring-indigo-400 border-indigo-600"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                        }`}
                        aria-pressed={inputs.cementType === type}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
              </motion.div>

              {/* Admixtures Section */}
              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                  <MdWaterDrop className="mr-2 text-blue-600 w-4 h-4" />{" "}
                  Admixtures (% by cement weight)
                </label>
                <div className="space-y-3">
                  {[
                    // Define admixture details
                    {
                      id: "retarder",
                      label: "Retarder",
                      useKey: "useRetarder",
                      amountKey: "retarderAmount",
                      icon: FiAlertTriangle,
                      color: "text-orange-500",
                      options: ["0.2", "0.3", "0.4", "0.5", "0.6"],
                    },
                    {
                      id: "plasticizer",
                      label: "Plasticizer",
                      useKey: "usePlasticizer",
                      amountKey: "plasticizerAmount",
                      icon: MdWaterDrop,
                      color: "text-blue-500",
                      options: ["0.2", "0.4", "0.6", "0.8", "1.0", "1.2"],
                    },
                    {
                      id: "accelerator",
                      label: "Accelerator",
                      useKey: "useAccelerator",
                      amountKey: "acceleratorAmount",
                      icon: FiZap,
                      color: "text-green-500",
                      options: ["0.2", "0.4", "0.6", "0.8", "1.0"],
                    },
                  ].map((adm) => (
                    <div
                      key={adm.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[50px]"
                    >
                      {" "}
                      {/* Ensure consistent height */}
                      <div className="flex items-center flex-grow mr-2">
                        <input
                          type="checkbox"
                          id={adm.id + "-checkbox"} // Unique ID for label association
                          checked={
                            inputs[adm.useKey as keyof InputsState] as boolean
                          }
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              [adm.useKey]: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-offset-0 shrink-0"
                          aria-labelledby={adm.id + "-label"}
                        />
                        <label
                          htmlFor={adm.id + "-checkbox"}
                          id={adm.id + "-label"}
                          className={`ml-3 text-sm text-gray-800 flex items-center font-medium cursor-pointer ${adm.color}`}
                        >
                          <adm.icon className="mr-1.5 w-4 h-4 shrink-0" />
                          {adm.label}
                        </label>
                      </div>
                      {/* Conditionally show dropdown */}
                      <motion.div
                        initial={false} // Don't animate on initial render
                        animate={
                          inputs[adm.useKey as keyof InputsState]
                            ? { opacity: 1, width: "auto", x: 0 }
                            : { opacity: 0, width: 0, x: -10 }
                        }
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden shrink-0" // Prevents content jump during animation
                      >
                        {inputs[adm.useKey as keyof InputsState] && ( // Double check ensures select doesn't render when hidden
                          <select
                            value={
                              inputs[
                                adm.amountKey as keyof InputsState
                              ] as string
                            } // ** TypeScript Fix: Added 'as string' **
                            onChange={(e) =>
                              setInputs((prev) => ({
                                ...prev,
                                [adm.amountKey]: e.target.value,
                              }))
                            }
                            className="p-1 text-xs border border-gray-300 rounded-md w-20 bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            aria-label={`${adm.label} Dosage`}
                          >
                            {adm.options.map((val) => (
                              <option key={val} value={val}>
                                {val}%
                              </option>
                            ))}
                          </select>
                        )}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Calculate Button */}
              <motion.div variants={itemVariants} className="pt-4">
                <button
                  type="button"
                  onClick={calculateMix}
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700
                           text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300
                           flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 border-white mr-3"></div>
                      Calculating Mix...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="mr-2" />
                      Generate Mix Design
                    </>
                  )}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>{" "}
          {/* End Input Panel */}
          {/* Results Panel (Right Side) */}
          {/* Added ref here for PDF capture */}
          <div
            ref={resultRef}
            className="lg:col-span-7 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col"
          >
            {/* Results Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50 rounded-t-xl flex-shrink-0">
              {[
                // Define tabs configuration
                { id: "design", label: "Mix Details", icon: FiLayers },
                { id: "charts", label: "Proportions Chart", icon: FiBarChart2 },
                {
                  id: "strength",
                  label: "Performance Chart",
                  icon: FiActivity,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-2 md:px-4 text-center font-medium transition-colors duration-200 text-sm md:text-base border-b-2 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:z-10
                    ${
                      activeTab === tab.id
                        ? "text-indigo-600 border-indigo-600 bg-white"
                        : "text-gray-500 hover:text-indigo-500 border-transparent"
                    }`}
                  aria-current={activeTab === tab.id ? "page" : undefined}
                >
                  <div className="flex items-center justify-center">
                    <tab.icon className="mr-1.5 md:mr-2 w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
            {/* Results Content Area */}
            <div className="p-5 md:p-6 flex-grow min-h-[450px] relative">
              {" "}
              {/* Ensure min height and relative for potential absolute positioned elements */}
              {/* Placeholder/Loading States */}
              {!mixDesign && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 pt-10">
                  <FiBox className="text-6xl mb-4 opacity-50" />
                  <p className="text-xl font-medium">No Mix Design Generated</p>
                  <p className="text-sm mt-2 max-w-xs">
                    Adjust parameters and click 'Generate Mix Design' to see
                    results.
                  </p>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-indigo-500 mb-4"></div>
                  <p className="text-lg font-medium text-gray-600">
                    Calculating Optimal Mix...
                  </p>
                  <p className="text-sm mt-1 text-gray-500">Please wait...</p>
                </div>
              )}
              {/* Display Results when available */}
              {mixDesign && !loading && (
                <motion.div // Animate content switching between tabs
                  key={activeTab} // Ensures animation runs when tab changes
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Action Buttons (Only shown on Design Tab) */}
                  {activeTab === "design" && (
                    <div className="flex flex-wrap justify-end gap-2 mb-5 -mt-1">
                      <button
                        type="button"
                        onClick={handleCopy}
                        title="Copy summary text"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                      >
                        <FiCopy className="w-3.5 h-3.5" />{" "}
                        {copied ? "Copied!" : "Copy Text"}
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        title="Print page"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                      >
                        <FiPrinter className="w-3.5 h-3.5" /> Print
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadPDF}
                        title="Download as PDF Report"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                      >
                        <FiDownload className="w-3.5 h-3.5" /> PDF Report
                      </button>
                    </div>
                  )}

                  {/* Design Tab Content */}
                  {activeTab === "design" && (
                    <div className="space-y-5">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Generated Mix Proportions (per m³)
                      </h3>
                      {/* Mix Summary Grid */}
                      <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Column 1: Core Components */}
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-blue-100 shadow-sm">
                          <h4 className="text-md font-semibold text-indigo-800 mb-3 flex items-center">
                            <FiLayers className="mr-2 w-5 h-5" /> Core
                            Components
                          </h4>
                          <ul className="space-y-1">
                            <DetailItem
                              icon={FiZap}
                              label="Target Strength (28d)"
                              value={mixDesign.targetStrength}
                              unit="N/mm²"
                            />
                            <DetailItem
                              icon={MdWaterDrop}
                              label="W/C Ratio"
                              value={mixDesign.wcRatio}
                            />
                            <DetailItem
                              icon={FiBox}
                              label="Cement Content"
                              value={mixDesign.cement}
                              unit="kg"
                            />
                            <DetailItem
                              icon={MdWaterDrop}
                              label="Water Content"
                              value={mixDesign.water}
                              unit="kg"
                            />
                            <DetailItem
                              icon={FiMaximize2}
                              label="Coarse Aggregate"
                              value={mixDesign.coarseAgg}
                              unit="kg"
                            />
                            <DetailItem
                              icon={FiMaximize2}
                              label="Fine Aggregate (Sand)"
                              value={mixDesign.fineAgg}
                              unit="kg"
                            />
                          </ul>
                        </div>

                        {/* Column 2: Properties & Additives */}
                        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4 border border-green-100 shadow-sm">
                          <h4 className="text-md font-semibold text-teal-800 mb-3 flex items-center">
                            <FiInfo className="mr-2 w-5 h-5" /> Properties &
                            Additives
                          </h4>
                          <ul className="space-y-1">
                            <DetailItem
                              icon={FiFeather}
                              label="Estimated Density"
                              value={mixDesign.density}
                              unit="kg/m³"
                            />
                            <DetailItem
                              icon={FiActivity}
                              label="Workability Class"
                              value={mixDesign.workability}
                            />
                            <DetailItem
                              icon={FiMaximize2}
                              label="Max Aggregate Size"
                              value={mixDesign.aggregates.maxSize}
                              unit="mm"
                            />
                            <DetailItem
                              icon={FiBox}
                              label="Aggregate Shape"
                              value={mixDesign.aggregates.shape}
                            />
                            <DetailItem
                              icon={FiHeart}
                              label="Est. CO₂ Impact"
                              value={mixDesign.ecoImpact}
                              unit="kg eq/m³"
                            />
                            <DetailItem
                              icon={FiAlertTriangle}
                              label="Retarder"
                              value={
                                mixDesign.admixtures.retarder > 0
                                  ? `${mixDesign.admixtures.retarder}%`
                                  : "None"
                              }
                            />
                            <DetailItem
                              icon={MdWaterDrop}
                              label="Plasticizer"
                              value={
                                mixDesign.admixtures.plasticizer > 0
                                  ? `${mixDesign.admixtures.plasticizer}%`
                                  : "None"
                              }
                            />
                            <DetailItem
                              icon={FiZap}
                              label="Accelerator"
                              value={
                                mixDesign.admixtures.accelerator > 0
                                  ? `${mixDesign.admixtures.accelerator}%`
                                  : "None"
                              }
                            />
                          </ul>
                        </div>
                      </div>
                      {/* Input Conditions Summary */}
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Based on Input Parameters:
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          Exposure:{" "}
                          <span className="font-medium capitalize">
                            {inputs.exposure}
                          </span>
                          , Cement:{" "}
                          <span className="font-medium">
                            {inputs.cementType}
                          </span>
                          , Slump:{" "}
                          <span className="font-medium">{inputs.slump} mm</span>
                          , Agg. Type:{" "}
                          <span className="font-medium">
                            {inputs.aggregateType}
                          </span>
                          , Max Agg Size:{" "}
                          <span className="font-medium">
                            {inputs.maxSize} mm
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Charts Tab Content */}
                  {activeTab === "charts" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                          Material Proportions (kg/m³)
                        </h3>
                        <div className="h-80 md:h-96 relative">
                          {" "}
                          {/* Increased height */}
                          <Bar
                            data={materialChartData}
                            options={chartOptions}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Strength Tab Content */}
                  {activeTab === "strength" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                          Estimated Strength Development Curve
                        </h3>
                        <div className="h-80 md:h-96 relative">
                          {" "}
                          {/* Increased height */}
                          <Line
                            data={strengthChartData}
                            options={chartOptions}
                          />
                        </div>
                      </div>
                      {/* Strength values Table */}
                      <div className="overflow-x-auto mt-6">
                        <h4 className="text-md font-semibold text-gray-700 mb-2">
                          Strength Summary:
                        </h4>
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm">
                          <thead className="bg-gray-50">
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 px-3 md:px-4 font-semibold text-gray-600">
                                Age
                              </th>
                              <th className="text-right py-2 px-3 md:px-4 font-semibold text-gray-600">
                                Est. Strength (N/mm²)
                              </th>
                              <th className="text-right py-2 px-3 md:px-4 font-semibold text-gray-600">
                                % of 28d Target
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {Object.entries(mixDesign.strengthDevelopment).map(
                              ([key, value]) => {
                                const days = key.replace("days", "");
                                const percentage =
                                  mixDesign.targetStrength > 0
                                    ? (
                                        (value / mixDesign.targetStrength) *
                                        100
                                      ).toFixed(0)
                                    : "N/A";
                                return (
                                  <tr key={key} className="hover:bg-gray-50">
                                    <td className="py-2 px-3 md:px-4 text-gray-700">
                                      {days} Days
                                    </td>
                                    <td className="py-2 px-3 md:px-4 text-gray-800 font-medium text-right tabular-nums">
                                      {value}
                                    </td>
                                    <td className="py-2 px-3 md:px-4 text-gray-600 text-right tabular-nums">
                                      {percentage}%
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div> // End tab content animation wrapper
              )}
            </div>{" "}
            {/* End Results Content Area */}
          </div>{" "}
          {/* End Results Panel */}
        </div>{" "}
        {/* End Main Grid Layout */}
        {/* Optional Footer */}
        <footer className="text-center mt-10 text-xs text-gray-500">
          <p>Concrete Mix Designer v1.0 (Educational Tool)</p>
          <p>
            Calculations are illustrative. Always verify mix designs with lab
            testing and local standards.
          </p>
          <p>&copy; {new Date().getFullYear()}</p>
        </footer>
      </div>{" "}
      {/* End Max Width Container */}
    </div> // End Main Div
  );
};

export default ConcreteMixCalculator;
