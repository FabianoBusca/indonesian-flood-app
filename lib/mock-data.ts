// ============================================================
// Types
// ============================================================

/** Communication channels available in Citeureup Village */
export type CommunicationChannel =
  | "whatsapp"
  | "sms"
  | "mosque_loudspeaker"
  | "door_to_door"

/** Household response status during a flood event */
export type HouseholdStatus =
  | "safe"
  | "evacuating"
  | "needs_help"
  | "no_response"

/** Vulnerability flags for prioritizing assistance */
export type VulnerabilityFlag =
  | "elderly"
  | "disabled"
  | "infant"
  | "pregnant"

/** BPBD alert severity levels (Indonesian standard) */
export type AlertSeverity =
  | "AMAN"      // Safe — no alert
  | "WASPADA"   // Watch — monitor conditions
  | "SIAGA"     // Warning — prepare to evacuate
  | "BAHAYA"    // Danger — evacuate immediately

export interface Household {
  id: string
  headOfFamily: string
  address: string
  memberCount: number
  channels: CommunicationChannel[]
  vulnerabilities: VulnerabilityFlag[]
  phone?: string
  status: HouseholdStatus
  lastResponseTime?: string
}

export interface BPBDAlert {
  id: string
  severity: AlertSeverity
  title: string
  description: string
  affectedArea: string
  predictedFloodLevel: number
  evacuationRecommendation: string
  shelterLocations: string[]
  issuedAt: string
}

// ============================================================
// Mock Households (35 total, ~141 members)
// ============================================================

