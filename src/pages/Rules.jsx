import React from 'react';

export default function Rules() {
    const rules = [
        {
            number: 1,
            title: 'Survival',
            description: 'Each week, pick one Premier League team to win. If they win, you advance. If they draw or lose, you are OUT.',
            icon: '⚔️'
        },
        {
            number: 2,
            title: 'No Repeats',
            description: 'You cannot pick the same team twice in one season.',
            icon: '🚫'
        },
        {
            number: 3,
            title: 'Deadline',
            description: 'Picks must be locked in 1 hour before the first kickoff of the weekend.',
            icon: '⏰'
        },
        {
            number: 4,
            title: 'The Winner',
            description: 'The last person remaining wins the pot. If everyone loses in the same week, we go to a \'Replay\' or split the prize.',
            icon: '🏆'
        }
    ];

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    background: 'linear-gradient(135deg, var(--color-purple) 0%, #FFD700 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0.5rem'
                }}>
                    Official Last Man Standing Rules
                </h1>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>
                    Read carefully. One mistake and you're out.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {rules.map((rule) => (
                    <div
                        key={rule.number}
                        style={{
                            background: 'white',
                            borderRadius: 'var(--radius-lg)',
                            padding: '2rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '2px solid #f0f0f0',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(55, 0, 179, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                            <div style={{
                                fontSize: '3rem',
                                lineHeight: 1,
                                flexShrink: 0
                            }}>
                                {rule.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                    <div style={{
                                        background: 'var(--color-purple)',
                                        color: 'white',
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '1.2rem'
                                    }}>
                                        {rule.number}
                                    </div>
                                    <h2 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: 'var(--color-purple)',
                                        margin: 0
                                    }}>
                                        {rule.title}
                                    </h2>
                                </div>
                                <p style={{
                                    fontSize: '1.1rem',
                                    lineHeight: '1.6',
                                    color: '#333',
                                    margin: 0
                                }}>
                                    {rule.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: '3rem',
                padding: '2rem',
                background: 'linear-gradient(135deg, var(--color-purple) 0%, #5a1fb3 100%)',
                borderRadius: 'var(--radius-lg)',
                color: 'white',
                textAlign: 'center'
            }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                    Good Luck! 🍀
                </h3>
                <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0 }}>
                    May the best strategist win. Remember: it's not just about picking winners, it's about outlasting everyone else.
                </p>
            </div>
        </div>
    );
}
