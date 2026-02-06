import React, { useState } from 'react';
import { useGame, TEAMS } from '../context/GameContext';
import TheWheel from '../components/TheWheel';
import { useNavigate } from 'react-router-dom';

export default function Fixtures() {
    const {
        currentGameweek, fixtures, isAutoWheelWindow, isAutoWheelForced, isAlive, lives, makePick, usedTeams,
        leagues, activeLeagueId, selectLeague, isSyncing
    } = useGame();
    const navigate = useNavigate();
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const savedPickId = localStorage.getItem(`userPick_${activeLeagueId}`);

    // Show wheel if in deadline window
    if ((isAutoWheelWindow || isAutoWheelForced) && !savedPickId) {
        return <TheWheel isAutoLock={true} />;
    }

    const isInteractionDisabled = !isAlive || savedPickId;

    const handleConfirm = async () => {
        if (selectedTeam) {
            const success = await makePick(selectedTeam.id);
            if (success) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                }, 1500);
            }
        }
    };

    // FPL Loading State
    if (!TEAMS || !fixtures) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem',
                gap: '1rem'
            }}>
                <div className="fpl-spinner" />
                <p style={{ color: '#37003c', fontWeight: '600' }}>Loading fixtures...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
            {/* League Selector & Quick Nav */}
            <div style={{
                background: '#37003c',
                padding: '1rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
                <select
                    value={activeLeagueId}
                    onChange={(e) => selectLeague(e.target.value)}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    {leagues.map(l => (
                        <option key={l.id} value={l.id} style={{ color: '#37003c' }}>{l.name}</option>
                    ))}
                </select>
                <button
                    onClick={() => navigate('/leagues')}
                    style={{
                        background: '#00ff85',
                        color: '#37003c',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontWeight: '900',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        textTransform: 'uppercase'
                    }}
                >
                    Management
                </button>
            </div>

            {/* Confirmation Button */}
            <div style={{ padding: '0 1rem 1rem 1rem' }}>
                <button
                    onClick={handleConfirm}
                    disabled={!selectedTeam || isSyncing}
                    style={{
                        background: selectedTeam ? '#00ff85' : '#ccc',
                        color: '#37003c',
                        border: 'none',
                        padding: '1.2rem 2.5rem',
                        borderRadius: '50px',
                        fontWeight: '900',
                        fontSize: '1.2rem',
                        cursor: selectedTeam && !isSyncing ? 'pointer' : 'not-allowed',
                        width: '100%',
                        maxWidth: '400px',
                        boxShadow: '0 10px 20px rgba(0,255,133,0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        margin: '0 auto' // Center the button
                    }}
                >
                    {isSyncing ? (
                        <>
                            <div className="fpl-spinner" style={{ width: '20px', height: '20px', borderTopColor: '#37003c' }} />
                            SAVING...
                        </>
                    ) : (
                        'Lock In Pick 🔒'
                    )}
                </button>
            </div>

            {/* FPL Gameweek Badge & Lives (Hidden for Hardcore) */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{
                    background: '#37003c',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontWeight: '900',
                    fontSize: '0.9rem',
                    letterSpacing: '1px',
                    boxShadow: '0 2px 8px rgba(55, 0, 60, 0.2)'
                }}>
                    GW {currentGameweek}
                </div>

                {/* Lives Hearts - Preservation Mode (Hidden) */}
                <div style={{ display: 'none' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} style={{
                                fontSize: '1.5rem',
                                filter: i < lives ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'grayscale(100%) opacity(0.3)',
                                transform: i < lives ? 'scale(1)' : 'scale(0.8)',
                                transition: 'all 0.3s ease'
                            }}>
                                {i < lives ? '❤️' : '💔'}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{
                    background: '#00ff85',
                    color: '#37003c',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontWeight: '900',
                    fontSize: '0.9rem',
                    letterSpacing: '1px',
                    boxShadow: '0 2px 8px rgba(0, 255, 133, 0.2)'
                }}>
                    STREAK: {usedTeams.length}
                </div>
            </div>

            {/* Status Banners */}
            {!isAlive && (
                <div style={{
                    background: '#37003c',
                    border: '3px solid #00ff85',
                    color: '#00ff85',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontWeight: '900',
                    marginBottom: '1.5rem',
                    boxShadow: '0 10px 30px rgba(0, 255, 133, 0.2)',
                    animation: 'pulse 2s infinite'
                }}>
                    📡 SPECTATOR MODE ACTIVE
                    <div style={{ fontSize: '0.7rem', marginTop: '0.4rem', color: 'white', opacity: 0.8 }}>
                        You were eliminated. You can still watch the league!
                    </div>
                </div>
            )}

            {savedPickId && isAlive && (
                <div style={{
                    background: 'white',
                    border: '2px solid #00ff85',
                    color: '#37003c',
                    padding: '1rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                    🔒 SELECTION LOCKED
                </div>
            )}

            {/* FPL Fixtures List - Versus Format */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {fixtures.map(fixture => {
                    const home = TEAMS.find(t => t.name === fixture.home_team);
                    const away = TEAMS.find(t => t.name === fixture.away_team);

                    if (!home || !away) return null;

                    const homeSelected = selectedTeam?.id === home.id;
                    const awaySelected = selectedTeam?.id === away.id;
                    const homeLocked = savedPickId === home.id.toString();
                    const awayLocked = savedPickId === away.id.toString();
                    const homeUsed = usedTeams.includes(home.id);
                    const awayUsed = usedTeams.includes(away.id);

                    return (
                        <div key={fixture.id} style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '1rem',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            maxWidth: '100%',
                            boxSizing: 'border-box'
                        }}>
                            {/* Team Names Row */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '0.75rem',
                                gap: '0.5rem'
                            }}>
                                {/* Home Team                                    */}
                                <div
                                    onClick={() => !isInteractionDisabled && !homeUsed && setSelectedTeam(home)}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        borderRadius: '6px',
                                        background: homeSelected ? '#00ff85' : (homeLocked ? '#37003c' : (homeUsed ? '#e0e0e0' : 'transparent')),
                                        cursor: (isInteractionDisabled || homeUsed) ? 'default' : 'pointer',
                                        transition: 'all 0.2s ease',
                                        textAlign: 'left',
                                        opacity: homeUsed ? 0.6 : 1
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px' // Space between badge and name
                                    }}>
                                        <img
                                            src={home.badge}
                                            alt={home.short_name}
                                            style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                                        />
                                        <div style={{
                                            fontWeight: '900',
                                            fontSize: '0.95rem',
                                            color: (homeSelected || homeLocked) ? 'white' : '#222',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {home.name}
                                        </div>
                                    </div>
                                </div>

                                {/* VS Badge */}
                                <div style={{
                                    padding: '0.25rem 0.5rem',
                                    background: '#f3f3f3',
                                    borderRadius: '4px',
                                    fontWeight: '900',
                                    fontSize: '0.7rem',
                                    color: '#999',
                                    flexShrink: 0
                                }}>
                                    VS
                                </div>

                                {/* Away Team                                    */}
                                <div
                                    onClick={() => !isInteractionDisabled && !awayUsed && setSelectedTeam(away)}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        borderRadius: '6px',
                                        background: awaySelected ? '#00ff85' : (awayLocked ? '#37003c' : (awayUsed ? '#e0e0e0' : 'transparent')),
                                        cursor: (isInteractionDisabled || awayUsed) ? 'default' : 'pointer',
                                        transition: 'all 0.2s ease',
                                        textAlign: 'right',
                                        opacity: awayUsed ? 0.6 : 1
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end', // Align right for away team
                                        gap: '8px'
                                    }}>
                                        <div style={{
                                            fontWeight: '900',
                                            fontSize: '0.95rem',
                                            color: (awaySelected || awayLocked) ? 'white' : '#222',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {away.name}
                                        </div>
                                        <img
                                            src={away.badge}
                                            alt={away.short_name}
                                            style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Details Row: Form - Stadium - Form */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.65rem',
                                color: '#999',
                                gap: '0.5rem'
                            }}>
                                {/* Home Form */}
                                <div style={{ display: 'flex', gap: '2px', flex: 1, justifyContent: 'flex-start' }}>
                                    {home.form.map((result, i) => (
                                        <span key={i} style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: result === 'W' ? '#00ff85' : (result === 'D' ? '#999' : '#ff0055'),
                                            flexShrink: 0
                                        }} />
                                    ))}
                                </div>

                                {/* Stadium */}
                                <div style={{
                                    fontWeight: '600',
                                    fontSize: '0.65rem',
                                    color: '#999',
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    flex: 1
                                }}>
                                    {getStadiumName(home.name)}
                                </div>

                                {/* Away Form */}
                                <div style={{ display: 'flex', gap: '2px', flex: 1, justifyContent: 'flex-end' }}>
                                    {away.form.map((result, i) => (
                                        <span key={i} style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: result === 'W' ? '#00ff85' : (result === 'D' ? '#999' : '#ff0055'),
                                            flexShrink: 0
                                        }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* My Journey (Survival History) */}
            {usedTeams.length > 0 && (
                <div style={{ marginTop: '3rem', borderTop: '2px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem', marginBottom: '4rem' }}>
                    <h3 style={{
                        textAlign: 'center',
                        color: '#37003c',
                        fontSize: '0.9rem',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '1rem'
                    }}>
                        My Journey
                    </h3>
                    <div style={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: '1rem',
                        padding: '0.5rem 1rem',
                        justifyContent: usedTeams.length < 5 ? 'center' : 'flex-start'
                    }}>
                        {usedTeams.map((teamId, index) => {
                            const team = TEAMS.find(t => t.id === teamId);
                            if (!team) return null;
                            return (
                                <div key={`${teamId}-${index}`} style={{
                                    flexShrink: 0,
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        border: '2px solid #00ff85'
                                    }}>
                                        <img
                                            src={team.badge}
                                            alt={team.short_name}
                                            style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                                        />
                                    </div>
                                    {/* Green Checkmark Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-5px',
                                        right: '-5px',
                                        background: '#00ff85',
                                        borderRadius: '50%',
                                        width: '18px',
                                        height: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        color: '#37003c',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                    }}>
                                        ✓
                                    </div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: '700', marginTop: '4px', color: '#999' }}>GW{21 + index}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* FPL Confirmation Panel */}
            {selectedTeam && !isInteractionDisabled && (
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'white',
                    padding: '1.5rem',
                    borderTop: '3px solid #37003c',
                    zIndex: 900,
                    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
                    maxWidth: '100vw',
                    boxSizing: 'border-box'
                }}>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <div style={{
                                color: '#999',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '0.5rem'
                            }}>
                                Confirm Selection
                            </div>
                            <div style={{ color: '#37003c', fontSize: '1.5rem', fontWeight: '900' }}>
                                {selectedTeam.name}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setSelectedTeam(null)}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    background: '#f3f3f3',
                                    color: '#37003c',
                                    border: 'none',
                                    fontWeight: '700',
                                    fontSize: '1rem'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                style={{
                                    flex: 2,
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    background: '#00ff85',
                                    color: '#37003c',
                                    border: 'none',
                                    fontWeight: '900',
                                    fontSize: '1rem',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 2px 8px rgba(0, 255, 133, 0.3)'
                                }}
                            >
                                Confirm Pick
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FPL Success Message */}
            {showSuccess && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: '#00ff85',
                    color: '#37003c',
                    padding: '2rem 3rem',
                    borderRadius: '12px',
                    fontWeight: '900',
                    fontSize: '1.5rem',
                    zIndex: 9999,
                    boxShadow: '0 10px 40px rgba(0, 255, 133, 0.4)',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    ✓ TEAM LOCKED!
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                @keyframes pulse {
                    0% { box-shadow: 0 10px 30px rgba(0, 255, 133, 0.2); }
                    50% { box-shadow: 0 10px 40px rgba(0, 255, 133, 0.4); }
                    100% { box-shadow: 0 10px 30px rgba(0, 255, 133, 0.2); }
                }
            `}</style>
        </div>
    );
}

// Helper function to get stadium names
function getStadiumName(teamName) {
    const stadiums = {
        'Arsenal': 'Emirates',
        'Aston Villa': 'Villa Park',
        'Brighton': 'Amex',
        'Chelsea': 'Stamford Bridge',
        'Fulham': 'Craven Cottage',
        'Liverpool': 'Anfield',
        'Man City': 'Etihad',
        'Man Utd': 'Old Trafford',
        'Newcastle': 'St James Park',
        'Tottenham': 'Tottenham Stadium',
        'Wolves': 'Molineux',
        'Everton': 'Goodison Park',
        'Leicester': 'King Power',
        'West Ham': 'London Stadium',
        'Crystal Palace': 'Selhurst Park',
        'Bournemouth': 'Vitality',
        'Brentford': 'Gtech',
        'Nottm Forest': 'City Ground',
        'Southampton': 'St Marys',
        'Ipswich': 'Portman Road'
    };
    return stadiums[teamName] || 'Stadium';
}
