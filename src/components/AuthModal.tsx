/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp, AuthView } from '../context/AppContext';
import { X, Lock, Mail, User, ShieldCheck, HelpCircle, ArrowLeft, RefreshCw, Key } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    authView, 
    setAuthView, 
    handleLogin, 
    handleSignup, 
    handleForgotPassword, 
    handleVerifyEmail 
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setDisplayName('');
    setVerificationCode('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      try {
        if (authView === 'login') {
          if (!email || !password) {
            setErrorMsg('All fields are required.');
            setIsLoading(false);
            return;
          }
          const res = handleLogin(email, password);
          if (res.success) {
            onClose();
            resetFields();
          } else {
            setErrorMsg(res.error || 'Invalid credentials.');
          }
        } else if (authView === 'signup') {
          if (!username || !displayName || !email || !password) {
            setErrorMsg('All fields are required.');
            setIsLoading(false);
            return;
          }
          const res = handleSignup(username, displayName, email);
          if (res.success) {
            // Redirect to verify code view
            setAuthView('verification');
          } else {
            setErrorMsg(res.error || 'Signup failed.');
          }
        } else if (authView === 'forgot') {
          if (!email) {
            setErrorMsg('Please enter your email.');
            setIsLoading(false);
            return;
          }
          handleForgotPassword(email);
          setSuccessMsg('A password reset code has been dispatched successfully.');
        } else if (authView === 'verification') {
          if (!verificationCode) {
            setErrorMsg('Please enter verification code.');
            setIsLoading(false);
            return;
          }
          const success = handleVerifyEmail(verificationCode);
          if (success) {
            onClose();
            resetFields();
          } else {
            setErrorMsg('Verification code is invalid.');
          }
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Login with pre-seeded values as a fast simulation
      const res = handleLogin('sofia_rossi@gmail.com', 'dummy_pass');
      if (res.success) {
        onClose();
        resetFields();
      } else {
        setErrorMsg('Google authentication failure.');
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl transition-all"
        id="auth-modal-card"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-white">
              {authView === 'login' && 'Sign In to ConnectX'}
              {authView === 'signup' && 'Create Your Account'}
              {authView === 'forgot' && 'Reset Password'}
              {authView === 'verification' && 'Verify Account'}
            </span>
          </div>
          <button 
            onClick={() => { onClose(); resetFields(); }}
            className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-900 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 rounded-lg bg-rose-950/40 border border-rose-800 p-3 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-lg bg-emerald-950/40 border border-emerald-850 p-3 text-xs text-emerald-300">
              {successMsg}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            
            {/* LOGIN & FORGOT & SIGNUP (common email field) */}
            {authView !== 'verification' && authView !== 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input 
                    type="email" 
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-violet-500 focus:bg-zinc-900"
                  />
                </div>
              </div>
            )}

            {/* SIGNUP FIELDS */}
            {authView === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <input 
                        type="text" 
                        required
                        placeholder="alex10"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-violet-500 focus:bg-zinc-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Display Name
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <input 
                        type="text" 
                        required
                        placeholder="Alex Rivera"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-violet-500 focus:bg-zinc-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <input 
                      type="email" 
                      required
                      placeholder="alex@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-violet-500 focus:bg-zinc-900"
                    />
                  </div>
                </div>
              </>
            )}

            {/* PASSWORD FIELD (login & signup) */}
            {(authView === 'login' || authView === 'signup') && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Password
                  </label>
                  {authView === 'login' && (
                    <button 
                      type="button"
                      onClick={() => setAuthView('forgot')}
                      className="text-xs text-violet-400 hover:underline hover:text-violet-300"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-violet-500 focus:bg-zinc-900"
                  />
                </div>
              </div>
            )}

            {/* VERIFICATION CODE FIELD */}
            {authView === 'verification' && (
              <div>
                <div className="text-center mb-4">
                  <p className="text-xs text-zinc-400">
                    We have dispatched a security PIN code to your email. Enter it below to activate your account.
                  </p>
                  <span className="inline-block mt-2 font-mono text-xs text-violet-400 font-semibold bg-violet-950/50 px-2 py-1 rounded">
                    Tip: Enter any code (e.g. 123456)
                  </span>
                </div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 text-center">
                  Verification Code
                </label>
                <div className="relative max-w-xs mx-auto">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input 
                    type="text" 
                    required
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 py-2 pl-10 pr-4 text-sm text-center tracking-widest font-bold text-white outline-none focus:border-violet-500 focus:bg-zinc-900"
                  />
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button 
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/10 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 transition cursor-pointer"
              id="auth-submit-btn"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {authView === 'login' && 'Sign In'}
                  {authView === 'signup' && 'Register Account'}
                  {authView === 'forgot' && 'Send Code'}
                  {authView === 'verification' && 'Verify & Claim Rewards'}
                </>
              )}
            </button>
          </form>

          {/* SOCIAL LOGIN (Only for signin/signup) */}
          {(authView === 'login' || authView === 'signup') && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-900" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/20 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900 cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.61 0 3.06.55 4.2 1.64l3.15-3.15C17.45 1.74 14.94 1 12 1 7.35 1 3.37 3.68 1.41 7.59l3.77 2.93C6.1 7.55 8.84 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.45h6.45c-.28 1.47-1.11 2.71-2.36 3.55l3.67 2.85c2.14-1.98 3.38-4.89 3.38-8.5z" />
                  <path fill="#FBBC05" d="M5.18 10.52c-.24-.72-.38-1.49-.38-2.28 0-.79.14-1.56.38-2.28L1.41 3.03C.51 4.82 0 6.84 0 8.98c0 2.14.51 4.16 1.41 5.95l3.77-2.93z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.67-2.85c-1.01.68-2.31 1.08-3.79 1.08-3.16 0-5.9-2.51-6.82-5.48L1.41 15.77C3.37 19.68 7.35 23 12 23z" />
                </svg>
                Google Single Sign-On
              </button>
            </>
          )}

          {/* Footer switches */}
          <div className="mt-6 text-center text-xs">
            {authView === 'login' && (
              <p className="text-zinc-400">
                Don't have an account?{' '}
                <button 
                  onClick={() => setAuthView('signup')}
                  className="text-violet-400 font-semibold hover:underline cursor-pointer"
                >
                  Create free account
                </button>
              </p>
            )}

            {authView === 'signup' && (
              <p className="text-zinc-400">
                Already have an account?{' '}
                <button 
                  onClick={() => setAuthView('login')}
                  className="text-violet-400 font-semibold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}

            {(authView === 'forgot' || authView === 'verification') && (
              <button 
                onClick={() => setAuthView('login')}
                className="flex items-center gap-1.5 mx-auto text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign In
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
