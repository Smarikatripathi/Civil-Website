"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiDollarSign,
  FiPercent,
  FiClock,
  FiRepeat,
  FiPieChart,
} from "react-icons/fi";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const EMICalculator: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [tenure, setTenure] = useState("5");
  const [emi, setEmi] = useState("");
  const [totalInterest, setTotalInterest] = useState("");
  const [totalPayment, setTotalPayment] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);

  const calculateEMI = () => {
    const principal = parseFloat(amount);
    const rate = parseFloat(interest) / 1200;
    const months = parseFloat(tenure) * 12;

    if (isNaN(principal) || isNaN(rate) || isNaN(months)) {
      setEmi("Invalid Input");
      return;
    }

    const emiValue =
      (principal * rate * Math.pow(1 + rate, months)) /
      (Math.pow(1 + rate, months) - 1);
    const total = emiValue * months;
    const interestAmount = total - principal;

    setEmi(emiValue.toFixed(2));
    setTotalInterest(interestAmount.toFixed(2));
    setTotalPayment(total.toFixed(2));
  };

  useEffect(() => {
    calculateEMI();
  }, [amount, interest, tenure]);

  const chartData = {
    labels: ["Principal", "Interest"],
    datasets: [
      {
        data: [parseFloat(amount) || 0, parseFloat(totalInterest) || 0],
        backgroundColor: ["#3B82F6", "#8B5CF6"],
        borderWidth: 0,
      },
    ],
  };

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
            Smart EMI Calculator
          </h1>

          <div className="grid gap-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
                <div className="flex items-center gap-3 px-6 py-4 bg-white/90 rounded-xl">
                  <FiDollarSign className="text-xl text-blue-500" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Loan Amount"
                    className="w-full bg-transparent border-0 focus:ring-0 text-lg"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
                <div className="flex items-center gap-3 px-6 py-4 bg-white/90 rounded-xl">
                  <FiPercent className="text-xl text-purple-500" />
                  <input
                    type="number"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    placeholder="Interest Rate"
                    className="w-full bg-transparent border-0 focus:ring-0 text-lg"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
                <div className="px-6 py-4 bg-white/90 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Tenure</span>
                    <span className="font-medium">{tenure} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    className="w-full range-lg accent-purple-600"
                  />
                </div>
              </div>
            </div>

            <motion.div
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Monthly EMI</p>
                      <p className="text-3xl font-bold text-purple-600">
                        ₹{emi}
                      </p>
                    </div>
                    <FiRepeat className="text-2xl text-gray-400" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Payment</span>
                      <span className="font-medium">₹{totalPayment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Principal Amount</span>
                      <span>₹{amount || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Interest</span>
                      <span className="text-blue-600">₹{totalInterest}</span>
                    </div>
                  </div>
                </div>

                <div className="h-56">
                  <Pie
                    data={chartData}
                    options={{
                      plugins: {
                        legend: { position: "bottom" },
                        tooltip: { enabled: true },
                      },
                    }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: showSchedule ? "auto" : 0 }}
            >
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiPieChart className="text-purple-500" />
                  Amortization Schedule
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-sm text-gray-600 border-b">
                        <th className="pb-3 text-left">Month</th>
                        <th className="pb-3 text-left">Principal</th>
                        <th className="pb-3 text-left">Interest</th>
                        <th className="pb-3 text-left">Balance</th>
                      </tr>
                    </thead>
                    // In the amortization schedule section
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3">1</td>
                        <td>
                          ₹
                          {(
                            parseFloat(emi) -
                            parseFloat(totalInterest) / 12
                          ).toFixed(2)}
                        </td>
                        <td>₹{(parseFloat(totalInterest) / 12).toFixed(2)}</td>
                        <td>₹{(parseFloat(amount) * 0.95).toFixed(2)}</td>
                      </tr>
                      {/* Add more rows with proper calculation */}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold"
                onClick={calculateEMI}
              >
                Calculate EMI
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 bg-white border border-gray-200 rounded-2xl font-bold"
                onClick={() => setShowSchedule(!showSchedule)}
              >
                {showSchedule ? "Hide" : "Show"} Schedule
              </motion.button>
            </div>
          </div>

          <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-blue-100/50 to-purple-100/50 border-2 border-dashed border-blue-200 text-center">
            <span className="text-sm text-gray-500 italic">
              Premium Financial Tools - Ad Placement Available
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EMICalculator;
