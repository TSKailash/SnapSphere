import { useState } from "react";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Sparkles, AlertCircle, Plus } from "lucide-react";

const CreateGroupModal = ({ isOpen, onClose, onSuccess }) => {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!groupName.trim()) {
      setError("Name your sphere to continue");
      return;
    }
    try {
      setLoading(true);
      await api.post('/group/create-group', { groupName });
      setGroupName(""); // Reset form
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create group");
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
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-400/10 blur-[60px] rounded-full pointer-events-none" />

            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* HEADER */}
            <div className="mb-8">
              <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center text-yellow-400 mb-4">
                <Users size={24} />
              </div>
              <h2 className="text-2xl font-black tracking-tighter italic uppercase text-white">
                Start a New <br /> <span className="text-yellow-400">Sphere</span>
              </h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">
                Create a private hub for your squad
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
                Sphere Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Street Photogs NYC"
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full bg-[#FFFC00] text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,252,0,0.3)] transition-all disabled:opacity-50"
              >
                {loading ? (
                  "Initiating..."
                ) : (
                  <>
                    Create Sphere <Plus size={18} strokeWidth={3} />
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="w-full py-4 text-gray-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateGroupModal;