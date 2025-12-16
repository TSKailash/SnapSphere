import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from '../context/AuthContext';
import UploadModal from '../components/UploadModal';
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Camera, Heart, Clock, Sparkles, ChevronRight, Image as ImageIcon } from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showWinner, setShowWinner] = useState(false);
  const hourNow = new Date().getHours();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 21) {
      setShowWinner(true);
      const fetchWinner = async () => {
        try {
          const res = await api.get('/global/today-winner');
          setWinner(res.data);
        } catch (error) {
          console.log("No winner Yet");
        }
      };
      fetchWinner();
    }
  }, []);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await api.get('/global/prompt');
        setPrompt(res.data.prompt);
      } catch (error) {
        console.log("Error fetching prompt");
      } finally {
        setLoadingPrompt(false);
      }
    };
    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/global/today-submissions');
        setSubmissions(res.data);
      } catch (error) {
        console.log("Error fetching submissions");
      } finally {
        setLoadingSubs(false);
      }
    };
    fetchPrompt();
    fetchSubmissions();
  }, []);

  const refreshSubmission = async () => {
    const res = await api.get('/global/today-submissions');
    setSubmissions(res.data);
  };

  const handleVote = async (submissionId) => {
    try {
      await api.post(`/submission/vote/${submissionId}`);
      setSubmissions((prev) =>
        prev.map((item) =>
          item._id === submissionId
            ? {
                ...item,
                votes: item.votes + 1,
                voters: [...(item.voters || []), user._id],
              }
            : item
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update vote");
    }
  };

  const hasSubmitted = submissions.some((item) => item.userId?._id === user?._id);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-4 md:px-8">
      
      {/* 1. STATUS BAR */}
      <div className="max-w-7xl mx-auto mb-8">
        <AnimatePresence>
          {hourNow < 21 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <Clock size={20} />
                </div>
                <p className="text-sm font-medium text-gray-300">
                  Daily Challenge closes at <span className="text-white font-bold underline decoration-blue-500">9:00 PM</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. LEFT COLUMN: PROMPT & WINNER */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* WINNER CARD */}
          {showWinner && winner && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative group rounded-[32px] overflow-hidden border border-yellow-500/50 shadow-[0_0_40px_rgba(255,252,0,0.15)] bg-black"
            >
              <div className="absolute top-4 left-4 z-20 bg-yellow-400 text-black px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-xl uppercase">
                <Trophy size={14} /> Global Champion
              </div>
              
              {/* Dynamic Winner Image Container */}
              <div className="relative w-full aspect-square md:aspect-[4/5] bg-zinc-900 flex items-center justify-center overflow-hidden">
                <img src={winner.imageUrl} alt="winner-blur" className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40" />
                <img src={winner.imageUrl} alt="winner" className="relative z-10 w-full h-auto max-h-full object-contain transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
              </div>

              <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                <p className="text-yellow-400 font-black text-2xl tracking-tighter uppercase">{winner.userId?.username}</p>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{winner.votes} Community Votes</p>
              </div>
            </motion.div>
          )}

          {/* DAILY PROMPT CARD */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#111] border border-white/5 rounded-[32px] p-8 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Camera size={120} />
            </div>
            <h2 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-yellow-400" /> Current Prompt
            </h2>
            {loadingPrompt ? (
              <div className="h-8 w-48 bg-white/5 animate-pulse rounded-md" />
            ) : (
              <h1 className="text-3xl md:text-4xl font-black mb-8 leading-tight tracking-tighter italic uppercase">
                "{prompt}"
              </h1>
            )}
            
            <button
              onClick={() => setShowUpload(true)}
              disabled={hasSubmitted}
              className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${
                hasSubmitted 
                ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5" 
                : "bg-[#FFFC00] text-black hover:shadow-[0_0_30px_rgba(255,252,0,0.3)] hover:scale-[1.02] active:scale-95"
              }`}
            >
              {hasSubmitted ? "CHALLENGE ENTERED" : (
                <>SUBMIT SNAP <ChevronRight size={20} /></>
              )}
            </button>
          </motion.div>
        </div>

        {/* 3. RIGHT COLUMN: SUBMISSIONS FEED */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black tracking-tighter italic uppercase text-gray-400">The Feed</h3>
            <div className="h-[1px] flex-1 bg-white/10 mx-6"></div>
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{submissions.length} Active Snaps</span>
          </div>

          {loadingSubs ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 animate-pulse">
              {[1, 2, 3, 4].map(n => <div key={n} className="h-80 bg-white/5 rounded-[32px]" />)}
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center">
              <ImageIcon className="text-white/10 mb-4" size={48} />
              <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No entries in the sphere yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {submissions.map((item) => {
                const hasVoted = item.voters?.includes(user?._id);
                const isOwnPost = item.userId?._id === user?._id;

                return (
                  <motion.div
                    layout
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -8 }}
                    className="relative group bg-[#111] rounded-[32px] overflow-hidden border border-white/5 shadow-xl transition-all hover:border-white/20"
                  >
                    {/* DYNAMIC IMAGE CONTAINER */}
                    <div className="relative w-full bg-black flex items-center justify-center overflow-hidden min-h-[350px] max-h-[500px]">
                      {/* Blurred Backdrop - Fills the container regardless of photo shape */}
                      <img
                        src={item.imageUrl}
                        alt="backdrop"
                        className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 scale-110"
                      />
                      
                      {/* Actual Photo - object-contain prevents landscape cropping */}
                      <img
                        src={item.imageUrl}
                        alt="submission"
                        className="relative z-10 w-full h-auto max-h-[500px] object-contain shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                      
                      {/* Floating Vote Count */}
                      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 border border-white/10 shadow-2xl">
                        <Heart size={14} className={hasVoted ? "fill-red-500 text-red-500" : "text-white"} />
                        {item.votes}
                      </div>
                    </div>

                    {/* Meta Info & Vote Button */}
                    <div className="p-6 bg-[#111]">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center font-bold text-xs uppercase border border-white/10 group-hover:rotate-6 transition-transform">
                            {item.userId?.username?.[0]}
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black mb-0.5">Contributor</p>
                            <p className="font-bold text-white tracking-tight italic">@{item.userId?.username || "Anonymous"}</p>
                          </div>
                        </div>

                        <button
                          disabled={hasVoted || isOwnPost}
                          onClick={() => handleVote(item._id)}
                          className={`px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all shadow-lg active:scale-90 ${
                            isOwnPost 
                            ? "bg-white/5 text-white/30 cursor-default" 
                            : hasVoted 
                              ? "bg-red-500/10 text-red-500 border border-red-500/20"
                              : "bg-white text-black hover:bg-[#FFFC00] hover:scale-105"
                          }`}
                        >
                          {isOwnPost ? "MINE" : hasVoted ? "VOTED" : "VOTE"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onSuccess={refreshSubmission}
        prompt={prompt}
        isGlobal={true}
        groupId={null}
      />
    </div>
  );
};

export default Home;