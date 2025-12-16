import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
// Add AnimatePresence here ⬇️
import { motion, AnimatePresence } from "framer-motion"; 

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative overflow-hidden selection:bg-yellow-400 selection:text-black">
      
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#111] p-8 md:p-10 rounded-[40px] border border-white/5 shadow-2xl backdrop-blur-3xl">
          
          {/* HEADER */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-4">
              <Sparkles size={12} /> The Sphere Awaits
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">
              Welcome <br /> <span className="text-yellow-400">Back</span>
            </h2>
          </div>

          {/* ERROR MESSAGE */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-3"
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL INPUT */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-400 transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Password</label>
                <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-yellow-400/50 hover:text-yellow-400 transition-colors">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-400 transition-colors" size={18} />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFFC00] text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,252,0,0.3)] disabled:opacity-50 transition-all mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Enter the Sphere <ArrowRight size={18} strokeWidth={3} /></>
              )}
            </motion.button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mt-10">
            Don’t have an account?{" "}
            <Link to="/register" className="text-white hover:text-yellow-400 transition-colors underline decoration-yellow-400/30 underline-offset-4">
              Register Now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;