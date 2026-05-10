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
      fetchJob(); // Refresh job data
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
    return <div className="text-center">Loading job details...</div>;
  }

  if (!job) {
    return <div className="text-center text-red-500">Job not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
          <p className="text-xl text-gray-600 mb-2">{job.company}</p>
          <p className="text-gray-500 mb-4">{job.location}</p>

          <div className="flex items-center space-x-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              job.type === 'full-time' ? 'bg-green-100 text-green-800' :
              job.type === 'part-time' ? 'bg-blue-100 text-blue-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {job.type}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              job.status === 'open' ? 'bg-green-100 text-green-800' :
              job.status === 'closed' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {job.status}
            </span>
          </div>

          {job.salary && (
            <p className="text-2xl font-semibold text-green-600 mb-4">{job.salary}</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Requirements</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {currentUserId && ((job.postedBy?._id ? job.postedBy._id.toString() : job.postedBy?.toString()) === currentUserId) && job.applications && job.applications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Applications ({job.applications.length})</h2>
            <div className="space-y-3">
              {job.applications.map((application, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{application.user?.name || 'Unknown Applicant'}</p>
                      <p className="text-sm text-gray-600">{application.user?.email || 'Email not available'}</p>
                      <p className="text-sm text-gray-500">
                        Applied on {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      application.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="text-sm text-gray-500">
            Posted by {job.postedBy.name} on {new Date(job.createdAt).toLocaleDateString()}
          </div>

          {user && user.role === 'jobseeker' && job.status === 'open' && (
            <button
              onClick={handleApply}
              disabled={hasApplied || applying}
              className={`px-6 py-3 rounded-lg font-semibold ${
                hasApplied
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
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