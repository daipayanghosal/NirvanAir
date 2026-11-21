import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  User,
  Bot,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Compass,
  ShieldAlert,
  Info,
  Layers,
  ArrowRight
} from "lucide-react";
import { EnvironmentalData, UserProfile, ChatMessage, ActionableCard } from "../types";
import { sendChatMessage } from "../services/api";

interface AssistantViewProps {
  envData: EnvironmentalData;
  userProfile: UserProfile;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  envData,
  userProfile
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I am **AIRWISE**, your environmental intelligence assistant for **${envData.location.name}**.\n\nCurrent conditions: **${envData.air_quality.aqi} NAQI (${envData.air_quality.category})**, dominated by PM2.5 (${envData.air_quality.pollutants.pm2_5.value} µg/m³).\n\nAsk me anything about daily routines, mask efficacy, ventilation timing, budget air cleaning, or commuting safely today!`,
      follow_up_suggestions: [
        "Is it safe to go jogging today?",
        "Should I open my windows this morning?",
        "How can I protect my family on a limited budget?",
        "Is an N95 mask useful during severe smog?"
      ],
      source: "AIRWISE GenAI Core",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const historyPayload = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await sendChatMessage(query.trim(), envData, userProfile, historyPayload);
      
      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: "assistant",
        content: res.answer_markdown || res.content || "I have analyzed your situation and summarized the priority actions above.",
        actionable_cards: res.actionable_cards || [],
        follow_up_suggestions: res.follow_up_suggestions || [],
        source: res.source || "Google Gemini 2.5 Flash",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content: "I encountered a communication delay with the environmental telemetry cluster. Based on current local sensor readings (NAQI: " + envData.air_quality.aqi + "), please prioritize staying indoors and keeping windows closed.",
          source: "Offline Safety Fallback",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#163323] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Grounded Conversational Agent</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">AIRWISE Environmental AI Assistant</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Powered by Google Gemini with live telemetry grounding for {envData.location.name} ({envData.air_quality.aqi} NAQI).
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-900 font-semibold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Context Grounded (Live Sensors)</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-[#e2e8e0] shadow-xs flex flex-col h-[600px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? "bg-[#163323] text-white"
                      : "bg-gradient-to-br from-[#849974] to-[#3a5d47] text-white shadow-xs"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-[#163323] text-white rounded-tr-none"
                        : "bg-[#f8faf8] border border-[#e2e8e0] text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {/* Markdown rendering with paragraphs & bullet points */}
                    <div className="space-y-2 whitespace-pre-wrap">
                      {msg.content.split("\n\n").map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] mt-2 pt-1 border-t border-current/10 opacity-70">
                      <span>{msg.source || (isUser ? "You" : "AIRWISE")}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>

                  {/* Render Actionable Cards if returned by Gemini */}
                  {msg.actionable_cards && msg.actionable_cards.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.actionable_cards.map((card, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-xl p-3.5 border border-[#cbe0d1] shadow-2xs space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#163323] text-xs flex items-center space-x-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>{card.title}</span>
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              card.priority === "critical"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : card.priority === "high"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}>
                              {card.priority} Priority
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                            <div>
                              <strong className="text-[10px] uppercase text-gray-400 block">Suggested Action</strong>
                              <span className="text-gray-900 font-semibold">{card.suggested_action}</span>
                            </div>
                            <div>
                              <strong className="text-[10px] uppercase text-gray-400 block">Reasoning</strong>
                              <span className="text-gray-700">{card.reasoning}</span>
                            </div>
                            <div>
                              <strong className="text-[10px] uppercase text-emerald-700 block">Expected Benefit</strong>
                              <span className="text-emerald-950 font-semibold">{card.expected_benefit}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                            <span>Confidence: {Math.round(card.confidence * 100)}%</span>
                            <span>Sources: {card.data_sources.join(", ")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Follow-Up Suggestion Chips */}
                  {msg.follow_up_suggestions && msg.follow_up_suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.follow_up_suggestions.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(chip)}
                          className="text-[11px] font-medium px-2.5 py-1 bg-white hover:bg-[#eaf3ed] text-[#163323] border border-[#cbe0d1] rounded-full transition-colors flex items-center space-x-1"
                        >
                          <span>{chip}</span>
                          <ArrowRight className="w-3 h-3 text-emerald-600" />
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#849974] to-[#3a5d47] text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#f8faf8] border border-gray-200 p-3 rounded-2xl rounded-tl-none text-xs text-gray-500 flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-[#163323] border-t-transparent rounded-full animate-spin" />
                <span>AIRWISE is reasoning with atmospheric telemetry & household profile...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask AIRWISE (e.g. Is it safe to go jogging today? How to ventilate?)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#163323] text-gray-900"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 bg-[#163323] hover:bg-[#204933] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center space-x-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </form>
          <div className="text-[10px] text-gray-400 mt-1.5 text-center">
            AIRWISE answers three questions for every recommendation: What should I do? Why? What difference will it make?
          </div>
        </div>

      </div>

    </div>
  );
};
