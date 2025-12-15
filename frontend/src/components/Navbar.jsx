import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const {isAuthenticated, logout} =useAuth() 

  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex items-center justify-between">
      {/* Left - Logo */}
      <Link to="/" className="text-2xl font-bold tracking-wide">
        SnapSphere
      </Link>

      {/* Center - Navigation */}
      <div className="hidden md:flex gap-8 text-sm font-medium">
        <Link to="/dashboard" className="hover:text-gray-300">
          Global
        </Link>
        <Link to="/groups" className="hover:text-gray-300">
          Groups
        </Link>
        <Link to="/leaderboard" className="hover:text-gray-300">
          Leaderboard
        </Link>
      </div>

      {/* Right - Auth */}
      <div className="flex items-center gap-4 text-sm">
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded bg-white text-black hover:bg-gray-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded border border-white hover:bg-white hover:text-black"
            >
              Register
            </Link>
          </>
        ) : (
            <>
          <Link
            to="/profile"
            className="px-4 py-2 rounded bg-white text-black hover:bg-gray-200"
          >
            Profile
          </Link>
          <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
