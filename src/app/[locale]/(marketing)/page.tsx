import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { WhyJinoSki } from "@/components/sections/why-jinoski";
import { MenuCards } from "@/components/sections/menu-cards";
import { Directions } from "@/components/sections/directions";
import { Reservation } from "@/components/sections/reservation";
import { SeasonPopup } from "@/components/sections/season-popup";

export default function HomePage() {
  return (
    <>
      <SeasonPopup />
      <Hero />
      <Stats />
      <WhyJinoSki />
      <MenuCards />
      <Directions />
      <Reservation />
    </>
  );
}
