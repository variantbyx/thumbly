"use client";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import { pricingData } from "../data/pricing";
import type { IPricing } from "../types";
import { CheckIcon } from "lucide-react";
import { motion } from "motion/react";

export default function PricingSection() {
  const navigate = useNavigate();
  return (
    <div id="pricing" className="px-4 md:px-16 lg:px-24 xl:px-32">
      <SectionTitle
        text1="Pricing"
        text2="Simple Pricing"
        text3="Choose the plan that fits your creation schedule. Canel anytime."
      />

      <div className="flex flex-wrap items-center justify-center gap-8 mt-20 px-4">
        {pricingData.map((plan: IPricing, index: number) => (
          <motion.div
            key={index}
            className={`w-72 text-center p-6 pb-12 rounded-2xl transition-all duration-300 ${
              plan.mostPopular
                ? "bg-slate-850 border-2 border-primary relative shadow-xl shadow-primary/10 md:scale-105 z-10"
                : "bg-surface/40 border border-slate-800 backdrop-blur-sm"
            }`}
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.15,
              type: "spring",
              stiffness: 320,
              damping: 70,
              mass: 1,
            }}
          >
            {plan.mostPopular && (
              <p className="absolute px-3.5 text-xs font-bold uppercase tracking-wider -top-3.5 left-1/2 -translate-x-1/2 py-1 bg-primary text-white rounded-full shadow-md shadow-primary/20">
                Most Popular
              </p>
            )}
            <p className="font-semibold text-text-primary text-base mt-2">{plan.name}</p>
            <h1 className="text-4xl font-bold mt-4 text-text-primary">
              ${plan.price}
              <span className="text-text-secondary font-normal text-sm">
                /{plan.period}
              </span>
            </h1>
            <ul className="list-none text-text-secondary mt-6 space-y-3.5 text-left pl-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-xs">
                  <CheckIcon className="size-4 text-secondary shrink-0" />
                  <p className="text-text-secondary">{feature}</p>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/login")}
              type="button"
              className={`w-full py-2.5 rounded-xl font-semibold mt-8 text-xs transition-all active:scale-97 cursor-pointer ${
                plan.mostPopular
                  ? "bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                  : "bg-slate-800 hover:bg-slate-700 text-text-primary border border-slate-700"
              }`}
            >
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
