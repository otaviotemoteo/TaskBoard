export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
  userId: string; // Para integração com NextAuth
}

export interface StageType {
  id: string;
  title: string;
  order: number; // Para ordenação dos estágios
  color?: string; // Cor personalizada do estágio
  taskIds: string[]; // IDs das tasks neste estágio
  boardId: string;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  userId: string;
  stages: StageType[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}
