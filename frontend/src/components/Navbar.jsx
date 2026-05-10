import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-950 border-b border-slate-800 shadow-black/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center gap-4 py-4">
          <Link to="/" className="text-2xl font-bold tracking-tight text-cyan-400">
            JobHub
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-slate-200">
            <Link to="/jobs" className="text-slate-200 transition hover:text-cyan-300">
              Jobs
            </Link>

            {user ? (
              <>
                {user.role === 'employer' && (
                  <Link to="/create-job" className="text-slate-200 transition hover:text-cyan-300">
                    Post Job
                  </Link>
                )}
                {user.role === 'jobseeker' && (
                  <Link to="/applications" className="text-slate-200 transition hover:text-cyan-300">
                    My Applications
                  </Link>
                )}
                <Link to="/profile" className="text-slate-200 transition hover:text-cyan-300">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary bg-red-500 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="transition hover:text-cyan-300">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
