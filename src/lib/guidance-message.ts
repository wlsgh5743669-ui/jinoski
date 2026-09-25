import type { SiteContent } from "@/config/content/types";

/**
 * Plain-text lines for the pre-lesson guidance block (준비물, 도착 시간,
 * 취소 정책 등). Shared between the booking confirmation message
 * (booking-wizard.tsx) and the admin D-1 reminder message (admin/page.tsx)
 * so the two stay in sync automatically when content/*.ts is edited.
 */
export function buildGuidanceLines(content: SiteContent): string[] {
  const { title, items } = content.preLessonGuidance;
  return [
    title,
    ...items.map((item) => `${item.icon} ${item.title}: ${item.description}`),
  ];
}

/**
 * Builds the D-1 reminder message an admin copies and sends to a customer
 * the day before their lesson (see admin/page.tsx). Greeting/closing are
 * localized to the booking's own locale, not the admin's.
 */
export function buildReminderMessage(params: {
  name: string;
  date: string;
  program: string;
  timeSlot: string;
  content: SiteContent;
}): string {
  const { name, date, program, timeSlot, content } = params;
  return [
    content.preLessonGuidance.reminderGreeting(name, date, program, timeSlot),
    "",
    ...content.preLessonGuidance.items.map(
      (item) => `${item.icon} ${item.title}: ${item.description}`
    ),
    "",
    content.preLessonGuidance.reminderClosing,
  ].join("\n");
}
