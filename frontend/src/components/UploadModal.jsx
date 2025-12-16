import React, { useState } from 'react'
import api from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Camera, Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react'

const UploadModal = ({ isOpen, onClose, onSuccess, prompt, isGlobal, groupId }) => {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (optional but recommended for UX)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large (Max 5MB)");
      return;
    }

    setImage(file)
    setPreview(URL.createObjectURL(file))
    setError("")
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("You must select a photo to compete");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("prompt", prompt);
    
    if (isGlobal) {
      formData.append("isGlobal", "true");
    } else {
      formData.append("groupId", groupId);
    }

    try {
      setLoading(true);
      await api.post('/submission/upload', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      onSuccess();
      onClose();
      // Clean up preview URL
      URL.revokeObjectURL(preview);
      setImage(null);
      setPreview(null);
    } catch (error) {
      setError(error.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* MODAL CONTAINER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
          >
            {/* TOP BAR */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-black">
                  <Camera size={18} strokeWidth={3} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest italic">Submit Entry</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              {/* PROMPT BOX */}
              <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                <Sparkles className="text-yellow-400 shrink-0" size={20} />
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Target Prompt</p>
                  <p className="text-white font-bold tracking-tight italic">"{prompt}"</p>
                </div>
              </div>

              {/* UPLOAD AREA / PREVIEW */}
              <div className="relative group rounded-3xl overflow-hidden mb-8 bg-black border-2 border-dashed border-white/10 hover:border-yellow-400/50 transition-colors">
                {!preview ? (
                  <label className="flex flex-col items-center justify-center py-20 cursor-pointer">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="text-gray-400 group-hover:text-yellow-400" size={32} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">Choose a High-Res Photo</p>
                    <p className="text-[10px] text-gray-600 mt-2 font-medium underline">Supports JPEG, PNG, HEIC</p>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                ) : (
                  <div className="relative w-full min-h-[300px] flex items-center justify-center bg-zinc-900">
                    {/* Dynamic Preview with Blurred Backdrop */}
                    <img src={preview} alt="blur" className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40" />
                    <img src={preview} alt="preview" className="relative z-10 w-full h-auto max-h-[400px] object-contain shadow-2xl" />
                    
                    {/* RE-UPLOAD BUTTON */}
                    <label className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <div className="px-6 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon size={14} /> Change Photo
                      </div>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                )}
              </div>

              {/* ERROR ALERT */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold mb-6"
                  >
                    <AlertCircle size={18} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 text-gray-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !image}
                  className={`flex-[2] py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    loading || !image 
                    ? "bg-white/5 text-gray-600 cursor-not-allowed" 
                    : "bg-[#FFFC00] text-black hover:shadow-[0_0_30px_rgba(255,252,0,0.3)] shadow-lg"
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Blast Off <Sparkles size={18} /></>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default UploadModal