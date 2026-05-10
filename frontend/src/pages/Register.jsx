import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'jobseeker',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password, formData.role);

    if (result.success) {
      toast.success('Registration successful!');
      navigate('/');
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Register</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">I am a</label>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="jobseeker"
                checked={formData.role === 'jobseeker'}
                onChange={handleChange}
                className="mr-2"
              />
              Job Seeker
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="employer"
                checked={formData.role === 'employer'}
                onChange={handleChange}
                className="mr-2"
              />
              Employer
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;