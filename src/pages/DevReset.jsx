import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function DevReset() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleDevReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Note: Since we don't have a service role key on the frontend,
            // we first sign in as the user (assuming we know the old password or it's a test account)
            // If they are locked out because they forgot, we can use this to try and force an update if they are already logged in locally.

            // For a TRUE backdoor without a token, we normally need a service role.
            // But we can use the 'updateUser' if there is any active session.

            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                throw new Error("No active session. Please log in normally first, or use the 'Reset Password' email flow. Dev Reset requires being logged in to use 'updateUser'.");
            }

            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;
            setMessage({ type: 'success', text: 'Password Forced Update Successful! Redirecting...' });
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ color: '#ff9800' }}>🛠️ DEV RESET</h1>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
                Forced Password Update (Requires active session)
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

            <form onSubmit={handleDevReset}>
                <p style={{ fontSize: '0.8rem', opacity: 0.6, textAlign: 'left', marginBottom: '0.5rem' }}>New Password for current user:</p>
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
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: '#ff9800',
                        color: 'white',
                        border: 'none',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        width: '100%',
                        cursor: loading ? 'wait' : 'pointer'
                    }}
                >
                    {loading ? 'Updating...' : 'FORCE UPDATE PASSWORD'}
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
