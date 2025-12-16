import React, { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { Trophy, Medal, User, Crown, Star } from "lucide-react";

const GroupLeaderboard = ({ groupId }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get(`/leaderboard/${groupId}`);
        setLeaderboard(res.data);
      } catch (error) {
        console.log("Failed to fetch leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [groupId]);

  if (loading) {
    return (
      <div className="bg-[#111] rounded-[32px] p-8 border border-white/5 animate-pulse space-y-4">
        <div className="h-6 w-32 bg-white/10 rounded" />
        <div className="h-12 w-full bg-white/5 rounded-2xl" />
        <div className="h-12 w-full bg-white/5 rounded-2xl" />
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="bg-[#111] rounded-[32px] p-10 border border-white/5 text-center">
        <Star className="mx-auto text-gray-700 mb-4" size={32} />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No Rankings Yet</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111] rounded-[32px] p-6 border border-white/5 shadow-2xl mt-8"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-400">
            <Trophy size={20} />
          </div>
          <h3 className="text-xl font-black tracking-tighter italic text-white uppercase">Hall of Fame</h3>
        </div>
        <span className="text-[10px] font-black text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
          {leaderboard.length} PLAYERS
        </span>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {leaderboard
          .sort((a, b) => b.points - a.points)
          .map((entry, index) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={entry.userId._id}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                index === 0 
                ? "bg-yellow-400/10 border border-yellow-400/20 shadow-[0_0_20px_rgba(255,252,0,0.05)]" 
                : "bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* RANK BADGE */}
                <div className="relative">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm transition-transform group-hover:scale-110 ${
                    index === 0 ? "bg-yellow-400 text-black" :
                    index === 1 ? "bg-zinc-300 text-black" :
                    index === 2 ? "bg-orange-500 text-black" :
                    "bg-zinc-800 text-gray-400"
                  }`}>
                    {index + 1}
                  </div>
                  {index === 0 && (
                    <motion.div 
                      animate={{ y: [-2, 0, -2] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2"
                    >
                      <Crown size={14} className="text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  )}
                </div>

                {/* USER INFO */}
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`font-bold text-sm tracking-tight ${index === 0 ? "text-yellow-400" : "text-white"}`}>
                      {entry.userId.username}
                    </p>
                    {index < 3 && <Star size={10} className="text-yellow-400 fill-yellow-400" />}
                  </div>
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.15em] mt-0.5">
                    Tier: {entry.points > 100 ? "Legend" : "Elite"}
                  </p>
                </div>
              </div>

              {/* POINTS AREA */}
              <div className="text-right">
                <span className="text-lg font-black text-white tabular-nums">
                  {entry.points}
                </span>
                <span className={`text-[10px] font-black ml-1.5 uppercase tracking-tighter ${index === 0 ? "text-yellow-400" : "text-gray-500"}`}>
                  pts
                </span>
              </div>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
};

export default GroupLeaderboard;