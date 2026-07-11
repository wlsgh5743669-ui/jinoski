import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { WhyJinoSki } from "@/components/sections/why-jinoski";
import { LessonProgram } from "@/components/sections/lesson-program";
import { Pricing } from "@/components/sections/pricing";
import { Instructor } from "@/components/sections/instructor";
import { Gallery } from "@/components/sections/gallery";
import { Reviews } from "@/components/sections/reviews";
import { Directions } from "@/components/sections/directions";
import { Reservation } from "@/components/sections/reservation";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <WhyJinoSki />
      <Instructor />
      <LessonProgram />
      <Pricing />
      <Gallery />
      <Reviews />
      <Directions />
      <Reservation />
    </>
  );
}
