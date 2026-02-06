import React, { useEffect, useState } from 'react';

export default function WelcomeSplash({ onComplete }) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Stay visible for 3 seconds, then trigger fade out
        const timer = setTimeout(() => {
            setIsExiting(true);
        }, 3000);

        // Completion callback after fade finishes
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 3600);

        return () => {
            clearTimeout(timer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div style={{
            ...containerStyle,
            opacity: isExiting ? 0 : 1,
            transition: 'opacity 0.6s ease-in-out',
        }}>
            {/* Distant Stadium Floodlights (Soft Glows) */}
            <div style={topGlowLeft} />
            <div style={topGlowRight} />

            {/* Minimalist Centered Typography */}
            <div style={contentStyle} className="pulse-text">
                <h1 style={titleStyle}>LAST MAN STANDING</h1>
                <p style={subtitleStyle}>FOOTBALL KILLER</p>
            </div>

            {/* Clean Curved Horizon */}
            <div style={footerStyle}>
                <div style={pitchArch} />
            </div>

            <style>{`
                @keyframes pulseClassic {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
                .pulse-text {
                    animation: pulseClassic 3s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
}

const containerStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 10000,
    background: '#1a0033',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
};

const topGlowLeft = {
    position: 'absolute',
    top: '-20%', left: '10%',
    width: '40%', height: '40%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
    filter: 'blur(50px)',
    pointerEvents: 'none'
};

const topGlowRight = {
    position: 'absolute',
    top: '-20%', right: '10%',
    width: '40%', height: '40%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
    filter: 'blur(50px)',
    pointerEvents: 'none'
};

const contentStyle = {
    textAlign: 'center',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

const titleStyle = {
    fontSize: '5rem',
    fontWeight: '900',
    color: '#32CD32', // Lime Green
    margin: 0,
    fontFamily: "'Inter', 'Impact', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '-2px',
    lineHeight: 1,
    textShadow: '0 4px 15px rgba(0,0,0,0.5)'
};

const subtitleStyle = {
    fontSize: '1.4rem',
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: '0.5rem',
    margin: '15px 0 0',
    textTransform: 'uppercase',
    opacity: 0.9,
    paddingLeft: '0.5rem'
};

const footerStyle = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 10
};

const pitchArch = {
    width: '140%',
    height: '100px',
    background: 'linear-gradient(to top, #001a00, #004d00)',
    clipPath: 'ellipse(50% 100% at 50% 100%)',
    opacity: 0.8,
    boxShadow: '0 -10px 50px rgba(0,0,0,0.3)'
};
