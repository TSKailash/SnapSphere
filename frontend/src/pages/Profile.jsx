import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { 
  User, 
  Globe, 
  Users, 
  Trophy, 
  Calendar, 
  Mail, 
  Zap, 
  Award,
  ChevronRight
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [groupStats, setGroupStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setProfile(res.data);

        const groupPoints = [];
        for (const groupId of res.data.groupsJoined) {
          try {
            const lb = await api.get(`/leaderboard/leaderboard/${groupId}`);
            const me = lb.data.find(
              (entry) => entry.userId._id === res.data._id
            );
            if (me) {
              groupPoints.push({
                groupId,
                points: me.points,
              });
            }
          } catch (e) {
            console.error("Group data fetch failed for", groupId);
          }
        }
        setGroupStats(groupPoints);
      } catch (err) {
        console.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!profile) return <div className="text-center mt-20 text-white">Profile not found</div>;

  const totalPoints = (profile.globalPoints || 0) + groupStats.reduce((acc, curr) => acc + curr.points, 0);
  const userLevel = Math.floor(totalPoints / 50) + 1;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER / IDENTITY SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111] rounded-[40px] p-8 border border-white/5 relative overflow-hidden mb-8"
        >
          {/* Background Glow */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-400/10 blur-[100px] rounded-full" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[35%] flex items-center justify-center text-black font-black text-4xl shadow-[0_0_40px_rgba(255,252,0,0.2)]">
                {profile.username[0].toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white text-black px-3 py-1 rounded-xl font-black text-xs border-4 border-[#111]">
                LVL {userLevel}
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-2">{profile.username}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <span className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                  <Mail size={16} /> {profile.email}
                </span>
                <span className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                  <Calendar size={16} /> Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center min-w-[150px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-1">Total XP</p>
              <p className="text-4xl font-black tracking-tighter">{totalPoints}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* STATS GRID */}
          <div className="space-y-6">
            {/* GLOBAL CARD */}
            <ProfileStatCard 
              icon={<Globe size={24} className="text-blue-400" />}
              label="Global Standing"
              value={profile.globalPoints || 0}
              subLabel="Total Global Points"
            />

            {/* GROUP STATS LIST */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#111] border border-white/5 rounded-[32px] p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users size={24} className="text-purple-400" />
                  <h3 className="font-black uppercase tracking-widest text-xs">Sphere Rankings</h3>
                </div>
                <span className="text-[10px] font-black text-gray-500">{groupStats.length} Joined</span>
              </div>

              {groupStats.length === 0 ? (
                <p className="text-gray-600 text-sm italic">You haven't conquered any spheres yet.</p>
              ) : (
                <div className="space-y-4">
                  {groupStats.map((g, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 group hover:border-yellow-400/30 transition-all">
                      <span className="text-sm font-bold text-gray-400">Sphere #{idx + 1}</span>
                      <span className="font-black text-white">{g.points} <span className="text-[10px] text-yellow-400">PTS</span></span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* ACHIEVEMENTS / REWARDS */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[32px] p-8 text-black"
            >
              <div className="flex items-center gap-3 mb-8">
                <Trophy size={24} />
                <h3 className="font-black uppercase tracking-widest text-xs">Hall of Fame</h3>
              </div>

              <div className="flex flex-col gap-4">
                {profile.globalPoints > 0 ? (
                  <Achievement 
                    icon={<Zap size={18} />} 
                    title="Global Victor" 
                    desc="Won a world-wide daily challenge" 
                    active 
                  />
                ) : null}

                {profile.groupsJoined.length > 0 ? (
                  <Achievement 
                    icon={<Users size={18} />} 
                    title="Sphere Legend" 
                    desc="Active in private competitions" 
                    active 
                  />
                ) : null}

                {totalPoints >= 100 ? (
                  <Achievement 
                    icon={<Award size={18} />} 
                    title="Century Club" 
                    desc="Reached 100 total experience points" 
                    active 
                  />
                ) : (
                   <div className="p-4 rounded-2xl border-2 border-dashed border-black/10 opacity-50">
                    <p className="text-xs font-black uppercase text-center">More rewards coming soon</p>
                   </div>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

// HELPER COMPONENTS
const ProfileStatCard = ({ icon, label, value, subLabel }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-[#111] border border-white/5 rounded-[32px] p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-colors"
  >
    <div className="flex items-center gap-6">
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-black tracking-tighter">{value}</p>
      </div>
    </div>
    <div className="text-right">
       <p className="text-[10px] font-bold text-gray-600 uppercase italic">{subLabel}</p>
    </div>
  </motion.div>
);

const Achievement = ({ icon, title, desc, active }) => (
  <div className="flex items-center gap-4 p-4 bg-black rounded-2xl text-white border border-black transition-all hover:scale-[1.02]">
    <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-black">
      {icon}
    </div>
    <div>
      <p className="font-black uppercase text-xs tracking-tight leading-none mb-1">{title}</p>
      <p className="text-[10px] text-gray-500 font-medium">{desc}</p>
    </div>
  </div>
);

export default Profile;