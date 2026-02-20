import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function AskBrain() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const askAI = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      setAnswer("");
      setSources([]);

      const res = await API.post(
        `/notes/ask?q=${encodeURIComponent(question)}`
      );

      setAnswer(res.data.answer || "No response generated.");
      setSources(res.data.sources || []);
    } catch (err) {
      console.log(err);
      setAnswer("The brain is having a headache. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar />

      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-netflix/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-red-900/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <h1 className="text-4xl font-bold mb-2">Ask Your Brain</h1>
        <p className="text-gray-400 mb-8">
          Ask questions based on your saved notes.
        </p>

        {/* Input Panel */}
        <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8
          hover:shadow-[0_0_25px_rgba(229,9,20,0.15)]
          transition-all duration-300"
        >
          <textarea
            placeholder="Ask something about your notes..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="w-full bg-black/50 border border-white/10 rounded-xl p-4
            text-white placeholder-gray-500
            focus:outline-none focus:border-netflix
            focus:shadow-[0_0_20px_rgba(229,9,20,0.35)]
            transition-all duration-300 resize-none"
          />

          <div className="flex justify-end mt-4">
            <button
              onClick={askAI}
              disabled={loading}
              className="px-8 py-3 rounded-xl font-semibold text-white
              bg-netflix hover:bg-red-700
              hover:shadow-[0_0_25px_rgba(229,9,20,0.45)]
              active:scale-[0.98]
              transition-all duration-300"
            >
              {loading ? "Thinking..." : "Ask AI"}
            </button>
          </div>
        </div>

        {/* Answer Panel */}
        {(loading || answer) && (
          <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8
            hover:shadow-[0_0_25px_rgba(229,9,20,0.1)]
            transition-all duration-300"
          >
            <h2 className="text-lg font-semibold text-netflix mb-4">
              AI Response
            </h2>

            {loading ? (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-netflix rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-netflix rounded-full animate-bounce delay-150" />
                <div className="w-2 h-2 bg-netflix rounded-full animate-bounce delay-300" />
                <span className="ml-3">Analyzing your notes...</span>
              </div>
            ) : (
              <>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line mb-6">
                  {answer}
                </p>

                {/* Sources */}
                {sources.length > 0 && (
                  <div>
                    <h3 className="text-sm text-gray-400 mb-3">
                      Sources used:
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      {sources.map((src) => (
                        <button
                          key={src.id}
                          onClick={() => navigate(`/notes/${src.id}`)}
                          className="px-4 py-2 bg-black border border-white/10 rounded-lg
                          text-sm text-gray-300
                          hover:border-netflix/40
                          hover:text-white
                          transition-all duration-300"
                        >
                          {src.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
