import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const RoleCard = ({ value, current, onChange, icon, title, desc }) => (
  <button
    type="button"
    onClick={() => onChange(value)}
    className={`flex-1 text-left p-4 rounded-2xl border transition-all duration-150 ${
      current === value
        ? 'border-[var(--accent-border)] bg-[var(--accent-dim)]'
        : 'border-white/[0.07] bg-zinc-900/50 hover:border-white/[0.12]'
    }`}
  >
    <div className="text-xl mb-2">{icon}</div>
    <p className={`font-semibold text-sm mb-0.5 ${current === value ? 'text-[var(--accent)]' : 'text-zinc-200'}`}>{title}</p>
    <p className="text-xs text-zinc-600">{desc}</p>
  </button>
);

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'jobseeker',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await register(form.name, form.email, form.password, form.role);
    if (result.success) {
      toast.success('Account created!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-sm space-y-8 fade-up">

        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 15L10 5L16 15" stroke="#0c0c0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 11H14" stroke="#0c0c0b" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="font-display text-3xl text-white">Create account</h1>
          <p className="text-sm text-zinc-500">Join JobHub — it takes 30 seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-7 space-y-5">

          {/* Role picker */}
          <div className="space-y-2">
            <label className="form-label">I am a</label>
            <div className="flex gap-3">
              <RoleCard
                value="jobseeker" current={form.role}
                onChange={r => setForm(f => ({ ...f, role: r }))}
                icon="🔍" title="Job seeker"
                desc="Looking for my next role"
              />
              <RoleCard
                value="employer" current={form.role}
                onChange={r => setForm(f => ({ ...f, role: r }))}
                icon="🏢" title="Employer"
                desc="Hiring for my company"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="form-label">Full name</label>
            <input name="name" value={form.name} onChange={set} required className="field" placeholder="Jane Smith" />
          </div>

          <div className="space-y-2">
            <label className="form-label">Email</label>
            <input type="email" name="email" value={form.email} onChange={set} required className="field" placeholder="you@example.com" />
          </div>

          <div className="space-y-2">
            <label className="form-label">Password</label>
            <input type="password" name="password" value={form.password} onChange={set} required className="field" placeholder="Min. 8 characters" />
          </div>

          <div className="space-y-2">
            <label className="form-label">Confirm password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={set} required className="field" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="btn-accent w-full py-3 text-[15px] mt-1">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600">
          Already have an account?{' '}
          <Link to="/login" className="text-zinc-300 hover:text-white transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;