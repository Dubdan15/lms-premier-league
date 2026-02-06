import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

export default function Onboarding() {
    const [leagueCode, setLeagueCode] = useState('');
    const [newLeagueName, setNewLeagueName] = useState('');
    const [mode, setMode] = useState('JOIN'); // 'JOIN' or 'CREATE'

    // League rule settings
    const [gameMode, setGameMode] = useState('classic'); // 'classic' or 'pro'
    const [hasGraveyard, setHasGraveyard] = useState(false);
    const [hasShadowPicks, setHasShadowPicks] = useState(false);
    const [hasBoosts, setHasBoosts] = useState(false);

    // Tooltip state
    const [activeTooltip, setActiveTooltip] = useState(null);

    const { joinLeague, createLeague, signOut, user } = useGame();
    const navigate = useNavigate();

    // When Pro Era is selected, enable all rules
    const handleGameModeChange = (newMode) => {
        setGameMode(newMode);
        if (newMode === 'pro') {
            setHasGraveyard(true);
            setHasShadowPicks(true);
            setHasBoosts(true);
        } else {
            setHasGraveyard(false);
            setHasShadowPicks(false);
            setHasBoosts(false);
        }
    };

    const handleAction = (e) => {
        e.preventDefault();

        console.log('🚀 IMMEDIATE REDIRECT: Firing database call and redirecting...');

        if (mode === 'JOIN') {
            joinLeague(leagueCode).catch(err => {
                console.error('Background join error:', err);
            });
        } else {
            // Pass league rules to createLeague
            const rules = {
                game_mode: gameMode,
                has_graveyard: hasGraveyard,
                has_shadow_picks: hasShadowPicks,
                has_boosts: hasBoosts
            };
            createLeague(newLeagueName, rules).catch(err => {
                console.error('Background create error:', err);
            });
        }

        console.log('✅ Redirecting to dashboard immediately...');

        try {
            navigate('/dashboard');
        } catch (err) {
            console.warn('Navigate failed, using window.location fallback');
            window.location.href = '/dashboard';
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-purple)' }}>Welcome{user?.username ? `, ${user.username}` : ''}!</h1>
            <p style={{ marginBottom: '2rem', color: '#666' }}>To get started, join a league or create your own.</p>

            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: '#eee', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
                <button
                    onClick={() => setMode('JOIN')}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: 'none',
                        borderRadius: 'calc(var(--radius-md) - 2px)',
                        background: mode === 'JOIN' ? 'white' : 'transparent',
                        fontWeight: mode === 'JOIN' ? 'bold' : 'normal',
                        cursor: 'pointer'
                    }}
                >
                    Join League
                </button>
                <button
                    onClick={() => setMode('CREATE')}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: 'none',
                        borderRadius: 'calc(var(--radius-md) - 2px)',
                        background: mode === 'CREATE' ? 'white' : 'transparent',
                        fontWeight: mode === 'CREATE' ? 'bold' : 'normal',
                        cursor: 'pointer'
                    }}
                >
                    Create League
                </button>
            </div>

            <form onSubmit={handleAction} style={{ textAlign: 'left' }}>
                {mode === 'JOIN' ? (
                    <input
                        type="text"
                        placeholder="6-Digit Code (e.g. ABC123)"
                        value={leagueCode}
                        onChange={(e) => setLeagueCode(e.target.value)}
                        maxLength={6}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            marginBottom: '1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid #ddd',
                            fontSize: '1rem',
                            textAlign: 'center',
                            textTransform: 'uppercase'
                        }}
                        required
                    />
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="League Name"
                            value={newLeagueName}
                            onChange={(e) => setNewLeagueName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                marginBottom: '1.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                            required
                        />

                        {/* Game Mode Selection */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--color-purple)' }}>
                                Game Mode
                            </h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <GameModeCard
                                    title="Classic LMS"
                                    description="Standard Last Man Standing rules"
                                    isSelected={gameMode === 'classic'}
                                    onClick={() => handleGameModeChange('classic')}
                                />
                                <GameModeCard
                                    title="Pro Era"
                                    description="All custom rules enabled"
                                    isSelected={gameMode === 'pro'}
                                    onClick={() => handleGameModeChange('pro')}
                                    isPro
                                />
                            </div>
                        </div>

                        {/* Custom Rules */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--color-purple)' }}>
                                Custom Rules
                            </h3>

                            <RuleToggle
                                label="The Graveyard"
                                description="Chat and Wall of Shame for eliminated players"
                                checked={hasGraveyard}
                                onChange={setHasGraveyard}
                                disabled={gameMode === 'pro'}
                                tooltipId="graveyard"
                                activeTooltip={activeTooltip}
                                setActiveTooltip={setActiveTooltip}
                            />

                            <RuleToggle
                                label="Shadow Picks"
                                description="Hide picks until first kickoff"
                                checked={hasShadowPicks}
                                onChange={setHasShadowPicks}
                                disabled={gameMode === 'pro'}
                                tooltipId="shadow"
                                activeTooltip={activeTooltip}
                                setActiveTooltip={setActiveTooltip}
                            />

                            <RuleToggle
                                label="Tactical Boosts"
                                description="One 'Second Life' per season (survive a draw)"
                                checked={hasBoosts}
                                onChange={setHasBoosts}
                                disabled={gameMode === 'pro'}
                                tooltipId="boosts"
                                activeTooltip={activeTooltip}
                                setActiveTooltip={setActiveTooltip}
                            />
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    style={{
                        background: 'var(--color-green)',
                        color: 'var(--color-purple)',
                        border: 'none',
                        padding: '1rem 2rem',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        borderRadius: 'var(--radius-md)',
                        width: '100%',
                        cursor: 'pointer'
                    }}
                >
                    {mode === 'JOIN' ? 'Enter League' : 'Establish League'}
                </button>
            </form>

            <div style={{ marginTop: '3rem' }}>
                <button
                    onClick={() => signOut()}
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}

