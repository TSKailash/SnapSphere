import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LogOut, User, LayoutGrid, Users, Trophy, Globe } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Helper to check if a link is active for styling
  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-[100] px-6 py-4 flex items-center justify-between backdrop-blur-xl border-b border-white/10 bg-black/50"
    >
      {/* LEFT - LOGO */}
      <Link to="/" className="group flex items-center gap-2">
        <div className="w-8 h-8 bg-[#FFFC00] rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-300">
          <div className="w-3 h-3 bg-black rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
        </div>
        <span className="text-xl font-black tracking-tighter italic text-white uppercase group-hover:text-[#FFFC00] transition-colors">
          SnapSphere
        </span>
      </Link>

      {/* CENTER - NAVIGATION (DESKTOP) */}
      <div className="hidden md:flex items-center bg-white/5 rounded-2xl p-1 border border-white/5">
        <NavLink to="/dashboard" active={isActive("/dashboard")} icon={<Globe size={16} />}>
          Global
        </NavLink>
        <NavLink to="/groups" active={isActive("/groups")} icon={<Users size={16} />}>
          Groups
        </NavLink>
        <NavLink to="/leaderboard" active={isActive("/leaderboard")} icon={<Trophy size={16} />}>
          Leaderboard
        </NavLink>
      </div>

      {/* RIGHT - AUTH */}
      <div className="flex items-center gap-3">
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-bold text-white hover:text-[#FFFC00] transition-colors"
            >
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="px-5 py-2 rounded-xl bg-white text-black text-sm font-black hover:bg-[#FFFC00] transition-colors"
              >
                Join Now
              </Link>
            </motion.div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive("/profile") 
                ? "bg-[#FFFC00] text-black" 
                : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <User size={16} />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            
            <button 
              onClick={logout}
              className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

// Sub-component for clean Navigation Links
const NavLink = ({ to, children, active, icon }) => (
  <Link
    to={to}
    className={`relative flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
      active ? "text-black" : "text-gray-400 hover:text-white"
    }`}
  >
    {active && (
      <motion.div 
        layoutId="nav-pill"
        className="absolute inset-0 bg-[#FFFC00] rounded-xl z-[-1]"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    {icon}
    {children}
  </Link>
);

export default Navbar;