"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MotionCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function MotionCard({
  children,
  delay = 0,
  className = "",
}: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
