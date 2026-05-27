import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);

    const result = await demoLogin();

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 sm:px-6 bg-slate-100">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200">
        <div className="pointer-events-none absolute -inset-x-8 top-0 h-56 bg-gradient-to-br from-sky-400/30 via-violet-400/15 to-slate-100 opacity-80 blur-3xl"></div>
        <div className="relative space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-500">
              Welcome back
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Sign in to your account
            </h2>
            <p className="text-sm text-slate-600">
              Secure access to your social feed, messages, and profile.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-3xl border border-slate-700 bg-slate-950/90 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:border-sky-400 hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Use demo account'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Demo login: demo@demo.com / DemoPass123!
          </p>

          <p className="text-center text-sm text-slate-400">
            New here?{' '}
            <Link to="/register" className="font-semibold text-white hover:text-sky-300">
              Create a new account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;