import "../app/globals.css";
import { BentoGrid, BentoGridItem } from "@/magicui/bento-grid";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Magic UI - BentoGrid Demo</h1>
      <BentoGrid>
        <BentoGridItem>Item 1</BentoGridItem>
        <BentoGridItem>Item 2</BentoGridItem>
        <BentoGridItem>Item 3</BentoGridItem>
        <BentoGridItem>Item 4</BentoGridItem>
        <BentoGridItem>Item 5</BentoGridItem>
      </BentoGrid>
    </main>
  );
}
