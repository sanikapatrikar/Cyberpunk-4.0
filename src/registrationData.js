// EDIT THIS FILE when your event names, allowed team sizes or prices change.

export const EVENT_DATABASE = {
  HEIST: {
    name: "Hacker's Heist",
    icon: "🔐",
    shortDescription: "Break the vault. Crack the grid.",
  },
  DETECTYX: {
    name: "DetectYx",
    icon: "🕵️",
    shortDescription: "Trace the signal. Expose the truth.",
  },
  WEB3: {
    name: "Web3 Hackathon",
    icon: "🌐",
    shortDescription: "Build the next decentralized operation.",
  },
  NGV: {
    name: "Nagpur's Got Violent",
    icon: "🎭",
    shortDescription: "Tactical battle. Speed. Strategy. Teamwork.",
  },
};

export const TEAM_SIZE_DATABASE = {
  SOLO: {
    label: "SOLO",
    count: 1,
    amount: 80,
    upi: "upi://pay?pa=YOUR_UPI_ID&pn=CYBERPUNK&am=80&cu=INR",
  },
  DUO: {
    label: "DUO",
    count: 2,
    amount: 140,
    upi: "upi://pay?pa=YOUR_UPI_ID&pn=CYBERPUNK&am=140&cu=INR",
  },
  TRIO: {
    label: "TRIO",
    count: 3,
    amount: 210,
    upi: "upi://pay?pa=YOUR_UPI_ID&pn=CYBERPUNK&am=210&cu=INR",
  },
  SQUAD: {
    label: "SQUAD",
    count: 4,
    amount: 280,
    upi: "upi://pay?pa=YOUR_UPI_ID&pn=CYBERPUNK&am=280&cu=INR",
  },
 
};

export const BRANCH_OPTIONS = [
  "CSE [CS]",
  "CE",
  "IT",
  "AI ",
  "Data Science",
  "IoT",
  "Mechanical",
  "Civil",
  "ETC",
  "Electrical",
  "Robotics & AI",
  "CSBS",
  "B.Voc",
];

export const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  
];

export function getTeamSizeConfig(key) {
  return TEAM_SIZE_DATABASE[key] || null;
}
