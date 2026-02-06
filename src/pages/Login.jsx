import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showDevTools, setShowDevTools] = useState(false);
    const navigate = useNavigate();
    const { enterAsGuest } = useGame();

    const handleBypassLogin = () => {
        // Set dev guest mode
        localStorage.setItem('devGuest', 'true');
        localStorage.setItem('userName', 'Dev Guest');
        enterAsGuest();
        navigate('/fixtures');
    };

    const handleGuestEntry = () => {
        enterAsGuest();
        navigate('/fixtures');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f3f3f3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}>
                {/* FPL Header */}
                <div style={{
                    background: '#37003c',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: '1.5rem',
                        fontWeight: '900',
                        color: 'white',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Last Man <span style={{ color: '#00ff85' }}>Standing</span>
                    </h1>
                    <p style={{
                        margin: '0.5rem 0 0 0',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}>
                        Premier League Survival Game
                    </p>
                </div>

                {/* Login Form */}
                <div style={{ padding: '2rem' }}>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#37003c',
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '2px solid #f3f3f3',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#00ff85'}
                                onBlur={(e) => e.target.style.borderColor = '#f3f3f3'}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#37003c',
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '2px solid #f3f3f3',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#00ff85'}
                                onBlur={(e) => e.target.style.borderColor = '#f3f3f3'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '8px',
                                background: '#ddd',
                                color: '#999',
                                border: 'none',
                                fontWeight: '900',
                                fontSize: '1rem',
                                textTransform: 'uppercase',
                                cursor: 'not-allowed',
                                marginBottom: '1rem'
                            }}
                        >
                            Login (Coming Soon)
                        </button>

                        <button
                            type="button"
                            onClick={handleGuestEntry}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '8px',
                                background: '#00ff85',
                                color: '#37003c',
                                border: 'none',
                                fontWeight: '900',
                                fontSize: '1rem',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0, 255, 133, 0.3)'
                            }}
                        >
                            Continue as Guest
                        </button>
                    </form>

                    {/* Dev Tools Toggle */}
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <button
                            onClick={() => setShowDevTools(!showDevTools)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#999',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            {showDevTools ? 'Hide' : 'Show'} Dev Tools
                        </button>
                    </div>

                    {/* Dev Tools */}
                    {showDevTools && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: '#f3f3f3',
                            borderRadius: '8px',
                            border: '1px solid #ddd'
                        }}>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: '#999',
                                marginBottom: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Developer Controls
                            </div>
                            <button
                                onClick={handleBypassLogin}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '6px',
                                    background: '#37003c',
                                    color: '#00ff85',
                                    border: 'none',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }}
                            >
                                ⚡ Bypass Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
