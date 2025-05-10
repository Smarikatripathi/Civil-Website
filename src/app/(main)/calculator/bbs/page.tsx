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
  FiSliders,
  FiCheckCircle,
} from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

Chart.register(...registerables);

interface BBSItem {
  id: string;
  elementType: string;
  barType: string;
  diameter: number;
  length: number;
  quantity: number;
  bends: number;
  clearCover: number;
  bendingShape: string;
}

const BBSCalculator = () => {
  const [bbsItems, setBbsItems] = useState<BBSItem[]>([]);
  const [currentItem, setCurrentItem] = useState<BBSItem>({
    id: "",
    elementType: "Beam",
    barType: "T12",
    diameter: 12,
    length: 0,
    quantity: 0,
    bends: 0,
    clearCover: 25,
    bendingShape: "Straight",
  });
  const reportRef = useRef<HTMLDivElement>(null);

  const addBBSItem = () => {
    const newItem = {
      ...currentItem,
      id: Math.random().toString(36).substr(2, 9),
    };
    setBbsItems([...bbsItems, newItem]);
    setCurrentItem({
      id: "",
      elementType: "Beam",
      barType: "T12",
      diameter: 12,
      length: 0,
      quantity: 0,
      bends: 0,
      clearCover: 25,
      bendingShape: "Straight",
    });
  };

  const calculateCuttingLength = (item: BBSItem) => {
    let length = item.length - 2 * item.clearCover;
    if (item.bendingShape !== "Straight") {
      length += item.bends * (4 * item.diameter); // 4d per bend
    }
    return length;
  };

  const calculateWeight = (item: BBSItem) => {
    const cuttingLength = calculateCuttingLength(item);
    return (
      ((Math.PI * Math.pow(item.diameter, 2) * cuttingLength) / 162) *
      item.quantity
    );
  };

  const exportPDF = async () => {
    if (!reportRef.current) return;

    const pdf = new jsPDF("landscape");
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight - 20);
    pdf.save("bbs-report.pdf");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      bbsItems.map((item) => ({
        "Element Type": item.elementType,
        "Bar Type": item.barType,
        Diameter: item.diameter,
        "Cutting Length": calculateCuttingLength(item),
        Quantity: item.quantity,
        "Total Weight": calculateWeight(item),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BBS Report");
    XLSX.writeFile(workbook, "bbs-report.xlsx");
  };

  const copyToClipboard = async () => {
    const text = bbsItems
      .map(
        (item) =>
          `${item.elementType}\t${item.barType}\t${
            item.diameter
          }mm\t${calculateCuttingLength(item)}mm\t${
            item.quantity
          }\t${calculateWeight(item).toFixed(2)}kg`
      )
      .join("\n");

    await navigator.clipboard.writeText(
      "Element Type\tBar Type\tDiameter\tCutting Length\tQuantity\tTotal Weight\n" +
        text
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <h1 className="text-3xl font-bold">
            Bar Bending Schedule Calculator
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 p-6">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  Structural Element
                </label>
                <select
                  className="w-full p-2 border rounded-lg text-black"
                  value={currentItem.elementType}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      elementType: e.target.value,
                    })
                  }
                >
                  {["Beam", "Slab", "Column", "Foundation"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  Bar Type
                </label>
                <select
                  className="w-full p-2 border rounded-lg text-black"
                  value={currentItem.barType}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      barType: e.target.value,
                      diameter: parseInt(e.target.value.replace("T", "")),
                    })
                  }
                >
                  {["T12", "T16", "T20", "T25", "T32"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  Bar Length (mm)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg text-black"
                  value={currentItem.length || ""}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      length: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  Quantity
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg text-black"
                  value={currentItem.quantity || ""}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  Bending Shape
                </label>
                <select
                  className="w-full p-2 border rounded-lg text-black"
                  value={currentItem.bendingShape}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      bendingShape: e.target.value,
                    })
                  }
                >
                  {["Straight", "Bent"].map((shape) => (
                    <option key={shape} value={shape}>
                      {shape}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  Clear Cover (mm)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg text-black"
                  value={currentItem.clearCover || ""}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      clearCover: Number(e.target.value),
                    })
                  }
                />
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addBBSItem}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg text-black"
            >
              <FiPlus className="inline mr-2" /> Add Bar
            </motion.button>
          </div>

          {/* Results Section */}
          <div
            className="lg:col-span-7 bg-gray-50 rounded-xl p-6 text-black"
            ref={reportRef}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Bar Bending Schedule</h2>
              <div className="overflow-x-auto shadow-sm rounded-xl">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      {[
                        "Element",
                        "Bar Type",
                        "Diameter",
                        "Cutting Length",
                        "Quantity",
                        "Weight",
                      ].map((header) => (
                        <th
                          key={header}
                          className="p-3 text-left text-sm font-semibold"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {bbsItems.map((item) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b even:bg-gray-50"
                        >
                          <td className="p-3">{item.elementType}</td>
                          <td className="p-3">{item.barType}</td>
                          <td className="p-3">{item.diameter}mm</td>
                          <td className="p-3">
                            {calculateCuttingLength(item)}mm
                          </td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3 font-semibold">
                            {calculateWeight(item).toFixed(2)}kg
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 "
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

export default BBSCalculator;
