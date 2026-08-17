"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Clock, CheckCircle2, ArrowLeft } from "lucide-react";
import NavBar from "@/app/components/shared/navigations/NavBar";
import Footer from "@/app/components/screens/landing-page/Footer";
import { API_URL } from "@/config/constant";
import { toast } from "react-toastify";
import { getStoredSession } from "@/lib/authSession";

const SupportPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const session = getStoredSession();
    const user = session?.user as
      | { firstName?: string; lastName?: string; email?: string }
      | undefined;
    if (!user) {
      return;
    }
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    if (fullName) {
      setName(fullName);
    }
    if (user.email) {
      setEmail(user.email);
    }
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please complete name, email, and message.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/support/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || "Support request",
          message: message.trim(),
          channel: "email",
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Could not send your message.");
      }
      setSent(true);
      setSubject("");
      setMessage("");
      toast.success("Message sent. Our team will reply by email.");
    } catch (error: any) {
      toast.error(error?.message || "Could not send your message.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendAnother = () => {
    setSent(false);
  };

  return (
    <div className="font-jakarta min-h-screen bg-[#F6F8F6]">
      <NavBar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/contact-us"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#045D23] hover:text-[#03442C]"
            aria-label="Back to contact us"
            tabIndex={0}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to contact
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <section className="rounded-2xl border border-[#D7E6D8] bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#045D23]">
                Contact support
              </p>
              <h1 className="mt-2 text-3xl font-bold text-[#03442C]">
                Email our team
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Send a message and we will reply to your email as soon as
                possible during operating hours.
              </p>

              {sent ? (
                <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                  <CheckCircle2
                    className="h-8 w-8 text-[#045D23]"
                    aria-hidden="true"
                  />
                  <h2 className="mt-3 text-lg font-semibold text-[#03442C]">
                    Message received
                  </h2>
                  <p className="mt-1 text-sm text-gray-700">
                    Thanks{name ? `, ${name.split(" ")[0]}` : ""}. We will
                    respond to {email || "your email"} shortly.
                  </p>
                  <button
                    type="button"
                    onClick={handleSendAnother}
                    className="mt-5 rounded-lg border border-[#03442C] px-4 py-2 text-sm font-medium text-[#03442C] hover:bg-[#03442C] hover:text-white"
                    aria-label="Send another support message"
                    tabIndex={0}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="support-name">
                      Full name
                      <input
                        id="support-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                        className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none ring-[#03442C] placeholder:text-gray-400 focus:border-[#03442C] focus:ring-2"
                        required
                      />
                    </label>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="support-email">
                      Email address
                      <input
                        id="support-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        autoComplete="email"
                        className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none ring-[#03442C] placeholder:text-gray-400 focus:border-[#03442C] focus:ring-2"
                        required
                      />
                    </label>
                  </div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="support-subject">
                    Subject
                    <input
                      id="support-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What is this about?"
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none ring-[#03442C] placeholder:text-gray-400 focus:border-[#03442C] focus:ring-2"
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="support-message">
                    Message
                    <textarea
                      id="support-message"
                      rows={7}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us how we can help"
                      className="mt-1.5 w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none ring-[#03442C] placeholder:text-gray-400 focus:border-[#03442C] focus:ring-2"
                      required
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-[#03442C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#023524] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    aria-label="Send support email"
                    tabIndex={0}
                  >
                    {loading ? "Sending…" : "Send message"}
                  </button>
                </form>
              )}
            </section>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-[#D7E6D8] bg-white p-6">
                <Mail className="h-9 w-9 rounded-lg bg-[#045D23] p-2 text-white" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-semibold text-[#03442C]">
                  What happens next
                </h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                  <li>Your message is sent to the NaijaRentVerify support team.</li>
                  <li>We reply to the email address you provide.</li>
                  <li>Include your account email if you already have an account.</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-[#03442C] p-6 text-white">
                <Clock className="h-9 w-9 rounded-lg bg-white/15 p-2" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-semibold">Operating hours</h2>
                <p className="mt-2 text-sm text-white/85">
                  Monday – Friday: 8:00 AM – 6:00 PM
                </p>
                <p className="mt-1 text-sm text-white/85">
                  Saturday: 9:00 AM – 4:00 PM
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SupportPage;
