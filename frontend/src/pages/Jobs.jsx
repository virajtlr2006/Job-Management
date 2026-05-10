import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center text-slate-300">Loading jobs...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="surface-panel p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white mb-2">Available Jobs</h1>
            <p className="text-slate-400">Search roles, companies, and locations to find your next hire or career move.</p>
          </div>
          {user && user.role === 'employer' && (
            <Link to="/create-job" className="btn-primary px-5 py-3">
              Create New Job
            </Link>
          )}
        </div>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Search jobs, companies, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredJobs.map(job => (
          <div key={job._id} className="surface-card p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">{job.title}</h2>
                <p className="text-slate-400">{job.company}</p>
                <p className="text-slate-500">{job.location}</p>
              </div>
              <span className={`badge-status ${
                job.type === 'full-time'
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                  : job.type === 'part-time'
                  ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
              }`}>
                {job.type}
              </span>
            </div>

            <p className="text-slate-400 mb-4 line-clamp-3">{job.description}</p>

            {job.salary && (
              <p className="text-cyan-300 font-semibold mb-4">{job.salary}</p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <span className="text-sm text-slate-500">Posted by {job.postedBy.name}</span>
              <Link to={`/jobs/${job._id}`} className="btn-secondary px-4 py-2">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center text-slate-400 mt-8">
          No jobs found matching your search.
        </div>
      )}
    </div>
  );
};

export default Jobs;
