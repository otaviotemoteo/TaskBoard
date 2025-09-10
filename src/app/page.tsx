"use client";

import { TaskBoard } from "@/components/TaskBoard";
import { mockBoard } from "@/data/mockData";

export default function HomePage() {
  return (
    <main>
      <TaskBoard initialBoard={mockBoard} />
    </main>
  );
}
