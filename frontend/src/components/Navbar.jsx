import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`text-sm font-medium transition-colors duration-150 ${
        isActive(to)
          ? 'text-white'
          : 'text-zinc-500 hover:text-zinc-200'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-10">
        <div className="flex h-[60px] items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 11L7 3L12 11" stroke="#0c0c0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 8.5H10.5" stroke="#0c0c0b" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-white">
              JobHub
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLink('/jobs', 'Browse jobs')}
            {user?.role === 'employer' && navLink('/create-job', 'Post a job')}
            {user?.role === 'jobseeker' && navLink('/applications', 'My applications')}
            {user && navLink('/profile', 'Profile')}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-zinc-500">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-danger px-4 py-2 text-sm"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn-accent px-4 py-2 text-sm inline-block"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-zinc-400"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <path d="M5 5L15 15M15 5L5 15"/>
                </>
              ) : (
                <>
                  <path d="M3 6H17M3 10H17M3 14H17"/>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-zinc-950 px-6 py-5 space-y-4">
          <div className="flex flex-col gap-4">
            {navLink('/jobs', 'Browse jobs')}
            {user?.role === 'employer' && navLink('/create-job', 'Post a job')}
            {user?.role === 'jobseeker' && navLink('/applications', 'My applications')}
            {user && navLink('/profile', 'Profile')}
          </div>
          <div className="divider" />
          <div className="flex flex-col gap-3">
            {user ? (
              <button onClick={handleLogout} className="btn-danger w-full py-2.5 text-sm text-center">
                Sign out
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost w-full py-2.5 text-sm text-center block">
                  Sign in
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-accent w-full py-2.5 text-sm text-center block">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;