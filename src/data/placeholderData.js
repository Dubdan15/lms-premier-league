// Master list of 20 Premier League teams with realistic seasonal stats and form
export const TEAMS = [
    { id: 1, name: "Arsenal", short_name: "ARS", color: "#EF0107", wins: 12, draws: 4, losses: 2, form: ["W", "W", "D", "W", "L"] },
    { id: 2, name: "Aston Villa", short_name: "AVL", color: "#670E36", wins: 11, draws: 3, losses: 4, form: ["L", "W", "W", "D", "W"] },
    { id: 3, name: "Bournemouth", short_name: "BOU", color: "#DA291C", wins: 7, draws: 4, losses: 7, form: ["W", "L", "D", "L", "W"] },
    { id: 4, name: "Brentford", short_name: "BRE", color: "#E30613", wins: 5, draws: 4, losses: 9, form: ["D", "L", "L", "W", "D"] },
    { id: 5, name: "Brighton", short_name: "BHA", color: "#0057B8", wins: 8, draws: 7, losses: 3, form: ["W", "D", "W", "L", "L"] },
    { id: 6, name: "Chelsea", short_name: "CHE", color: "#034694", wins: 8, draws: 4, losses: 6, form: ["W", "W", "L", "D", "W"] },
    { id: 7, name: "Crystal Palace", short_name: "CRY", color: "#1B458F", wins: 5, draws: 6, losses: 7, form: ["D", "D", "L", "W", "L"] },
    { id: 8, name: "Everton", short_name: "EVE", color: "#003399", wins: 8, draws: 2, losses: 8, form: ["L", "L", "W", "D", "D"] },
    { id: 9, name: "Fulham", short_name: "FUL", color: "#FFFFFF", wins: 7, draws: 3, losses: 8, form: ["D", "W", "L", "L", "W"] },
    { id: 10, name: "Ipswich Town", short_name: "IPS", color: "#005aab", wins: 3, draws: 2, losses: 13, form: ["W", "D", "L", "W", "W"] },
    { id: 11, name: "Leicester City", short_name: "LEI", color: "#003090", wins: 6, draws: 4, losses: 10, form: ["L", "L", "W", "D", "W"] },
    { id: 12, name: "Liverpool", short_name: "LIV", color: "#C8102E", wins: 13, draws: 6, losses: 1, form: ["W", "W", "W", "D", "W"] },
    { id: 13, name: "Man City", short_name: "MCI", color: "#6CABDD", wins: 12, draws: 4, losses: 3, form: ["W", "W", "W", "W", "D"] },
    { id: 14, name: "Man Utd", short_name: "MUN", color: "#DA291C", wins: 10, draws: 1, losses: 8, form: ["L", "W", "D", "W", "L"] },
    { id: 15, name: "Newcastle", short_name: "NEW", color: "#241F20", wins: 9, draws: 2, losses: 8, form: ["D", "W", "L", "W", "W"] },
    { id: 16, name: "Nott'm Forest", short_name: "NFO", color: "#DD0000", wins: 5, draws: 5, losses: 9, form: ["W", "L", "D", "L", "D"] },
    { id: 17, name: "Southampton", short_name: "SOU", color: "#D71920", wins: 4, draws: 3, losses: 11, form: ["W", "W", "D", "L", "W"] },
    { id: 18, name: "Tottenham", short_name: "TOT", color: "#132257", wins: 11, draws: 3, losses: 5, form: ["W", "L", "W", "D", "W"] },
    { id: 19, name: "West Ham", short_name: "WHU", color: "#7A263A", wins: 10, draws: 4, losses: 5, form: ["L", "D", "W", "L", "W"] },
    { id: 20, name: "Wolves", short_name: "WOL", color: "#FDB913", wins: 8, draws: 4, losses: 7, form: ["D", "L", "L", "L", "L"] }
];

export const getTeam = (id) => TEAMS.find(t => t.id === id);
export const getTeamByName = (name) => TEAMS.find(t => t.name === name || t.short_name === name);
