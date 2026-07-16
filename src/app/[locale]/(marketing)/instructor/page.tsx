import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { pageMetadata } from "@/lib/page-metadata";
import { Instructor } from "@/components/sections/instructor";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : defaultLocale;
  const content = getContent(resolvedLocale);
  return pageMetadata({
    locale: resolvedLocale,
    path: "instructor/",
    title: content.pageMeta.instructor.title,
    description: content.pageMeta.instructor.description,
    image: { url: content.instructor.photo, alt: content.instructor.name },
  });
}

export default function InstructorPage() {
  return <Instructor />;
}
