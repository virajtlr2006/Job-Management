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
      // This would need to be implemented in the backend
      // For now, we'll show a placeholder
      setJobs([]);
    } catch (error) {
      console.error('Error fetching user jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please login to view your profile</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold">Name</label>
            <p className="text-gray-900">{user.name}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Role</label>
            <p className="text-gray-900 capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {user.role === 'employer' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">My Job Postings</h2>
          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job._id} className="border p-4 rounded">
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500">Applications: {job.applications?.length || 0}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven't posted any jobs yet.</p>
          )}
        </div>
      )}

      {user.role === 'jobseeker' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">My Applications</h2>
          <p className="text-gray-600">Application tracking coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default Profile;