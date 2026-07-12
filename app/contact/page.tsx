"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone, Send } from "lucide-react";

const CONTACT_EMAIL = "info.mealbear@gmail.com";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const subject = "Message from " + (name || "Website Visitor");
    const body = "Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message;
    const mailtoUrl = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

    window.location.href = mailtoUrl;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-purple-600 transition-colors mb-8">
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Contact Us
          </h1>
          <p className="text-[13px] text-gray-500 mt-2 max-w-md">
            Have a question, partnership inquiry, or feedback about an order? We would love to hear from you.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">

          <div className="sm:col-span-2 space-y-4">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-3">
              <div className="bg-purple-50 text-purple-600 p-2 rounded-full shrink-0">
                <Mail size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Email
                </p>
                <a href={"mailto:" + CONTACT_EMAIL} className="text-[13px] font-bold text-gray-800 hover:text-purple-600 transition-colors break-all">
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-3">
              <div className="bg-purple-50 text-purple-600 p-2 rounded-full shrink-0">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Coverage Area
                </p>
                <p className="text-[13px] font-bold text-gray-800">
                  Skardu, Gilgit-Baltistan
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-3">
              <div className="bg-purple-50 text-purple-600 p-2 rounded-full shrink-0">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Support
                </p>
                <p className="text-[13px] font-bold text-gray-800">
                  Available daily, 8:00 AM to 9:00 PM
                </p>
              </div>
            </div>

          </div>

          <div className="sm:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={function (e) { setName(e.target.value); }}
                  placeholder="Your Full Name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
                  Your Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={function (e) { setEmail(e.target.value); }}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={message}
                  onChange={function (e) { setMessage(e.target.value); }}
                  placeholder="Tell us how we can help..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-black text-sm uppercase tracking-widest py-3.5 rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all"
              >
                <Send size={15} />
                Send Message
              </button>

              <p className="text-[10px] text-gray-400 text-center">
                This opens your email app with the message pre-filled, ready to send.
              </p>

            </form>
          </div>

        </div>
      </div>
    </main>
  );
}