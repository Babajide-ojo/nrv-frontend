"use client";

import { useState } from "react";
import NavBar from "@/app/components/shared/navigations/NavBar";
import Footer from "@/app/components/screens/landing-page/Footer";
import { API_URL } from "@/config/constant";
import { toast } from "react-toastify";

type SupportMode = "email" | "chat";

const SupportPage = () => {
  const [mode, setMode] = useState<SupportMode>("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState<
    Array<{ from: "user" | "support"; text: string; at: string }>
  >([
    {
      from: "support",
      text: "Hi! Send a message and our support team will respond by email as soon as possible.",
      at: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendSupportMessage = async (payload: {
    name: string;
    email: string;
    subject: string;
    message: string;
    channel: SupportMode;
  }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/support/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Could not send your message.");
      }
      toast.success("Message sent. Our team will respond shortly.");
      return true;
    } catch (error: any) {
      toast.error(error?.message || "Could not send your message.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please complete name, email, and message.");
      return;
    }
    const ok = await sendSupportMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim() || "Support request",
      message: message.trim(),
      channel: "email",
    });
    if (ok) {
      setSubject("");
      setMessage("");
    }
  };

  const handleChatSend = async () => {
    const text = chatInput.trim();
    if (!text) {
      return;
    }
    if (!name.trim() || !email.trim()) {
      toast.error("Enter your name and email so support can reply.");
      return;
    }
    setChatLog((prev) => [
      ...prev,
      { from: "user", text, at: new Date().toISOString() },
    ]);
    setChatInput("");
    const ok = await sendSupportMessage({
      name: name.trim(),
      email: email.trim(),
      subject: "Live chat support",
      message: text,
      channel: "chat",
    });
    if (ok) {
      setChatLog((prev) => [
        ...prev,
        {
          from: "support",
          text: "Thanks — your message was sent to our support team. We will reply to your email soon.",
          at: new Date().toISOString(),
        },
      ]);
    }
  };

  return (
    <div className="font-jakarta min-h-screen bg-white">
      <NavBar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#03442C] mb-2">Support</h1>
        <p className="text-gray-600 mb-8">
          Email our team or use live chat. Messages are delivered to support and
          answered by email.
        </p>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-gray-200 p-1">
          <button
            type="button"
            onClick={() => setMode("email")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === "email"
                ? "bg-[#03442C] text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Email support
          </button>
          <button
            type="button"
            onClick={() => setMode("chat")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === "chat"
                ? "bg-[#03442C] text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Live chat
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        {mode === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4 rounded-xl border border-gray-200 p-6">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#03442C] px-4 py-2 text-sm font-medium text-white hover:bg-[#023524] disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send email"}
            </button>
          </form>
        ) : (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="h-72 overflow-y-auto bg-gray-50 p-4 space-y-3">
              {chatLog.map((entry, index) => (
                <div
                  key={`${entry.at}-${index}`}
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    entry.from === "user"
                      ? "ml-auto bg-[#03442C] text-white"
                      : "bg-white border border-gray-200 text-gray-700"
                  }`}
                >
                  {entry.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-gray-200 p-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message…"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleChatSend();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleChatSend}
                disabled={loading}
                className="rounded-lg bg-[#03442C] px-4 py-2 text-sm font-medium text-white hover:bg-[#023524] disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SupportPage;
