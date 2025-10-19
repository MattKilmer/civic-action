import { z } from "zod";

export const AddressSchema = z.object({
  address: z.string().min(5, "Please enter a full street address"),
});

export const StanceSchema = z.enum(["support", "oppose"]);

export const IssueDraftSchema = z.object({
  stance: StanceSchema,
  topic: z.string().min(2).max(80),
  bill: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  personalImpact: z.string().max(300).optional(),
  desiredAction: z
    .string()
    .max(120)
    .optional(),
  tone: z.enum(["neutral", "urgent", "friendly"]).default("neutral").optional(),
});

export type AddressInput = z.infer<typeof AddressSchema>;
export type IssueDraftInput = z.infer<typeof IssueDraftSchema>;

export type OfficialContact = {
  name: string;
  role: string;
  level: string;
  party?: string;
  phones: string[];
  emails: string[];
  urls: string[];
  photoUrl?: string;
  primaryUrl?: string;
};
