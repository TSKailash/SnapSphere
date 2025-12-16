import React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Camera, Users, Trophy, Zap, Globe, Shield, Sparkles, ArrowRight } from "lucide-react";

const Landing = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-400 selection:text-black overflow-x-hidden">
      
      {/* 1. DYNAMIC MESH BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* 3. HERO SECTION (ULTRA-MODERN) */}
      <section className="relative pt-40 pb-20 px-6 flex flex-col items-center">
        <motion.div style={{ opacity }} className="text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs mb-8"
          >
            <Sparkles size={14} className="text-yellow-400" />
            <span className="uppercase tracking-widest font-bold">The New Era of Photo Sharing</span>
          </motion.div>
          
          <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tighter leading-[0.9]">
            SNAP.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-white">SHARE.</span><br />
            WIN.
          </h1>

          <p className="max-w-lg mx-auto text-gray-400 text-lg mb-12">
            The world's first competitive photo social network. 
            One daily prompt. Infinite creative possibilities.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/register" className="group relative px-10 py-5 bg-[#FFFC00] text-black font-black rounded-2xl overflow-hidden transition-all">
              <span className="relative z-10 flex items-center gap-2">START COMPETING <ArrowRight size={20} /></span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 4. THE BENTO GRID FEATURES */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-full">
          
          {/* Main Large Feature */}
          <BentoCard 
            className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-yellow-500 to-orange-600"
            icon={<Camera size={40} />}
            title="The Daily Prompt"
            desc="Every 24 hours, the world gets one mission. Capture 'Shadows', 'Street Life', or 'Ethereal'. One shot to rule the leaderboard."
            darkText
          />

          {/* Medium Feature */}
          <BentoCard 
            className="md:col-span-2 bg-[#111]"
            icon={<Globe className="text-blue-400" />}
            title="Global Spheres"
            desc="Compete with millions. Your creativity, judged by the world."
          />

          {/* Small Feature */}
          <BentoCard 
            className="bg-[#111]"
            icon={<Shield className="text-green-400" />}
            title="Private Groups"
            desc="Challenge your friends in private circles."
          />

          {/* Small Feature */}
          <BentoCard 
            className="bg-zinc-900"
            icon={<Trophy className="text-purple-400" />}
            title="Daily Crowns"
            desc="Top 3 win exclusive badges and profile glows."
          />
        </div>
      </section>

      {/* 5. INTERACTIVE HOW-IT-WORKS SECTION */}
      <section className="py-24 bg-white text-black rounded-[40px] mx-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              HOW TO <br />DOMINATE.
            </h2>
            <p className="max-w-xs font-medium text-gray-500">
              Three simple steps to go from a casual snapper to a SnapSphere Legend.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <Step number="01" title="Receive" desc="Get the daily prompt at midnight UTC." />
            <Step number="02" title="Capture" desc="Upload your best shot before the timer hits zero." />
            <Step number="03" title="Vote" desc="The community decides. Best photo takes the gold." />
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-40 text-center">
        <motion.div 
            whileInView={{ y: [20, 0], opacity: [0, 1] }}
            className="flex flex-col items-center"
        >
            <div className="w-24 h-24 bg-yellow-400 rounded-[30%] flex items-center justify-center rotate-12 mb-8 shadow-[0_0_50px_rgba(255,252,0,0.3)]">
                <Zap size={48} fill="black" stroke="black" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter italic">DON'T MISS<br />TODAY'S PROMPT.</h2>
            <Link to="/register" className="px-12 py-6 border border-white rounded-full font-bold text-xl hover:bg-white hover:text-black transition-all">
                SECURE YOUR HANDLE
            </Link>
        </motion.div>
      </section>

      <footer className="p-10 text-center border-t border-white/5 opacity-50 text-xs tracking-widest uppercase">
        SnapSphere © 2025 • Designed for the Bold
      </footer>
    </div>
  );
};

// HELPER COMPONENTS
const BentoCard = ({ className, icon, title, desc, darkText }) => (
  <motion.div 
    whileHover={{ scale: 0.98 }}
    className={`${className} p-8 rounded-[32px] flex flex-col justify-end min-h-[250px] relative overflow-hidden group cursor-pointer`}
  >
    <div className={`mb-auto ${darkText ? 'text-black/50' : 'text-white/20'} group-hover:scale-110 group-hover:text-yellow-400 transition-all duration-500`}>
      {icon}
    </div>
    <div>
      <h3 className={`text-2xl font-black mb-2 tracking-tight ${darkText ? 'text-black' : 'text-white'}`}>{title}</h3>
      <p className={`text-sm font-medium leading-snug ${darkText ? 'text-black/70' : 'text-gray-400'}`}>{desc}</p>
    </div>
  </motion.div>
);

const Step = ({ number, title, desc }) => (
  <div className="group">
    <div className="text-8xl font-black text-gray-100 group-hover:text-yellow-400 transition-colors duration-500 leading-none mb-4">{number}</div>
    <h4 className="text-2xl font-bold mb-2 uppercase tracking-tight">{title}</h4>
    <p className="text-gray-500 font-medium">{desc}</p>
  </div>
);

export default Landing;