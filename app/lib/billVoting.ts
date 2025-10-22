/**
 * Helper functions for determining which officials can vote on specific bills
 * Supports both federal bills (House/Senate) and state bills (all 50 states)
 */

export type BillChamber = 'house' | 'senate' | 'state-house' | 'state-senate' | null;

export type BillInfo = {
  chamber: BillChamber;
  jurisdiction?: string; // State name for state bills (e.g., "California")
  level: 'federal' | 'state';
};

/**
 * Determine which chamber can vote on a bill based on its number/type
 *
 * Federal bills:
 * - House bills: HR, HRES, HJRES, HCONRES
 * - Senate bills: S, SRES, SJRES, SCONRES
 *
 * State bills (examples):
 * - California: AB (Assembly Bill), SB (Senate Bill)
 * - New York: A (Assembly), S (Senate)
 * - Texas: HB (House Bill), SB (Senate Bill)
 *
 * @param billNumber - The bill number (e.g., "HR 1234", "CA AB 123", "NY S 456")
 * @param jurisdiction - Optional jurisdiction for state bills
 * @returns Bill information including chamber and jurisdiction
 */
export function getBillInfo(billNumber?: string, jurisdiction?: string): BillInfo | null {
  if (!billNumber) return null;

  const parts = billNumber.trim().split(/\s+/);

  // Check if it's a state bill (starts with state abbreviation)
  if (parts.length >= 2 && isStateAbbreviation(parts[0])) {
    const stateAbbr = parts[0].toUpperCase();
    const billType = parts[1].toUpperCase();

    // Determine if state house or state senate
    const isStateSenate = billType.startsWith('S') || billType === 'SEN';
    const chamber: BillChamber = isStateSenate ? 'state-senate' : 'state-house';

    return {
      chamber,
      jurisdiction: jurisdiction || getFullStateName(stateAbbr) || undefined,
      level: 'state',
    };
  }

  // Federal bill
  const type = parts[0].toUpperCase();

  // House bills start with H
  if (type.startsWith('H')) {
    return { chamber: 'house', level: 'federal' };
  }

  // Senate bills are S followed by space/number (not starting with H)
  if (type === 'S' || type.startsWith('S')) {
    return { chamber: 'senate', level: 'federal' };
  }

  return null;
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getBillInfo instead
 */
export function getBillChamber(billNumber?: string): BillChamber {
  const info = getBillInfo(billNumber);
  return info?.chamber || null;
}

/**
 * Determine if an official can vote on a bill based on their role and jurisdiction
 *
 * For state bills, the official must be from the correct state AND correct chamber
 * For federal bills, the official must be in the correct federal chamber
 *
 * @param role - The official's role (e.g., "Representative in the House", "California State Senator")
 * @param billInfo - Bill information including chamber and jurisdiction
 * @param officialState - Optional state for the official (for state bill matching)
 * @returns True if the official can vote on this bill
 */
export function canOfficialVoteOnBill(
  role: string,
  billInfo: BillInfo | BillChamber | null,
  officialState?: string
): boolean {
  // Handle legacy BillChamber type
  if (typeof billInfo === 'string' || billInfo === null) {
    const chamber = billInfo;
    if (!chamber) return false;
    const roleLower = role.toLowerCase();

    if (chamber === 'house') {
      return (
        (roleLower.includes('representative') || roleLower.includes('rep.')) &&
        roleLower.includes('house')
      );
    }

    if (chamber === 'senate') {
      return roleLower.includes('senator') || roleLower.includes('sen.');
    }

    return false;
  }

  // Modern BillInfo type
  if (!billInfo || !billInfo.chamber) return false;

  const roleLower = role.toLowerCase();

  // Federal House
  if (billInfo.chamber === 'house') {
    return (
      (roleLower.includes('representative') || roleLower.includes('rep.')) &&
      roleLower.includes('house') &&
      !roleLower.includes('state') // Exclude state representatives
    );
  }

  // Federal Senate
  if (billInfo.chamber === 'senate') {
    return (
      (roleLower.includes('senator') || roleLower.includes('sen.')) &&
      !roleLower.includes('state') // Exclude state senators
    );
  }

  // State House
  if (billInfo.chamber === 'state-house') {
    // Explicitly exclude federal representatives
    const isFederalRep =
      roleLower.includes('representative in the house') ||  // "This is your representative in the House."
      roleLower.includes('u.s. representative') ||
      (roleLower.includes('house') && !roleLower.includes('state'));

    if (isFederalRep) return false;

    // Must be state-level legislator
    const isStateRep = (
      (roleLower.includes('assembly') || roleLower.includes('delegate') ||
       roleLower.includes('representative') || roleLower.includes('legislator')) &&
      roleLower.includes('state')
    );

    if (!isStateRep) return false;

    // If we have bill jurisdiction, verify official is from that state
    if (billInfo.jurisdiction && officialState) {
      return normalizeStateName(officialState) === normalizeStateName(billInfo.jurisdiction);
    }

    return isStateRep;
  }

  // State Senate
  if (billInfo.chamber === 'state-senate') {
    // Explicitly exclude federal senators
    const isFederalSenator =
      roleLower.includes('two senators') ||  // "This is one of your two Senators."
      roleLower.includes('u.s. senator') ||
      roleLower.includes('senator') && !roleLower.includes('state');

    if (isFederalSenator) return false;

    // Must be state-level legislator (some states use "legislator" instead of "senator")
    const isStateSenator = (
      (roleLower.includes('senator') || roleLower.includes('legislator')) &&
      roleLower.includes('state')
    );

    if (!isStateSenator) return false;

    // If we have bill jurisdiction, verify official is from that state
    if (billInfo.jurisdiction && officialState) {
      return normalizeStateName(officialState) === normalizeStateName(billInfo.jurisdiction);
    }

    return isStateSenator;
  }

  return false;
}

/**
 * Get a user-friendly description of who can vote on a bill
 *
 * @param billNumber - The bill number
 * @param jurisdiction - Optional jurisdiction for state bills
 * @returns Description text for the info banner
 */
export function getVotingDescription(billNumber?: string, jurisdiction?: string): string | null {
  const billInfo = getBillInfo(billNumber, jurisdiction);

  if (!billInfo || !billInfo.chamber) return null;

  if (billInfo.chamber === 'house') {
    return 'The following officials can vote directly on this House bill. Other officials can still influence through advocacy.';
  }

  if (billInfo.chamber === 'senate') {
    return 'The following officials can vote directly on this Senate bill. Other officials can still influence through advocacy.';
  }

  if (billInfo.chamber === 'state-house') {
    const stateName = billInfo.jurisdiction || 'state';
    return `The following ${stateName} state legislators can vote directly on this House bill. Other officials can still influence through advocacy.`;
  }

  if (billInfo.chamber === 'state-senate') {
    const stateName = billInfo.jurisdiction || 'state';
    return `The following ${stateName} state senators can vote directly on this Senate bill. Other officials can still influence through advocacy.`;
  }

  return null;
}

/**
 * Helper: Check if a string is a valid US state abbreviation
 */
function isStateAbbreviation(abbr: string): boolean {
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC', 'PR'
  ];
  return states.includes(abbr.toUpperCase());
}

/**
 * Helper: Get full state name from abbreviation
 */
function getFullStateName(abbr: string): string | null {
  const stateMap: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia', 'PR': 'Puerto Rico'
  };
  return stateMap[abbr.toUpperCase()] || null;
}

/**
 * Helper: Normalize state name for comparison (handles full name or abbreviation)
 */
function normalizeStateName(state: string): string {
  const upper = state.toUpperCase();
  // If it's an abbreviation, convert to full name
  if (upper.length === 2) {
    return getFullStateName(upper) || upper;
  }
  // Return as-is (full name)
  return state;
}
