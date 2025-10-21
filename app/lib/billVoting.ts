/**
 * Helper functions for determining which officials can vote on specific bills
 */

export type BillChamber = 'house' | 'senate' | null;

/**
 * Determine which chamber can vote on a bill based on its number/type
 *
 * House bills: HR, HRES, HJRES, HCONRES
 * Senate bills: S, SRES, SJRES, SCONRES
 *
 * @param billNumber - The bill number (e.g., "HR 1234", "S 567")
 * @returns The chamber that can vote on this bill, or null if undetermined
 */
export function getBillChamber(billNumber?: string): BillChamber {
  if (!billNumber) return null;

  // Extract the bill type (first part before space or number)
  const type = billNumber.trim().split(/\s+/)[0].toUpperCase();

  // House bills start with H
  if (type.startsWith('H')) return 'house';

  // Senate bills are S followed by space/number (not starting with H)
  if (type === 'S' || type.startsWith('S')) return 'senate';

  return null;
}

/**
 * Determine if an official can vote on a bill based on their role
 *
 * @param role - The official's role (e.g., "Representative in the House", "Senator")
 * @param chamber - The chamber that can vote on the bill
 * @returns True if the official can vote on this bill
 */
export function canOfficialVoteOnBill(role: string, chamber: BillChamber): boolean {
  if (!chamber) return false;

  const roleLower = role.toLowerCase();

  if (chamber === 'house') {
    // Match: "representative", "rep.", "house"
    return (
      (roleLower.includes('representative') || roleLower.includes('rep.')) &&
      roleLower.includes('house')
    );
  }

  if (chamber === 'senate') {
    // Match: "senator", "sen."
    return roleLower.includes('senator') || roleLower.includes('sen.');
  }

  return false;
}

/**
 * Get a user-friendly description of who can vote on a bill
 *
 * @param billNumber - The bill number
 * @returns Description text for the info banner
 */
export function getVotingDescription(billNumber?: string): string | null {
  const chamber = getBillChamber(billNumber);

  if (!chamber) return null;

  if (chamber === 'house') {
    return 'The following officials can vote directly on this House bill. Other officials can still influence through advocacy.';
  }

  if (chamber === 'senate') {
    return 'The following officials can vote directly on this Senate bill. Other officials can still influence through advocacy.';
  }

  return null;
}
