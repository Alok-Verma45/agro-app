import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { askAI } from "../api/aiApi";

const STORAGE_KEY = "agro_ai_chat_v1";

function CropAdvice() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "bot",
            text: "🌱 नमस्ते! मैं आपका कृषि सहायक हूँ। क्या जानना चाहते हैं?",
            time: Date.now(),
          },
        ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastUserMsg, setLastUserMsg] = useState(null);

  const bottomRef = useRef(null);

  // auto scroll + persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fmt = (t) =>
    new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // 🔥 FIXED SEND (NO TYPEWRITER)
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = {
      role: "user",
      text: input,
      time: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLastUserMsg(input);
    setInput("");
    setLoading(true);

    try {
      const res = await askAI(input);
      const reply = res.data;

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: reply,
          time: Date.now(),
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "⚠️ AI से response नहीं मिला। Retry करें।",
          error: true,
          time: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const retry = async () => {
    if (!lastUserMsg) return;
    setInput(lastUserMsg);
    await sendMessage();
  };

  const clearChat = () => {
    const init = [
      {
        role: "bot",
        text: "🌱 नमस्ते! मैं आपका कृषि सहायक हूँ। क्या जानना चाहते हैं?",
        time: Date.now(),
      },
    ];
    setMessages(init);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b border-gray-300 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
            🤖
          </div>
          <div>
            <h2 className="font-semibold">Agro AI Assistant</h2>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="text-xs px-3 py-1 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
        >
          Clear
        </button>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.map((msg, i) => (
          <motion.div
            key={msg.time + "_" + i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[75%]">

              {/* MESSAGE BOX */}
              <div
                className={`
                  px-4 py-2 rounded-2xl text-sm leading-relaxed
                  ${
                    msg.role === "user"
                      ? "bg-green-600 text-white"
                      : "bg-white dark:bg-slate-800 text-gray-800 dark:text-white"
                  }
                `}
              >
                <div className="space-y-1">
                  {msg.text.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>

              {/* TIME */}
              <div className="text-[10px] mt-1 text-gray-500">
                {fmt(msg.time)}
              </div>

              {/* RETRY */}
              {msg.error && (
                <button
                  onClick={retry}
                  className="text-xs mt-1 text-blue-500 hover:underline"
                >
                  Retry
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {/* TYPING */}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 text-sm">
              <span className="animate-pulse">Typing...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-gray-300 dark:border-white/10 flex gap-3">

        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about crops, fertilizer, pests..."
          className="
            flex-1 px-4 py-3 rounded-xl resize-none
            bg-white dark:bg-slate-900
            border border-gray-300 dark:border-white/10
            outline-none
          "
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="
            px-5 py-3 rounded-xl
            bg-green-600 hover:bg-green-700
            text-white font-semibold
            disabled:opacity-50
          "
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default CropAdvice;