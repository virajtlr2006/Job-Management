import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CreateJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: '',
    type: 'full-time',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== 'employer') {
      toast.error('Only employers can post jobs');
      return;
    }

    setLoading(true);
    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(req => req.trim()),
      };

      await axios.post('/api/jobs', jobData);
      toast.success('Job posted successfully!');
      navigate('/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'employer') {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p>Only employers can post jobs.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Job Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Salary (Optional)</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g., $50,000 - $70,000 per year"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Requirements (One per line)
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Bachelor's degree in Computer Science&#10;3+ years of experience&#10;Proficiency in React"
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Posting Job...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default CreateJob;