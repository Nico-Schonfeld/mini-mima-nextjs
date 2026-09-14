"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const letters = "MiniMima".split("");

export function AnimatedLogo({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 120 120"
        className={compact ? "h-8 w-8" : "mb-5 h-16 w-16"}
        initial={{ opacity: 0, rotate: -12, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.path
          d="M22 98 C 22 60, 60 40, 78 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          className="text-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.circle
          cx={84}
          cy={20}
          r={8}
          className="fill-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 1.1, ease: "backOut" }}
        />
        <motion.circle
          cx={84}
          cy={20}
          r={3.2}
          className="fill-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.35 }}
        />
      </motion.svg>

      <h1
        className={
          compact
            ? "font-serif text-xl font-semibold tracking-tight"
            : "font-serif text-5xl font-semibold tracking-tight sm:text-6xl"
        }
      >
        <span className="sr-only">MiniMima!</span>
        <span aria-hidden="true" className="inline-flex items-baseline">
          {letters.map((letter, i) => (
            <motion.span
              key={`${letter}-${i}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.4 + i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={i >= 4 ? "text-primary" : "text-foreground"}
            >
              {letter}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.4 + letters.length * 0.06,
              ease: "backOut",
            }}
            className="text-primary"
          >
            !
          </motion.span>
        </span>
      </h1>

      {!compact ? (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.05 }}
          className="mt-1 font-sans text-[0.6rem] font-medium uppercase tracking-[0.42em] text-muted-foreground"
        >
          couture
        </motion.span>
      ) : null}
    </div>
  );
}

export function BrandMark({
  className,
  name = "MiniMima!",
  logo,
}: {
  className?: string;
  name?: string;
  logo?: string;
}) {
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logo} alt={name} className={cn("h-8 w-auto object-contain", className)} />
    );
  }
  const clean = name.replace(/!$/, "");
  const left = clean.slice(0, 4);
  const right = clean.slice(4);
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-serif text-lg font-semibold tracking-tight",
        className
      )}
    >
      {left}
      <span className="text-primary">{right}</span>
      {name.endsWith("!") ? <span className="text-primary">!</span> : null}
    </span>
  );
}