// Game Mode Card Component
function GameModeCard({ title, description, isSelected, onClick, isPro }) {
    return (
        <div
            onClick={onClick}
            style={{
                flex: 1,
                padding: '1rem',
                border: isSelected ? '2px solid ' + (isPro ? '#FFD700' : 'var(--color-purple)') : '2px solid #ddd',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                background: isSelected ? (isPro ? 'rgba(255, 215, 0, 0.1)' : 'rgba(55, 0, 179, 0.05)') : 'white',
                transition: 'all 0.2s'
            }}
        >
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: isPro ? '#FFD700' : 'var(--color-purple)' }}>
                {title}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#666' }}>
                {description}
            </div>
        </div>
    );
}

// Rule Toggle Component with Tooltip
function RuleToggle({ label, description, checked, onChange, disabled, tooltipId, activeTooltip, setActiveTooltip }) {
    return (
        <div style={{
            marginBottom: '0.75rem',
            padding: '0.75rem',
            background: checked ? 'rgba(255, 215, 0, 0.1)' : '#f9f9f9',
            borderRadius: 'var(--radius-md)',
            border: checked ? '1px solid #FFD700' : '1px solid #e0e0e0',
            opacity: disabled ? 0.6 : 1,
            transition: 'all 0.2s'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-purple)' }}>
                            {label}
                        </label>
                        <span
                            onMouseEnter={() => setActiveTooltip(tooltipId)}
                            onMouseLeave={() => setActiveTooltip(null)}
                            style={{
                                cursor: 'help',
                                background: 'var(--color-purple)',
                                color: 'white',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                position: 'relative'
                            }}
                        >
                            i
                            {activeTooltip === tooltipId && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '120%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'var(--color-purple)',
                                    color: 'white',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    whiteSpace: 'nowrap',
                                    zIndex: 10,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                    border: '1px solid #FFD700'
                                }}>
                                    {description}
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 0,
                                        borderLeft: '5px solid transparent',
                                        borderRight: '5px solid transparent',
                                        borderTop: '5px solid var(--color-purple)'
                                    }} />
                                </div>
                            )}
                        </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                        {description}
                    </div>
                </div>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => !disabled && onChange(e.target.checked)}
                    disabled={disabled}
                    style={{
                        width: '20px',
                        height: '20px',
                        cursor: disabled ? 'not-allowed' : 'pointer'
                    }}
                />
            </div>
        </div>
    );
}
