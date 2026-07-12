import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { Instructor } from "@/components/sections/instructor";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = getContent(isLocale(locale) ? locale : defaultLocale);
  return {
    title: content.pageMeta.instructor.title,
    description: content.pageMeta.instructor.description,
  };
}

export default function InstructorPage() {
  return <Instructor />;
}
