import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { sendMessage } from "../lib/mockAIService";

export default function AIChatPanel() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hello! I'm your AI file assistant. Ask me about any document — contracts, invoices, reports, or meeting notes.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  // auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now().toString(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendMessage(text);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", text: reply },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e]/60">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <MessageSquare className="w-5 h-5 text-cyan-400" />
        <span className="text-sm font-medium text-white/80">AI Chat</span>
      </div>

      {/* ── Messages ──────────────────────────────────────── */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-2",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-cyan-500/20 text-white/90 rounded-tr-sm"
                    : "bg-white/[0.06] text-white/70 rounded-tl-sm"
                )}
              >
                {msg.text.split("\n").map((line, i) => (
                  <span key={i}>
                    {renderBold(line)}
                    {i < msg.text.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
              {msg.role === "user" && (
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Thinking…
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* ── Input ─────────────────────────────────────────── */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2 bg-white/[0.06] rounded-xl px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about this file..."
            className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/30 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              input.trim()
                ? "text-cyan-400 hover:bg-cyan-400/10"
                : "text-white/20"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// simple **bold** renderer
function renderBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
