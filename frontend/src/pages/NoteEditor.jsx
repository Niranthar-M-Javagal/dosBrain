import { useEffect, useState } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const isNew = id === "new";

  useEffect(() => {
    if (!isNew) {
      API.get(`/notes/${id}`)
        .then((res) => {
          setTitle(res.data.title || "");
          setContent(res.data.content || "");
        })
        .catch(() => {});
    }
  }, [id, isNew]);

  const saveNote = async () => {
    try {
      setSaving(true);

      if (isNew) {
        await API.post("/notes", { title, content });
      } else {
        await API.patch(`/notes/${id}`, { title, content });
      }

      navigate("/notes");
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar />

      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-netflix/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-900/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {isNew ? "Create Note" : "Edit Note"}
          </h1>

          <button
            onClick={saveNote}
            disabled={saving}
            className="px-6 py-3 rounded-lg font-semibold text-white
            bg-netflix hover:bg-red-700
            hover:shadow-[0_0_25px_rgba(229,9,20,0.45)]
            active:scale-[0.98]
            transition-all duration-300"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Editor Card */}
        <div
          className="bg-zinc-900/70 backdrop-blur-xl border border-white/10
          rounded-2xl p-8
          hover:shadow-[0_0_25px_rgba(229,9,20,0.1)]
          transition-all duration-300"
        >
          {/* Title Input */}
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-semibold mb-6 bg-transparent
            border-b border-white/10 pb-3
            focus:outline-none focus:border-netflix
            focus:shadow-[0_8px_20px_-10px_rgba(229,9,20,0.5)]
            transition-all duration-300"
          />

          {/* Content Area */}
          <textarea
            placeholder="Start writing your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[400px] resize-none bg-transparent
            text-gray-300 leading-relaxed
            focus:outline-none
            placeholder-gray-500"
          />
        </div>
      </div>
    </div>
  );
}
