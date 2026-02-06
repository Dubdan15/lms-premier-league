import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { teams } from '../data/teams';

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const { activateDemoMode, enterAsGuest } = useGame();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const timeout = (ms) => new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Database Connection Failed.')), ms)
        );

        try {
            const authPromise = isSignUp
                ? supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: email.split('@')[0],
                        }
                    }
                })
                : supabase.auth.signInWithPassword({
                    email,
                    password,
                });

            // Race the auth request against a 5s timeout (Reduced for emergency fix)
            const result = await Promise.race([
                authPromise,
                timeout(5000)
            ]);

            const { data, error } = result;

            if (error) throw error;

            // CRITICAL: Only redirect if we have a valid user object from the database
            if (data?.user) {
                console.log('✅ Auth successful, user verified:', data.user.email);

                // Ensure profile exists in the players database before navigating
                const username = data.user.user_metadata?.username || data.user.email.split('@')[0];
                await ensureProfileExists(data.user.id, username);

                window.location.href = '/dashboard';
            } else {
                throw new Error("Authentication failed: No user data returned from database.");
            }

        } catch (error) {
            console.error('❌ Auth error:', error);
            setMessage({ type: 'error', text: error.message });
            setLoading(false);
        }
    };

    const handleAutoFill = () => {
        setEmail('test@example.com');
        setPassword('Password123!');
        setMessage({ type: 'success', text: 'Test credentials populated!' });
    };

    const ensureProfileExists = async (userId, username) => {
        try {
            console.log('🔧 DEBUG: Checking if profile exists for user:', userId);

            const { data: existingProfile, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (existingProfile) {
                console.log('✅ DEBUG: Profile already exists');
                return;
            }

            console.log('🔧 DEBUG: Creating profile...');
            const { error: insertError } = await supabase
                .from('profiles')
                .insert({ id: userId, username: username });

            if (insertError) {
                console.error('❌ DEBUG: Profile creation failed:', insertError);
            } else {
                console.log('✅ DEBUG: Profile created successfully');
            }
        } catch (error) {
            console.error('❌ DEBUG: Error ensuring profile:', error);
        }
    };

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h1>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
                {isSignUp ? 'Join the league and track your picks.' : 'Log in to manage your team.'}
            </p>

            {message && (
                <div style={{
                    background: message.type === 'error' ? '#ffebee' : '#e8f5e9',
                    color: message.type === 'error' ? '#d32f2f' : '#2e7d32',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.9rem',
                    fontWeight: message.type === 'error' ? 'bold' : 'normal',
                    border: message.type === 'error' ? '1px solid #d32f2f' : 'none'
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleAuth}>
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
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                {!isSignUp && (
                    <div style={{ textAlign: 'right', marginTop: '-1.5rem', marginBottom: '1.5rem' }}>
                        <a href="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--color-purple)', textDecoration: 'none' }}>Forgot Password?</a>
                    </div>
                )}
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
                    {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem' }}>
                <button
                    onClick={enterAsGuest}
                    style={{
                        background: 'linear-gradient(135deg, #00c853, #64dd17)',
                        color: 'white',
                        border: 'none',
                        padding: '1.25rem',
                        fontSize: '1.1rem',
                        fontWeight: '900',
                        borderRadius: '12px',
                        width: '100%',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(0, 200, 83, 0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                >
                    🚀 Guest Entry (Immediate Access)
                </button>
                <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.5rem' }}>
                    Use this if you are having database connection issues.
                </p>
            </div>

            {!isSignUp && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <button
                        onClick={handleAutoFill}
                        disabled={loading}
                        style={{
                            background: '#f5f5f5',
                            color: '#666',
                            border: '1px solid #ddd',
                            padding: '0.75rem',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            width: '100%',
                            cursor: loading ? 'wait' : 'pointer',
                        }}
                    >
                        📝 Auto-Fill Test Account
                    </button>
                </div>
            )}

            <div style={{ marginTop: '2rem' }}>
                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
                </button>
            </div>
        </div>
    );
}
