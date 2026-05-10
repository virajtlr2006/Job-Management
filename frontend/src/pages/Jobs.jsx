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
    return <div className="text-center">Loading jobs...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Available Jobs</h1>
        <input
          type="text"
          placeholder="Search jobs, companies, or locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {user && user.role === 'employer' && (
          <div className="mt-4">
            <Link
              to="/create-job"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block"
            >
              Create New Job
            </Link>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {filteredJobs.map(job => (
          <div key={job._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-gray-500">{job.location}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                job.type === 'full-time' ? 'bg-green-100 text-green-800' :
                job.type === 'part-time' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {job.type}
              </span>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

            {job.salary && (
              <p className="text-green-600 font-semibold mb-4">{job.salary}</p>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Posted by {job.postedBy.name}
              </span>
              <Link
                to={`/jobs/${job._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No jobs found matching your search.
        </div>
      )}
    </div>
  );
};

export default Jobs;