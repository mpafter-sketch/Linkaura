import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function LoginPage() {
  const { handleLogin } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await handleLogin(email, password);
      if (res.success) {
        navigate('/');
      } else {
        setErrorMsg(res.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
        id="login-card-container"
      >
        {/* Brand/Logo area */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <span className="text-2xl font-black tracking-tight text-white font-display">
              Connect<span className="text-violet-500">X</span>
            </span>
          </Link>
          <p className="text-sm text-zinc-400">Sign in to access your dashboard, chats, and wallet.</p>
        </div>

        {/* Card */}
        <div className="border border-zinc-850 bg-zinc-950/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 font-display">Sign In</h2>

          {!isSupabaseConfigured && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 rounded-xl bg-amber-950/40 border border-amber-900/50 p-3.5 mb-5 text-xs text-amber-400"
            >
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500 animate-pulse" />
              <div>
                <p className="font-bold mb-1 text-amber-300">Supabase Connection Required</p>
                <p className="text-zinc-400 leading-relaxed">
                  Please configure <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> inside your environment configuration.
                </p>
              </div>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 rounded-xl bg-red-950/40 border border-red-900/50 p-3.5 mb-5 text-xs text-red-400"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                <input 
                  type="email" 
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-violet-500 focus:bg-zinc-900/80 transition duration-200"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
                <Link 
                  to="/forgot-password"
                  className="text-xs text-violet-400 hover:underline hover:text-violet-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-violet-500 focus:bg-zinc-900/80 transition duration-200"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/10 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 transition duration-200 cursor-pointer min-h-[44px]"
            >
              {isLoading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 text-center text-xs">
            <p className="text-zinc-400">
              Don't have an account?{' '}
              <Link 
                to="/register"
                className="text-violet-400 font-semibold hover:underline"
              >
                Create a free account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
