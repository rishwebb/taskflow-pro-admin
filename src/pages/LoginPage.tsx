import { FormEvent, useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setLocalError(null);

    try {
      await login(email, password);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-ink-50 lg:grid-cols-[1fr_1.05fr]">
      <section className="flex min-h-[42vh] flex-col justify-between bg-ink-900 px-6 py-8 text-white sm:px-10 lg:min-h-screen">
        <BrandMark inverse />
        <div className="max-w-xl py-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
            <ShieldCheck className="h-4 w-4" />
            Secure operations console
          </div>
          <h1 className="text-4xl font-bold tracking-normal sm:text-5xl">TaskFlow Pro Admin</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            Monitor platform health, manage users, review tasks, and keep the TaskFlow workspace running cleanly.
          </p>
        </div>
        <p className="text-sm text-slate-400">API-backed dashboard for production teams.</p>
      </section>

      <section className="flex items-center justify-center px-6 py-10">
        <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-ink-200 bg-white p-6 shadow-panel sm:p-8">
          <div>
            <h2 className="text-2xl font-bold text-ink-900">Admin Login</h2>
            <p className="mt-2 text-sm text-ink-500">Use an account with the `admin` role.</p>
          </div>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-ink-700">Email</span>
              <span className="mt-2 flex h-12 items-center rounded-lg border border-ink-200 bg-white px-3 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100">
                <Mail className="mr-3 h-4 w-4 text-ink-500" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="h-full w-full bg-transparent text-sm font-medium text-ink-900 outline-none placeholder:text-slate-400 placeholder:opacity-100"
                  autoComplete="email"
                />
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink-700">Password</span>
              <span className="mt-2 flex h-12 items-center rounded-lg border border-ink-200 bg-white px-3 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100">
                <LockKeyhole className="mr-3 h-4 w-4 text-ink-500" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="h-full w-full bg-transparent text-sm font-medium text-ink-900 outline-none placeholder:text-slate-400 placeholder:opacity-100"
                  autoComplete="current-password"
                />
              </span>
            </label>
          </div>

          {(localError || error) && (
            <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {localError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
};
