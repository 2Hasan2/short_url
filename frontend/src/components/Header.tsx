import React from "react";
import { Link } from "react-router-dom";
import { useAuthActions } from "../context/hooks/useAuthActions";

const Header: React.FC = () => {
  const { user, logout } = useAuthActions();

  return (
    <header className="bg-blue-600 text-white p-4 mb-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-xl font-bold">
          ShortURL
        </Link>
        <nav>
          {user ? (
            <>
              <button
                onClick={logout}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">
                Login
              </Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
