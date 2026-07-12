import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string[];
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-900 pb-16 pt-40 sm:pb-20 sm:pt-44">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand-500/20 blur-[120px]" />
      <Container className="relative">
        <SectionHeading
          eyebrow={eyebrow}
          light
          title={
            <>
              {title[0]}
              {title[1] && (
                <>
                  <br />
                  {title[1]}
                </>
              )}
            </>
          }
          description={description}
        />
      </Container>
    </section>
  );
}
