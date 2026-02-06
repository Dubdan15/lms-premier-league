import React, { createContext, useState, useContext, useEffect } from 'react';
import { TEAMS, getTeam } from '../data/data';
import { supabase } from '../supabaseClient';

const GameContext = createContext();

export { TEAMS, getTeam };

export function GameProvider({ children }) {
    // Basic Persistence
    const [nickname, setNickname] = useState(() => localStorage.getItem('userNickname') || '');

    // Multi-League State
    const [leagues, setLeagues] = useState(() => {
        const saved = localStorage.getItem('leagues');
        if (saved) return JSON.parse(saved);
        return [];
    });
    const [activeLeagueId, setActiveLeagueId] = useState(() => localStorage.getItem('activeLeagueId') || '');

    // Current League Details (Live)
    const [livePlayers, setLivePlayers] = useState([]);

    // Bot legacy - keep for singleton mode if needed, but we'll focus on live
    const [bots, setBots] = useState([]);

    // Shared App State
    const [currentGameweek, setCurrentGameweek] = useState(() => parseInt(localStorage.getItem('currentGameweek')) || 21);
    const [isGuest, setIsGuest] = useState(() => localStorage.getItem('isGuest') === 'true');
    const [isAutoWheelForced, setIsAutoWheelForced] = useState(() => localStorage.getItem('isAutoWheelForced') === 'true');

    const [notification, setNotification] = useState(null);
    const [fixtures, setFixtures] = useState([]);
    const [outcomeEffect, setOutcomeEffect] = useState(null); // 'win' or 'loss'
    const [isSyncing, setIsSyncing] = useState(false);

    // Calculate next deadline (next Saturday at 12:30 PM)
    const calculateNextDeadline = () => {
        const now = new Date();
        const nextSaturday = new Date(now);

        // Find next Saturday (day 6)
        const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7;
        nextSaturday.setDate(now.getDate() + daysUntilSaturday);
        nextSaturday.setHours(12, 30, 0, 0);

        return nextSaturday;
    };

    const nextDeadline = calculateNextDeadline();


    // Derived Time Logic
    const FIRST_GAME_TIME = new Date("2026-01-19T19:12:00Z");
    const currentTime = new Date();
    const isAutoWheelWindow = (FIRST_GAME_TIME - currentTime) > 0 && (FIRST_GAME_TIME - currentTime) <= 3600000;

    // Get Active League Data
    const activeLeague = leagues.find(l => l.id === activeLeagueId) || leagues[0] || { state: { isAlive: true, usedTeams: [], lastResult: null, lives: 3, currentPick: null } };
    const leagueState = activeLeague?.state || { isAlive: true, usedTeams: [], lastResult: null, lives: 3, currentPick: null };
    const { isAlive, usedTeams, lastResult, lives, currentPick } = leagueState;

    // Persist to LocalStorage on changes
    useEffect(() => {
        localStorage.setItem('leagues', JSON.stringify(leagues));
        localStorage.setItem('activeLeagueId', activeLeagueId);
        localStorage.setItem('currentGameweek', currentGameweek.toString());
        localStorage.setItem('isGuest', isGuest.toString());
        localStorage.setItem('isAutoWheelForced', isAutoWheelForced.toString());
        localStorage.setItem('gameBots', JSON.stringify(bots));
    }, [leagues, activeLeagueId, currentGameweek, isGuest, isAutoWheelForced, bots]);

    // Generate Fixtures
    useEffect(() => {
        const mock = [
            { id: 1, home_team: "Man City", away_team: "Tottenham", kickoff_time: "2026-01-19T19:30:00Z" },
            { id: 2, home_team: "Arsenal", away_team: "Man Utd", kickoff_time: "2026-01-19T19:30:00Z" },
            { id: 3, home_team: "Liverpool", away_team: "Chelsea", kickoff_time: "2026-01-19T19:30:00Z" },
            { id: 4, home_team: "Aston Villa", away_team: "Newcastle", kickoff_time: "2026-01-19T19:30:00Z" },
            { id: 5, home_team: "Fulham", away_team: "Brighton", kickoff_time: "2026-01-19T19:30:00Z" }
        ];
        setFixtures(mock);
    }, [currentGameweek]);

    const fetchLeagueData = async () => {
        if (!activeLeagueId || !leagues.length) return;
        const league = leagues.find(l => l.id === activeLeagueId);
        if (!league || !league.code || league.code === 'DUMMY') return;

        try {
            const { data, error } = await supabase
                .from('players')
                .select('*')
                .eq('league_code', league.code); // Lowercase column

            if (error) {
                console.error('Supabase Error (fetch):', error);
            }

            if (data) {
                setLivePlayers(data.map(p => ({
                    id: p.id,
                    name: p.nickname, // Lowercase column
                    status: p.status, // Lowercase column
                    currentPick: p.selected_team_id ? { id: p.selected_team_id, short_name: getTeam(p.selected_team_id)?.short_name } : null, // Updated column
                    history: JSON.parse(p.journey || '[]'), // Lowercase column
                    isMe: p.nickname === nickname
                })));
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    // Poll for updates (Realtime placeholder)
    useEffect(() => {
        const interval = setInterval(fetchLeagueData, 5000);
        return () => clearInterval(interval);
    }, [activeLeagueId]);

    const syncPlayerState = async (updates) => {
        if (!nickname || !activeLeagueId) return;
        const league = leagues.find(l => l.id === activeLeagueId);
        if (!league) return;

        setIsSyncing(true);
        // NOTE: Row Level Security (RLS) must be disabled or have correct policies for these to work
        try {
            const { error } = await supabase
                .from('players')
                .update({
                    selected_team_id: updates.currentPick?.id || null, // Updated column
                    status: updates.isAlive === false ? 'ELIMINATED' : 'ALIVE',
                    journey: updates.usedTeams ? JSON.stringify(updates.usedTeams) : undefined
                })
                .match({ nickname: nickname, league_code: league.code }); // Lowercase search

            if (error) console.error('Supabase Error (sync):', error);
        } catch (err) {
            console.error("Supabase Connection Error (sync):", err);
        } finally {
            setIsSyncing(false);
        }
    };

    const leagueMembers = livePlayers.length > 0 ? livePlayers : [];

    const makePick = async (teamId) => {
        if (!isAlive || usedTeams.includes(teamId)) return false;
        const team = getTeam(teamId);
        if (team) {
            const updates = { currentPick: { id: team.id, name: team.name } };
            // Update local first for snappy UI
            setLeagues(prev => prev.map(l =>
                l.id === activeLeagueId
                    ? { ...l, state: { ...l.state, ...updates } }
                    : l
            ));

            // Sync to database and WAIT
            await syncPlayerState(updates);

            setIsAutoWheelForced(false);
            return true;
        }
        return false;
    };

    // Helper to update active league state
    const updateLeagueState = (updates) => {
        setLeagues(prev => prev.map(l =>
            l.id === activeLeagueId
                ? { ...l, state: { ...l.state, ...updates } }
                : l
        ));
        syncPlayerState(updates);
    };

    // Automated Result Engine
    const checkMatchResult = (teamId, result = 'Win') => {
        const team = getTeam(teamId);
        if (!team) return;

        if (result === 'Win') {
            // IMMEDATE: Set result for overlay display (fixes crest delay)
            updateLeagueState({
                lastResult: {
                    team: team.name,
                    result: 'Won',
                    score: '2-0', // Mock score
                    message: `You picked ${team.name}. They won 2-0. You survived!`
                }
            });

            // After 3 seconds: Trigger overlay effect (handled in App.jsx)
            setOutcomeEffect('win');
        } else {
            // Trigger loss/draw effect
            setOutcomeEffect('loss');

            // Hardcore Mode: Instant Elimination
            setTimeout(() => {
                const resultText = result === 'Draw' ? 'drew' : 'lost';
                const score = result === 'Draw' ? '1-1' : '0-2';

                updateLeagueState({
                    isAlive: false,
                    lives: Math.max(0, lives - 1),
                    lastResult: {
                        team: team.name,
                        result: result === 'Draw' ? 'Drew' : 'Lost',
                        score: score,
                        message: `You picked ${team.name}. They ${resultText} ${score}. You were eliminated!`
                    }
                });
                setOutcomeEffect(null);
            }, 3000);
        }
    };

    // MANUAL PROGRESSION: User clicks "Next Round"
    const advanceToNextRound = () => {
        if (!currentPick) return;

        updateLeagueState({
            usedTeams: [...new Set([...usedTeams, currentPick.id])],
            currentPick: null
        });
        setCurrentGameweek(prev => prev + 1);
        setOutcomeEffect(null);
    };

    const resetLeague = async () => {
        if (!activeLeagueId) return;
        const league = leagues.find(l => l.id === activeLeagueId);
        if (!league) return;

        try {
            // Reset all players in this league in Supabase
            const { error } = await supabase
                .from('players')
                .update({
                    status: 'ALIVE',
                    journey: '[]',
                    selected_team_id: null
                })
                .eq('league_code', league.code);

            if (error) {
                setNotification({ type: 'error', message: "Failed to reset season" });
            } else {
                // Reset local state for the active league
                updateLeagueState({
                    isAlive: true,
                    lives: 3,
                    usedTeams: [],
                    lastResult: null,
                    currentPick: null
                });
                setNotification({ type: 'success', message: "Season Reset! Good luck." });
            }
        } catch (err) {
            console.error("Supabase Connection Error (reset):", err);
            setNotification({ type: 'error', message: "Database connection failed" });
        }
    };

    // Legacy evaluateGameweek for backward compatibility
    const evaluateGameweek = (result = 'Win') => {
        if (currentPick) {
            checkMatchResult(currentPick.id, result);
        }
    };

    const clearNotification = () => setNotification(null);

    return (
        <GameContext.Provider value={{
            currentGameweek, isAlive, lives, usedTeams, isGuest, activeLeague, leagueMembers,
            leagues, activeLeagueId, selectLeague: setActiveLeagueId,
            createLeague: async (name) => {
                const code = Math.random().toString(36).substring(2, 8).toUpperCase();

                // NOTE: RLS must be disabled for public inserts
                try {
                    // 1. Create in Supabase
                    const { error: lError } = await supabase.from('leagues').insert({ name: name, code: code, created_by: nickname });
                    if (lError) {
                        console.error('Supabase Error (createLeague):', lError);
                        return setNotification({ type: 'error', message: "Failed to create league" });
                    }

                    // 2. Add player to league
                    const { error: pError } = await supabase.from('players').insert({ nickname: nickname, league_code: code, status: 'ALIVE', journey: '[]' });
                    if (pError) console.error('Supabase Error (joinAfterCreate):', pError);

                    const newLeague = {
                        id: Date.now().toString(),
                        name,
                        code,
                        state: { isAlive: true, usedTeams: [], lastResult: null, lives: 3, currentPick: null }
                    };
                    setLeagues(prev => [...prev, newLeague]);
                    setActiveLeagueId(newLeague.id);
                } catch (err) {
                    console.error("Supabase Create Error:", err);
                    setNotification({ type: 'error', message: "Database connection failed" });
                }
            },
            joinLeague: async (code) => {
                try {
                    // 1. Check if league exists
                    const { data, error: lError } = await supabase.from('leagues').select('*').eq('code', code.toUpperCase()).single();

                    if (!data || lError) {
                        if (lError) console.error('Supabase Error (joinLeagueCheck):', lError);
                        return setNotification({ type: 'error', message: "League not found! Check the code." });
                    }

                    // 2. Check if already in league
                    const { data: existingPlayer } = await supabase.from('players').select('*').match({ nickname: nickname, league_code: code.toUpperCase() }).single();

                    if (!existingPlayer) {
                        await supabase.from('players').insert({ nickname: nickname, league_code: code.toUpperCase(), status: 'ALIVE', journey: '[]' });
                    }

                    const newLeague = {
                        id: Date.now().toString(),
                        name: data.Name,
                        code: code.toUpperCase(),
                        state: { isAlive: true, usedTeams: [], lastResult: null, lives: 3, currentPick: null }
                    };
                    setLeagues(prev => [...prev, newLeague]);
                    setActiveLeagueId(newLeague.id);
                } catch (err) {
                    console.error("Supabase Join Error:", err);
                    setNotification({ type: 'error', message: "Database connection failed" });
                }
            },
            notification, setNotification, clearNotification,
            fixtures, makePick, evaluateGameweek, checkMatchResult, advanceToNextRound, resetLeague,
            isAutoWheelWindow, isAutoWheelForced, nickname, isSyncing,
            outcomeEffect, lastResult, nextDeadline,
            forceWheelMode: () => setIsAutoWheelForced(true),
            revivePlayer: () => {
                updateLeagueState({
                    isAlive: true,
                    lives: 3,
                    usedTeams: [],
                    lastResult: null,
                    currentPick: null
                });
            },
            enterAsGuest: () => {
                setIsGuest(true);
                window.location.href = '/fixtures';
            }
        }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGame = () => useContext(GameContext);
