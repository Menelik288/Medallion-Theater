import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheatreStore } from '../store/useTheatreStore';

// --- Sub-component: Particle Background ---
const ParticlesBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      floatDuration: Math.random() * 6 + 6,
      twinkleDuration: Math.random() * 2 + 1,
      delay: Math.random() * -10,
      opacity: Math.random() * 0.6 + 0.3
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-white rounded-full animate-float shadow-[0_0_12px_rgba(255,255,255,0.8)]"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `float ${p.floatDuration}s infinite ease-in-out, twinkle ${p.twinkleDuration}s infinite ease-in-out`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function LoginMedallionTheatre() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, setUser } = useTheatreStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate('/clerk-dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const clerkCredentials = {
      'clerk1': 'Samuel Mulat',
      'clerk2': 'Nathnael Bizuneh',
      'clerk3': 'Bememnet Tilahun',
      'clerk4': 'Surafel Wasshiun',
    };
    let authenticatedUser = null;
    const lowerUser = username.toLowerCase();
    if (clerkCredentials[lowerUser] && password === 'clerk123') {
      authenticatedUser = { username: lowerUser, role: 'Clerk', name: clerkCredentials[lowerUser] };
    } else if (lowerUser === 'manager' && password === 'manager123') {
      authenticatedUser = { username: 'manager', role: 'Manager', name: 'Menelik ahm' };
    }

    if (authenticatedUser) {
      setUser(authenticatedUser);
      const origin = location.state?.from?.pathname || '/clerk-dashboard';
      navigate(origin, { replace: true });
    } else {
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050B14] flex items-center justify-center overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="Theatre Backdrop" 
          className="w-full h-full object-cover opacity-30 grayscale blur-md scale-105" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkqdL3YVbitKFhngza5vj5dy3P-JboIWCqFfvAG0K4XUF9iaqdRf23IcMhZGDKyVeU1-Zkhk6SY2JMNFLCw8SYC0rLmRFrWlQY1oQvDu7PfB4zVDqvEbS6PtoyTWs5siKH9hcB4m2ASbT9NsbB7CytisE7AxQpKRqnGAkysUzVekT6SKGbfR5sALx5sYIBGWWnCnQaQInMeTdonC0nWJCAhaJeqpxd40UYOYe-_siysSiFPxS965ykGjxw3E9hpmKFJkXQfpe24fmr" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050B14] via-transparent to-[#050B14]"></div>
      </div>

      {/* Atmospheric Particles Only */}
      <ParticlesBackground />

      {/* Decorative Lines */}
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent"></div>
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent"></div>

      {/* Login Card */}
      <div className="relative z-10 w-[92%] max-w-[440px] px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_40px_80px_-12px_rgba(0,0,0,1)] overflow-hidden">
          <div className="p-10 md:p-12">
            
            {/* Header with Custom Logo */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-950/40 p-2 shadow-[0_0_40px_rgba(197,160,89,0.15)] mb-6 overflow-hidden border border-white/5">
                <img 
                  src="/src/assets/image copy.png" 
                  alt="Medallion Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight font-serif italic mb-2">Medallion Theatre</h1>
              <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">Administrative Portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-[#C5A059] uppercase tracking-widest ml-4">Authorized User</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-[#C5A059] transition-colors">person</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]/50 transition-all"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-[#C5A059] uppercase tracking-widest ml-4">Security Key</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-[#C5A059] transition-colors">lock</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]/50 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                  <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#C5A059] to-[#E9C176] text-slate-950 font-bold py-5 rounded-2xl shadow-[0_20px_40px_rgba(197,160,89,0.2)] hover:shadow-[0_20px_50px_rgba(197,160,89,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 uppercase tracking-[0.2em] text-xs"
              >
                Access System
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Precision Ticketing System v4.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
