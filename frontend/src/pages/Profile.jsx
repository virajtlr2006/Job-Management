import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserJobs();
    }
  }, [user]);

  const fetchUserJobs = async () => {
    try {
      setJobs([]);
    } catch (error) {
      console.error('Error fetching user jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-slate-300">Please login to view your profile</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold text-white">Profile</h1>

      <div className="surface-card p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-400 font-semibold">Name</label>
              <p className="text-slate-100">{user.name}</p>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold">Email</label>
              <p className="text-slate-100">{user.email}</p>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold">Role</label>
              <p className="text-slate-100 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      {user.role === 'employer' && (
        <div className="surface-card p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">My Job Postings</h2>
          {loading ? (
            <p className="text-slate-400">Loading jobs...</p>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job._id} className="surface-panel p-4 rounded-3xl">
                  <h3 className="font-semibold text-white">{job.title}</h3>
                  <p className="text-slate-400">{job.company}</p>
                  <p className="text-sm text-slate-500">Applications: {job.applications?.length || 0}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">You haven't posted any jobs yet.</p>
          )}
        </div>
      )}

      {user.role === 'jobseeker' && (
        <div className="surface-card p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">My Applications</h2>
          <p className="text-slate-400">Application tracking coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
