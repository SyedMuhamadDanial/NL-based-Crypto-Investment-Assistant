"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Shield, Target } from "lucide-react";

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSettings({ isOpen, onClose }: ProfileSettingsProps) {
  const [risk, setRisk] = useState("medium");
  const [goal, setGoal] = useState("long_term_growth");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:8000/profile")
        .then(res => res.json())
        .then(data => {
          setRisk(data.risk_tolerance || "medium");
          setGoal(data.investment_goal || "long_term_growth");
        })
        .catch(err => console.error("Error fetching profile", err));
    }
  }, [isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("http://localhost:8000/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ risk_tolerance: risk, investment_goal: goal }),
      });
      onClose();
    } catch (err) {
      console.error("Error saving profile", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card w-full max-w-md rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold">Profile Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-purple-400">
              <Shield className="w-5 h-5" />
              <h3 className="font-semibold text-sm uppercase tracking-wider">Risk Tolerance</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["low", "medium", "high"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRisk(r)}
                  className={`py-2 rounded-xl text-sm font-medium transition-all border ${risk === r
                      ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20"
                      : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20"
                    }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-400">
              <Target className="w-5 h-5" />
              <h3 className="font-semibold text-sm uppercase tracking-wider">Investment Goal</h3>
            </div>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-purple-500 transition-colors text-white"
            >
              <option value="long_term_growth">Long Term Growth</option>
              <option value="passive_income">Passive Income (Yield)</option>
              <option value="speculative_trading">Speculative Trading</option>
              <option value="wealth_preservation">Wealth Preservation</option>
            </select>
          </div>
        </div>

        <div className="p-6 bg-white/2 pb-8">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xl shadow-purple-900/40 disabled:opacity-50"
          >
            {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
