import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ShieldCheck, ArrowRight, Sparkles, ChevronLeft } from "lucide-react";

const Register = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // STEP 1: Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email: form.email });
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", {
        email: form.email,
        otp: form.otp
      });
      setStep(3);
    } catch (error) {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Register
  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", {
        email: form.email,
        username: form.username,
        password: form.password
      });
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (error) {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants for steps
  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#111] p-8 md:p-10 rounded-[40px] border border-white/5 shadow-2xl backdrop-blur-3xl">
          
          {/* STEP INDICATOR */}
          <div className="flex justify-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  step >= s ? "w-8 bg-yellow-400" : "w-4 bg-white/10"
                }`} 
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: EMAIL */}
            {step === 1 && (
              <motion.form 
                key="step1" 
                variants={stepVariants} initial="hidden" animate="visible" exit="exit"
                onSubmit={sendOtp} className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Join the <span className="text-yellow-400">Sphere</span></h2>
                  <p className="text-gray-500 text-xs font-bold mt-2 uppercase tracking-widest">Step 1: Verify your identity</p>
                </div>
                <div className="space-y-2">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-400 transition-colors" size={18} />
                    <input
                      name="email" type="email" required placeholder="Email Address"
                      className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white focus:ring-2 focus:ring-yellow-400/50 outline-none transition-all"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <button disabled={loading} className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,252,0,0.3)] transition-all">
                  {loading ? "Sending..." : <>Get Secure Code <ArrowRight size={18} strokeWidth={3} /></>}
                </button>
              </motion.form>
            )}

            {/* STEP 2: OTP */}
            {step === 2 && (
              <motion.form 
                key="step2"
                variants={stepVariants} initial="hidden" animate="visible" exit="exit"
                onSubmit={verifyOtp} className="space-y-6"
              >
                <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white flex items-center gap-1 text-[10px] font-black uppercase tracking-widest mb-4">
                  <ChevronLeft size={14} /> Back
                </button>
                <div className="text-center">
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Check your <span className="text-yellow-400">Inbox</span></h2>
                  <p className="text-gray-500 text-xs font-bold mt-2 uppercase tracking-widest">Step 2: Enter 6-digit code</p>
                </div>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-400 transition-colors" size={18} />
                  <input
                    name="otp" required placeholder="Verification Code"
                    className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white text-center tracking-[0.5em] font-black focus:ring-2 focus:ring-yellow-400/50 outline-none transition-all"
                    onChange={handleChange}
                  />
                </div>
                <button disabled={loading} className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all">
                  {loading ? "Verifying..." : <>Verify Code <ArrowRight size={18} strokeWidth={3} /></>}
                </button>
              </motion.form>
            )}

            {/* STEP 3: USER DETAILS */}
            {step === 3 && (
              <motion.form 
                key="step3"
                variants={stepVariants} initial="hidden" animate="visible" exit="exit"
                onSubmit={registerUser} className="space-y-5"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Final <span className="text-yellow-400">Step</span></h2>
                  <p className="text-gray-500 text-xs font-bold mt-2 uppercase tracking-widest">Step 3: Create your profile</p>
                </div>
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-400 transition-colors" size={18} />
                    <input
                      name="username" required placeholder="Choose Username"
                      className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white focus:ring-2 focus:ring-yellow-400/50 outline-none transition-all"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-400 transition-colors" size={18} />
                    <input
                      name="password" type="password" required placeholder="Set Password"
                      className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white focus:ring-2 focus:ring-yellow-400/50 outline-none transition-all"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <button disabled={loading} className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all">
                  {loading ? "Creating..." : <>Complete Registration <Sparkles size={18} /></>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mt-10">
            Already a member?{" "}
            <Link to="/login" className="text-white hover:text-yellow-400 transition-colors underline underline-offset-4 decoration-yellow-400/30">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;