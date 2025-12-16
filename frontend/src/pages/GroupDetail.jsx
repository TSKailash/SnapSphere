import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import UploadModal from "../components/UploadModal";
import GroupLeaderboard from "../components/GroupLeaderBoard";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Camera, Users, Hash, Heart, Clock, Sparkles, ChevronLeft, Image as ImageIcon } from "lucide-react";

const GroupDetail = () => {
  const { groupId } = useParams();
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(true);
  const [winnerData, setWinnerData] = useState(null);
  const [loadingWinner, setLoadingWinner] = useState(true);

  // ... fetchGroupWinner, fetchPrompt, useEffect, handleVote remain the same logic-wise ...
  const fetchGroupWinner = async () => {
    try {
      const hour = new Date().getHours();
      if (hour < 21) {
        setWinnerData({ beforeTime: true });
        return;
      }
      const res = await api.get(`/group/${groupId}`);
      const subs = res.data.submissions || [];
      if (subs.length === 0) {
        setWinnerData({ noSubmissions: true });
        return;
      }
      const maxVotes = Math.max(...subs.map(s => s.votes));
      const winners = subs.filter(s => s.votes === maxVotes);
      setWinnerData({ winners, votes: maxVotes });
    } catch (error) {
      console.log("Failed to fetch winner");
    } finally {
      setLoadingWinner(false);
    }
  };

  const fetchPrompt = async () => {
    try {
      const res = await api.get(`/group/prompt/${groupId}`);
      setPrompt(res.data.prompt);
    } catch (error) {
      console.log("Failed to fetch prompt");
    } finally {
      setLoadingPrompt(false);
    }
  };

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await api.get(`/group/${groupId}`);
        setGroup(res.data.group);
        setSubmissions(res.data.submissions);
      } catch (error) {
        console.log("Error fetching group");
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
    fetchPrompt();
    fetchGroupWinner();
  }, [groupId]);

  const handleVote = async (submissionId) => {
    try {
      await api.post(`/submission/vote/${submissionId}`);
      setSubmissions((prev) =>
        prev.map((item) =>
          item._id === submissionId
            ? { ...item, votes: item.votes + 1, voters: [...item.voters, user._id] }
            : item
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Unable to vote");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!group) return <div className="text-center text-white mt-20">Group not found</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        <Link to="/groups" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group text-sm font-bold uppercase tracking-widest">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Spheres
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: INFO & LEADERBOARD */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#111] rounded-[32px] p-8 border border-white/5 relative overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 text-yellow-400 font-black tracking-[0.2em] text-[10px] uppercase mb-3">
                <Hash size={12} strokeWidth={3} /> {group.groupCode}
              </div>
              <h2 className="text-4xl font-black tracking-tighter italic mb-6 leading-none">{group.groupName}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                  <p className="text-2xl font-black text-white">{group.members.length}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Members</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                  <p className="text-2xl font-black text-white">{submissions.length}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Snaps</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[32px] p-8 shadow-[0_20px_50px_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-2 text-black/40 font-black uppercase tracking-widest text-[10px] mb-4">
                <Sparkles size={14} /> Today's Prompt
              </div>
              <p className="text-2xl font-black text-black leading-tight tracking-tight mb-8">
                {loadingPrompt ? "..." : `"${prompt}"`}
              </p>
              <button onClick={() => setShowUpload(true)} className="w-full py-4 bg-black text-white rounded-2xl font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2">
                <Camera size={20} /> SNAP YOUR ENTRY
              </button>
            </motion.div>

            <div className="hidden lg:block">
              <GroupLeaderboard groupId={groupId} />
            </div>
          </div>

          {/* RIGHT: CONTENT FEED */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* WINNER PODIUM (Only if 9PM passed) */}
            <AnimatePresence>
              {!loadingWinner && winnerData?.winners && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative group p-[2px] rounded-[32px] bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 shadow-[0_0_50px_rgba(255,180,0,0.15)]">
                  <div className="bg-[#080808] rounded-[30px] p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center text-black rotate-3 shadow-lg">
                      <Trophy size={40} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="text-xs font-black tracking-[0.3em] text-yellow-400 uppercase mb-2">Today's Champion</h4>
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {winnerData.winners.map(w => (
                          <span key={w._id} className="text-3xl font-black tracking-tighter italic">@{w.userId.username}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 text-center">
                      <p className="text-2xl font-black leading-none">{winnerData.votes}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Votes</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FEED */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black italic tracking-tighter">THE FEED</h3>
                {winnerData?.beforeTime && (
                  <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> Results in {21 - new Date().getHours()}h
                  </div>
                )}
              </div>

              {submissions.length === 0 ? (
                <div className="py-32 rounded-[40px] border-2 border-dashed border-white/5 flex flex-col items-center text-gray-600">
                  <ImageIcon size={48} className="mb-4 opacity-20" />
                  <p className="font-bold tracking-widest uppercase text-xs">No one has snapped yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {submissions.map((item) => {
                    const hasVoted = item.voters?.includes(user?._id);
                    const isOwnPost = item.userId?._id === user?._id;

                    return (
                      <motion.div key={item._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#111] rounded-[32px] border border-white/5 overflow-hidden group">
                        
                        {/* DYNAMIC IMAGE CONTAINER */}
                        <div className="relative w-full bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[550px]">
                          {/* Blurred Backdrop for 16:9 or Square images */}
                          <img src={item.imageUrl} alt="backdrop" className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-20 scale-110" />
                          
                          {/* The Real Image: object-contain allows it to be 16:9 without cropping */}
                          <img src={item.imageUrl} alt="snap" className="relative z-10 w-full h-auto max-h-[550px] object-contain shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" />
                          
                          <div className="absolute top-4 right-4 z-20">
                            <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 shadow-xl">
                              <Heart size={14} className={hasVoted ? "fill-red-500 text-red-500" : "text-white"} />
                              <span className="text-xs font-black">{item.votes}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full border border-white/10 flex items-center justify-center font-bold text-xs uppercase">
                                {item.userId?.username?.[0]}
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Captured By</p>
                                <p className="font-bold text-white leading-none">@{item.userId?.username}</p>
                              </div>
                            </div>
                            
                            <button
                              disabled={hasVoted || isOwnPost}
                              onClick={() => handleVote(item._id)}
                              className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                                isOwnPost ? "bg-white/5 text-gray-500" : 
                                hasVoted ? "bg-red-500/10 text-red-500 border border-red-500/20" : 
                                "bg-white text-black hover:bg-yellow-400 hover:scale-105 active:scale-95 shadow-lg"
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

            <div className="lg:hidden">
              <GroupLeaderboard groupId={groupId} />
            </div>
          </div>
        </div>

        <UploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} onSuccess={() => window.location.reload()} prompt={prompt} isGlobal={false} groupId={groupId} />
      </div>
    </div>
  );
};

export default GroupDetail;