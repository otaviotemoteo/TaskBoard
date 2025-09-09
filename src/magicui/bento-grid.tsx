"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-3", className)}>
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      className={cn(
        "row-span-1 rounded-xl border border-border bg-background p-4 shadow-input transition duration-200 ease-in-out",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