export const mockHouseholds: Household[] = [
  {
    id: "hh-001",
    headOfFamily: "Budi Santoso",
    address: "Block A No. 3, RT 05",
    memberCount: 4,
    channels: ["whatsapp", "sms"],
    vulnerabilities: [],
    phone: "+62 812-3456-7890",
    status: "no_response",
  },
  {
    id: "hh-002",
    headOfFamily: "Siti Rahayu",
    address: "Block A No. 7, RT 05",
    memberCount: 3,
    channels: ["whatsapp", "sms", "mosque_loudspeaker"],
    vulnerabilities: ["elderly"],
    phone: "+62 813-2345-6789",
    status: "no_response",
  },
  {
    id: "hh-003",
    headOfFamily: "Ahmad Fauzi",
    address: "Gang Melati No. 2, RT 05",
    memberCount: 5,
    channels: ["door_to_door"],
    vulnerabilities: ["disabled", "infant"],
    status: "no_response",
  },
  {
    id: "hh-004",
    headOfFamily: "Dewi Lestari",
    address: "Block A No. 12, RT 05",
    memberCount: 4,
    channels: ["whatsapp", "sms"],
    vulnerabilities: [],
    phone: "+62 812-1111-2222",
    status: "no_response",
  },
  {
    id: "hh-005",
    headOfFamily: "Rudi Hartono",
    address: "Block B No. 1, RT 05",
    memberCount: 6,
    channels: ["whatsapp", "sms"],
    vulnerabilities: ["pregnant"],
    phone: "+62 812-3333-4444",
    status: "no_response",
  },
  {
    id: "hh-006",
    headOfFamily: "Yuni Wulandari",
    address: "Block B No. 4, RT 05",
    memberCount: 3,
    channels: ["whatsapp", "sms"],
    vulnerabilities: [],
    phone: "+62 812-5555-6666",
    status: "no_response",
  },
  {
    id: "hh-007",
    headOfFamily: "Bambang Setiawan",
    address: "Block B No. 9, RT 05",
    memberCount: 5,
    channels: ["whatsapp", "sms"],
    vulnerabilities: [],
    phone: "+62 813-7777-8888",
    status: "no_response",
  },
  {
    id: "hh-008",
    headOfFamily: "Endang Suryani",
    address: "Block B No. 14, RT 05",
    memberCount: 2,
    channels: ["sms", "mosque_loudspeaker"],
    vulnerabilities: ["elderly"],
    phone: "+62 821-1212-3434",
    status: "no_response",
  },
  {
    id: "hh-009",
    headOfFamily: "Slamet Riyadi",
    address: "Block C No. 2, RT 05",
    memberCount: 4,
    channels: ["whatsapp", "sms"],
    vulnerabilities: [],
    phone: "+62 813-9999-0000",
    status: "no_response",
  },
  {
    id: "hh-010",
    headOfFamily: "Tini Marlina",
    address: "Block C No. 6, RT 05",
    memberCount: 3,
    channels: ["whatsapp", "sms"],
    vulnerabilities: ["infant"],
    phone: "+62 812-2323-4545",
    status: "no_response",
  },
  {
    id: "hh-011",
    headOfFamily: "Joko Widodo",
    address: "Block C No. 10, RT 05",
    memberCount: 5,
    channels: ["whatsapp", "sms"],
    vulnerabilities: [],
    phone: "+62 812-4545-6767",
    status: "no_response",
  },
  {
    id: "hh-012",
    headOfFamily: "Ratna Sari",
    address: "Gang Mawar No. 1, RT 05",
    memberCount: 4,
    channels: ["sms"],
    vulnerabilities: [],
    phone: "+62 821-6767-8989",
    status: "no_response",
  },
  {
    id: "hh-013",
    headOfFamily: "Hendra Gunawan",
    address: "Gang Mawar No. 3, RT 05",
    memberCount: 6,
    channels: ["whatsapp", "sms"],
    vulnerabilities: [],
    phone: "+62 813-8989-1010",
    status: "no_response",
  },
  {
    id: "hh-014",
    headOfFamily: "Nining Suhartini",
    address: "Gang Mawar No. 7, RT 05",
    memberCount: 2,
    channels: ["sms", "mosque_loudspeaker"],
    vulnerabilities: ["elderly", "disabled"],
    phone: "+62 821-1010-2121",
    status: "no_response",
  },
  {
    id: "hh-015",
    headOfFamily: "Agus Pramono",
    address: "Gang Melati No. 5, RT 05",
    memberCount: 5,
    channels: ["whatsapp", "sms"],
    vulnerabilities: [],
    phone: "+62 812-3232-4343",
    status: "no_response",
  },
  {
    id: "hh-016",
    headOfFamily: "Lina Komariah",
    address: "Gang Melati No. 8, RT 05",
    memberCount: 4,
    channels: ["sms"],
    vulnerabilities: [],
    phone: "+62 821-5454-6565",
    status: "no_response",
  },
  {
    id: "hh-017",
    headOfFamily: "Pak Cecep",
    address: "Gang Melati No. 11, RT 05",
    memberCount: 1,
    channels: ["mosque_loudspeaker", "door_to_door"],
    vulnerabilities: ["elderly"],
    status: "no_response",
  },
  {
    id: "hh-018",
    headOfFamily: "Iwan Saputra",
    address: "Block A No. 18, RT 05",
    memberCount: 4,
    channels: ["whatsapp", "sms"],
    vulnerabilities: [],
    phone: "+62 813-7676-8787",
    status: "no_response",
  },
  {
    id: "hh-019",
    headOfFamily: "Mbah Karto",
    address: "Gang Mawar No. 12, RT 05",
    memberCount: 2,
    channels: ["door_to_door"],
    vulnerabilities: ["elderly"],
    status: "no_response",
  },
  {
    id: "hh-020",
    headOfFamily: "Rina Pratiwi",
    address: "Block C No. 15, RT 05",
    memberCount: 3,
    channels: ["sms"],
    vulnerabilities: [],
    phone: "+62 821-9898-1212",
    status: "no_response",
  },
  {
    id: "hh-021",
    headOfFamily: "Tri Cahyono",
    address: "Block D No. 2, RT 05",
    memberCount: 5,
    channels: ["whatsapp", "sms"],
    vulnerabilities: [],
    phone: "+62 812-1111-3333",
    status: "no_response",
  },
  {
    id: "hh-022",
    headOfFamily: "Kurnia Sari",
    address: "Block D No. 6, RT 05",
    memberCount: 4,
    channels: ["whatsapp", "sms"],
    vulnerabilities: ["infant"],
    phone: "+62 813-2222-4444",
    status: "no_response",
  },
  {
    id: "hh-023",
    headOfFamily: "Doni Hermawan",
    address: "Block D No. 10, RT 05",
    memberCount: 3,
    channels: ["sms", "mosque_loudspeaker"],
    vulnerabilities: [],
    phone: "+62 821-3333-5555",
    status: "no_response",
  },
  {
    id: "hh-024",
    headOfFamily: "Lis Suryani",
    address: "Gang Melur No. 1, RT 05",
    memberCount: 6,
    channels: ["whatsapp", "sms"],
    vulnerabilities: ["pregnant"],
    phone: "+62 812-4444-6666",
    status: "no_response",
  },
  {
    id: "hh-025",
    headOfFamily: "Hadi Suryanto",
    address: "Gang Melur No. 4, RT 05",
    memberCount: 4,
    channels: ["whatsapp", "sms"],
    vulnerabilities: [],
    phone: "+62 813-5555-7777",
    status: "no_response",
  },
  {
    id: "hh-026",
    headOfFamily: "Pitriyani",
    address: "Gang Melur No. 8, RT 05",
    memberCount: 5,
    channels: ["sms", "door_to_door"],
    vulnerabilities: [],
    phone: "+62 821-6666-8888",
    status: "no_response",
  },
  {
    id: "hh-027",
    headOfFamily: "Suripto",
    address: "Block E No. 1, RT 05",
    memberCount: 3,
    channels: ["whatsapp", "sms"],
    vulnerabilities: ["elderly", "disabled"],
    phone: "+62 812-7777-9999",
    status: "no_response",
  },
  {
    id: "hh-028",
    headOfFamily: "Ketut Widana",
    address: "Block E No. 5, RT 05",
    memberCount: 4,
    channels: ["whatsapp", "sms"],
    vulnerabilities: [],
    phone: "+62 813-8888-0000",
    status: "no_response",
  },
  {
    id: "hh-029",
    headOfFamily: "Nyoman Sutrisna",
    address: "Block E No. 9, RT 05",
    memberCount: 5,
    channels: ["whatsapp", "sms"],
    vulnerabilities: ["infant"],
    phone: "+62 821-9999-1111",
    status: "no_response",
  },
  {
    id: "hh-030",
    headOfFamily: "Sri Winarsih",
    address: "Gang Raya No. 2, RT 05",
    memberCount: 4,
    channels: ["sms", "mosque_loudspeaker"],
    vulnerabilities: [],
    phone: "+62 812-0000-2222",
    status: "no_response",
  },
  {
    id: "hh-031",
    headOfFamily: "Gunawan Prasetyo",
    address: "Gang Raya No. 6, RT 05",
    memberCount: 6,
    channels: ["whatsapp", "sms"],
    vulnerabilities: [],
    phone: "+62 813-1111-3333",
    status: "no_response",
  },
  {
    id: "hh-032",
    headOfFamily: "Fatimah Zahra",
    address: "Block F No. 2, RT 05",
    memberCount: 3,
    channels: ["whatsapp", "sms", "door_to_door"],
    vulnerabilities: ["pregnant"],
    phone: "+62 821-2222-4444",
    status: "no_response",
  },
  {
    id: "hh-033",
    headOfFamily: "Ridho Ilyas",
    address: "Block F No. 7, RT 05",
    memberCount: 5,
    channels: ["whatsapp", "sms"],
    vulnerabilities: [],
    phone: "+62 812-3333-5555",
    status: "no_response",
  },
  {
    id: "hh-034",
    headOfFamily: "Aminah Yusuf",
    address: "Block G No. 1, RT 05",
    memberCount: 4,
    channels: ["sms", "mosque_loudspeaker"],
    vulnerabilities: ["elderly"],
    phone: "+62 813-4444-6666",
    status: "no_response",
  },
  {
    id: "hh-035",
    headOfFamily: "Zaenudin Hamid",
    address: "Block G No. 5, RT 05",
    memberCount: 5,
    channels: ["whatsapp", "sms"],
    vulnerabilities: [],
    phone: "+62 821-5555-7777",
    status: "no_response",
  },
]

