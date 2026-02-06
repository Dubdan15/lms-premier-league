import React, { useState, useEffect } from 'react';
import { useGame, TEAMS } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const {
        currentGameweek, isAlive, usedTeams, notification, setNotification,
        evaluateGameweek, forceWheelMode, revivePlayer, lastResult, nextDeadline,
        activeLeague, leagues, selectLeague, isSyncing
    } = useGame();
    const navigate = useNavigate();
    const [showSimModal, setShowSimModal] = useState(false);
    const [timeUntilDeadline, setTimeUntilDeadline] = useState('');

    const currentPick = activeLeague?.state?.currentPick;
    const pickTeam = currentPick && TEAMS ? TEAMS.find(t => t.id === currentPick.id) : null;

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const diff = nextDeadline - now;

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                setTimeUntilDeadline(`${days}d ${hours}h ${minutes}m`);
            } else {
                setTimeUntilDeadline('Deadline passed');
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [nextDeadline]);

    const handleBypassLogin = () => {
        localStorage.setItem('devGuest', 'true');
        localStorage.setItem('userName', 'Dev Guest');
        navigate('/fixtures');
        window.location.reload();
    };

    // FPL Loading State
    if (!TEAMS) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', gap: '1rem' }}>
                <div className="fpl-spinner" />
                <p style={{ color: '#37003c', fontWeight: '600' }}>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '1rem' }}>
            {/* Notification */}
            {notification && (
                <div style={{
                    background: 'white',
                    border: `2px solid ${notification.type === 'error' ? '#ff0055' : '#00ff85'}`,
                    color: notification.type === 'error' ? '#ff0055' : '#37003c',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    fontWeight: '600'
                }}>
                    <span>{notification.message}</span>
                    <button
                        onClick={() => setNotification(null)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'inherit',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            cursor: 'pointer'
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Eliminated Banner */}
            {!isAlive && (
                <div style={{
                    background: 'white',
                    border: '3px solid #ff0055',
                    color: '#ff0055',
                    padding: '2rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    marginBottom: '2rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>ELIMINATED</h2>
                    <p style={{ marginTop: '0.5rem', fontWeight: '600' }}>Your journey ends here</p>
                </div>
            )}

            {/* FPL Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <FPLStatCard label="Gameweek" value={currentGameweek} />
                <FPLStatCard label="Teams Used" value={`${usedTeams.length}/20`} />
                <FPLStatCard label="Status" value={isAlive ? 'ALIVE' : 'OUT'} color={isAlive ? '#00ff85' : '#ff0055'} />
            </div>

            {/* Last Result Card */}
            {lastResult && (
                <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: `2px solid ${lastResult.result === 'Won' ? '#00ff85' : '#ff0055'}`
                }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#37003c', fontSize: '1rem', fontWeight: '900', textTransform: 'uppercase' }}>
                        Last Result
                    </h3>
                    <p style={{ margin: '0 0 1rem 0', color: '#222', fontSize: '0.95rem', lineHeight: 1.5 }}>
                        {lastResult.message}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: '900', color: '#37003c' }}>{lastResult.team}</div>
                        <div style={{
                            padding: '0.25rem 0.75rem',
                            background: '#f3f3f3',
                            borderRadius: '4px',
                            fontWeight: '700'
                        }}>
                            {lastResult.score}
                        </div>
                        <div style={{
                            padding: '0.25rem 0.75rem',
                            background: lastResult.result === 'Won' ? '#00ff85' : '#ff0055',
                            color: lastResult.result === 'Won' ? '#37003c' : 'white',
                            borderRadius: '4px',
                            fontWeight: '900',
                            fontSize: '0.75rem'
                        }}>
                            {lastResult.result.toUpperCase()}
                        </div>
                    </div>
                </div>
            )}

            {/* Next Deadline Card */}
            <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#37003c', fontSize: '1rem', fontWeight: '900', textTransform: 'uppercase' }}>
                    Next Deadline
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#37003c' }}>
                        {timeUntilDeadline}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#999', fontWeight: '600' }}>
                        Saturday 12:30 PM
                    </div>
                </div>
            </div>

            {/* Current Pick Card */}
            <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#37003c', fontSize: '1rem', fontWeight: '900', textTransform: 'uppercase' }}>
                    Your Weekly Pick
                </h3>

                {pickTeam ? (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        background: '#f3f3f3',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '2px solid #00ff85',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: pickTeam.color,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: pickTeam.color === '#FFFFFF' ? 'black' : 'white',
                            fontWeight: 'bold',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            flexShrink: 0
                        }}>
                            {pickTeam.short_name}
                        </div>
                        <div style={{ flex: '1 1 150px' }}>
                            <div style={{ fontWeight: '900', fontSize: '1.2rem', color: '#37003c' }}>{pickTeam.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#00ff85', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {isSyncing ? (
                                    <>
                                        <div className="fpl-spinner" style={{ width: '12px', height: '12px', borderTopColor: '#00ff85' }} />
                                        SYNCING...
                                    </>
                                ) : (
                                    'TEAM LOCKED ✓'
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        border: '2px dashed #ddd',
                        borderRadius: '8px'
                    }}>
                        <p style={{ color: '#999', marginBottom: '1rem', fontWeight: '600' }}>No team selected for GW {currentGameweek}</p>
                        <button
                            onClick={() => navigate('/fixtures')}
                            style={{
                                background: '#00ff85',
                                color: '#37003c',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                fontWeight: '900',
                                cursor: isAlive ? 'pointer' : 'not-allowed',
                                opacity: isAlive ? 1 : 0.5,
                                textTransform: 'uppercase'
                            }}
                            disabled={!isAlive}
                        >
                            Select Team
                        </button>
                    </div>
                )}
            </div>

            {/* Dev Tools Button - Hidden for Spectators */}
            {isAlive && (
                <button
                    onClick={() => setShowSimModal(true)}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        color: '#999',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                >
                    🔧 Dev Tools
                </button>
            )}

            {!isAlive && (
                <div style={{
                    padding: '1.5rem',
                    background: '#f3f3f3',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#999',
                    fontWeight: '700',
                    border: '2px dashed #ddd'
                }}>
                    📡 SPECTATOR MODE ACTIVE
                </div>
            )}

            {/* Dev Tools Modal */}
            {showSimModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '1rem'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '400px',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', textAlign: 'center', color: '#37003c' }}>
                            Developer Tools
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {/* Bypass Login */}
                            <button
                                onClick={handleBypassLogin}
                                style={{ ...simBtnStyle, background: '#37003c', color: '#00ff85' }}
                            >
                                ⚡ Bypass Login
                            </button>

                            {/* Gameweek Simulation */}
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#999', marginTop: '1rem', textTransform: 'uppercase' }}>
                                Automated Result Simulation
                            </div>

                            <button
                                onClick={() => {
                                    setShowSimModal(false);
                                    evaluateGameweek('Win');
                                }}
                                disabled={!pickTeam}
                                style={{ ...simBtnStyle, background: '#e8f5e9', color: '#1b5e20', opacity: pickTeam ? 1 : 0.5 }}
                            >
                                🎉 Simulate WIN (Full Cycle)
                            </button>

                            <button
                                onClick={() => {
                                    setShowSimModal(false);
                                    evaluateGameweek('Loss');
                                }}
                                disabled={!pickTeam}
                                style={{ ...simBtnStyle, background: '#ffebee', color: '#b71c1c', opacity: pickTeam ? 1 : 0.5 }}
                            >
                                💀 Simulate LOSS (Full Cycle)
                            </button>

                            <button
                                onClick={() => {
                                    setShowSimModal(false);
                                    evaluateGameweek('Draw');
                                }}
                                disabled={!pickTeam}
                                style={{ ...simBtnStyle, background: '#fff3e0', color: '#e65100', opacity: pickTeam ? 1 : 0.5 }}
                            >
                                ⚖️ Simulate DRAW (Elimination)
                            </button>

                            <button
                                onClick={() => { forceWheelMode(); setShowSimModal(false); navigate('/fixtures'); }}
                                style={{ ...simBtnStyle, background: '#f3e5f5', color: '#6a1b9a' }}
                            >
                                🎡 Force Auto-Wheel
                            </button>

                            {/* Career Reset */}
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#999', marginTop: '1rem', textTransform: 'uppercase' }}>
                                Career Management
                            </div>

                            <button
                                onClick={() => { revivePlayer(); setShowSimModal(false); window.location.reload(); }}
                                style={{ ...simBtnStyle, background: '#37003c', color: 'white' }}
                            >
                                ⚡ REVIVE & RESET
                            </button>

                            <button
                                onClick={() => setShowSimModal(false)}
                                style={{ border: 'none', background: 'none', padding: '1rem', color: '#999', cursor: 'pointer', marginTop: '1rem' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FPLStatCard({ label, value, color = '#37003c' }) {
    return (
        <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
            <div style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>
                {label}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color }}>
                {value}
            </div>
        </div>
    );
}

const simBtnStyle = {
    padding: '1rem',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.9rem'
};
