import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navItem = (path, label) => {
    const active = location.pathname.startsWith(path);

    return (
      <Link
        to={path}
        className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
        ${
          active
            ? "text-white"
            : "text-gray-400 hover:text-white"
        }
        hover:bg-white/5 hover:shadow-[0_0_15px_rgba(229,9,20,0.25)]
        `}
      >
        {label}

        {/* Active underline glow */}
        {active && (
          <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-netflix shadow-[0_0_10px_rgba(229,9,20,0.8)] rounded-full"></span>
        )}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer text-2xl font-bold tracking-tight
            text-netflix hover:scale-105 transition-all duration-300"
          >
            dosBrain
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            {navItem("/dashboard", "Dashboard")}
            {navItem("/notes", "Notes")}
            {navItem("/ask", "Ask AI")}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium
              bg-netflix text-white
              hover:bg-red-700
              hover:shadow-[0_0_20px_rgba(229,9,20,0.45)]
              transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
