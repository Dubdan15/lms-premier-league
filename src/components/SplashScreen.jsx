import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
    const [phase, setPhase] = useState('entering'); // entering, visible, leaving

    useEffect(() => {
        const showTimer = setTimeout(() => {
            setPhase('visible');
        }, 100);

        const leaveTimer = setTimeout(() => {
            setPhase('leaving');
        }, 3000);

        const completeTimer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 3600);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(leaveTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#38003c', // Deep Purple
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            opacity: phase === 'leaving' ? 0 : 1,
            transition: 'opacity 0.6s ease-in-out',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Dramatic Stadium Background Lights */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '120%',
                height: '40%',
                background: 'radial-gradient(circle, rgba(144, 0, 255, 0.4) 0%, rgba(56, 0, 60, 0) 70%)',
                filter: 'blur(40px)',
                zIndex: 1
            }} />

            {/* Content Container */}
            <div style={{
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transform: phase === 'entering' ? 'scale(0.9) translateY(20px)' : 'scale(1) translateY(0)',
                opacity: phase === 'visible' || phase === 'leaving' ? 1 : 0,
                transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>

                {/* Custom Lion Emblem (SVG) */}
                <div style={{ marginBottom: '2rem', filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.2))' }}>
                    <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 5L58.5 18H41.5L50 5Z" fill="white" /> {/* Top Crown Jewel */}
                        <path d="M35 15L42 22H58L65 15L60 25H40L35 15Z" fill="white" /> {/* Crown Base */}
                        {/* Majestic Mane */}
                        <path d="M50 25C30 25 15 40 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 40 70 25 50 25ZM50 85C35 85 25 75 25 60C25 45 35 35 50 35C65 35 75 45 75 60C75 75 65 85 50 85Z" fill="white" fillOpacity="0.8" />
                        {/* Lion Face / Body simplified */}
                        <path d="M50 40C42 40 38 45 38 52C38 60 42 65 50 65C58 65 62 60 62 52C62 45 58 40 50 40Z" fill="white" />
                        <path d="M45 52H55" stroke="#38003C" strokeWidth="2" strokeLinecap="round" /> {/* Mouth line */}
                        <circle cx="44" cy="48" r="1.5" fill="#38003C" /> {/* Eye */}
                        <circle cx="56" cy="48" r="1.5" fill="#38003C" /> {/* Eye */}
                    </svg>
                </div>

                {/* Title */}
                <h1 style={{
                    color: '#00ff85', // Lime Green
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    textShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}>
                    Last Man Standing
                </h1>

                <h2 style={{
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '400',
                    margin: '0.5rem 0 0 0',
                    opacity: 0.8,
                    letterSpacing: '4px',
                    textTransform: 'uppercase'
                }}>
                    Football Killer
                </h2>
            </div>

            {/* Bottom Grass & Football */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '15%',
                background: 'linear-gradient(to top, #004d00 0%, transparent 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '2rem',
                zIndex: 3
            }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'white',
                        borderRadius: '50%',
                        position: 'relative',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
                        overflow: 'hidden',
                        border: '2px solid #ddd'
                    }}>
                        {/* Football Pattern */}
                        <div style={{ position: 'absolute', top: '10%', left: '40%', width: '20%', height: '20%', background: 'black', clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />
                        <div style={{ position: 'absolute', top: '60%', left: '10%', width: '20%', height: '20%', background: 'black', clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />
                        <div style={{ position: 'absolute', top: '60%', left: '70%', width: '20%', height: '20%', background: 'black', clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />
                    </div>

                    {/* Green Tick */}
                    <div style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#00ff85',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 10px rgba(0, 255, 133, 0.5)'
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Stadium Lights (Flares) */}
            <div style={{
                position: 'absolute',
                top: '5%',
                left: '10%',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(200, 100, 255, 0.6) 0%, transparent 70%)',
                filter: 'blur(20px)',
                zIndex: 1
            }} />
            <div style={{
                position: 'absolute',
                top: '5%',
                right: '10%',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(200, 100, 255, 0.6) 0%, transparent 70%)',
                filter: 'blur(20px)',
                zIndex: 1
            }} />
        </div>
    );
}
