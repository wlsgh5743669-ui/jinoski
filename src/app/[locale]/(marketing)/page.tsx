import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { WhyJinoSki } from "@/components/sections/why-jinoski";
import { MenuCards } from "@/components/sections/menu-cards";
import { Directions } from "@/components/sections/directions";
import { Reservation } from "@/components/sections/reservation";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <WhyJinoSki />
      <MenuCards />
      <Directions />
      <Reservation />
    </>
  );
}
