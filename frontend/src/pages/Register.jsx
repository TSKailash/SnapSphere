import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Sparkles } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", {
        email: form.email,
        username: form.username,
        password: form.password,
      });

      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#111] p-8 rounded-[40px] border border-white/5 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
              Create <span className="text-yellow-400">Account</span>
            </h2>
            <p className="text-gray-500 text-xs font-bold mt-2 uppercase tracking-widest">
              Sign up to get started
            </p>
          </div>

          <form onSubmit={registerUser} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white"
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                name="username"
                required
                placeholder="Username"
                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white"
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white"
                onChange={handleChange}
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              {loading ? "Creating..." : <>Register <Sparkles size={18} /></>}
            </button>
          </form>

          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mt-8">
            Already a member?{" "}
            <Link to="/login" className="text-white hover:text-yellow-400 underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
