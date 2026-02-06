export const teams = [
  { id: 1, name: "Arsenal", short_name: "ARS", color: "#EF0107", record: "12-4-2", wins: 12, draws: 4, losses: 2, form: ["W", "W", "D", "W", "L"] },
  { id: 2, name: "Aston Villa", short_name: "AVL", color: "#670E36", record: "11-3-4", wins: 11, draws: 3, losses: 4, form: ["L", "W", "W", "D", "W"] },
  { id: 3, name: "Bournemouth", short_name: "BOU", color: "#DA291C", record: "7-4-7", wins: 7, draws: 4, losses: 7, form: ["W", "L", "D", "L", "W"] },
  { id: 4, name: "Brentford", short_name: "BRE", color: "#E30613", record: "5-4-9", wins: 5, draws: 4, losses: 9, form: ["D", "L", "L", "W", "D"] },
  { id: 5, name: "Brighton", short_name: "BHA", color: "#0057B8", record: "8-7-3", wins: 8, draws: 7, losses: 3, form: ["W", "D", "W", "L", "L"] },
  { id: 6, name: "Chelsea", short_name: "CHE", color: "#034694", record: "8-4-6", wins: 8, draws: 4, losses: 6, form: ["W", "W", "L", "D", "W"] },
  { id: 7, name: "Crystal Palace", short_name: "CRY", color: "#1B458F", record: "5-6-7", wins: 5, draws: 6, losses: 7, form: ["D", "D", "L", "W", "L"] },
  { id: 8, name: "Everton", short_name: "EVE", color: "#003399", record: "8-2-8", wins: 8, draws: 2, losses: 8, form: ["L", "L", "W", "D", "D"] },
  { id: 9, name: "Fulham", short_name: "FUL", color: "#FFFFFF", record: "7-3-8", wins: 7, draws: 3, losses: 8, form: ["D", "W", "L", "L", "W"] },
  { id: 10, name: "Burnley", short_name: "BUR", color: "#6C1D45", record: "3-2-13", wins: 3, draws: 2, losses: 13, form: ["W", "D", "L", "W", "W"] },
  { id: 11, name: "Leeds United", short_name: "LEE", color: "#FFCD00", record: "4-4-10", wins: 4, draws: 4, losses: 10, form: ["L", "L", "W", "D", "W"] },
  { id: 12, name: "Liverpool", short_name: "LIV", color: "#C8102E", record: "13-6-1", wins: 13, draws: 6, losses: 1, form: ["W", "W", "W", "D", "W"] },
  { id: 13, name: "Man City", short_name: "MCI", color: "#6CABDD", record: "12-4-3", wins: 12, draws: 4, losses: 3, form: ["W", "W", "W", "W", "D"] },
  { id: 14, name: "Man Utd", short_name: "MUN", color: "#DA291C", record: "10-1-8", wins: 10, draws: 1, losses: 8, form: ["L", "W", "D", "W", "L"] },
  { id: 15, name: "Newcastle", short_name: "NEW", color: "#241F20", record: "9-2-8", wins: 9, draws: 2, losses: 8, form: ["D", "W", "L", "W", "W"] },
  { id: 16, name: "Nott'm Forest", short_name: "NFO", color: "#DD0000", record: "5-5-9", wins: 5, draws: 5, losses: 9, form: ["W", "L", "D", "L", "D"] },
  { id: 17, name: "Sunderland", short_name: "SUN", color: "#FF0000", record: "4-3-11", wins: 4, draws: 3, losses: 11, form: ["W", "W", "D", "L", "W"] },
  { id: 18, name: "Tottenham", short_name: "TOT", color: "#132257", record: "11-3-5", wins: 11, draws: 3, losses: 5, form: ["W", "L", "W", "D", "W"] },
  { id: 19, name: "West Ham", short_name: "WHU", color: "#7A263A", record: "10-4-5", wins: 10, draws: 4, losses: 5, form: ["L", "D", "W", "L", "W"] },
  { id: 20, name: "Wolves", short_name: "WOL", color: "#FDB913", record: "8-4-7", wins: 8, draws: 4, losses: 7, form: ["D", "L", "L", "L", "L"] }
];

export const getTeam = (id) => teams.find(t => t.id === id);
