import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Todo App
        </Link>
        
        <div className="flex items-center">
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline mr-4">Welcome, {user?.name}</span>
              <Link to="/profile" className="px-3 py-2 rounded hover:bg-blue-700 transition mr-2">
                Profile
              </Link>
              <button
                onClick={logout}
                className="px-3 py-2 bg-red-500 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded hover:bg-blue-700 transition mr-2">
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 bg-green-500 rounded hover:bg-green-600 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 