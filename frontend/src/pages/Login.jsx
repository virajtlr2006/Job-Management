import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-8 fade-up">

        {/* Logo mark */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 15L10 5L16 15" stroke="#0c0c0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 11H14" stroke="#0c0c0b" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="font-display text-3xl text-white">Welcome back</h1>
          <p className="text-sm text-zinc-500">Sign in to your JobHub account</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-7 space-y-5">
          <div className="space-y-2">
            <label className="form-label">Email</label>
            <input
              type="email" name="email" value={form.email} onChange={set}
              required className="field" placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label className="form-label">Password</label>
            <input
              type="password" name="password" value={form.password} onChange={set}
              required className="field" placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-accent w-full py-3 text-[15px] mt-2">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-zinc-300 hover:text-white transition-colors font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;