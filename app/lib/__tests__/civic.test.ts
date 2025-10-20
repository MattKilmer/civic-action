import { mapCivicToOfficials, mapFiveCallsToOfficials } from '../civic';

describe('civic.ts', () => {
  describe('mapCivicToOfficials', () => {
    it('should return empty array when data has no offices or officials', () => {
      expect(mapCivicToOfficials({})).toEqual([]);
      expect(mapCivicToOfficials({ offices: [] })).toEqual([]);
      expect(mapCivicToOfficials({ officials: [] })).toEqual([]);
    });

    it('should map civic data to official contacts correctly', () => {
      const mockData = {
        offices: [
          {
            name: 'President of the United States',
            divisionId: 'ocd-division/country:us',
            levels: ['country'],
            officialIndices: [0],
          },
          {
            name: 'U.S. Senator',
            divisionId: 'ocd-division/country:us/state:ca',
            levels: ['country'],
            officialIndices: [1, 2],
          },
        ],
        officials: [
          {
            name: 'Joe Biden',
            party: 'Democratic Party',
            phones: ['(202) 456-1111'],
            urls: ['https://www.whitehouse.gov/'],
            photoUrl: 'https://example.com/biden.jpg',
          },
          {
            name: 'Dianne Feinstein',
            party: 'Democratic Party',
            phones: ['(202) 224-3841'],
            urls: ['https://www.feinstein.senate.gov/'],
          },
          {
            name: 'Alex Padilla',
            party: 'Democratic Party',
            phones: ['(202) 224-3553'],
            urls: ['https://www.padilla.senate.gov/'],
          },
        ],
      };

      const result = mapCivicToOfficials(mockData);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        name: 'Joe Biden',
        party: 'Democratic Party',
        role: 'President of the United States',
        level: 'country',
        phones: ['(202) 456-1111'],
        emails: [],
        urls: ['https://www.whitehouse.gov/'],
        photoUrl: 'https://example.com/biden.jpg',
        primaryUrl: 'https://www.whitehouse.gov/',
      });
      expect(result[1].name).toBe('Dianne Feinstein');
      expect(result[2].name).toBe('Alex Padilla');
    });

    it('should handle missing optional fields', () => {
      const mockData = {
        offices: [
          {
            name: 'Mayor',
            divisionId: 'ocd-division/country:us/state:ca/city:sf',
            officialIndices: [0],
          },
        ],
        officials: [
          {
            name: 'London Breed',
          },
        ],
      };

      const result = mapCivicToOfficials(mockData);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: 'London Breed',
        party: undefined,
        role: 'Mayor',
        level: 'Mayor', // Falls back to role name when no levels
        phones: [],
        emails: [],
        urls: [],
        photoUrl: undefined,
        primaryUrl: undefined,
      });
    });

    it('should handle offices with no officialIndices', () => {
      const mockData = {
        offices: [
          {
            name: 'Unknown Office',
            divisionId: 'ocd-division/test',
          },
        ],
        officials: [
          {
            name: 'Test Official',
          },
        ],
      };

      const result = mapCivicToOfficials(mockData);
      expect(result).toEqual([]);
    });
  });

  describe('mapFiveCallsToOfficials', () => {
    it('should return empty array when no representatives', () => {
      expect(mapFiveCallsToOfficials({ representatives: [] } as any)).toEqual([]);
      expect(mapFiveCallsToOfficials({} as any)).toEqual([]);
    });

    it('should map 5 Calls data to official contacts correctly', () => {
      const mockData = {
        location: 'San Francisco, CA',
        lowAccuracy: false,
        state: 'CA',
        district: '11',
        representatives: [
          {
            id: 'us-sen-1',
            name: 'Dianne Feinstein',
            phone: '(202) 224-3841',
            url: 'https://www.feinstein.senate.gov/',
            photoURL: 'https://example.com/feinstein.jpg',
            party: 'Democrat',
            state: 'CA',
            reason: 'This is your U.S. Senator',
            area: 'US Senate',
            field_offices: [
              {
                phone: '(415) 393-0707',
                city: 'San Francisco',
              },
              {
                phone: '(310) 914-7300',
                city: 'Los Angeles',
              },
            ],
          },
          {
            id: 'us-house-ca-11',
            name: 'Nancy Pelosi',
            phone: '(202) 225-4965',
            url: 'https://pelosi.house.gov/',
            photoURL: 'https://example.com/pelosi.jpg',
            party: 'Democrat',
            state: 'CA',
            reason: 'This is your U.S. Representative',
            area: 'US House',
            field_offices: [],
          },
        ],
      };

      const result = mapFiveCallsToOfficials(mockData);

      expect(result).toHaveLength(2);

      // Check first official with field offices
      expect(result[0]).toEqual({
        name: 'Dianne Feinstein',
        party: 'Democrat',
        role: 'This is your U.S. Senator',
        level: 'US Senate',
        phones: ['(202) 224-3841', '(415) 393-0707', '(310) 914-7300'],
        emails: [],
        urls: ['https://www.feinstein.senate.gov/'],
        photoUrl: 'https://example.com/feinstein.jpg',
        primaryUrl: 'https://www.feinstein.senate.gov/',
      });

      // Check second official without field offices
      expect(result[1]).toEqual({
        name: 'Nancy Pelosi',
        party: 'Democrat',
        role: 'This is your U.S. Representative',
        level: 'US House',
        phones: ['(202) 225-4965'],
        emails: [],
        urls: ['https://pelosi.house.gov/'],
        photoUrl: 'https://example.com/pelosi.jpg',
        primaryUrl: 'https://pelosi.house.gov/',
      });
    });

    it('should handle missing optional fields', () => {
      const mockData = {
        location: 'Unknown',
        lowAccuracy: true,
        state: '',
        district: '',
        representatives: [
          {
            id: 'test-1',
            name: 'Test Official',
            phone: '',
            url: '',
            party: '',
            state: '',
            reason: '',
            area: 'Test Area',
            field_offices: [],
          },
        ],
      };

      const result = mapFiveCallsToOfficials(mockData);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: 'Test Official',
        party: undefined, // Empty string converts to undefined
        role: '',
        level: 'Test Area',
        phones: [''],
        emails: [],
        urls: [],
        photoUrl: undefined,
        primaryUrl: undefined,
      });
    });

    it('should not duplicate phone numbers from field offices', () => {
      const mockData = {
        location: 'Test',
        lowAccuracy: false,
        state: 'CA',
        district: '1',
        representatives: [
          {
            id: 'test-1',
            name: 'Test Official',
            phone: '(202) 555-1234',
            url: 'https://example.com',
            party: 'Independent',
            state: 'CA',
            reason: 'Test',
            area: 'Test',
            field_offices: [
              {
                phone: '(202) 555-1234', // Same as main phone
                city: 'Washington',
              },
              {
                phone: '(415) 555-5678', // Different phone
                city: 'San Francisco',
              },
            ],
          },
        ],
      };

      const result = mapFiveCallsToOfficials(mockData);

      expect(result[0].phones).toEqual([
        '(202) 555-1234',
        '(415) 555-5678',
      ]);
    });
  });
});
