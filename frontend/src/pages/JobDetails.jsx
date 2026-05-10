import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const typeConfig = {
  'full-time':  { label: 'Full‑time',  cls: 'badge-lime' },
  'part-time':  { label: 'Part‑time',  cls: 'badge-violet' },
  'contract':   { label: 'Contract',   cls: 'badge-amber' },
  'freelance':  { label: 'Freelance',  cls: 'badge-blue' },
};

const statusBadge = {
  'open':   'badge-green',
  'closed': 'badge-red',
  'draft':  'badge-zinc',
};

const appStatusBadge = {
  'applied':  { cls: 'badge-blue', label: 'Applied' },
  'reviewed': { cls: 'badge-amber', label: 'Under review' },
  'accepted': { cls: 'badge-green', label: 'Accepted' },
  'rejected': { cls: 'badge-red', label: 'Rejected' },
};

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => { fetchJob(); }, [id]);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`/api/jobs/${id}`);
      setJob(res.data);
    } catch {
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      await axios.post(`/api/jobs/${id}/apply`);
      toast.success('Application submitted!');
      fetchJob();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const currentUserId = user?.id || user?._id;
  const isOwner = job && currentUserId &&
    (job.postedBy?._id ? job.postedBy._id.toString() : job.postedBy?.toString()) === currentUserId;

  const hasApplied = job?.applications?.some(app => {
    const aid = app.user?._id ? app.user._id.toString() : app.user?.toString();
    return aid === currentUserId;
  });

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-zinc-800 rounded w-1/2" />
        <div className="h-4 bg-zinc-800 rounded w-1/3" />
        <div className="card p-8 space-y-3 mt-6">
          <div className="h-4 bg-zinc-800 rounded" />
          <div className="h-4 bg-zinc-800 rounded w-4/5" />
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-24">
        <p className="text-zinc-500">Job not found.</p>
        <Link to="/jobs" className="btn-ghost mt-4 inline-block px-4 py-2 text-sm">← Back to jobs</Link>
      </div>
    );
  }

  const type = typeConfig[job.type] || { label: job.type, cls: 'badge-zinc' };

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-up">

      {/* Back */}
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 7H2M5.5 3.5L2 7l3.5 3.5"/>
        </svg>
        All jobs
      </Link>

      {/* Main card */}
      <div className="card p-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-14 h-14 rounded-2xl border border-white/[0.07] bg-zinc-900 flex items-center justify-center text-xl font-bold text-zinc-300">
              {job.company?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-3xl text-white leading-tight">{job.title}</h1>
              <p className="text-zinc-400 mt-1">{job.company}</p>
              <p className="text-sm text-zinc-600 mt-0.5 flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6.5 7a2 2 0 100-4 2 2 0 000 4z"/><path d="M6.5 1C4.015 1 2 3.015 2 5.5 2 8.985 6.5 12 6.5 12S11 8.985 11 5.5C11 3.015 8.985 1 6.5 1z"/>
                </svg>
                {job.location}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className={`badge ${type.cls}`}>{type.label}</span>
            <span className={`badge ${statusBadge[job.status] || 'badge-zinc'} capitalize`}>{job.status}</span>
          </div>
        </div>

        {job.salary && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-dim)]">
            <span className="text-[var(--accent)] font-semibold">{job.salary}</span>
          </div>
        )}

        <div className="divider" />

        {/* Description */}
        <section>
          <h2 className="form-label mb-3">About the role</h2>
          <p className="text-zinc-400 text-[15px] leading-relaxed whitespace-pre-line">{job.description}</p>
        </section>

        {/* Requirements */}
        {job.requirements?.length > 0 && (
          <section>
            <h2 className="form-label mb-3">Requirements</h2>
            <ul className="space-y-2.5">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] text-zinc-400">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="divider" />

        {/* Footer action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-zinc-600">
            Posted by <span className="text-zinc-400">{job.postedBy?.name}</span>
            {' '}· {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          {user?.role === 'jobseeker' && job.status === 'open' && (
            <button
              onClick={handleApply}
              disabled={hasApplied || applying}
              className={`btn-accent px-6 py-2.5 text-sm ${hasApplied ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {applying ? 'Submitting…' : hasApplied ? 'Already applied' : 'Apply now'}
            </button>
          )}
        </div>
      </div>

      {/* Applications (owner only) */}
      {isOwner && job.applications?.length > 0 && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Applications</h2>
            <span className="badge badge-zinc">{job.applications.length}</span>
          </div>

          <div className="space-y-3">
            {job.applications.map((app, i) => {
              const s = appStatusBadge[app.status] || { cls: 'badge-zinc', label: app.status };
              return (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.05] bg-zinc-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-400">
                      {app.user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{app.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-zinc-600">{app.user?.email} · Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`badge ${s.cls}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;