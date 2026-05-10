import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b border-white/[0.05] last:border-0">
    <p className="text-xs uppercase tracking-widest text-zinc-700 sm:w-32 shrink-0">{label}</p>
    <p className="text-sm text-zinc-300">{value}</p>
  </div>
);

const Profile = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchUserJobs();
  }, [user]);

  const fetchUserJobs = async () => {
    try {
      setJobs([]); // placeholder – fetch from API when ready
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-24">
        <p className="text-zinc-500">Please sign in to view your profile.</p>
        <Link to="/login" className="btn-accent mt-4 inline-block px-5 py-2.5 text-sm">Sign in</Link>
      </div>
    );
  }

  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="max-w-2xl mx-auto space-y-8 fade-up">
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-600 mb-2">Account</p>
        <h1 className="font-display text-4xl text-white">Profile</h1>
      </div>

      {/* Identity card */}
      <div className="card p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold bg-[var(--accent-dim)] border border-[var(--accent-border)] text-[var(--accent)]">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{user.name}</h2>
            <span className="badge badge-zinc capitalize mt-1">{user.role}</span>
          </div>
        </div>

        <div>
          <InfoRow label="Full name" value={user.name} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Account type" value={user.role === 'employer' ? 'Employer' : 'Job seeker'} />
        </div>
      </div>

      {/* Employer jobs */}
      {user.role === 'employer' && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">My job postings</h2>
            <Link to="/create-job" className="btn-accent px-4 py-2 text-xs">+ Post role</Link>
          </div>

          {loading ? (
            <p className="text-sm text-zinc-600">Loading…</p>
          ) : jobs.length > 0 ? (
            <div className="space-y-3">
              {jobs.map(job => (
                <Link key={job._id} to={`/jobs/${job._id}`} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{job.title}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{job.applications?.length || 0} applications</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
                    <path d="M2 7H12M8 3l4 4-4 4"/>
                  </svg>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <p className="text-zinc-600 text-sm">No roles posted yet</p>
              <Link to="/create-job" className="btn-ghost inline-block px-4 py-2 text-xs">Post your first role</Link>
            </div>
          )}
        </div>
      )}

      {/* Jobseeker tracker */}
      {user.role === 'jobseeker' && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Applications</h2>
            <Link to="/applications" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">View all →</Link>
          </div>
          <p className="text-sm text-zinc-600">Head to your applications dashboard to track every role you've applied to.</p>
          <Link to="/applications" className="btn-ghost inline-flex items-center gap-1.5 text-sm px-4 py-2">
            My applications
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6H10M6.5 2.5L10 6l-3.5 3.5"/>
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;