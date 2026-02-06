import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleResetRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const redirectUrl = `${import.meta.env.VITE_APP_URL}/reset-password`;
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            });
            if (error) throw error;
            setMessage({ type: 'success', text: 'Password reset link sent! Check your email.' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Reset Password</h1>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
                Enter your email address and we'll send you a link to reset your password.
            </p>

            {message && (
                <div style={{
                    background: message.type === 'error' ? '#ffebee' : '#e8f5e9',
                    color: message.type === 'error' ? '#c62828' : '#2e7d32',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleResetRequest}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        width: '100%',
                        padding: '1rem',
                        marginBottom: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '1rem'
                    }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: 'var(--color-purple)',
                        color: 'white',
                        border: 'none',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        width: '100%',
                        cursor: loading ? 'wait' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>

            <div style={{ marginTop: '2rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}
