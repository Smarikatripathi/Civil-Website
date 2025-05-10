"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MotionButtonProps {
  children: ReactNode;
  className?: string;
}

export default function MotionButton({
  children,
  className = "",
}: MotionButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
