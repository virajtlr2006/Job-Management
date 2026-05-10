import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const stats = [
  { label: 'Open roles', value: '2,400+' },
  { label: 'Companies hiring', value: '340+' },
  { label: 'Placements made', value: '18k+' },
];

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="8"/><path d="M10 6v4l2.5 2.5"/>
      </svg>
    ),
    title: 'One-click apply',
    body: 'Your profile does the talking. Submit applications in seconds without retyping the same details.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 11H3M17 11l-4-4M17 11l-4 4"/>
      </svg>
    ),
    title: 'Real-time pipeline',
    body: 'Track every stage of your application — from submitted to offer — with live status updates.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="14" height="12" rx="2"/><path d="M13 5V4a1 1 0 00-1-1H8a1 1 0 00-1 1v1"/>
      </svg>
    ),
    title: 'Employer dashboard',
    body: 'Post roles, review candidates, and manage your hiring pipeline from one clean workspace.',
  },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-24">

      {/* Hero */}
      <section className="relative pt-8 pb-4">
        {/* Background glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[780px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(ellipse, #e8ff57 0%, transparent 70%)' }} />

        <div className="relative max-w-3xl fade-up">
          <div className="inline-flex items-center gap-2 badge badge-lime mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            Now hiring — 340 companies active this week
          </div>

          <h1 className="font-display text-[clamp(2.6rem,6vw,5rem)] leading-[1.05] tracking-tight text-white mb-6">
            Find work that<br />
            <span className="italic text-zinc-500">actually fits.</span>
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed mb-10 max-w-xl">
            JobHub connects ambitious people with the right opportunities.
            Browse curated roles, apply instantly, and keep tabs on every stage.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/jobs" className="btn-accent inline-flex items-center gap-2 px-6 py-3 text-[15px]">
              Browse open roles
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 7H12M8 3l4 4-4 4"/>
              </svg>
            </Link>
            {!user && (
              <Link to="/register" className="btn-ghost inline-flex items-center gap-2 px-6 py-3 text-[15px]">
                Create account
              </Link>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap gap-8 fade-up fade-up-2">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-semibold text-white">{s.value}</p>
              <p className="text-sm text-zinc-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="divider" />

      {/* Features */}
      <section className="fade-up fade-up-3">
        <p className="text-xs uppercase tracking-widest text-zinc-600 mb-10">Why JobHub</p>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="card p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl border border-white/[0.07] flex items-center justify-center text-zinc-400">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white text-[15px] mb-1.5">{f.title}</h3>
                <p className="text-[14px] text-zinc-500 leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="fade-up fade-up-4">
          <div className="card p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            style={{ borderColor: 'var(--accent-border)', background: 'linear-gradient(135deg, #111110 0%, #141410 100%)' }}>
            <div>
              <h2 className="font-display text-3xl text-white mb-2">Ready to get started?</h2>
              <p className="text-zinc-500 text-[15px]">Join thousands of job seekers and employers using JobHub.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link to="/register?role=employer" className="btn-ghost px-5 py-2.5 text-[14px]">
                I'm hiring
              </Link>
              <Link to="/register" className="btn-accent px-5 py-2.5 text-[14px]">
                Find a role
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;