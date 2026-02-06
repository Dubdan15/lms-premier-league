import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nickname.trim()) {
            localStorage.setItem('userNickname', nickname.trim());
            navigate('/fixtures');
            window.location.reload(); // Refresh to update context with new nickname
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#37003c',
            padding: '1rem'
        }}>
            <div style={{
                background: 'white',
                padding: '3rem 2rem',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
                <h1 style={{ color: '#37003c', fontWeight: '900', margin: '0 0 1rem 0', fontSize: '2rem' }}>WELCOME</h1>
                <p style={{ color: '#666', marginBottom: '2rem', fontWeight: '600' }}>Enter a nickname to start your survival journey.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        autoFocus
                        placeholder="e.g. FPL King"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1.2rem',
                            borderRadius: '12px',
                            border: '2px solid #f3f3f3',
                            marginBottom: '1.5rem',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            textAlign: 'center',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#00ff85'}
                        onBlur={(e) => e.target.style.borderColor = '#f3f3f3'}
                    />
                    <button
                        type="submit"
                        disabled={!nickname.trim()}
                        style={{
                            width: '100%',
                            padding: '1.2rem',
                            background: '#00ff85',
                            color: '#37003c',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '900',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            opacity: nickname.trim() ? 1 : 0.5
                        }}
                    >
                        Enter Arena →
                    </button>
                </form>
            </div>
        </div>
    );
}
