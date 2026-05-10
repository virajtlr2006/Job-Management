import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Applications = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const res = await axios.get('/api/jobs/applied');
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentUserId = user?.id || user?._id;

  const getApplicationForJob = (job) => {
    return job.applications?.find((application) => {
      const applicantId = application.user?._id ? application.user._id.toString() : application.user?.toString();
      return applicantId === currentUserId;
    });
  };

  if (!user) {
    return <div className="text-center text-slate-300">Please login to view your applications.</div>;
  }

  if (loading) {
    return <div className="text-center text-slate-300">Loading your applications...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-white mb-6">My Applications</h1>
      {jobs.length === 0 ? (
        <div className="surface-card p-6 text-slate-400">
          You have not applied to any jobs yet.
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => {
            const application = getApplicationForJob(job);
            return (
              <div key={job._id} className="surface-card p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{job.title}</h2>
                    <p className="text-slate-400">{job.company}</p>
                    <p className="text-slate-500">{job.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="badge-status bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {job.type}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-500">Application status</p>
                    <p className="mt-1 font-semibold text-white">
                      {application?.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'Applied'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Applied on</p>
                    <p className="mt-1 font-semibold text-white">
                      {application?.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Job description</h3>
                  <p className="text-slate-400 line-clamp-3">{job.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applications;
