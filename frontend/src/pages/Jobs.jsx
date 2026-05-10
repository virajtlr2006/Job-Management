import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const typeConfig = {
  'full-time':  { label: 'Full‑time',  cls: 'badge-lime' },
  'part-time':  { label: 'Part‑time',  cls: 'badge-violet' },
  'contract':   { label: 'Contract',   cls: 'badge-amber' },
  'freelance':  { label: 'Freelance',  cls: 'badge-blue' },
};

const statusConfig = {
  'open':   { cls: 'badge-green' },
  'closed': { cls: 'badge-red' },
  'draft':  { cls: 'badge-zinc' },
};

const JobCard = ({ job }) => {
  const type = typeConfig[job.type] || { label: job.type, cls: 'badge-zinc' };
  const status = statusConfig[job.status] || { cls: 'badge-zinc' };

  return (
    <div className="card card-interactive p-6 flex flex-col sm:flex-row sm:items-start gap-5">
      {/* Company avatar */}
      <div className="shrink-0 w-11 h-11 rounded-xl border border-white/[0.07] bg-zinc-900 flex items-center justify-center text-lg font-semibold text-zinc-300">
        {job.company?.[0]?.toUpperCase() || '?'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
          <div>
            <h2 className="text-[15px] font-semibold text-white leading-snug">{job.title}</h2>
            <p className="text-sm text-zinc-500 mt-0.5">{job.company} · {job.location}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <span className={`badge ${type.cls}`}>{type.label}</span>
            <span className={`badge ${status.cls} capitalize`}>{job.status}</span>
          </div>
        </div>

        <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2 mb-4">{job.description}</p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            {job.salary && (
              <span className="text-sm font-medium text-[var(--accent)]">{job.salary}</span>
            )}
            <span className="text-xs text-zinc-600">
              Posted by {job.postedBy?.name}
            </span>
          </div>
          <Link
            to={`/jobs/${job._id}`}
            className="btn-ghost px-4 py-2 text-xs inline-flex items-center gap-1.5"
          >
            View details
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6H10M6.5 2.5L10 6l-3.5 3.5"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = jobs.filter(job => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q);
    const matchType = typeFilter === 'all' || job.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-600 mb-2">Opportunities</p>
          <h1 className="font-display text-4xl text-white">Open roles</h1>
        </div>
        {user?.role === 'employer' && (
          <Link to="/create-job" className="btn-accent px-5 py-2.5 text-sm inline-block">
            + Post a role
          </Link>
        )}
      </div>

      {/* Search + filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="7" cy="7" r="5"/><path d="M11.5 11.5L14 14"/>
          </svg>
          <input
            type="text"
            placeholder="Search roles, companies, locations…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="field pl-10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="field sm:w-40"
        >
          <option value="all">All types</option>
          <option value="full-time">Full‑time</option>
          <option value="part-time">Part‑time</option>
          <option value="contract">Contract</option>
          <option value="freelance">Freelance</option>
        </select>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-zinc-600">
          {filtered.length} {filtered.length === 1 ? 'role' : 'roles'} found
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      )}

      {/* Job list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex gap-5">
                <div className="w-11 h-11 rounded-xl bg-zinc-800" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-zinc-800 rounded w-1/3" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2" />
                  <div className="h-3 bg-zinc-800 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-zinc-400 font-medium">No roles match your search</p>
          <p className="text-sm text-zinc-600 mt-1">Try broadening your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(job => <JobCard key={job._id} job={job} />)}
        </div>
      )}
    </div>
  );
};

export default Jobs;