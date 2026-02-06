import React, { useState } from 'react';
import { useGame, TEAMS } from '../context/GameContext';

export default function Standings() {
    const { leagueMembers, currentGameweek, activeLeague, resetLeague, nickname } = useGame();
    const [selectedManager, setSelectedManager] = useState(null);

    // FPL Loading State
    if (!TEAMS || !leagueMembers) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', gap: '1rem' }}>
                <div className="fpl-spinner" />
                <p style={{ color: '#37003c', fontWeight: '600' }}>Loading standings...</p>
            </div>
        );
    }

    const getTeamById = (id) => TEAMS.find(t => t.id === id);

    const activePlayers = leagueMembers.filter(m => m.status === 'ALIVE').sort((a, b) => b.history.length - a.history.length);
    const deadPlayers = leagueMembers.filter(m => m.status === 'ELIMINATED').sort((a, b) => b.history.length - a.history.length);

    const winner = (activePlayers.length === 1 && leagueMembers.length > 1) ? activePlayers[0] : null;
    const isSeasonFinished = activePlayers.length <= 1;

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* FPL Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ color: '#37003c', margin: 0, fontSize: '1.5rem', fontWeight: '900' }}>{activeLeague?.name || 'LEAGUE TABLE'}</h1>
                <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: '600' }}>GW {currentGameweek}</p>
            </div>

            {/* Champion Banner */}
            {winner && (
                <div style={{
                    background: 'linear-gradient(135deg, #37003c 0%, #a200ff 100%)',
                    color: '#00ff85',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    marginBottom: '2rem',
                    border: '3px solid #00ff85',
                    boxShadow: '0 10px 30px rgba(0, 255, 133, 0.3)',
                    animation: 'pulse 2s infinite'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        LEAGUE CHAMPION
                    </h2>
                    <p style={{ margin: '0.5rem 0 0', color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>
                        {winner.name} is the last man standing!
                    </p>
                </div>
            )}

            {/* Active Players Table */}
            <div style={{
                background: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                marginBottom: '2rem'
            }}>
                <div style={{ background: '#00ff85', color: '#37003c', padding: '0.5rem 1rem', fontWeight: '900', fontSize: '0.75rem' }}>
                    ACTIVE SURVIVORS
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#37003c', color: 'white' }}>
                            <th style={thStyle}>MANAGER</th>
                            <th style={thStyle}>PICK</th>
                            <th style={thStyle}>STREAK</th>
                            <th style={thStyle}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activePlayers.map((m, idx) => (
                            <tr key={m.id} style={{ borderBottom: idx < activePlayers.length - 1 ? '1px solid #f3f3f3' : 'none', background: m.isMe ? 'rgba(0, 255, 133, 0.05)' : 'white' }}>
                                <td style={tdStyle}>
                                    <div
                                        onClick={() => setSelectedManager(m)}
                                        style={{ fontWeight: '700', color: '#37003c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        {winner?.id === m.id && <span>🏆</span>}
                                        {m.name}
                                        {m.isMe && <span style={{ color: '#00ff85', fontSize: '0.6rem' }}>● YOU</span>}
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    {m.currentPick ? (
                                        <div>
                                            <div style={{ fontWeight: '900', color: '#37003c' }}>{getTeamById(m.currentPick.id)?.short_name}</div>
                                            <div style={{ fontSize: '0.6rem', color: '#999' }}>Locked 12:45</div>
                                        </div>
                                    ) : (
                                        <span style={{ color: '#ccc', fontStyle: 'italic' }}>Thinking...</span>
                                    )}
                                </td>
                                <td style={tdStyle}>
                                    <span style={{ fontWeight: '900', color: '#00ff85' }}>{m.history.length}</span>
                                </td>
                                <td style={tdStyle}>
                                    <span style={{ background: '#00ff85', color: '#37003c', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '900' }}>SAFE</span>
                                </td>
                            </tr>
                        ))}
                        {activePlayers.length === 0 && (
                            <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Everyone has been eliminated!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Graveyard Section */}
            {deadPlayers.length > 0 && (
                <div style={{
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    opacity: 0.7
                }}>
                    <div style={{ background: '#37003c', color: 'white', padding: '0.5rem 1rem', fontWeight: '900', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span>THE GRAVEYARD 💀</span>
                        <span>REST IN PEACE</span>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <tbody>
                            {deadPlayers.map((m, idx) => {
                                const lastTeam = m.history[m.history.length - 1];
                                return (
                                    <tr key={m.id} style={{ borderBottom: idx < deadPlayers.length - 1 ? '1px solid #eee' : 'none' }}>
                                        <td style={tdStyle}>
                                            <div
                                                onClick={() => setSelectedManager(m)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                            >
                                                <span style={{ fontSize: '1.2rem' }}>💀</span>
                                                <div style={{ fontWeight: '700', color: '#999', textDecoration: 'line-through' }}>{m.name}</div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ fontSize: '0.75rem', color: '#ff0055', fontWeight: '700' }}>
                                                CAUSE OF DEATH
                                            </div>
                                            <div style={{ fontSize: '0.65rem', color: '#37003c', fontWeight: '800' }}>
                                                Picked {getTeamById(lastTeam)?.name || 'Unknown'} (GW {21 + m.history.length}) ❌
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ fontWeight: '900', color: '#999' }}>{m.history.length}W</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Season Reset Button */}
            {isSeasonFinished && (
                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <button
                        onClick={() => {
                            if (window.confirm("This will restart the season for EVERYONE in this league. Are you sure?")) {
                                resetLeague();
                            }
                        }}
                        style={{
                            background: '#37003c',
                            color: '#00ff85',
                            padding: '1.2rem 2.5rem',
                            borderRadius: '50px',
                            border: '3px solid #00ff85',
                            fontWeight: '900',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            boxShadow: '0 10px 20px rgba(0,255,133,0.2)'
                        }}
                    >
                        Start New Season 🔄
                    </button>
                    <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '1rem', fontWeight: '600' }}>A winner has been crowned or everyone is out.</p>
                </div>
            )}

            {/* Manager Detail Modal */}
            {selectedManager && (
                <div
                    style={{
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
                    }}
                    onClick={() => setSelectedManager(null)}
                >
                    <div
                        style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '12px',
                            width: '100%',
                            maxWidth: '400px'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, color: '#37003c', fontWeight: '900' }}>{selectedManager.name}</h2>
                            <button
                                onClick={() => setSelectedManager(null)}
                                style={{
                                    border: 'none',
                                    background: '#f3f3f3',
                                    color: '#37003c',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    fontWeight: 'bold'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{
                            marginBottom: '1.5rem',
                            background: '#f3f3f3',
                            padding: '1rem',
                            borderRadius: '8px'
                        }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                Status
                            </div>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: '900',
                                color: selectedManager.status === 'ALIVE' ? '#00ff85' : '#ff0055'
                            }}>
                                {selectedManager.status}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#999', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                Teams Used ({selectedManager.history.length}/20)
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                {selectedManager.history.map((teamId, i) => {
                                    const team = getTeamById(teamId);
                                    const isLast = i === selectedManager.history.length - 1;
                                    const isEliminated = selectedManager.status === 'ELIMINATED' && isLast;
                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                background: '#f3f3f3',
                                                padding: '0.5rem',
                                                borderRadius: '6px',
                                                textAlign: 'center',
                                                border: isEliminated ? '1px solid #ff0055' : '1px solid transparent'
                                            }}
                                        >
                                            <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#37003c' }}>
                                                {team?.short_name || '???'}
                                            </div>
                                            <div style={{ fontSize: '0.6rem', color: isEliminated ? '#ff0055' : '#00ff85', fontWeight: '900' }}>
                                                {isEliminated ? '❌ OUT' : '✅ SAFE'}
                                            </div>
                                            <div style={{ fontSize: '0.5rem', color: '#999', fontWeight: '600' }}>
                                                GW {21 + i}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {selectedManager.history.length === 0 && (
                                <p style={{ color: '#999', textAlign: 'center', padding: '1rem', fontWeight: '600' }}>
                                    No teams used yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const thStyle = { padding: '0.75rem', fontWeight: '900', fontSize: '0.7rem', textTransform: 'uppercase' };
const tdStyle = { padding: '0.75rem', verticalAlign: 'middle', fontSize: '0.85rem' };
