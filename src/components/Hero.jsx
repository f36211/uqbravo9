import { SmoothScrollHero } from "@/components/ui/SmoothScrollHero";
import ParallaxScrolls from "@/components/ui/murid"; // or wherever you placed it
import HorizontalCard from "@/components/ui/horizontalcard";

export default function HomePage() {
  return (
    <>
      <SmoothScrollHero />
      <div className="" id="students-7">
        <ParallaxScrolls className="" />
      </div>
      <div className="" id="achievements-7">
        <HorizontalCard />
      </div>
    </>
  );
}
