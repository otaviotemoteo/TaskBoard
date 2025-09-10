import { useState, useCallback } from "react";
import { Task, StageType, Board } from "@/types/task";

export const useTaskBoard = (initialBoard: Board) => {
  const [board, setBoard] = useState<Board>(initialBoard);

  // Criar nova task
  const createTask = useCallback(
    (
      stageId: string,
      taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">
    ) => {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "current-user", // Virá do NextAuth
      };

      setBoard((prev) => ({
        ...prev,
        tasks: [...prev.tasks, newTask],
        stages: prev.stages.map((stage) =>
          stage.id === stageId
            ? { ...stage, taskIds: [...stage.taskIds, newTask.id] }
            : stage
        ),
      }));
    },
    []
  );

  // Criar novo estágio
  const createStage = useCallback(
    (stageData: Omit<StageType, "id" | "taskIds" | "boardId">) => {
      const newStage: StageType = {
        ...stageData,
        id: `stage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        taskIds: [],
        boardId: board.id,
      };

      setBoard((prev) => ({
        ...prev,
        stages: [...prev.stages, newStage].sort((a, b) => a.order - b.order),
      }));
    },
    [board.id]
  );

  // Atualizar task existente
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setBoard((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      ),
    }));
  }, []);

  // Mover task entre estágios
  const moveTask = useCallback(
    (
      taskId: string,
      fromStageId: string,
      toStageId: string,
      newIndex?: number
    ) => {
      setBoard((prev) => {
        const updatedStages = prev.stages.map((stage) => {
          if (stage.id === fromStageId) {
            return {
              ...stage,
              taskIds: stage.taskIds.filter((id) => id !== taskId),
            };
          }

          if (stage.id === toStageId) {
            const newTaskIds = [...stage.taskIds];
            if (newIndex !== undefined) {
              newTaskIds.splice(newIndex, 0, taskId);
            } else {
              newTaskIds.push(taskId);
            }
            return {
              ...stage,
              taskIds: newTaskIds,
            };
          }

          return stage;
        });

        return {
          ...prev,
          stages: updatedStages,
          tasks: prev.tasks.map((task) =>
            task.id === taskId ? { ...task, updatedAt: new Date() } : task
          ),
        };
      });
    },
    []
  );

  // Deletar task
  const deleteTask = useCallback((taskId: string) => {
    setBoard((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== taskId),
      stages: prev.stages.map((stage) => ({
        ...stage,
        taskIds: stage.taskIds.filter((id) => id !== taskId),
      })),
    }));
  }, []);

  // Deletar estágio (move tasks para o primeiro estágio)
  const deleteStage = useCallback((stageId: string) => {
    setBoard((prev) => {
      const stageToDelete = prev.stages.find((s) => s.id === stageId);
      const remainingStages = prev.stages.filter((s) => s.id !== stageId);

      if (stageToDelete && remainingStages.length > 0) {
        // Move tasks para o primeiro estágio restante
        const firstStage = remainingStages[0];
        const updatedStages = remainingStages.map((stage) =>
          stage.id === firstStage.id
            ? {
                ...stage,
                taskIds: [...stage.taskIds, ...stageToDelete.taskIds],
              }
            : stage
        );

        return {
          ...prev,
          stages: updatedStages,
        };
      }

      // Se é o último estágio, apenas remove (tasks ficam órfãs, mas isso pode ser tratado)
      return {
        ...prev,
        stages: remainingStages,
      };
    });
  }, []);

  // Reordenar estágios
  const reorderStages = useCallback((stageId: string, newOrder: number) => {
    setBoard((prev) => ({
      ...prev,
      stages: prev.stages
        .map((stage) =>
          stage.id === stageId ? { ...stage, order: newOrder } : stage
        )
        .sort((a, b) => a.order - b.order),
    }));
  }, []);

  // Getters úteis
  const getTasksByStageId = useCallback(
    (stageId: string) => {
      const stage = board.stages.find((s) => s.id === stageId);
      if (!stage) return [];

      return stage.taskIds
        .map((taskId) => board.tasks.find((task) => task.id === taskId))
        .filter(Boolean) as Task[];
    },
    [board]
  );

  const getTaskById = useCallback(
    (taskId: string) => {
      return board.tasks.find((task) => task.id === taskId);
    },
    [board.tasks]
  );

  // Salvar no localStorage (persistência local)
  const saveToLocalStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`taskBoard-${board.id}`, JSON.stringify(board));
    }
  }, [board]);

  // Carregar do localStorage
  const loadFromLocalStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`taskBoard-${board.id}`);
      if (saved) {
        try {
          const parsedBoard = JSON.parse(saved);
          setBoard(parsedBoard);
        } catch (error) {
          console.error("Erro ao carregar dados do localStorage:", error);
        }
      }
    }
  }, [board.id]);

  return {
    board,
    createTask,
    createStage,
    updateTask,
    moveTask,
    deleteTask,
    deleteStage,
    reorderStages,
    getTasksByStageId,
    getTaskById,
    saveToLocalStorage,
    loadFromLocalStorage,
  };
};
