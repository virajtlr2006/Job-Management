import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
  applied:  { cls: 'badge-blue',   label: 'Applied' },
  reviewed: { cls: 'badge-amber',  label: 'Under review' },
  accepted: { cls: 'badge-green',  label: 'Accepted' },
  rejected: { cls: 'badge-red',    label: 'Rejected' },
};

const typeConfig = {
  'full-time':  { label: 'Full‑time',  cls: 'badge-lime' },
  'part-time':  { label: 'Part‑time',  cls: 'badge-violet' },
  'contract':   { label: 'Contract',   cls: 'badge-amber' },
  'freelance':  { label: 'Freelance',  cls: 'badge-blue' },
};

const Applications = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchApplied(); }, []);

  const fetchApplied = async () => {
    try {
      const res = await axios.get('/api/jobs/applied');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentUserId = user?.id || user?._id;

  const getApp = (job) =>
    job.applications?.find(a => {
      const aid = a.user?._id ? a.user._id.toString() : a.user?.toString();
      return aid === currentUserId;
    });

  if (!user) {
    return (
      <div className="text-center py-24">
        <p className="text-zinc-500">Please sign in to view your applications.</p>
        <Link to="/login" className="btn-accent mt-4 inline-block px-5 py-2.5 text-sm">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 fade-up">
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-600 mb-2">Dashboard</p>
        <h1 className="font-display text-4xl text-white">My applications</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="card p-6 animate-pulse space-y-3">
              <div className="h-4 bg-zinc-800 rounded w-1/2" />
              <div className="h-3 bg-zinc-800 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="card p-16 text-center space-y-3">
          <p className="text-3xl">📋</p>
          <p className="text-zinc-400 font-medium">No applications yet</p>
          <p className="text-sm text-zinc-600">Browse open roles and hit "Apply now"</p>
          <Link to="/jobs" className="btn-accent inline-block mt-2 px-5 py-2.5 text-sm">Browse jobs</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => {
            const app = getApp(job);
            const status = statusConfig[app?.status] || { cls: 'badge-zinc', label: 'Applied' };
            const type = typeConfig[job.type] || { label: job.type, cls: 'badge-zinc' };

            return (
              <div key={job._id} className="card p-6 space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-xl border border-white/[0.07] bg-zinc-900 flex items-center justify-center font-semibold text-zinc-300">
                      {job.company?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-semibold text-white text-[15px]">{job.title}</h2>
                      <p className="text-sm text-zinc-500">{job.company} · {job.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`badge ${type.cls}`}>{type.label}</span>
                    <span className={`badge ${status.cls}`}>{status.label}</span>
                  </div>
                </div>

                <div className="divider" />

                {/* Meta */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-700 mb-1">Applied</p>
                    <p className="text-sm text-zinc-300">
                      {app?.appliedAt
                        ? new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—'}
                    </p>
                  </div>
                  {job.salary && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-zinc-700 mb-1">Salary</p>
                      <p className="text-sm text-[var(--accent)]">{job.salary}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-700 mb-1">Job status</p>
                    <p className="text-sm text-zinc-300 capitalize">{job.status}</p>
                  </div>
                </div>

                <p className="text-sm text-zinc-600 line-clamp-2">{job.description}</p>

                <Link
                  to={`/jobs/${job._id}`}
                  className="btn-ghost inline-flex items-center gap-1.5 text-xs px-4 py-2"
                >
                  View listing
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6H10M6.5 2.5L10 6l-3.5 3.5"/>
                  </svg>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applications;