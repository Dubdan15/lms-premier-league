import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isValidSession, setIsValidSession] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    // Supabase handles the recovery session automatically if it's in the hash.
    // We check if we have an active session to allow the update.
    React.useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsValidSession(true);
            }
            setCheckingSession(false);
        };
        checkSession();
    }, []);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });
            if (error) throw error;

            setMessage({ type: 'success', text: 'Password updated successfully! Redirecting to login...' });

            // Redirect to login after 2 seconds
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error('Password reset error:', error);
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ color: 'var(--color-purple)' }}>Set New Password</h1>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
                Enter your new password below to regain access.
            </p>

            {checkingSession && (
                <div style={{ color: 'var(--color-purple)', fontWeight: 'bold' }}>
                    Authenticating link...
                </div>
            )}

            {!checkingSession && !isValidSession && (
                <div style={{
                    background: '#fff3cd', color: '#856404', padding: '1rem',
                    borderRadius: '8px', marginBottom: '2rem', fontSize: '0.9rem',
                    border: '1px solid #ffeeba'
                }}>
                    <strong>⚠️ Error:</strong> No valid recovery session found. Please click the link in your email again.
                </div>
            )}

            {message && (
                <div style={{
                    background: message.type === 'error' ? '#ffebee' : '#e8f5e9',
                    color: message.type === 'error' ? '#c62828' : '#2e7d32',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handlePasswordUpdate} style={{ opacity: (!isValidSession || checkingSession) ? 0.3 : 1, pointerEvents: (!isValidSession || checkingSession) ? 'none' : 'auto' }}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{
                        width: '100%',
                        padding: '1rem',
                        marginBottom: '2rem',
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
                        opacity: loading ? 0.7 : 1,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </form>

            <div style={{ marginTop: '2rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Cancel and Return to Login
                </button>
            </div>
        </div>
    );
}
