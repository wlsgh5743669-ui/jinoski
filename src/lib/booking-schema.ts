import { z } from "zod";

export const bookingSchema = z.object({
  date: z.string().min(1, "날짜를 선택해주세요"),
  program: z.enum(["2h", "3h", "4h", "one-day", "night"]),
  timeSlot: z.string().min(1, "시간대를 선택해주세요"),
  groupSize: z.string().min(1, "인원을 선택해주세요"),
  equipment: z.enum(["ski", "snowboard", "inline-ski"]),
  level: z.enum(["입문", "초급", "중급", "상급"]),
  wantsPhoto: z.boolean(),
  liftPassPayment: z.string().min(1, "패찰 결제 방식을 선택해주세요"),
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z.string().min(9, "연락처를 다시 확인해주세요"),
  kakaoId: z.string().optional(),
  requestNote: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
