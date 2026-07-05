"use client";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();
  return (
    <motion.div
      className="max-w-5xl py-16 mt-40 md:pl-20 md:w-full max-md:mx-4 md:mx-auto flex flex-col md:flex-row max-md:gap-6 items-center justify-between text-left bg-linear-to-b from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden"
      initial={{ y: 150, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
    >
      <div className="absolute right-0 top-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute left-0 bottom-0 w-60 h-60 bg-secondary/15 rounded-full blur-[80px] -z-10"></div>
      <div>
        <motion.h1
          className="text-4xl md:text-[46px] md:leading-15 font-bold bg-linear-to-r from-white to-secondary text-transparent bg-clip-text"
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
        >
          Ready to go viral?
        </motion.h1>
        <motion.p
          className="bg-linear-to-r from-white to-slate-300 text-transparent bg-clip-text text-lg mt-2"
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 70, mass: 1 }}
        >
          Join thousands of creators using AI to boost their CTR.
        </motion.p>
      </div>
      <motion.button
        onClick={() => navigate("/generate")}
        className="px-8 py-3.5 bg-primary hover:bg-primary/95 text-white rounded-full text-sm font-semibold transition active:scale-95 shadow-lg shadow-primary/25 relative z-10"
        initial={{ y: 80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
      >
        Generate Free Thumbnail
      </motion.button>
    </motion.div>
  );
}
