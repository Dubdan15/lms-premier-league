import React from 'react';

export default function EffectOverlay({ effect }) {
    if (!effect) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            pointerEvents: 'none'
        }}>
            {effect === 'win' && <WinEffect />}
            {effect === 'loss' && <LossEffect />}
        </div>
    );
}

function WinEffect() {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease'
        }}>
            {/* Confetti */}
            {Array.from({ length: 100 }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        top: '-20px',
                        left: `${Math.random() * 100}%`,
                        width: '10px',
                        height: '10px',
                        background: ['#00ff85', '#37003c', '#ffffff', '#ff0055'][Math.floor(Math.random() * 4)],
                        animation: `confettiFall ${2 + Math.random()}s ease-in ${Math.random() * 0.5}s forwards`,
                        borderRadius: '2px',
                        transform: `rotate(${Math.random() * 360}deg)`
                    }}
                />
            ))}

            {/* Message */}
            <div style={{
                fontSize: '4rem',
                fontWeight: '900',
                color: '#00ff85',
                textAlign: 'center',
                animation: 'pulse 1s ease infinite',
                textShadow: '0 0 30px rgba(0, 255, 133, 0.8)',
                zIndex: 1,
                padding: '2rem'
            }}>
                YOU<br />SURVIVED!
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                }
                @keyframes confettiFall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(110vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}

function LossEffect() {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            background: '#ff0055',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease',
            overflow: 'hidden'
        }}>
            {/* Blood Drips */}
            {Array.from({ length: 30 }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        top: '-100%',
                        left: `${Math.random() * 100}%`,
                        width: `${3 + Math.random() * 5}px`,
                        height: '100%',
                        background: 'linear-gradient(to bottom, rgba(139, 0, 0, 0.9), rgba(139, 0, 0, 0))',
                        animation: `bloodDrip ${1 + Math.random() * 0.5}s ease-out ${Math.random() * 0.3}s forwards`,
                        borderRadius: '0 0 50% 50%'
                    }}
                />
            ))}

            {/* Message */}
            <div style={{
                fontSize: '4rem',
                fontWeight: '900',
                color: 'white',
                textAlign: 'center',
                animation: 'shake 0.5s ease infinite',
                textShadow: '0 0 30px rgba(0, 0, 0, 0.8)',
                zIndex: 1,
                padding: '2rem'
            }}>
                ELIMINATED
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0) rotate(0deg); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px) rotate(-1deg); }
                    20%, 40%, 60%, 80% { transform: translateX(8px) rotate(1deg); }
                }
                @keyframes bloodDrip {
                    0% {
                        top: -100%;
                        opacity: 1;
                    }
                    100% {
                        top: 0;
                        opacity: 0.7;
                    }
                }
            `}</style>
        </div>
    );
}
