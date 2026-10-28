import React, { useState } from 'react';
import { X, User, Lock, Mail, CheckCircle2, LogOut, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import type { User as UserType } from '../types';
import { formatCurrency } from '../utils/formatters';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType | null;
  onLogin: (email: string) => Promise<void>;
  onLogout: () => Promise<void>;
  onSwitchDemo: (userId: string) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onSwitchDemo,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await onLogin(email);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-slate-800" />
            <h3 className="text-sm font-bold text-slate-900 font-display">
              {currentUser ? 'User Profile & Preferences' : (isRegisterMode ? 'Create Shopper Account' : 'Sign In to SmartBuy')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentUser ? (
            /* Logged In Profile Screen */
            <div className="space-y-5">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-lg font-display">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {currentUser.name}
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded uppercase">
                      {currentUser.role}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Personal Preferences
                </span>
                <div className="flex justify-between text-slate-700">
                  <span>Target Budget Preference:</span>
                  <strong className="font-mono">{formatCurrency(currentUser.budgetPreference || 2000)}</strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Price Alert Notifications:</span>
                  <span className="text-emerald-700 font-semibold">Active & Live</span>
                </div>
              </div>

              {/* Demo switchers */}
              <div className="pt-1">
                <span className="text-xs font-semibold text-slate-500 block mb-2">
                  Switch Demo Persona:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSwitchDemo('user-demo-1')}
                    className={`py-2 px-3 text-xs rounded-lg border text-left transition-colors cursor-pointer ${
                      currentUser.id === 'user-demo-1'
                        ? 'bg-slate-950 text-white border-slate-950'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">Aarav Sharma</div>
                    <div className="text-[10px] opacity-75">Student (₹1,500 Budget)</div>
                  </button>

                  <button
                    onClick={() => onSwitchDemo('user-demo-2')}
                    className={`py-2 px-3 text-xs rounded-lg border text-left transition-colors cursor-pointer ${
                      currentUser.id === 'user-demo-2'
                        ? 'bg-slate-950 text-white border-slate-950'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">Priya Patel</div>
                    <div className="text-[10px] opacity-75">Fashion Enthusiast</div>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={onLogout}
                  className="py-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>

                <button
                  onClick={onClose}
                  className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <div className="space-y-4">
              {/* Quick Demo 1-Click Login Box */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  College Evaluation 1-Click Sign In:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onLogin('aarav@example.com')}
                    className="py-1.5 px-2 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-xs font-semibold text-slate-900 text-left cursor-pointer transition-colors"
                  >
                    <div>Aarav (Student)</div>
                    <div className="text-[10px] text-slate-500 font-normal">aarav@example.com</div>
                  </button>

                  <button
                    onClick={() => onLogin('priya@example.com')}
                    className="py-1.5 px-2 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-xs font-semibold text-slate-900 text-left cursor-pointer transition-colors"
                  >
                    <div>Priya (Enthusiast)</div>
                    <div className="text-[10px] text-slate-500 font-normal">priya@example.com</div>
                  </button>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-2 text-[11px] text-slate-400 uppercase font-medium">Or Use Custom Credentials</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g., student@college.edu"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-950 focus:border-slate-950"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-950 focus:border-slate-950"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap pt-2"
                >
                  <span>{isSubmitting ? 'Authenticating...' : (isRegisterMode ? 'Register Account' : 'Sign In')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-xs text-slate-500 hover:text-slate-900 underline cursor-pointer"
                >
                  {isRegisterMode ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
