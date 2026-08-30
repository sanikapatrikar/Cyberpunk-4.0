// EDIT THIS FILE when your event names, allowed team sizes, prices, or WhatsApp groups change.

export const EVENT_DATABASE = {
  HEIST: {
    name: "Hacker's Heist",
    iconKey: "HEIST",
    price: 150,
    shortDescription: "Break the vault. Crack the grid.",
    whatsapp: "https://chat.whatsapp.com/JK7PSA0NostIXx6hekCII9",
  },
  DETECTYX: {
    name: "DetectYx",
    iconKey: "DETECTYX",
    price: 140,
    shortDescription: "Trace the signal. Expose the truth.",
    whatsapp: "https://chat.whatsapp.com/HT91rCKRnnV7sO3T8qrWa3",
  },
  WEB3: {
    name: "Web3 Hackathon",
    iconKey: "WEB3",
    price: 250,
    shortDescription: "Build the next decentralized operation.",
    whatsapp: "https://chat.whatsapp.com/Hn0Y56aM9kCKGey496ymTL",
  },
  NGV: {
    name: "Campus Rush",
    iconKey: "NGV",
    price: 150,
    shortDescription: "Tactical battle. Speed. Strategy. Teamwork.",
    whatsapp: "https://chat.whatsapp.com/BorHgehQ5tx2yOei5WAGvt",
  },
};

export const TEAM_SIZE_DATABASE = {
  SOLO: {
    label: "SOLO",
    count: 1,
    description: "1 operative",
  },
  DUO: {
    label: "DUO",
    count: 2,
    description: "2 operatives",
  },
  TRIO: {
    label: "TRIO",
    count: 3,
    description: "3 operatives",
  },
  SQUAD: {
    label: "SQUAD",
    count: 4,
    description: "4 operatives",
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

export function getEventConfig(key) {
  return EVENT_DATABASE[key] || null;
}

export function getEventPrice(eventKey) {
  return EVENT_DATABASE[eventKey]?.price ?? 150;
}

export function getEventWhatsAppLink(eventKey) {
  return EVENT_DATABASE[eventKey]?.whatsapp || "https://chat.whatsapp.com/JK7PSA0NostIXx6hekCII9";
}

export function getPaymentUpi(amount) {
  return `upi://pay?pa=9981108875@ptyes&pn=CYBERPUNK&am=${amount}&cu=INR`;
}
