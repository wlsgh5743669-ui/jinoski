import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { pageMetadata } from "@/lib/page-metadata";
import { TeamCertificates } from "@/components/sections/team-certificates";
import { Instructor } from "@/components/sections/instructor";
import { InstructorCards } from "@/components/sections/instructor-cards";

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

export default async function InstructorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // 한국어: 강사진 카드를 맨 위로, 대표 소개는 아래 작은 칸 (대표 11-19). 영어·중국어는 강사진 카드가 없어서 그대로.
  if (locale === "ko") {
    return (
      <>
        <InstructorCards top />
        <Instructor compact />
        <TeamCertificates />
      </>
    );
  }
  return (
    <>
      <Instructor />
      <InstructorCards />
      <TeamCertificates />
    </>
  );
}
