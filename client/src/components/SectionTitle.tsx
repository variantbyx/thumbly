import type { SectionTitleProps } from "../types";
import { motion } from "motion/react";

export default function SectionTitle({ text1, text2, text3 }: SectionTitleProps) {
    return (
        <>
            <motion.p className="text-center font-medium text-primary mt-28 px-6 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs w-max mx-auto tracking-wider uppercase"
                initial={{ y: 120, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                {text1}
            </motion.p>
            <motion.h3 className="text-3xl font-semibold text-center mx-auto mt-4"
                initial={{ y: 120, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
            >
                {text2}
            </motion.h3>
            <motion.p className="text-slate-300 text-center mt-2 max-w-xl mx-auto"
                initial={{ y: 120, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
            >
                {text3}
            </motion.p>
        </>
    );
}