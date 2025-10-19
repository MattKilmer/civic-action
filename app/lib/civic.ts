type CivicOfficial = {
  name: string;
  party?: string;
  phones?: string[];
  urls?: string[];
  emails?: string[];
  photoUrl?: string;
  address?: Array<{
    line1?: string;
    line2?: string;
    line3?: string;
    city?: string;
    state?: string;
    zip?: string;
  }>;
  channels?: Array<{ type: string; id: string }>;
};

type CivicOffice = {
  name: string;
  divisionId: string;
  levels?: string[];
  officialIndices?: number[];
};

type CivicResponse = {
  offices?: CivicOffice[];
  officials?: CivicOfficial[];
};

import { OfficialContact } from "./schemas";

export function mapCivicToOfficials(data: CivicResponse): OfficialContact[] {
  const results: OfficialContact[] = [];
  if (!data.offices || !data.officials) return results;

  for (const office of data.offices) {
    for (const idx of office.officialIndices ?? []) {
      const o = data.officials[idx];
      results.push({
        name: o.name,
        party: o.party,
        role: office.name,
        level: office.levels?.[0] ?? office.name,
        phones: o.phones ?? [],
        emails: o.emails ?? [],
        urls: o.urls ?? [],
        photoUrl: o.photoUrl,
        primaryUrl: o.urls?.[0],
      });
    }
  }
  return results;
}

// 5 Calls API Types
type FiveCallsFieldOffice = {
  phone: string;
  city: string;
};

type FiveCallsRepresentative = {
  id: string;
  name: string;
  phone: string;
  url: string;
  photoURL?: string;
  party: string;
  state: string;
  reason: string;
  area: string;
  field_offices: FiveCallsFieldOffice[];
};

type FiveCallsResponse = {
  location: string;
  lowAccuracy: boolean;
  state: string;
  district: string;
  representatives: FiveCallsRepresentative[];
};

export function mapFiveCallsToOfficials(data: FiveCallsResponse): OfficialContact[] {
  if (!data.representatives) return [];

  return data.representatives.map((rep) => {
    // Collect all phone numbers (main + field offices)
    const phones = [rep.phone];
    rep.field_offices?.forEach((office) => {
      if (office.phone && office.phone !== rep.phone) {
        phones.push(office.phone);
      }
    });

    return {
      name: rep.name,
      party: rep.party || undefined,
      role: rep.reason, // e.g., "This is your representative in the House."
      level: rep.area, // e.g., "US House", "US Senate", "Governor"
      phones,
      emails: [], // 5 Calls API doesn't provide emails
      urls: rep.url ? [rep.url] : [],
      photoUrl: rep.photoURL,
      primaryUrl: rep.url || undefined,
    };
  });
}
