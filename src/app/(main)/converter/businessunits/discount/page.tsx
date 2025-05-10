"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiPercent,
  FiTag,
  FiGrid,
  FiDollarSign,
} from "react-icons/fi";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DiscountCalculator: React.FC = () => {
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<string>("");
  const [discountedPrice, setDiscountedPrice] = useState<string>("");
  const [amountSaved, setAmountSaved] = useState<string>("");

  const chartData = {
    labels: ["Original Price", "You Save"],
    datasets: [
      {
        data: [parseFloat(originalPrice) || 0, parseFloat(amountSaved) || 0],
        backgroundColor: ["#3B82F6", "#8B5CF6"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const calculateDiscount = () => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);

    if (isNaN(price) || isNaN(discount)) {
      setDiscountedPrice("Invalid input");
      return;
    }

    const savings = (price * discount) / 100;
    const finalPrice = price - savings;

    setAmountSaved(savings.toFixed(2));
    setDiscountedPrice(finalPrice.toFixed(2));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") calculateDiscount();
  };

  const popularDiscounts = [10, 20, 25, 30, 40, 50];

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
            Discount Calculator
          </h1>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
              <FiGrid className="text-blue-500" />
              Popular Discounts
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {popularDiscounts.map((discount) => (
                <motion.button
                  key={discount}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDiscountPercent(discount.toString())}
                  className={`p-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    discountPercent === discount.toString()
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <FiPercent className="text-sm" />
                  <span>{discount}% Off</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/90 rounded-xl">
                    <FiDollarSign className="text-xl text-blue-500" />
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="w-full bg-transparent border-0 focus:ring-0 text-lg"
                      placeholder="Original Price"
                    />
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/90 rounded-xl">
                    <FiPercent className="text-xl text-purple-500" />
                    <input
                      type="number"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="w-full bg-transparent border-0 focus:ring-0 text-lg"
                      placeholder="Discount %"
                    />
                  </div>
                </div>
              </div>

              <motion.button
                onClick={calculateDiscount}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all text-xl"
              >
                CALCULATE
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">
                      Discounted Price
                    </h3>
                    <div className="text-4xl font-bold text-purple-600">
                      ${discountedPrice || "0.00"}
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Original Price</p>
                      <p className="font-medium">${originalPrice || "0.00"}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">You Save</p>
                      <p className="font-medium text-green-600">
                        ${amountSaved || "0.00"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-56">
                  <Pie
                    data={chartData}
                    options={{
                      plugins: {
                        legend: { position: "bottom" },
                        tooltip: {
                          callbacks: {
                            label: (context) => ` $${context.parsed}`,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </motion.div>
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

export default DiscountCalculator;
