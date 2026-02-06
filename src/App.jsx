import React, { useState, useEffect } from 'react';
import { TEAMS } from './data/data';
import { Routes, Route, Navigate, NavLink, Outlet } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import Fixtures from './pages/Fixtures';
import Dashboard from './pages/Dashboard';
import Standings from './pages/Standings';
import Login from './pages/Login';
import LeagueDashboard from './pages/LeagueDashboard';
import Welcome from './pages/Welcome';


// FPL Top Navigation with Pill Tabs
function FPLTopNav() {
  const navItems = [
    { to: '/leagues', label: 'Leagues' },
    { to: '/fixtures', label: 'Fixtures' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/standings', label: 'Standings' }
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '1rem',
      background: '#37003c',
      flexWrap: 'wrap'
    }}>
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          style={({ isActive }) => ({
            padding: '0.75rem 1.25rem',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'all 0.2s ease',
            background: isActive ? '#00ff85' : 'transparent',
            color: isActive ? '#37003c' : 'rgba(255, 255, 255, 0.7)',
            border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
            whiteSpace: 'nowrap'
          })}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

// Main FPL Layout
function FPLLayout() {
  const hasNickname = localStorage.getItem('userNickname');

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f3f3f3',
      maxWidth: '100vw',
      overflowX: 'hidden',
      margin: '0 auto',
      position: 'relative'
    }}>
      {/* FPL Header with Title */}
      <header style={{
        background: '#37003c',
        padding: '1.5rem 1rem 0.5rem',
        textAlign: 'center',
        width: '100%'
      }}>
        <h1 style={{
          margin: '0 0 1rem 0',
          fontSize: '1.3rem',
          fontWeight: '900',
          letterSpacing: '1px',
          color: 'white',
          textTransform: 'uppercase'
        }}>
          Last Man <span style={{ color: '#00ff85' }}>Standing</span>
        </h1>

        {hasNickname && (
          <div style={{ color: '#00ff85', fontSize: '0.8rem', fontWeight: '800', marginBottom: '1rem', textTransform: 'uppercase' }}>
            Manager: {hasNickname}
          </div>
        )}

        {/* Top Navigation Pills */}
        <FPLTopNav />
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: '1rem',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        <Outlet />
      </main>
    </div>
  );
}

