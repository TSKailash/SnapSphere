import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown, Globe, Star, ArrowUpRight, Sparkles } from "lucide-react";

const GlobalLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/global/leaderboard");
        // Ensure data is sorted by points descending
        const sorted = (res.data || []).sort((a, b) => b.points - a.points);
        setLeaderboard(sorted);
      } catch (error) {
        console.log("Failed to load global leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <div className="relative">
          <Globe className="text-yellow-400 animate-spin-slow mb-4" size={48} />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full"
          />
        </div>
        <p className="text-gray-500 font-black tracking-[0.3em] uppercase text-[10px]">Syncing Universe...</p>
      </div>
    );
  }

  // Logic to separate Top 3 from the rest
  const topThree = leaderboard.slice(0, 3);
  const theRest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-4 md:px-8 selection:bg-yellow-400 selection:text-black">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Sparkles size={12} /> Live World Rankings
          </motion.div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic leading-[0.85] uppercase">
            Global <br /> <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600">Elite</span>
          </h2>
        </div>

        {/* TOP 3 PODIUM - ONLY SHOW IF USERS EXIST */}
        {topThree.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-end">
            {/* 2ND PLACE - Will appear on the LEFT */}
            <PodiumCard user={topThree[1]} rank={2} color="bg-zinc-400" delay={0.2} />
            
            {/* 1ST PLACE - Will appear in the CENTER */}
            <PodiumCard user={topThree[0]} rank={1} color="bg-yellow-400" delay={0} isMain={true} />
            
            {/* 3RD PLACE - Will appear on the RIGHT */}
            <PodiumCard user={topThree[2]} rank={3} color="bg-orange-700" delay={0.3} />
          </div>
        ) : (
          <div className="text-center py-20 bg-[#111] rounded-[40px] border border-white/5 mb-16">
            <Trophy size={48} className="mx-auto text-gray-800 mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No Champions Crowned Yet</p>
          </div>
        )}

        {/* RANKINGS LIST */}
        <div className="bg-[#111] rounded-[40px] border border-white/5 p-2 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 px-6 pt-4 md:pt-0">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">The Rankings Feed</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Real-time</span>
            </div>
          </div>

          <div className="space-y-1">
            {theRest.length > 0 ? (
              theRest.map((user, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  key={user._id}
                  className="group flex justify-between items-center p-5 rounded-[24px] hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <span className="w-6 text-gray-700 font-black italic group-hover:text-yellow-400 transition-colors text-lg">
                      {index + 4}
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center font-black text-sm border border-white/5 group-hover:border-yellow-400/50 group-hover:rotate-3 transition-all">
                        {user.userId?.username?.[0]}
                      </div>
                      <div>
                        <span className="font-bold text-white text-lg tracking-tight block group-hover:text-yellow-400 transition-colors">
                          @{user.userId?.username || "Anonymous"}
                        </span>
                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Global Citizen</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="font-black text-xl text-white tabular-nums">{user.points}</span>
                      <span className="text-[10px] text-yellow-500 font-black uppercase ml-2 tracking-tighter">pts</span>
                    </div>
                    <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                      <ArrowUpRight size={18} className="text-yellow-400" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 font-medium italic mb-6">Only the legends have made their mark so far.</p>
                <Link 
                  to="/dashboard" 
                  className="px-8 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-lg"
                >
                  Join Today's Prompt
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// PODIUM COMPONENT
const PodiumCard = ({ user, rank, color, delay, isMain }) => {
  if (!user) return <div className={`hidden md:block p-8 rounded-[40px] border border-dashed border-white/5 h-64 ${isMain ? 'md:order-2' : 'md:order-1'}`} />;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, type: "spring", bounce: 0.4 }}
      className={`relative flex flex-col items-center p-8 rounded-[40px] border border-white/5 bg-[#111] transition-all group hover:border-white/20 ${
        isMain ? 'md:order-2 border-yellow-400/40 shadow-[0_0_50px_rgba(255,252,0,0.1)]' : 'md:order-1'
      }`}
    >
      {isMain && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-[0_0_20px_rgba(255,252,0,0.5)]" />
      )}
      
      <div className="relative mb-6">
        <div className={`w-24 h-24 rounded-[30%] flex items-center justify-center font-black text-3xl uppercase border-4 border-black/50 shadow-2xl transition-transform group-hover:rotate-6 ${color} text-black`}>
          {user.userId?.username?.[0]}
        </div>
        
        <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center text-black font-black text-lg shadow-2xl ${color} ring-4 ring-[#111]`}>
          {rank}
        </div>

        {rank === 1 && (
          <motion.div 
            animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2"
          >
            <Crown className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(255,252,0,0.5)]" size={40} />
          </motion.div>
        )}
      </div>

      <p className={`font-black tracking-tighter text-center leading-none mb-2 ${isMain ? 'text-2xl' : 'text-xl'}`}>
        @{user.userId?.username}
      </p>
      
      <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
        <Star size={12} className="text-yellow-400 fill-yellow-400" />
        <span className="font-black text-gray-400 uppercase text-[10px] tracking-widest">{user.points} XP</span>
      </div>
    </motion.div>
  );
};

export default GlobalLeaderboard;