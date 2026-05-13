import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useTheatreStore } from '../store/useTheatreStore';

const navItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/clerk-dashboard', roles: ['Clerk', 'Manager'] },
  { name: 'Patrons', icon: 'group', path: '/search-patron', roles: ['Clerk', 'Manager'] },
  { name: 'Reservations', icon: 'confirmation_number', path: '/reserve-tickets', roles: ['Clerk', 'Manager'] },
  { name: 'Productions', icon: 'theater_comedy', path: '/manage-productions', roles: ['Manager'] },
  { name: 'Performances', icon: 'event_seat', path: '/manage-performances', roles: ['Manager'] },
  { name: 'Reports', icon: 'analytics', path: '/reports', roles: ['Manager'] },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useTheatreStore();

  const handleLogout = () => {
    logout();
    navigate('/login-medallion-theatre', { replace: true });
  };

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation Shell */}
      <header className="fixed top-0 right-0 left-0 flex justify-between items-center px-8 h-20 bg-slate-950/60 backdrop-blur-xl z-40 border-b border-[#C5A059]/20 shadow-none backdrop-blur-lg">
        <div></div>
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-6">
            {user?.role === 'Manager' && (
              <Link className="text-slate-400 font-serif text-sm antialiased hover:text-[#C5A059] transition-colors duration-300" to="/manage-productions">Productions</Link>
            )}
            <Link className="text-[#C5A059] font-semibold font-serif text-sm antialiased transition-colors duration-300" to="/reserve-tickets">Reservations</Link>
            <Link className="text-slate-400 font-serif text-sm antialiased hover:text-[#C5A059] transition-colors duration-300" to="/search-patron">Patrons</Link>
          </nav>
          <div className="flex items-center gap-4 text-[#C5A059]">
            <span className="material-symbols-outlined cursor-pointer active:opacity-70">history</span>
            <span className="material-symbols-outlined cursor-pointer active:opacity-70">notifications</span>
            <div className="flex items-center gap-3 ml-2">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-bold text-white leading-none">{user?.name}</div>
                <div className="text-[8px] text-[#C5A059] uppercase tracking-widest mt-1">{user?.role}</div>
              </div>
              <div className="h-8 w-8 rounded-full border border-[#C5A059]/30 overflow-hidden bg-slate-900">
                <img alt="Admin Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWR-OZxA_v3r04lKmDJIjODYMIdT9HmDFVeCpCAxikOqjQQULv5clLcpDAuOliHuFh9Z7nXKW4a2MjiUqQRCgP0bYUgOeyfPtZtof9Jc4c_j3UN7f63192pfE1xoVtHcdYelmkH_OuV5ixLkaETK6HlVQVrEaulnjptWoxPzFd1aIH2N0No6YAty-glCXxLpooF8bR0GKi6nR5qsb4OaqRROyfwVrM2bq1MHkdrEbZlf9nhGBSqzbjQyv6MctJZ1CZIIfxugKisKWI" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Side Navigation Shell */}
      <aside className="fixed left-0 top-0 h-full w-[280px] border-r border-[#C5A059]/30 bg-slate-950/80 backdrop-blur-2xl shadow-2xl shadow-black/50 z-30 pt-24">
        <div className="flex flex-col h-full py-8">
          <div className="px-6 mb-10">
            <div className="text-xl font-serif text-[#C5A059]">Medallion Admin</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-label-caps">Elite Venue Management</div>
          </div>
          <nav className="flex-1 space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.name === 'Reservations' && (
                  location.pathname.startsWith('/reserve-tickets/') || 
                  location.pathname.startsWith('/reservation/') ||
                  location.pathname === '/reservation-confirmation'
                ));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-6 py-4 flex items-center gap-4 font-serif text-sm antialiased transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C5A059]/10 to-transparent text-[#C5A059] border-l-2 border-[#C5A059]'
                      : 'text-slate-500 hover:bg-[#C5A059]/5 hover:text-[#C5A059]'
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="px-6 mt-auto">
            <button 
              onClick={handleLogout}
              className="w-full text-slate-500 py-4 flex items-center gap-4 font-serif text-sm antialiased hover:text-error transition-colors bg-transparent border-none cursor-pointer"
            >
              <span className="material-symbols-outlined">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pl-[280px] pt-20 h-screen overflow-y-auto scroll-smooth">
        <Outlet />
      </main>
    </div>
  );
}
