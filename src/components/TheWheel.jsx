import React, { useState, useEffect, useRef } from 'react';
import { useGame, TEAMS } from '../context/GameContext';

export default function TheWheel({ isAutoLock = false }) {
    const { fixtures, currentGameweek, makePick, setIsLatePick, isAlive, usedTeams } = useGame();
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [rotation, setRotation] = useState(0);

    // Filter out teams that have already been used in previous winning weeks
    const availableTeams = TEAMS.filter(t => !usedTeams.includes(t.id)).map(t => {
        if (t.short_name === 'FUL') return { ...t, color: '#FFFFFF' };
        return t;
    });

    const totalTeams = availableTeams.length;
    const sliceAngle = 360 / totalTeams;

    const handleSpin = () => {
        if (spinning || result || !isAlive || totalTeams === 0) return;
        setSpinning(true);

        const randomActiveTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
        const targetIndex = availableTeams.indexOf(randomActiveTeam);
        const sliceCenter = (targetIndex * sliceAngle) + (sliceAngle / 2);
        const targetRotation = (360 * 5) + (270 - sliceCenter);

        setRotation(prev => {
            const base = Math.ceil(prev / 360) * 360;
            return base + targetRotation;
        });

        setTimeout(async () => {
            setSpinning(false);
            setResult(randomActiveTeam);

            // Auto-Confirm in Lockout Mode
            await makePick(randomActiveTeam.id);

            setTimeout(() => {
                if (setIsLatePick) setIsLatePick(false);
                window.location.href = '/dashboard';
            }, 3000);
        }, 4000);
    };

    const getPathData = (index) => {
        const radius = 180;
        const centerX = 200;
        const centerY = 200;
        const startRad = (index * sliceAngle * Math.PI) / 180;
        const endRad = ((index + 1) * sliceAngle * Math.PI) / 180;
        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);
        return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
    };

    return (
        <div style={containerStyle}>
            <div style={overlayStyle}>
                {!isAlive ? (
                    <div style={{ textAlign: 'center', color: 'white' }}>
                        <h1 style={{ color: '#FF4D4D', fontSize: '2.5rem', fontWeight: '900' }}>GAME OVER</h1>
                        <p style={{ opacity: 0.8, maxWidth: '300px', margin: '1rem auto' }}>
                            You have been killed. The wheel no longer turns for you.
                        </p>
                        <button onClick={() => window.location.href = '/dashboard'} style={spinButtonStyle}>BACK TO DASHBOARD</button>
                    </div>
                ) : totalTeams === 0 ? (
                    <div style={{ textAlign: 'center', color: 'white' }}>
                        <h1 style={{ color: '#FFD700', fontSize: '2.5rem', fontWeight: '900' }}>ULTIMATE WINNER</h1>
                        <p style={{ opacity: 0.8, maxWidth: '300px', margin: '1rem auto' }}>
                            You have used every single team and survived. You are the champion!
                        </p>
                        <button onClick={() => window.location.href = '/dashboard'} style={spinButtonStyle}>BACK TO DASHBOARD</button>
                    </div>
                ) : (
                    <>
                        <h1 style={titleStyle}>{isAutoLock ? "🚨 AUTO-WHEEL LOCKOUT! 🚨" : "🚨 DEADLINE MISSED! 🚨"}</h1>
                        <p style={{ color: 'white', opacity: 0.8, marginBottom: '2rem', textAlign: 'center', maxWidth: '300px' }}>
                            {isAutoLock
                                ? "It's within 1 hour of kickoff. You must spin the wheel to select your team!"
                                : "The randomizer is taking over your pick!"}
                        </p>

                        <div style={wheelContainerStyle}>
                            <div style={tickPointerStyle} className={spinning ? 'ticking' : ''} />
                            <div style={{ width: '100%', height: '100%', transition: spinning ? 'transform 4s cubic-bezier(0.15, 0, 0.2, 1)' : 'none', transform: `rotate(${rotation}deg)` }}>
                                <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }}>
                                    <defs>
                                        {availableTeams && availableTeams.length > 0 && availableTeams.map((team, i) => (
                                            <path key={`path-${team.id}`} id={`labelPath-${i}`} d={(() => {
                                                const r = 130;
                                                const startRad = (i * sliceAngle * Math.PI) / 180;
                                                const endRad = ((i + 1) * sliceAngle * Math.PI) / 180;
                                                const x1 = 200 + r * Math.cos(startRad);
                                                const y1 = 200 + r * Math.sin(startRad);
                                                const x2 = 200 + r * Math.cos(endRad);
                                                const y2 = 200 + r * Math.sin(endRad);
                                                return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
                                            })()} />
                                        ))}
                                    </defs>
                                    {availableTeams && availableTeams.length > 0 ? availableTeams.map((team, i) => {
                                        const midAngle = (i * sliceAngle) + (sliceAngle / 2);
                                        const rad = (midAngle * Math.PI) / 180;
                                        // Position image at radius 120
                                        const imgR = 120;
                                        const imgX = 200 + imgR * Math.cos(rad);
                                        const imgY = 200 + imgR * Math.sin(rad);
                                        // Rotate image to point outward
                                        const rot = midAngle + 90;

                                        return (
                                            <g key={team.id}>
                                                <path d={getPathData(i)} fill={team.color} stroke="#1a0026" strokeWidth="1" />

                                                {/* Text Label on Path (Outer) */}
                                                <text
                                                    fill={team.short_name === 'FUL' ? '#000000' : (team.color === '#FFFFFF' ? '#000000' : '#FFFFFF')}
                                                    style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', pointerEvents: 'none' }}
                                                >
                                                    <textPath href={`#labelPath-${i}`} startOffset="50%" textAnchor="middle">{team.short_name}</textPath>
                                                </text>

                                                {/* Team Logo (Inner) */}
                                                <image
                                                    href={team.badge}
                                                    x={imgX - 12}
                                                    y={imgY - 12}
                                                    width="24"
                                                    height="24"
                                                    transform={`rotate(${rot}, ${imgX}, ${imgY})`}
                                                />
                                            </g>
                                        );
                                    }) : null}
                                    <circle cx="200" cy="200" r="45" fill="white" stroke="#FFD700" strokeWidth="4" />
                                </svg>
                            </div>
                        </div>

                        {!result && !spinning && (
                            <button onClick={handleSpin} style={spinButtonStyle}>CLICK TO SPIN</button>
                        )}

                        {result && (
                            <div style={{ textAlign: 'center' }}>
                                <img
                                    src={result.badge}
                                    alt={result.short_name}
                                    style={{
                                        width: '150px',
                                        height: '150px',
                                        objectFit: 'contain',
                                        marginBottom: '1rem',
                                        filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))',
                                        animation: 'pulse 1s infinite'
                                    }}
                                />
                                <div style={resultTeamStyle}>{result.name}</div>
                                <div style={{ color: '#00ff85', fontWeight: 'bold', marginTop: '1rem' }}>✓ PICK AUTO-SAVED</div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <style>{`
                @keyframes pulse { 0% { scale: 1; opacity: 1; } 50% { scale: 1.05; opacity: 0.8; } 100% { scale: 1; opacity: 1; } }
                @keyframes tick { 0% { rotate: -8deg; } 20% { rotate: 15deg; } 100% { rotate: 0deg; } }
                .ticking { animation: tick 0.1s infinite; }
            `}</style>
        </div>
    );
}

const containerStyle = { position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, zIndex: 9999, background: 'radial-gradient(circle, #38003c 0%, #000 100%)' };
const overlayStyle = { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
const titleStyle = { fontSize: '1.5rem', color: '#FFD700', marginBottom: '0.5rem', textAlign: 'center' };
const wheelContainerStyle = { position: 'relative', width: '350px', height: '350px', marginBottom: '2.5rem' };
const tickPointerStyle = { position: 'absolute', top: '-10px', left: '50%', marginLeft: '-15px', width: '30px', height: '40px', backgroundColor: '#00ff85', clipPath: 'polygon(50% 100%, 0 0, 100% 0)', zIndex: 10 };
const spinButtonStyle = { background: '#FFD700', color: '#38003c', padding: '1rem 2rem', fontSize: '1.5rem', fontWeight: '900', borderRadius: '50px', cursor: 'pointer', border: 'none', animation: 'pulse 1.5s infinite' };
const resultTeamStyle = { fontSize: '4rem', fontWeight: '900', color: 'white' };