// App Routes with Login as Default
function AppRoutes() {
  const { isGuest, outcomeEffect, revivePlayer, lastResult, lives, advanceToNextRound } = useGame();
  const [showEffect, setShowEffect] = useState(null);

  const resultTeam = lastResult ? TEAMS.find(t => t.name === lastResult.team) : null;

  // Check for authentication: Supabase token, guest mode, or dev bypass
  const hasSupabaseAuth = localStorage.getItem('supabase.auth.token');
  const isDevGuest = localStorage.getItem('devGuest') === 'true';
  const isAuthenticated = hasSupabaseAuth || isGuest || isDevGuest;

  // Check for nickname
  const hasNickname = localStorage.getItem('userNickname');

  // Watch for outcomeEffect changes
  useEffect(() => {
    if (outcomeEffect) {
      setShowEffect(outcomeEffect);
      // Only auto-hide loss effect after 3s (or keep it open for Try Again)
      // For win, we wait for manual "Next Round"
    }
  }, [outcomeEffect]);

  return (
    <>
      <Routes>
        {/* Force Nickname if missing */}
        {!hasNickname ? (
          <Route path="*" element={<Welcome />} />
        ) : (
          <>
            <Route path="/" element={isAuthenticated ? <Navigate to="/fixtures" replace /> : <Login />} />

            <Route element={<FPLLayout />}>
              <Route path="fixtures" element={isAuthenticated ? <Fixtures /> : <Navigate to="/" replace />} />
              <Route path="leagues" element={isAuthenticated ? <LeagueDashboard /> : <Navigate to="/" replace />} />
              <Route path="dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} />
              <Route path="standings" element={isAuthenticated ? <Standings /> : <Navigate to="/" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>

      {/* DEATH/GLORY PORTAL LAYER - At bottom to sit on top */}
      {showEffect === 'win' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Confetti Particles - Full Screen */}
          <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
            {Array.from({ length: 150 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '-20px',
                  left: `${Math.random() * 100}%`,
                  width: '12px',
                  height: '12px',
                  background: ['#00ff85', '#37003c', '#ffffff', '#ff0055', '#00ff85'][Math.floor(Math.random() * 5)],
                  animation: `confettiFall ${2 + Math.random() * 1.5}s ease-in ${Math.random() * 0.5}s forwards`,
                  borderRadius: '50%',
                  opacity: 0.9
                }}
              />
            ))}
          </div>

          <div className="overlay-content" style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2
          }}>
            {/* Team Logo */}
            {resultTeam && (
              <img
                src={resultTeam.badge}
                alt={resultTeam.name}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'contain',
                  marginBottom: '1rem',
                  filter: 'drop-shadow(0 0 20px rgba(0,255,133,0.5))'
                }}
              />
            )}

            {/* Message */}
            <div style={{
              fontSize: 'clamp(3rem, 10vw, 5rem)',
              fontWeight: '900',
              color: '#00ff85',
              textAlign: 'center',
              animation: 'pulse 1s ease infinite',
              textShadow: '0 0 40px rgba(0, 255, 133, 1), 0 0 80px rgba(0, 255, 133, 0.5)',
              lineHeight: 1.2
            }}>
              YOU<br />SURVIVED!
            </div>

            {/* Next Round Button */}
            <button
              onClick={() => {
                advanceToNextRound();
                setShowEffect(null);
              }}
              style={{
                marginTop: '2rem',
                padding: '1.2rem 3rem',
                background: '#00ff85',
                color: '#37003c',
                border: 'none',
                borderRadius: '50px',
                fontWeight: '900',
                fontSize: '1.2rem',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,255,133,0.4)',
                zIndex: 2,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                animation: 'pulse 1s ease infinite'
              }}
            >
              Next Round →
            </button>
          </div>

          <style>{`
            @media (max-width: 768px) {
                .overlay-content {
                    transform: scale(0.8);
                }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
            @keyframes confettiFall {
              0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(120vh) rotate(720deg);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}

      {showEffect === 'loss' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(255, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease',
          overflow: 'hidden'
        }}>
          {/* Blood Drips - Full Screen */}
          <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '-100%',
                  left: `${Math.random() * 100}%`,
                  width: `${4 + Math.random() * 6}px`,
                  height: '200%',
                  background: `linear-gradient(to bottom, rgba(200, 0, 0, ${0.8 + Math.random() * 0.2}), rgba(139, 0, 0, 0))`,
                  animation: `bloodDrip ${1.5 + Math.random() * 1}s ease-out ${Math.random() * 0.5}s forwards`,
                  borderRadius: '0 0 50% 50%'
                }}
              />
            ))}
          </div>

          <div className="overlay-content" style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2
          }}>
            {/* Team Logo */}
            {resultTeam && (
              <img
                src={resultTeam.badge}
                alt={resultTeam.name}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'contain',
                  marginBottom: '1rem',
                  filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))'
                }}
              />
            )}

            {/* Message */}
            <div style={{
              fontSize: 'clamp(1.5rem, 8vw, 5rem)',
              fontWeight: '900',
              color: 'white',
              textAlign: 'center',
              animation: 'shake 0.4s ease infinite',
              textShadow: '0 0 40px rgba(0, 0, 0, 1), 0 0 80px rgba(0, 0, 0, 0.8)',
              background: '#ff0055',
              padding: '2rem 3rem',
              borderRadius: '20px',
              border: '5px solid white'
            }}>
              ELIMINATED
            </div>

            {/* Try Again Button */}
            <button
              onClick={() => {
                revivePlayer();
                setShowEffect(null);
              }}
              style={{
                marginTop: '2rem',
                padding: '1rem 2rem',
                background: 'white',
                color: '#ff0055',
                border: 'none',
                borderRadius: '50px',
                fontWeight: '900',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                zIndex: 2,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Try Again
            </button>
          </div>

          <style>{`
            @media (max-width: 768px) {
                .overlay-content {
                    transform: scale(0.8);
                }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes shake {
              0%, 100% { transform: translateX(0) rotate(0deg); }
              10%, 30%, 50%, 70%, 90% { transform: translateX(-10px) rotate(-2deg); }
              20%, 40%, 60%, 80% { transform: translateX(10px) rotate(2deg); }
            }
            @keyframes bloodDrip {
              0% {
                top: -100%;
                opacity: 1;
              }
              100% {
                top: 100%;
                opacity: 0.6;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

// Main App Component
export default function App() {
  return (
    <GameProvider>
      <AppRoutes />
    </GameProvider>
  );
}
