import fixturesData from './fixtures.json';

// Export fixtures data
export const mockFixtures = {
    gameweek21: fixturesData.matches.map(match => ({
        ...match,
        gameweek: fixturesData.gameweek
    }))
};

// Helper to check if a team has kicked off
export function hasMatchKickedOff(teamName, fixtures) {
    const now = new Date();
    const teamFixture = fixtures.find(
        f => f.home_team === teamName || f.away_team === teamName
    );

    if (!teamFixture) return false;

    const kickoffTime = new Date(teamFixture.kickoff_time);
    return now >= kickoffTime;
}

// Helper to get all teams playing in a gameweek
export function getTeamsInGameweek(gameweek, fixtures) {
    const teams = new Set();
    fixtures
        .filter(f => f.gameweek === gameweek)
        .forEach(f => {
            teams.add(f.home_team);
            teams.add(f.away_team);
        });
    return Array.from(teams);
}

// Helper to format kickoff time
export function formatKickoffTime(kickoffTime) {
    const date = new Date(kickoffTime);
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleString('en-GB', options);
}
