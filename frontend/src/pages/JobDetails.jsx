import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`/api/jobs/${id}`);
      setJob(res.data);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      await axios.post(`/api/jobs/${id}/apply`);
      toast.success('Application submitted successfully!');
      fetchJob();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const currentUserId = user?.id || user?._id;
  const hasApplied = job?.applications?.some((app) => {
    const applicantId = app.user?._id ? app.user._id.toString() : app.user?.toString();
    return applicantId === currentUserId;
  });

  if (loading) {
    return <div className="text-center text-slate-300">Loading job details...</div>;
  }

  if (!job) {
    return <div className="text-center text-red-400">Job not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="surface-card p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-semibold text-white mb-2">{job.title}</h1>
          <p className="text-xl text-slate-300 mb-2">{job.company}</p>
          <p className="text-slate-500 mb-4">{job.location}</p>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`badge-status ${
              job.type === 'full-time'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                : job.type === 'part-time'
                ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
            }`}>
              {job.type}
            </span>
            <span className={`badge-status ${
              job.status === 'open'
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                : job.status === 'closed'
                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
            }`}>
              {job.status}
            </span>
          </div>

          {job.salary && (
            <p className="text-cyan-300 text-2xl font-semibold">{job.salary}</p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">Job Description</h2>
            <p className="text-slate-400 whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">Requirements</h2>
              <ul className="list-disc list-inside text-slate-400 space-y-1">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {currentUserId && ((job.postedBy?._id ? job.postedBy._id.toString() : job.postedBy?.toString()) === currentUserId) && job.applications && job.applications.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Applications ({job.applications.length})</h2>
            <div className="space-y-3">
              {job.applications.map((application, index) => (
                <div key={index} className="surface-panel p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <p className="font-semibold text-white">{application.user?.name || 'Unknown Applicant'}</p>
                      <p className="text-slate-400">{application.user?.email || 'Email not available'}</p>
                      <p className="text-slate-500 text-sm mt-1">
                        Applied on {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`badge-status ${
                      application.status === 'applied'
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                        : application.status === 'reviewed'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6 border-t border-slate-800">
          <div className="text-sm text-slate-500">
            Posted by {job.postedBy.name} on {new Date(job.createdAt).toLocaleDateString()}
          </div>

          {user && user.role === 'jobseeker' && job.status === 'open' && (
            <button
              onClick={handleApply}
              disabled={hasApplied || applying}
              className={`px-6 py-3 rounded-2xl font-semibold transition ${
                hasApplied
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
              }`}
            >
              {applying ? 'Applying...' : hasApplied ? 'Already Applied' : 'Apply Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
