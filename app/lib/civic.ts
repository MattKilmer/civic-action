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
