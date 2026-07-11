import { z } from "zod";

export const bookingSchema = z.object({
  date: z.string().min(1),
  program: z.enum(["2h", "3h", "4h", "one-day", "night"]),
  timeSlot: z.string().min(1),
  groupSize: z.string().min(1),
  equipment: z.enum(["ski", "snowboard", "inline-ski"]),
  level: z.enum(["beginner", "basic", "intermediate", "advanced"]),
  wantsPhoto: z.boolean(),
  liftPassPayment: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(9),
  kakaoId: z.string().optional(),
  requestNote: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
