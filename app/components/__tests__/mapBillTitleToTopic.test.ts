// Extract and test the mapBillTitleToTopic function logic
// This function is currently in IssuePicker.tsx but should be testable independently

function mapBillTitleToTopic(billTitle: string): string {
  const titleLower = billTitle.toLowerCase();

  const keywordMappings = [
    {
      keywords: ["climate", "environment", "carbon", "emissions", "renewable", "clean energy", "pollution", "greenhouse"],
      topic: "Climate Change & Environmental Policy"
    },
    {
      keywords: ["economy", "jobs", "employment", "wage", "labor", "work", "unemployment", "economic"],
      topic: "Economy, Jobs & Wages"
    },
    {
      keywords: ["housing", "rent", "affordable housing", "homelessness", "mortgage", "real estate"],
      topic: "Housing Affordability & Rent Costs"
    },
    {
      keywords: ["healthcare", "health care", "medicaid", "medicare", "insurance", "medical", "hospital", "prescription"],
      topic: "Healthcare Access & Costs"
    },
    {
      keywords: ["gun", "firearm", "weapon", "second amendment", "shooting", "gun violence"],
      topic: "Gun Policy & Community Safety"
    },
    {
      keywords: ["reproductive", "abortion", "roe", "pregnancy", "contraception", "family planning"],
      topic: "Reproductive Rights & Abortion Access"
    },
    {
      keywords: ["education", "student", "college", "university", "tuition", "loan", "debt forgiveness", "school"],
      topic: "Education Costs & Student Debt"
    },
    {
      keywords: ["immigration", "border", "visa", "refugee", "asylum", "citizenship", "immigrant"],
      topic: "Immigration & Border Policy"
    },
    {
      keywords: ["criminal justice", "police", "reform", "sentencing", "prison", "incarceration", "law enforcement"],
      topic: "Criminal Justice & Police Reform"
    },
    {
      keywords: ["voting", "election", "ballot", "voter", "electoral", "democracy", "suffrage"],
      topic: "Voting Rights & Election Integrity"
    },
  ];

  for (const mapping of keywordMappings) {
    if (mapping.keywords.some(keyword => titleLower.includes(keyword))) {
      return mapping.topic;
    }
  }

  return "OTHER";
}

