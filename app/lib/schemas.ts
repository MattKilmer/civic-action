import { z } from "zod";

export const AddressSchema = z.object({
  address: z.string().min(5, "Please enter a full street address"),
});

export const StanceSchema = z.enum(["support", "oppose"]);

export const BillLevelSchema = z.enum(["federal", "state", "local"]);

export const BillSchema = z.object({
  bill: z.string(), // e.g., "HR 683" or "CA AB 123"
  title: z.string(),
  summary: z.string().optional(),
  level: BillLevelSchema,
  jurisdiction: z.string().optional(), // State name for state bills
  session: z.string().optional(), // Legislative session for state bills
  chamber: z.string().optional(), // "house", "senate", "state-house", "state-senate"
  introduced: z.string().optional(),
  latestAction: z.string().optional(),
  sponsors: z.array(z.string()).optional(),
});

export const IssueDraftSchema = z.object({
  stance: StanceSchema,
  topic: z.string().min(2).max(80),
  bill: z.string().optional(),
  billTitle: z.string().optional(),
  billSummary: z.string().optional(),
  billLevel: BillLevelSchema.optional(), // "federal" or "state"
  billJurisdiction: z.string().optional(), // State name for state bills
  jurisdiction: z.string().optional(), // State name for state bills (from Issue type)
  session: z.string().optional(), // Legislative session for state bills
  city: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(), // Congressional district
  personalImpact: z.string().max(300).optional(),
  desiredAction: z
    .string()
    .max(120)
    .optional(),
  tone: z.enum(["neutral", "urgent", "friendly"]).default("neutral").optional(),
});

export type AddressInput = z.infer<typeof AddressSchema>;
export type IssueDraftInput = z.infer<typeof IssueDraftSchema>;
export type Bill = z.infer<typeof BillSchema>;
export type BillLevel = z.infer<typeof BillLevelSchema>;

export type OfficialContact = {
  name: string;
  role: string;
  level: string;
  party?: string;
  state?: string; // State abbreviation or name (for state legislators)
  phones: string[];
  emails: string[];
  urls: string[];
  photoUrl?: string;
  primaryUrl?: string;
};
