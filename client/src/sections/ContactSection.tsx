"use client";
import React, { useState } from "react";
import SectionTitle from "../components/SectionTitle";
import { ArrowRightIcon, MailIcon, UserIcon, CheckCircleIcon, AlertCircleIcon, Loader2Icon } from "lucide-react";
import { motion } from "motion/react";
import { apiFetch } from "../config/api";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await apiFetch("/contact", {
        method: "POST",
        bodyData: formData,
      });
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      console.error("Contact Form Error:", err);
      setError(err.message || "Failed to submit message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact" className="px-4 md:px-16 lg:px-24 xl:px-32">
      <SectionTitle
        text1="Contact"
        text2="Grow your channel"
        text3="Have questions about our AI? Ready to scale your views? Let's talk."
      />
      <form
        onSubmit={handleSubmit}
        className="grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-2xl mx-auto text-slate-300 mt-16 w-full"
      >
        {success && (
          <div className="sm:col-span-2 flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <CheckCircleIcon className="size-5 shrink-0" />
            <p>Thank you for reaching out! We will get back to you shortly.</p>
          </div>
        )}

        {error && (
          <div className="sm:col-span-2 flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <AlertCircleIcon className="size-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

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
              value={formData.name}
              onChange={handleChange}
              type="text"
              required
              placeholder="Enter your name"
              className="w-full p-3 outline-none text-text-primary placeholder:text-text-secondary bg-transparent"
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
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
              placeholder="Enter your email"
              className="w-full p-3 outline-none text-text-primary placeholder:text-text-secondary bg-transparent"
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
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Enter your message"
            className="focus:border-primary resize-none w-full p-3 outline-none rounded-lg border border-slate-700 bg-slate-900/50 text-text-primary placeholder:text-text-secondary"
          />
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-max flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-10 py-3 rounded-full shadow-lg shadow-primary/20 transition-all font-semibold active:scale-95 cursor-pointer"
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
        >
          {loading ? (
            <>
              <Loader2Icon className="size-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit
              <ArrowRightIcon className="size-5" />
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
