import { Task, StageType } from "./task";

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageId: string;
  onCreateTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">
  ) => void;
}

export interface CreateStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateStage: (stage: Omit<StageType, "id" | "taskIds" | "boardId">) => void;
}

export type DragEndEvent = {
  active: {
    id: string;
    data: {
      current: {
        type: "task" | "stage";
        task?: Task;
        stage?: StageType;
      };
    };
  };
  over: {
    id: string;
    data: {
      current: {
        type: "stage" | "task";
        accepts?: string[];
      };
    };
  } | null;
};
