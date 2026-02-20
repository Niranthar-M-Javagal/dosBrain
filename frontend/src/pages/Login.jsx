import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault(); // ✅ prevents page reload

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/user/login", {
        email,
        password,
      });

      if (!res.data.token) {
        throw new Error("Token missing from response");
      }

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      console.log(err);

      // ✅ show backend error if available
      setError(
        err.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-netflix/20 rounded-full blur-3xl top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-red-800/20 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />

      {/* Login Card */}
      <form
        onSubmit={login}
        className="relative z-10 w-[380px] bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-400 mb-6">
          Login to access your AI brain
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 px-4 py-3 rounded-lg bg-black/60 border border-white/10
          text-white placeholder-gray-500
          focus:outline-none focus:border-netflix
          focus:shadow-[0_0_15px_rgba(229,9,20,0.35)]
          transition-all duration-300"
        />

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 rounded-lg font-semibold text-white
          bg-netflix hover:bg-red-700
          hover:shadow-[0_0_25px_rgba(229,9,20,0.45)]
          active:scale-[0.98]
          transition-all duration-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register */}
        <p className="text-gray-400 text-sm mt-6 text-center">
          New here?{" "}
          <Link
            to="/register"
            className="text-netflix hover:text-red-400 transition-colors"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}