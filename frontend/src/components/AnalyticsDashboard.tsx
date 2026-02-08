"use client";

import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import { TrendingUp, ShieldAlert, Activity, BarChart2, Info, ArrowRight, Zap } from "lucide-react";

export default function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [forecast, setForecast] = useState<any>(null);
    const [strategies, setStrategies] = useState<any>(null);
    const [selectedCoin, setSelectedCoin] = useState("bitcoin");

    useEffect(() => {
        fetch("http://localhost:8000/portfolio/analytics")
            .then(res => res.json())
            .then(data => setAnalytics(data));

        fetch("http://localhost:8000/portfolio/strategies")
            .then(res => res.json())
            .then(data => setStrategies(data));
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8000/market/forecast/${selectedCoin}`)
            .then(res => res.json())
            .then(data => setForecast(data.forecast));
    }, [selectedCoin]);

    return (
        <div className="p-8 space-y-8 overflow-y-auto h-full pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-3xl space-y-2">
                    <div className="flex justify-between items-start">
                        <Activity className="text-purple-400 w-5 h-5" />
                        <span className="text-xs font-bold text-green-500">{analytics?.status}</span>
                    </div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest">Sharpe Ratio</p>
                    <h3 className="text-2xl font-bold">{analytics?.sharpe_ratio}</h3>
                </div>

                <div className="glass-card p-6 rounded-3xl space-y-2">
                    <ShieldAlert className="text-orange-400 w-5 h-5" />
                    <p className="text-gray-400 text-xs uppercase tracking-widest">Volatility (Annual)</p>
                    <h3 className="text-2xl font-bold">{(analytics?.volatility * 100).toFixed(2)}%</h3>
                </div>

                <div className="glass-card p-6 rounded-3xl space-y-2">
                    <TrendingUp className="text-blue-400 w-5 h-5" />
                    <p className="text-gray-400 text-xs uppercase tracking-widest">Value at Risk (95%)</p>
                    <h3 className="text-2xl font-bold">{(analytics?.var_95 * 100).toFixed(2)}%</h3>
                </div>

                <div className="glass-card p-6 rounded-3xl space-y-2">
                    <BarChart2 className="text-green-400 w-5 h-5" />
                    <p className="text-gray-400 text-xs uppercase tracking-widest">Beta Index</p>
                    <h3 className="text-2xl font-bold">1.24</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Forecast Chart */}
                <div className="lg:col-span-2 glass-card p-8 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Price Projection (7 Days)</h3>
                        <div className="flex space-x-2">
                            {["bitcoin", "ethereum", "solana"].map(coin => (
                                <button
                                    key={coin}
                                    onClick={() => setSelectedCoin(coin)}
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${selectedCoin === coin ? 'bg-purple-600' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {coin.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={forecast}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="day" stroke="#ffffff40" fontSize={11} tickFormatter={(val) => `Day ${val}`} />
                                <YAxis stroke="#ffffff40" fontSize={11} domain={['auto', 'auto']} tickFormatter={(val) => `$${val.toLocaleString()}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ color: '#8b5cf6' }}
                                />
                                <Area type="monotone" dataKey="price" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                                <Line type="monotone" dataKey="upper" stroke="#8b5cf620" strokeDasharray="5 5" dot={false} />
                                <Line type="monotone" dataKey="lower" stroke="#8b5cf620" strokeDasharray="5 5" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Distribution mockup */}
                <div className="glass-card p-8 rounded-3xl space-y-6">
                    <h3 className="text-lg font-bold">Asset Allocation</h3>
                    <div className="space-y-6">
                        {[
                            { label: "Large Cap (BTC/ETH)", p: 65, color: "bg-purple-500" },
                            { label: "Mid Cap (SOL/ADA)", p: 25, color: "bg-blue-500" },
                            { label: "Small Cap/DeFi", p: 10, color: "bg-pink-500" },
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">{item.label}</span>
                                    <span className="font-bold">{item.p}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color}`} style={{ width: `${item.p}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <p className="text-[10px] text-gray-500 italic">
                            * Calculations based on historical 100-day window. Past performance is not indicative of future results.
                        </p>
                    </div>
                </div>
            </div>

            {/* Actionable Insights Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-3xl space-y-6 flex flex-col">
                    <div className="flex items-center space-x-3 text-purple-400">
                        <Zap className="w-6 h-6" />
                        <h3 className="text-xl font-bold">Recommended DCA Plan</h3>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="bg-white/5 p-4 rounded-2xl flex justify-between items-center">
                            <span className="text-gray-400">Frequency</span>
                            <span className="font-bold">{strategies?.dca_plan?.frequency}</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl flex justify-between items-center">
                            <span className="text-gray-400">Amount per Period</span>
                            <span className="font-bold text-purple-400">${strategies?.dca_plan?.recommended_amount}</span>
                        </div>
                        <div className="p-2">
                            <p className="text-xs text-gray-400 leading-relaxed">
                                {strategies?.dca_plan?.rationale}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {strategies?.dca_plan?.target_assets.map((a: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold border border-white/5">{a}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-3xl space-y-6">
                    <div className="flex items-center space-x-3 text-blue-400">
                        <Activity className="w-6 h-6" />
                        <h3 className="text-xl font-bold">Rebalancing Signals</h3>
                    </div>

                    <div className="space-y-3">
                        {strategies?.rebalancing_signals.length > 0 ? (
                            strategies.rebalancing_signals.map((s: any, i: number) => (
                                <div key={i} className="bg-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all border border-transparent hover:border-white/5">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${s.action === 'BUY' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {s.action[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{s.asset}</p>
                                            <p className="text-[10px] text-gray-400">Deviation: {s.deviation_pct}%</p>
                                        </div>
                                    </div>
                                    <button className="p-2 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="h-40 flex flex-col items-center justify-center text-gray-500 space-y-2">
                                <Info className="w-8 h-8 opacity-20" />
                                <p className="text-xs">No rebalancing needed at this time.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
