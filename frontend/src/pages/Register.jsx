import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    username: "",
    password: ""
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // STEP 1: Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    await api.post("/auth/send-otp", { email: form.email });
    setStep(2);
  };

  // STEP 2: Verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    await api.post("/auth/verify-otp", {
      email: form.email,
      otp: form.otp
    });
    setStep(3);
  };

  // STEP 3: Register
  const registerUser = async (e) => {
    e.preventDefault();
    await api.post("/auth/register", {
      email: form.email,
      username: form.username,
      password: form.password
    });

    await login(form.email, form.password);
    navigate("/home");
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      {step === 1 && (
        <form onSubmit={sendOtp}>
          <h2 className="text-xl mb-4">Verify Email</h2>
          <input
            name="email"
            placeholder="Email"
            className="w-full p-2 border mb-3"
            onChange={handleChange}
          />
          <button className="w-full bg-black text-white py-2">
            Send OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOtp}>
          <h2 className="text-xl mb-4">Enter OTP</h2>
          <input
            name="otp"
            placeholder="OTP"
            className="w-full p-2 border mb-3"
            onChange={handleChange}
          />
          <button className="w-full bg-black text-white py-2">
            Verify OTP
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={registerUser}>
          <h2 className="text-xl mb-4">Create Account</h2>
          <input
            name="username"
            placeholder="Username"
            className="w-full p-2 border mb-3"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border mb-3"
            onChange={handleChange}
          />
          <button className="w-full bg-black text-white py-2">
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
