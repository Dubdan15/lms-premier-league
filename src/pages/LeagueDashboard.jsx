import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LeagueDashboard() {
    const { leagues, activeLeagueId, createLeague, joinLeague, selectLeague, activeLeague } = useGame();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [leagueName, setLeagueName] = useState('');
    const [leagueCode, setLeagueCode] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Parse URL query parameters for auto-join
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const joinCode = params.get('join');
        if (joinCode) {
            setLeagueCode(joinCode.toUpperCase());
            setIsJoinModalOpen(true);
        }
    }, [location.search]);

    const handleCreate = (e) => {
        e.preventDefault();
        if (leagueName.trim()) {
            createLeague(leagueName);
            setLeagueName('');
            setIsCreateModalOpen(false);
            navigate('/fixtures');
        }
    };

    const handleJoin = (e) => {
        e.preventDefault();
        if (leagueCode.trim()) {
            joinLeague(leagueCode);
            setLeagueCode('');
            setIsJoinModalOpen(false);
            navigate('/fixtures');
        }
    };

    return (
        <div style={{
            padding: '2rem 1rem',
            maxWidth: '800px',
            margin: '0 auto',
            minHeight: '100vh',
            background: '#f3f3f3'
        }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ color: '#37003c', fontSize: '2rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    Multiplayer Leagues
                </h1>
                <p style={{ color: '#777', fontWeight: '600' }}>Manage your survival campaigns</p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginBottom: '3rem'
            }}>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    style={{
                        background: '#37003c',
                        color: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: 'none',
                        fontWeight: '900',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(55, 0, 60, 0.2)',
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    + CREATE LEAGUE
                </button>
                <button
                    onClick={() => setIsJoinModalOpen(true)}
                    style={{
                        background: '#00ff85',
                        color: '#37003c',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: 'none',
                        fontWeight: '900',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0, 255, 133, 0.2)',
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    👉 JOIN LEAGUE
                </button>
            </div>

            <section>
                <h2 style={{ color: '#37003c', fontSize: '1.2rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🏆</span> YOUR LEAGUES
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {leagues.map(league => (
                        <div
                            key={league.id}
                            style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '1rem',
                                flexWrap: 'wrap',
                                border: league.id === activeLeagueId ? '3px solid #37003c' : '3px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => {
                                selectLeague(league.id);
                                navigate('/fixtures');
                            }}
                        >
                            <div>
                                <h3 style={{ margin: 0, color: '#37003c', fontWeight: '900', fontSize: '1.1rem' }}>{league.name}</h3>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span style={{ color: '#999', fontSize: '0.8rem', fontWeight: '700' }}>CODE: {league.code}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const shareUrl = `${window.location.origin}/leagues?join=${league.code}`;
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: `Join ${league.name}`,
                                                    text: `Join my Last Man Standing league! Code: ${league.code}`,
                                                    url: shareUrl
                                                }).catch(() => { });
                                            } else {
                                                navigator.clipboard.writeText(shareUrl);
                                                alert('League link copied to clipboard!');
                                            }
                                        }}
                                        style={{
                                            background: '#00ff85',
                                            color: '#37003c',
                                            border: 'none',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontSize: '0.7rem',
                                            fontWeight: '900',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        📤 Share
                                    </button>
                                    <span style={{ color: '#00ff85', fontSize: '0.8rem', fontWeight: '700' }}>{league.state?.usedTeams?.length || 0}W STREAK</span>
                                    {league.state?.isAlive === false && <span style={{ color: '#ff0055', fontSize: '0.8rem', fontWeight: '700' }}>DEFEATED</span>}
                                </div>
                            </div>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: '#f3f3f3',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#37003c',
                                fontWeight: '900'
                            }}>
                                →
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <form onSubmit={handleCreate} style={{ background: 'white', padding: '2rem', borderRadius: '20px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ color: '#37003c', fontWeight: '900', marginTop: 0 }}>Create New League</h2>
                        <input
                            autoFocus
                            placeholder="League Name (e.g. Work Mates)"
                            value={leagueName}
                            onChange={e => setLeagueName(e.target.value)}
                            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #ddd', marginBottom: '1.5rem', boxSizing: 'border-box', fontSize: '1rem' }}
                        />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" onClick={() => setIsCreateModalOpen(false)} style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: 'none', background: '#eee', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ flex: 2, padding: '1rem', borderRadius: '8px', border: 'none', background: '#37003c', color: 'white', fontWeight: '900', cursor: 'pointer' }}>Create</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Join Modal */}
            {isJoinModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <form onSubmit={handleJoin} style={{ background: 'white', padding: '2rem', borderRadius: '20px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ color: '#37003c', fontWeight: '900', marginTop: 0 }}>Join League</h2>
                        <input
                            autoFocus
                            placeholder="Paste 6-digit code"
                            value={leagueCode}
                            onChange={e => setLeagueCode(e.target.value)}
                            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #ddd', marginBottom: '1.5rem', boxSizing: 'border-box', fontSize: '1rem', textAlign: 'center', letterSpacing: '4px', textTransform: 'uppercase' }}
                        />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" onClick={() => setIsJoinModalOpen(false)} style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: 'none', background: '#eee', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ flex: 2, padding: '1rem', borderRadius: '8px', border: 'none', background: '#00ff85', color: '#37003c', fontWeight: '900', cursor: 'pointer' }}>Join</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
