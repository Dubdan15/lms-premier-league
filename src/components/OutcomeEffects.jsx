import React, { useEffect } from 'react';

export function WinCelebration({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.9)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.3s ease'
            }}>
                {/* Pulsing Message */}
                <div style={{
                    fontSize: '3rem',
                    fontWeight: '900',
                    color: '#00ff85',
                    textAlign: 'center',
                    animation: 'pulse 1s ease infinite',
                    textShadow: '0 0 20px rgba(0, 255, 133, 0.5)',
                    padding: '2rem'
                }}>
                    YOU SURVIVED!
                </div>

                {/* Confetti */}
                <ConfettiCannon />
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            `}</style>
        </>
    );
}

export function LossEffect({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: '#ff0055',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.3s ease'
            }}>
                {/* Shaky Message */}
                <div style={{
                    fontSize: '3rem',
                    fontWeight: '900',
                    color: 'white',
                    textAlign: 'center',
                    animation: 'shake 0.5s ease infinite',
                    textShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                    padding: '2rem'
                }}>
                    ELIMINATED
                </div>

                {/* Blood Drip Effect */}
                <BloodDrip />
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0) rotate(0deg); }
                    25% { transform: translateX(-5px) rotate(-2deg); }
                    75% { transform: translateX(5px) rotate(2deg); }
                }
            `}</style>
        </>
    );
}

// Confetti Cannon Component
function ConfettiCannon() {
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        color: ['#00ff85', '#37003c', '#ffffff', '#ff0055'][Math.floor(Math.random() * 4)]
    }));

    return (
        <>
            {confettiPieces.map(piece => (
                <div
                    key={piece.id}
                    style={{
                        position: 'absolute',
                        top: '-10px',
                        left: `${piece.left}%`,
                        width: '10px',
                        height: '10px',
                        background: piece.color,
                        animation: `confettiFall ${piece.duration}s ease-in ${piece.delay}s forwards`,
                        opacity: 0.8,
                        borderRadius: '2px'
                    }}
                />
            ))}
            <style>{`
                @keyframes confettiFall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `}</style>
        </>
    );
}

// Blood Drip Component
function BloodDrip() {
    const drips = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 1.5 + Math.random() * 1
    }));

    return (
        <>
            {drips.map(drip => (
                <div
                    key={drip.id}
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: `${drip.left}%`,
                        width: '3px',
                        height: '0',
                        background: 'linear-gradient(to bottom, rgba(139, 0, 0, 0.8), rgba(139, 0, 0, 0))',
                        animation: `bloodDrip ${drip.duration}s ease-in ${drip.delay}s forwards`,
                        borderRadius: '0 0 2px 2px'
                    }}
                />
            ))}
            <style>{`
                @keyframes bloodDrip {
                    0% {
                        height: 0;
                        opacity: 1;
                    }
                    50% {
                        height: 150px;
                        opacity: 0.8;
                    }
                    100% {
                        height: 200px;
                        opacity: 0;
                    }
                }
            `}</style>
        </>
    );
}
