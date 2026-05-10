import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto text-center">
      <div className="surface-card card-glow p-12 mb-12 border-slate-800">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400 mb-4">Job marketplace</p>
        <h1 className="text-5xl font-semibold tracking-tight text-white mb-4">
          Find your next opportunity, faster.
        </h1>
        <p className="mx-auto max-w-2xl text-slate-400 text-lg leading-8 mb-8">
          Connect employers and job seekers with confidence. Browse roles, apply in one click, and keep your hiring pipeline moving.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/jobs" className="btn-primary px-8 py-3">
            Browse Jobs
          </Link>
          {!user && (
            <Link to="/register" className="btn-secondary px-8 py-3">
              Get Started
            </Link>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="surface-card p-6">
          <h3 className="text-xl font-semibold mb-3 text-white">For Job Seekers</h3>
          <p className="text-slate-400">
            Discover opportunities that match your skills and grow your career with curated listings.
          </p>
        </div>
        <div className="surface-card p-6">
          <h3 className="text-xl font-semibold mb-3 text-white">For Employers</h3>
          <p className="text-slate-400">
            Post roles, review applicants, and manage hiring from one polished dashboard.
          </p>
        </div>
        <div className="surface-card p-6">
          <h3 className="text-xl font-semibold mb-3 text-white">Clean Experience</h3>
          <p className="text-slate-400">
            A modern interface built for clarity, speed, and easy collaboration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