// ============================================================
// Mock BPBD Alert
// ============================================================

export const mockBPBDAlert: BPBDAlert = {
  id: "alert-001",
  severity: "SIAGA",
  title: "Flood Warning — Citeureup Village",
  description:
    "Heavy rainfall upstream has caused river water levels to rise rapidly. " +
    "Flooding is expected in low-lying areas within the next 1–2 hours.",
  affectedArea: "RT 05/08, Citeureup Village, Cibinong District",
  predictedFloodLevel: 2.3,
  evacuationRecommendation:
    "Residents in flood-prone zones should prepare to evacuate to the nearest shelter. " +
    "Prioritize elderly, disabled, and families with infants.",
  shelterLocations: [
    "Balai Desa Citeureup (Village Hall)",
    "SDN 02 Citeureup (Elementary School)",
    "Masjid Al-Hidayah (Mosque)",
  ],
  issuedAt: new Date().toISOString(),
}

// ============================================================
// Helper functions
// ============================================================

export function getChannelLabel(channel: CommunicationChannel): string {
  switch (channel) {
    case "whatsapp": return "WhatsApp"
    case "sms": return "SMS"
    case "mosque_loudspeaker": return "Mosque Loudspeaker"
    case "door_to_door": return "Door-to-Door"
  }
}

export function isVulnerable(household: Household): boolean {
  return household.vulnerabilities.length > 0
}

export function getStatusCounts(households: Household[]): Record<HouseholdStatus, number> {
  const counts: Record<HouseholdStatus, number> = {
    safe: 0,
    evacuating: 0,
    needs_help: 0,
    no_response: 0,
  }
  for (const h of households) {
    counts[h.status]++
  }
  return counts
}

export function getNonResponsive(households: Household[]): Household[] {
  return households
    .filter((h) => h.status === "no_response")
    .sort((a, b) => {
      const av = isVulnerable(a) ? 1 : 0
      const bv = isVulnerable(b) ? 1 : 0
      return bv - av
    })
}

export function getChannelBreakdown(households: Household[]): Record<CommunicationChannel, number> {
  const counts: Record<CommunicationChannel, number> = {
    whatsapp: 0,
    sms: 0,
    mosque_loudspeaker: 0,
    door_to_door: 0,
  }
  for (const h of households) {
    for (const c of h.channels) counts[c]++
  }
  return counts
}
