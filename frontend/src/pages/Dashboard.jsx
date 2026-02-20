import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/user/profile")
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar />

      {/* Controlled Background Glows (no overflow now) */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-netflix/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-red-900/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <h1 className="text-4xl font-bold mb-2">
          Welcome back,{" "}
          <span className="text-netflix">{user.name || "User"}</span>
        </h1>

        <p className="text-gray-400 mb-10">
          Manage your knowledge, notes, and AI insights.
        </p>

        {/* Profile Card */}
        <div
          className="bg-zinc-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-10
          hover:shadow-[0_0_25px_rgba(229,9,20,0.15)]
          transition-all duration-300"
        >
          <h2 className="text-xl font-semibold mb-4 text-netflix">
            Profile
          </h2>

          <div className="space-y-2 text-gray-300">
            <p>
              <span className="text-gray-500">Name:</span>{" "}
              {user.name || "—"}
            </p>
            <p>
              <span className="text-gray-500">Email:</span>{" "}
              {user.email || "—"}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Notes */}
          <div
            onClick={() => navigate("/notes")}
            className="cursor-pointer bg-zinc-900/70 border border-white/10 rounded-2xl p-8
            hover:border-netflix/40
            hover:shadow-[0_0_30px_rgba(229,9,20,0.25)]
            hover:-translate-y-1
            transition-all duration-300"
          >
            <h3 className="text-xl font-semibold mb-2">📒 Notes</h3>
            <p className="text-gray-400 text-sm">
              Create, edit, and organize your personal knowledge base.
            </p>
          </div>

          {/* Search */}
          <div
            onClick={() => navigate("/search")}
            className="cursor-pointer bg-zinc-900/70 border border-white/10 rounded-2xl p-8
            hover:border-netflix/40
            hover:shadow-[0_0_30px_rgba(229,9,20,0.25)]
            hover:-translate-y-1
            transition-all duration-300"
          >
            <h3 className="text-xl font-semibold mb-2">🔍 Semantic Search</h3>
            <p className="text-gray-400 text-sm">
              Instantly find notes using intelligent similarity search.
            </p>
          </div>

          {/* Ask AI */}
          <div
            onClick={() => navigate("/ask")}
            className="cursor-pointer bg-zinc-900/70 border border-white/10 rounded-2xl p-8
            hover:border-netflix/40
            hover:shadow-[0_0_30px_rgba(229,9,20,0.25)]
            hover:-translate-y-1
            transition-all duration-300"
          >
            <h3 className="text-xl font-semibold mb-2">🧠 Ask AI</h3>
            <p className="text-gray-400 text-sm">
              Ask questions and get context-aware answers from your notes.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