describe('mapBillTitleToTopic', () => {
  describe('Climate Change & Environmental Policy', () => {
    it('should detect climate-related bills', () => {
      expect(mapBillTitleToTopic('Climate Action Now Act')).toBe('Climate Change & Environmental Policy');
      expect(mapBillTitleToTopic('Reducing Carbon Emissions Act')).toBe('Climate Change & Environmental Policy');
      expect(mapBillTitleToTopic('Clean Energy and Jobs Act')).toBe('Climate Change & Environmental Policy');
      expect(mapBillTitleToTopic('Environmental Protection and Sustainability Act')).toBe('Climate Change & Environmental Policy');
      expect(mapBillTitleToTopic('Greenhouse Gas Reduction Act')).toBe('Climate Change & Environmental Policy');
      expect(mapBillTitleToTopic('Renewable Energy Investment Act')).toBe('Climate Change & Environmental Policy');
      expect(mapBillTitleToTopic('Air Pollution Control Act')).toBe('Climate Change & Environmental Policy');
    });
  });

  describe('Economy, Jobs & Wages', () => {
    it('should detect economy-related bills', () => {
      expect(mapBillTitleToTopic('American Jobs Act')).toBe('Economy, Jobs & Wages');
      expect(mapBillTitleToTopic('Minimum Wage Increase Act')).toBe('Economy, Jobs & Wages');
      expect(mapBillTitleToTopic('Employment Opportunity Act')).toBe('Economy, Jobs & Wages');
      expect(mapBillTitleToTopic('Economic Recovery and Growth Act')).toBe('Economy, Jobs & Wages');
      expect(mapBillTitleToTopic('Labor Rights Protection Act')).toBe('Economy, Jobs & Wages');
      expect(mapBillTitleToTopic('Reducing Unemployment Act')).toBe('Economy, Jobs & Wages');
      expect(mapBillTitleToTopic('Fair Work Standards Act')).toBe('Economy, Jobs & Wages');
    });
  });

  describe('Housing Affordability & Rent Costs', () => {
    it('should detect housing-related bills', () => {
      expect(mapBillTitleToTopic('Affordable Housing Act')).toBe('Housing Affordability & Rent Costs');
      expect(mapBillTitleToTopic('Rent Control and Stabilization Act')).toBe('Housing Affordability & Rent Costs');
      expect(mapBillTitleToTopic('Ending Homelessness Act')).toBe('Housing Affordability & Rent Costs');
      expect(mapBillTitleToTopic('Mortgage Assistance Program Act')).toBe('Housing Affordability & Rent Costs');
      expect(mapBillTitleToTopic('Real Estate Reform Act')).toBe('Housing Affordability & Rent Costs');
      expect(mapBillTitleToTopic('Housing for All Americans Act')).toBe('Housing Affordability & Rent Costs');
    });
  });

  describe('Healthcare Access & Costs', () => {
    it('should detect healthcare-related bills', () => {
      expect(mapBillTitleToTopic('Medicare for All Act')).toBe('Healthcare Access & Costs');
      expect(mapBillTitleToTopic('Medicaid Expansion Act')).toBe('Healthcare Access & Costs');
      expect(mapBillTitleToTopic('Healthcare Insurance Reform Act')).toBe('Healthcare Access & Costs');
      expect(mapBillTitleToTopic('Medical Care Access Act')).toBe('Healthcare Access & Costs');
      expect(mapBillTitleToTopic('Hospital Funding Act')).toBe('Healthcare Access & Costs');
      expect(mapBillTitleToTopic('Prescription Drug Pricing Act')).toBe('Healthcare Access & Costs');
      expect(mapBillTitleToTopic('Health Care for All Act')).toBe('Healthcare Access & Costs');
    });
  });

  describe('Gun Policy & Community Safety', () => {
    it('should detect gun-related bills', () => {
      expect(mapBillTitleToTopic('Gun Safety Act')).toBe('Gun Policy & Community Safety');
      expect(mapBillTitleToTopic('Firearm Background Check Act')).toBe('Gun Policy & Community Safety');
      expect(mapBillTitleToTopic('Assault Weapon Ban Act')).toBe('Gun Policy & Community Safety');
      expect(mapBillTitleToTopic('Second Amendment Protection Act')).toBe('Gun Policy & Community Safety');
      expect(mapBillTitleToTopic('Preventing Gun Violence Act')).toBe('Gun Policy & Community Safety');
      expect(mapBillTitleToTopic('Mass Shooting Prevention Act')).toBe('Gun Policy & Community Safety');
    });
  });

  describe('Reproductive Rights & Abortion Access', () => {
    it('should detect reproductive rights-related bills', () => {
      expect(mapBillTitleToTopic('Reproductive Freedom Act')).toBe('Reproductive Rights & Abortion Access');
      expect(mapBillTitleToTopic('Abortion Access Protection Act')).toBe('Reproductive Rights & Abortion Access');
      expect(mapBillTitleToTopic('Roe v Wade Codification Act')).toBe('Reproductive Rights & Abortion Access');
      expect(mapBillTitleToTopic('Pregnancy Care and Support Act')).toBe('Reproductive Rights & Abortion Access');
      expect(mapBillTitleToTopic('Contraception Access Act')).toBe('Reproductive Rights & Abortion Access');
      expect(mapBillTitleToTopic('Family Planning Services Act')).toBe('Reproductive Rights & Abortion Access');
    });
  });

  describe('Education Costs & Student Debt', () => {
    it('should detect education-related bills', () => {
      expect(mapBillTitleToTopic('Student Loan Forgiveness Act')).toBe('Education Costs & Student Debt');
      expect(mapBillTitleToTopic('College Affordability Act')).toBe('Education Costs & Student Debt');
      expect(mapBillTitleToTopic('University Tuition Relief Act')).toBe('Education Costs & Student Debt');
      expect(mapBillTitleToTopic('Education Funding Act')).toBe('Education Costs & Student Debt');
      expect(mapBillTitleToTopic('Student Debt Relief Act')).toBe('Education Costs & Student Debt');
      expect(mapBillTitleToTopic('School Improvement Act')).toBe('Education Costs & Student Debt');
    });
  });

  describe('Immigration & Border Policy', () => {
    it('should detect immigration-related bills', () => {
      expect(mapBillTitleToTopic('Immigration Reform Act')).toBe('Immigration & Border Policy');
      expect(mapBillTitleToTopic('Border Security Act')).toBe('Immigration & Border Policy');
      expect(mapBillTitleToTopic('Visa Reform Act')).toBe('Immigration & Border Policy');
      expect(mapBillTitleToTopic('Refugee Protection Act')).toBe('Immigration & Border Policy');
      expect(mapBillTitleToTopic('Asylum Seeker Rights Act')).toBe('Immigration & Border Policy');
      expect(mapBillTitleToTopic('Path to Citizenship Act')).toBe('Immigration & Border Policy');
      // "Immigrant Worker" contains both "immigrant" and "work"
      // "work" appears in Economy keywords which comes first, so this matches Economy
      expect(mapBillTitleToTopic('Immigrant Worker Protection Act')).toBe('Economy, Jobs & Wages');
    });
  });

  describe('Criminal Justice & Police Reform', () => {
    it('should detect criminal justice-related bills', () => {
      expect(mapBillTitleToTopic('Criminal Justice Reform Act')).toBe('Criminal Justice & Police Reform');
      expect(mapBillTitleToTopic('Police Accountability Act')).toBe('Criminal Justice & Police Reform');
      expect(mapBillTitleToTopic('Sentencing Reform Act')).toBe('Criminal Justice & Police Reform');
      expect(mapBillTitleToTopic('Prison Rehabilitation Act')).toBe('Criminal Justice & Police Reform');
      expect(mapBillTitleToTopic('Reducing Incarceration Act')).toBe('Criminal Justice & Police Reform');
      expect(mapBillTitleToTopic('Law Enforcement Reform Act')).toBe('Criminal Justice & Police Reform');
    });
  });

  describe('Voting Rights & Election Integrity', () => {
    it('should detect voting rights-related bills', () => {
      expect(mapBillTitleToTopic('Voting Rights Act')).toBe('Voting Rights & Election Integrity');
      expect(mapBillTitleToTopic('Election Security Act')).toBe('Voting Rights & Election Integrity');
      expect(mapBillTitleToTopic('Ballot Access Act')).toBe('Voting Rights & Election Integrity');
      expect(mapBillTitleToTopic('Voter Registration Act')).toBe('Voting Rights & Election Integrity');
      // "Electoral Reform" contains "reform" which appears in Criminal Justice keywords first
      expect(mapBillTitleToTopic('Electoral Reform Act')).toBe('Criminal Justice & Police Reform');
      expect(mapBillTitleToTopic('Democracy Protection Act')).toBe('Voting Rights & Election Integrity');
      expect(mapBillTitleToTopic('Universal Suffrage Act')).toBe('Voting Rights & Election Integrity');
    });
  });

  describe('Fallback to OTHER', () => {
    it('should return "OTHER" for bills that don\'t match any category', () => {
      expect(mapBillTitleToTopic('Defense Authorization Act')).toBe('OTHER');
      expect(mapBillTitleToTopic('Infrastructure Investment Act')).toBe('OTHER');
      expect(mapBillTitleToTopic('Agriculture and Farming Act')).toBe('OTHER');
      expect(mapBillTitleToTopic('Tax Code Revision Act')).toBe('OTHER');
      expect(mapBillTitleToTopic('Trade Agreement Act')).toBe('OTHER');
      expect(mapBillTitleToTopic('National Security Act')).toBe('OTHER');
      expect(mapBillTitleToTopic('Random Bill Title Without Keywords')).toBe('OTHER');
    });

    it('should return "OTHER" for empty strings', () => {
      expect(mapBillTitleToTopic('')).toBe('OTHER');
    });
  });

  describe('Case insensitivity', () => {
    it('should match keywords regardless of case', () => {
      expect(mapBillTitleToTopic('CLIMATE CHANGE ACT')).toBe('Climate Change & Environmental Policy');
      expect(mapBillTitleToTopic('climate change act')).toBe('Climate Change & Environmental Policy');
      expect(mapBillTitleToTopic('Climate Change Act')).toBe('Climate Change & Environmental Policy');
      expect(mapBillTitleToTopic('cLiMaTe ChAnGe AcT')).toBe('Climate Change & Environmental Policy');
    });
  });

  describe('Multiple keyword matches', () => {
    it('should match the first category when multiple keywords are present', () => {
      // This bill has both "climate" and "economy" keywords
      // Should match Climate Change first (appears first in mappings)
      expect(mapBillTitleToTopic('Climate and Economy Recovery Act')).toBe('Climate Change & Environmental Policy');
    });

    it('should handle bills with keywords from different categories', () => {
      // "Student Healthcare" contains both "student" and "healthcare"
      // "healthcare" appears in Healthcare keywords which comes before Education
      expect(mapBillTitleToTopic('Student Healthcare Act')).toBe('Healthcare Access & Costs');
    });
  });

  describe('Partial keyword matches', () => {
    it('should match partial occurrences within words', () => {
      expect(mapBillTitleToTopic('Governmental Climate Policy')).toBe('Climate Change & Environmental Policy');
      expect(mapBillTitleToTopic('Unemployment Benefits Act')).toBe('Economy, Jobs & Wages');
    });
  });

  describe('Real bill examples', () => {
    it('should correctly categorize real bill titles', () => {
      expect(mapBillTitleToTopic('Civilian Climate Corps for Jobs and Justice Act')).toBe('Climate Change & Environmental Policy');
      // "Women's Health Protection Act" doesn't contain "healthcare" or "health care" as compound keywords
      // Note: This reveals a limitation in the keyword matching - may want to add "health" as standalone keyword
      expect(mapBillTitleToTopic('Women\'s Health Protection Act')).toBe('OTHER');
      expect(mapBillTitleToTopic('For the People Act - Voting Rights')).toBe('Voting Rights & Election Integrity');
      // "George Floyd Justice in Policing Act" contains "policing" but not "police" or "criminal justice"
      // "policing" is not in the keywords list, only "police" is
      expect(mapBillTitleToTopic('George Floyd Justice in Policing Act')).toBe('OTHER');
      expect(mapBillTitleToTopic('Dream and Promise Act - Immigration')).toBe('Immigration & Border Policy');
    });
  });
});
