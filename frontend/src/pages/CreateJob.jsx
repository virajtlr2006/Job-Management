import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const TYPES = [
  { value: 'full-time',  label: 'Full‑time' },
  { value: 'part-time',  label: 'Part‑time' },
  { value: 'contract',   label: 'Contract' },
  { value: 'freelance',  label: 'Freelance' },
];

const Field = ({ label, hint, children }) => (
  <div className="space-y-2">
    <div className="flex items-baseline justify-between">
      <label className="form-label">{label}</label>
      {hint && <span className="text-xs text-zinc-600">{hint}</span>}
    </div>
    {children}
  </div>
);

const CreateJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', company: '', location: '',
    description: '', requirements: '', salary: '', type: 'full-time',
  });
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'employer') {
      toast.error('Only employers can post jobs');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/jobs', {
        ...form,
        requirements: form.requirements.split('\n').filter(r => r.trim()),
      });
      toast.success('Role posted!');
      navigate('/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'employer') {
    return (
      <div className="max-w-md mx-auto text-center py-24">
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="font-display text-2xl text-white mb-2">Employers only</h1>
        <p className="text-zinc-500 text-sm">Only employer accounts can post jobs.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 fade-up">
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-600 mb-2">Employers</p>
        <h1 className="font-display text-4xl text-white">Post a role</h1>
        <p className="text-zinc-500 text-[15px] mt-2">Fill in the details below and publish your listing.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">

        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Job title">
            <input name="title" value={form.title} onChange={set} required className="field" placeholder="e.g. Senior React Developer" />
          </Field>
          <Field label="Company">
            <input name="company" value={form.company} onChange={set} required className="field" placeholder="Your company name" />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Location">
            <input name="location" value={form.location} onChange={set} required className="field" placeholder="Remote, New York, etc." />
          </Field>
          <Field label="Job type">
            <select name="type" value={form.type} onChange={set} className="field">
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Salary" hint="optional">
          <input
            name="salary" value={form.salary} onChange={set}
            className="field" placeholder="e.g. $80,000 – $110,000 / year"
          />
        </Field>

        <Field label="Job description">
          <textarea
            name="description" value={form.description} onChange={set}
            required rows={6} className="field resize-none"
            placeholder="Describe the role, team, and day-to-day responsibilities…"
          />
        </Field>

        <Field label="Requirements" hint="one per line">
          <textarea
            name="requirements" value={form.requirements} onChange={set}
            rows={5} className="field resize-none"
            placeholder={"Bachelor's degree in CS\n3+ years experience with React\nStrong written communication"}
          />
        </Field>

        <div className="divider" />

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button type="button" onClick={() => navigate('/jobs')} className="btn-ghost px-6 py-2.5 text-sm">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-accent px-8 py-2.5 text-sm">
            {loading ? 'Publishing…' : 'Publish role'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;