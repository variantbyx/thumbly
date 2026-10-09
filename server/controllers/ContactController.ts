import { Request, Response } from "express";
import Contact from "../models/Contact.js";

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, and message are all required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const contactEntry = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    return res.status(201).json({
      message: "Thank you for reaching out! Your message has been received.",
      contactId: contactEntry._id,
    });
  } catch (error: any) {
    console.error("Contact Form Submission Error:", error);
    return res.status(500).json({ message: error.message || "Failed to submit message." });
  }
};

export default {
  submitContact,
};
