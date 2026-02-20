import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setSearching(true);
      const res = await API.get(`/notes/search?q=${query}`);
      setResults(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar />

      {/* Background glows */}
      <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-netflix/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-red-900/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <h1 className="text-4xl font-bold mb-2">Semantic Search</h1>
        <p className="text-gray-400 mb-8">
          Find notes using intelligent similarity matching.
        </p>

        {/* Search Bar */}
        <div className="flex gap-4 mb-10">
          <input
            type="text"
            placeholder="Search your notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-5 py-4 rounded-xl bg-zinc-900/70 border border-white/10
            placeholder-gray-500
            focus:outline-none focus:border-netflix
            focus:shadow-[0_0_20px_rgba(229,9,20,0.35)]
            transition-all duration-300"
          />

          <button
            onClick={handleSearch}
            className="px-8 py-4 rounded-xl font-semibold text-white
            bg-netflix hover:bg-red-700
            hover:shadow-[0_0_25px_rgba(229,9,20,0.45)]
            active:scale-[0.98]
            transition-all duration-300"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((note) => (
              <div
                key={note._id}
                className="bg-zinc-900/70 border border-white/10 rounded-2xl p-6
                hover:border-netflix/40
                hover:shadow-[0_0_30px_rgba(229,9,20,0.25)]
                hover:-translate-y-1
                transition-all duration-300"
              >
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {note.title || "Untitled Note"}
                </h3>

                <p className="text-gray-400 text-sm line-clamp-4">
                  {note.content || "No preview available"}
                </p>

                {/* Optional relevance score */}
                {note.score && (
                  <p className="text-xs text-netflix mt-4">
                    Relevance: {note.score.toFixed(2)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!searching && results.length === 0 && query && (
          <div className="text-center text-gray-500 mt-12">
            No matching notes found.
          </div>
        )}
      </div>
    </div>
  );
}
