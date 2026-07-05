"use client";
import SectionTitle from "../components/SectionTitle";
import { ArrowRightIcon, MailIcon, UserIcon } from "lucide-react";
import { motion } from "motion/react";

export default function ContactSection() {
  return (
    <div className="px-4 md:px-16 lg:px-24 xl:px-32">
      <SectionTitle
        text1="Contact"
        text2="Grow your channel"
        text3="Have questions about our AI? Ready to scale your views? Let's talk."
      />
      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-2xl mx-auto text-slate-300 mt-16 w-full"
      >
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
          <p className="mb-2 font-medium">Your name</p>
          <div className="flex items-center pl-3 rounded-lg border border-slate-700 focus-within:border-primary bg-slate-900/50">
            <UserIcon className="size-5 text-text-secondary" />
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              className="w-full p-3 outline-none text-text-primary placeholder:text-text-secondary"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
        >
          <p className="mb-2 font-medium">Email id</p>
          <div className="flex items-center pl-3 rounded-lg border border-slate-700 focus-within:border-primary bg-slate-900/50">
            <MailIcon className="size-5 text-text-secondary" />
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 outline-none text-text-primary placeholder:text-text-secondary"
            />
          </div>
        </motion.div>

        <motion.div
          className="sm:col-span-2"
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
        >
          <p className="mb-2 font-medium">Message</p>
          <textarea
            name="message"
            rows={8}
            placeholder="Enter your message"
            className="focus:border-primary resize-none w-full p-3 outline-none rounded-lg border border-slate-700 bg-slate-900/50 text-text-primary placeholder:text-text-secondary"
          />
        </motion.div>

        <motion.button
          type="submit"
          className="w-max flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-10 py-3 rounded-full shadow-lg shadow-primary/20 transition-all font-semibold active:scale-95"
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
        >
          Submit
          <ArrowRightIcon className="size-5" />
        </motion.button>
      </form>
    </div>
  );
}
