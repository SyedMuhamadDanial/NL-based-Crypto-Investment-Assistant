"use client";

import React, { useState } from "react";
import {
  Send,
  Wallet,
  TrendingUp,
  PieChart,
  Settings,
  Zap,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  UserCircle
} from "lucide-react";
import ProfileSettings from "@/components/ProfileSettings";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your Crypto Investment Assistant. How can I help you today? I can analyze your portfolio, suggest rebalancing strategies, or provide market insights." }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [marketData, setMarketData] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Assistant");

  React.useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await fetch("http://localhost:8000/market-data");
        const data = await res.json();
        setMarketData(data);
      } catch (err) {
        console.error("Failed to fetch market data", err);
      }
    };
    fetchMarket();
    const interval = setInterval(fetchMarket, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response,
        thought: data.thought
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to my brain right now. Please ensure the backend is running."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <nav className="w-20 lg:w-64 glass border-r flex flex-col items-center lg:items-start p-4 space-y-8">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Zap className="text-white w-6 h-6" />
          </div>
          <h1 className="hidden lg:block font-bold text-xl tracking-tight">Crypto<span className="text-purple-400">AI</span></h1>
        </div>

        <div className="flex-1 space-y-4 w-full">
          {[
            { icon: MessageSquare, label: "Assistant" },
            { icon: BarChart3, label: "Analytics" },
            { icon: Wallet, label: "Wallets" },
            { icon: ShieldCheck, label: "Risk Report" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(item.label)}
              className={`flex items-center w-full p-3 rounded-xl transition-all ${activeTab === item.label ? 'bg-white/10 text-purple-400' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="hidden lg:block ml-3 font-medium">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center w-full p-3 rounded-xl transition-all hover:bg-white/5 text-gray-400 hover:text-white"
          >
            <UserCircle className="w-6 h-6" />
            <span className="hidden lg:block ml-3 font-medium">Profile</span>
          </button>
        </div>

        <button className="flex items-center w-full p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white group">
          <Settings className="w-6 h-6 group-hover:rotate-45 transition-transform" />
          <span className="hidden lg:block ml-3 font-medium">Settings</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col bg-transparent">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5">
          <h2 className="text-lg font-semibold text-gray-300">Investment Intelligence</h2>
          <div className="flex items-center space-x-4">
            <div className="glass px-4 py-1.5 rounded-full flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-gray-400">Live Markets</span>
            </div>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-purple-500/20">
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          </div>
        </header>

        {/* Dynamic Layout */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === "Assistant" ? (
            <>
              {/* Dashboard Section (Hidden on small mobile) */}
              <div className="hidden xl:flex w-[400px] flex-col p-6 space-y-6 overflow-y-auto border-r border-white/5 bg-black/20">
                <div className="glass-card p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Portfolio Value</span>
                    <TrendingUp className="text-green-500 w-4 h-4" />
                  </div>
                  <p className="text-3xl font-bold">$124,562.80</p>
                  <div className="h-32 bg-white/5 rounded-2xl flex items-end justify-between p-4 space-x-1">
                    {/* Mini bars mockup */}
                    {[40, 60, 45, 90, 65, 80, 55, 75].map((h, i) => (
                      <div key={i} className="bg-purple-500/30 w-full rounded-t-sm hover:bg-purple-500/60 transition-colors" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4 rounded-2xl space-y-2">
                    <PieChart className="text-blue-400 w-5 h-5" />
                    <p className="text-gray-400 text-xs">Diversification</p>
                    <p className="font-bold text-lg">High</p>
                  </div>
                  <div className="glass-card p-4 rounded-2xl space-y-2">
                    <ShieldCheck className="text-orange-400 w-5 h-5" />
                    <p className="text-gray-400 text-xs">Risk Index</p>
                    <p className="font-bold text-lg">Stable</p>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl space-y-4">
                  <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Top Holdings</h3>
                  <div className="space-y-4">
                    {[
                      { id: "bitcoin", coin: "BTC", color: "bg-orange-500" },
                      { id: "ethereum", coin: "ETH", color: "bg-blue-500" },
                      { id: "solana", coin: "SOL", color: "bg-purple-500" },
                    ].map((item, i) => {
                      const crypto = marketData?.[item.id];
                      return (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center text-[10px] font-bold`}>{item.coin[0]}</div>
                            <div>
                              <p className="text-sm font-semibold">{item.coin}</p>
                              <p className={`text-[10px] ${crypto?.usd_24h_change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {crypto?.usd_24h_change ? `${crypto.usd_24h_change.toFixed(2)}%` : '---'}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-bold">{crypto?.usd ? `$${crypto.usd.toLocaleString()}` : '---'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Chat Section */}
              <div className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full relative">
                <div className="flex-1 overflow-y-auto space-y-6 mb-24 pr-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                        ? 'bg-purple-600/90 text-white shadow-lg'
                        : 'glass-card'
                        }`}>
                        {msg.content}
                      </div>
                      {(msg as any).thought && (
                        <div className="mt-2 text-[10px] text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 max-w-[70%] italic">
                          <span className="font-bold uppercase tracking-widest text-[8px] mr-2">Reasoning:</span>
                          {(msg as any).thought}
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="glass-card p-4 rounded-2xl animate-pulse flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Form */}
                <div className="absolute bottom-10 left-6 right-10">
                  <div className="glass rounded-2xl p-2 flex items-center border border-white/10 shadow-2xl">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask anything about your investments..."
                      className="flex-1 bg-transparent border-none focus:ring-0 outline-none px-4 text-sm text-white"
                    />
                    <button
                      onClick={handleSend}
                      className="bg-purple-600 hover:bg-purple-500 p-2.5 rounded-xl transition-all shadow-lg shadow-purple-900/40"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <AnalyticsDashboard />
          )}
        </div>
      </section>
      <ProfileSettings isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </main>
  );
}
