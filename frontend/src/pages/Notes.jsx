import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const loadNotes = () => {
    API.get("/notes")
      .then((res) => setNotes(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const deleteNote = async (id) => {
    await API.delete(`/notes/${id}`);
    loadNotes();
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar />

      {/* Soft background glows */}
      <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-netflix/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-red-900/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Notes</h1>
            <p className="text-gray-400">
              Build your personal knowledge system.
            </p>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {/* New Note Card */}
          <div
            onClick={() => navigate("/notes/new")}
            className="cursor-pointer bg-zinc-900/70 border border-dashed border-white/20
            rounded-2xl p-6 flex items-center justify-center text-center
            hover:border-netflix/50
            hover:shadow-[0_0_25px_rgba(229,9,20,0.25)]
            hover:-translate-y-1
            transition-all duration-300"
          >
            <div>
              <p className="text-5xl text-netflix mb-2">+</p>
              <p className="text-gray-300 font-medium">New Note</p>
            </div>
          </div>

          {/* Existing Notes */}
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-zinc-900/70 border border-white/10 rounded-2xl p-6
              hover:border-netflix/40
              hover:shadow-[0_0_30px_rgba(229,9,20,0.25)]
              hover:-translate-y-1
              transition-all duration-300 flex flex-col justify-between"
            >
              {/* Title */}
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                {note.title || "Untitled Note"}
              </h3>

              {/* Preview */}
              <p className="text-gray-400 text-sm line-clamp-4 mb-6">
                {note.content || "No content"}
              </p>

              {/* Actions */}
              <div className="flex justify-between items-center text-sm">
                <button
                  onClick={() => navigate(`/notes/${note._id}`)}
                  className="text-gray-300 hover:text-netflix transition-colors"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteNote(note._id)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
