import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const register = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await API.post("/user/register", {
        name,
        email,
        password,
      });

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError("Registration failed. Try another email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute w-[500px] h-[500px] bg-netflix/20 rounded-full blur-3xl top-[-120px] right-[-120px]" />
      <div className="absolute w-[400px] h-[400px] bg-red-800/20 rounded-full blur-3xl bottom-[-120px] left-[-120px]" />

      {/* Register Card */}
      <div className="relative z-10 w-[400px] bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-gray-400 mb-6">Start building your AI knowledge base</p>

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-black/60 border border-white/10
          text-white placeholder-gray-500
          focus:outline-none focus:border-netflix
          focus:shadow-[0_0_15px_rgba(229,9,20,0.35)]
          transition-all duration-300"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-black/60 border border-white/10
          text-white placeholder-gray-500
          focus:outline-none focus:border-netflix
          focus:shadow-[0_0_15px_rgba(229,9,20,0.35)]
          transition-all duration-300"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 px-4 py-3 rounded-lg bg-black/60 border border-white/10
          text-white placeholder-gray-500
          focus:outline-none focus:border-netflix
          focus:shadow-[0_0_15px_rgba(229,9,20,0.35)]
          transition-all duration-300"
        />

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        {/* Success */}
        {success && (
          <p className="text-green-400 text-sm mb-3">{success}</p>
        )}

        {/* Button */}
        <button
          onClick={register}
          disabled={loading}
          className="w-full mt-3 py-3 rounded-lg font-semibold text-white
          bg-netflix hover:bg-red-700
          hover:shadow-[0_0_25px_rgba(229,9,20,0.45)]
          active:scale-[0.98]
          transition-all duration-300"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* Login Link */}
        <p className="text-gray-400 text-sm mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-netflix hover:text-red-400 transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
