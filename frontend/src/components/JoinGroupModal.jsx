import React, { useState } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Hash, UserPlus, AlertCircle, ArrowRight } from 'lucide-react';

const JoinGroupModal = ({ isOpen, onClose, onSuccess }) => {
  const [groupCode, setGroupCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleJoin = async () => {
    if (!groupCode.trim()) {
      setError("Please enter a valid invitation code");
      return;
    }
    try {
      setLoading(true);
      await api.post('/group/join', { groupCode });
      setGroupCode("");
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to join group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* MODAL CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden"
          >
            {/* AMBIENT GLOW */}
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* HEADER */}
            <div className="mb-8">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-4">
                <UserPlus size={24} />
              </div>
              <h2 className="text-2xl font-black tracking-tighter italic uppercase text-white">
                Enter a <br /> <span className="text-blue-400">Sphere</span>
              </h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">
                Paste the invite code below
              </p>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-4 text-[10px] font-black uppercase flex items-center gap-2"
              >
                <AlertCircle size={14} /> {error}
              </motion.div>
            )}

            {/* INPUT */}
            <div className="space-y-2 mb-8">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-2">
                Invitation Code
              </label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="CODE-1234"
                  value={groupCode}
                  onChange={(e) => {
                    setGroupCode(e.target.value.toUpperCase());
                    setError("");
                  }}
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white font-mono placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all uppercase tracking-widest"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleJoin}
                disabled={loading}
                className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-blue-400 transition-all disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  "Accessing..."
                ) : (
                  <>
                    Join Sphere <ArrowRight size={18} strokeWidth={3} />
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="w-full py-4 text-gray-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JoinGroupModal;