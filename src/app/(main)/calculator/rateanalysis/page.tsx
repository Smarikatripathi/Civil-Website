"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import {
  FiPlus,
  FiTrash2,
  FiDownload,
  FiPrinter,
  FiCopy,
  FiTool,
  FiBox,
  FiUsers,
  FiDollarSign,
} from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

Chart.register(...registerables);

interface CostItem {
  id: string;
  category: "material" | "labor" | "machinery" | "overhead";
  name: string;
  rate: number;
  quantity: number;
  unit: string;
}

const RateAnalysisCalculator = () => {
  const [costItems, setCostItems] = useState<CostItem[]>([]);
  const [activeCategory, setActiveCategory] =
    useState<CostItem["category"]>("material");
  const reportRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: "material", name: "Materials", icon: FiBox },
    { id: "labor", name: "Labor", icon: FiUsers },
    { id: "machinery", name: "Machinery", icon: FiTool },
    { id: "overhead", name: "Overheads", icon: FiDollarSign },
  ];

  const addCostItem = () => {
    const newItem: CostItem = {
      id: Math.random().toString(36).substr(2, 9),
      category: activeCategory,
      name: "",
      rate: 0,
      quantity: 0,
      unit: "units",
    };
    setCostItems([...costItems, newItem]);
  };

  const calculateTotal = (category?: CostItem["category"]) => {
    return costItems
      .filter((item) => !category || item.category === category)
      .reduce((sum, item) => sum + item.rate * item.quantity, 0);
  };

  const exportPDF = async () => {
    if (!reportRef.current) return;

    const pdf = new jsPDF("landscape");
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight - 20);
    pdf.save("rate-analysis-report.pdf");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      costItems.map((item) => ({
        Category: item.category.toUpperCase(),
        Item: item.name,
        Rate: item.rate,
        Quantity: item.quantity,
        Total: item.rate * item.quantity,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rate Analysis");
    XLSX.writeFile(workbook, "rate-analysis.xlsx");
  };

  const copyToClipboard = async () => {
    const text = costItems
      .map(
        (item) =>
          `${item.category}\t${item.name}\t${item.rate}\t${item.quantity}\t${
            item.rate * item.quantity
          }`
      )
      .join("\n");

    await navigator.clipboard.writeText(
      "Category\tItem\tRate\tQuantity\tTotal\n" + text
    );
  };

  const costDistributionData = {
    labels: ["Materials", "Labor", "Machinery", "Overheads"],
    datasets: [
      {
        label: "Cost Distribution",
        data: [
          calculateTotal("material"),
          calculateTotal("labor"),
          calculateTotal("machinery"),
          calculateTotal("overhead"),
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#6366f1"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <h1 className="text-3xl font-bold">Rate Analysis Calculator</h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 p-6">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="grid grid-cols-4 gap-2 mb-6">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  className={`p-3 flex flex-col items-center rounded-xl ${
                    activeCategory === category.id
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() =>
                    setActiveCategory(category.id as CostItem["category"])
                  }
                >
                  <category.icon className="w-6 h-6 mb-2" />
                  <span className="text-sm">{category.name}</span>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {costItems
                .filter((item) => item.category === activeCategory)
                .map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 border rounded-xl bg-gray-50"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Item name"
                        className="p-2 border rounded-lg"
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...costItems];
                          const itemIndex = newItems.findIndex(
                            (i) => i.id === item.id
                          );
                          newItems[itemIndex].name = e.target.value;
                          setCostItems(newItems);
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Rate"
                        className="p-2 border rounded-lg"
                        value={item.rate || ""}
                        onChange={(e) => {
                          const newItems = [...costItems];
                          const itemIndex = newItems.findIndex(
                            (i) => i.id === item.id
                          );
                          newItems[itemIndex].rate = Number(e.target.value);
                          setCostItems(newItems);
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        className="p-2 border rounded-lg"
                        value={item.quantity || ""}
                        onChange={(e) => {
                          const newItems = [...costItems];
                          const itemIndex = newItems.findIndex(
                            (i) => i.id === item.id
                          );
                          newItems[itemIndex].quantity = Number(e.target.value);
                          setCostItems(newItems);
                        }}
                      />
                      <select
                        className="p-2 border rounded-lg"
                        value={item.unit}
                        onChange={(e) => {
                          const newItems = [...costItems];
                          const itemIndex = newItems.findIndex(
                            (i) => i.id === item.id
                          );
                          newItems[itemIndex].unit = e.target.value;
                          setCostItems(newItems);
                        }}
                      >
                        <option value="units">Units</option>
                        <option value="kg">Kilograms</option>
                        <option value="m">Meters</option>
                      </select>
                    </div>
                    <button
                      onClick={() =>
                        setCostItems(costItems.filter((i) => i.id !== item.id))
                      }
                      className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <FiTrash2 className="w-4 h-4" /> Remove
                    </button>
                  </motion.div>
                ))}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addCostItem}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg"
            >
              <FiPlus className="inline mr-2" /> Add{" "}
              {categories.find((c) => c.id === activeCategory)?.name}
            </motion.button>
          </div>

          {/* Results Section */}
          <div
            className="lg:col-span-7 bg-gray-50 rounded-xl p-6"
            ref={reportRef}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Cost Breakdown</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 bg-white rounded-xl shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <category.icon className="text-blue-600" />
                      {category.name}
                    </h3>
                    <p className="text-2xl font-bold mt-2">
                      ₹
                      {calculateTotal(
                        category.id as CostItem["category"]
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="h-64 mb-6">
                <Pie
                  data={costDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                    },
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
                onClick={copyToClipboard}
              >
                <FiCopy /> Copy
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                onClick={exportPDF}
              >
                <FiDownload /> PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                onClick={exportExcel}
              >
                <FiDownload /> Excel
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateAnalysisCalculator;
