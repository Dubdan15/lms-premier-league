import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function Layout() {
  console.log('🖼️ Layout is rendering...');

  const navLinks = [
    { to: '/fixtures', label: 'Fixtures', icon: '⚽' },
    { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/standings', label: 'Standings', icon: '📊' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f9fa', fontFamily: 'sans-serif' }}>
      {/* Top Emergency Navbar */}
      <nav style={{
        background: '#38003c',
        color: 'white',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: '900', fontSize: '1.2rem', color: '#32CD32' }}>LMS</span>
          <span style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>SAFE MODE</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: '900',
                color: isActive ? '#32CD32' : 'white',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                borderBottom: isActive ? '2px solid #32CD32' : '2px solid transparent'
              })}
            >
              <span>{link.icon}</span>
              <span className="nav-text">{link.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '1rem', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 480px) {
            .nav-text { display: none; }
            nav { padding: 0.5rem; }
        }
        body { margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  );
}
