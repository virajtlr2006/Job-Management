import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 rounded-lg mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Find Your Dream Job or Hire Top Talent
        </h1>
        <p className="text-xl mb-8">
          Connect employers with job seekers in one platform
        </p>
        <div className="space-x-4">
          <Link
            to="/jobs"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Browse Jobs
          </Link>
          {!user && (
            <Link
              to="/register"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">For Job Seekers</h3>
          <p className="text-gray-600">
            Discover thousands of job opportunities that match your skills and interests.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">For Employers</h3>
          <p className="text-gray-600">
            Post jobs and find qualified candidates quickly and efficiently.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Easy to Use</h3>
          <p className="text-gray-600">
            Simple interface for both job seekers and employers to manage their needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;