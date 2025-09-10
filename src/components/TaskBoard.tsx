"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { CreateTaskModal } from "./modals/CreateTaskModal";
import { CreateStageModal } from "./modals/CreateStageModal";
import { EditTaskModal } from "./modals/EditTaskModal";
import { useTaskBoard } from "@/hooks/useTaskBoard";
import { Board, Task, StageType } from "@/types/task";
import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { Stage } from "./Stage";

interface TaskBoardProps {
  initialBoard: Board;
}

export const TaskBoard = ({ initialBoard }: TaskBoardProps) => {
  const {
    board,
    createTask,
    createStage,
    moveTask,
    deleteTask,
    deleteStage,
    updateTask,
    getTasksByStageId,
    getTaskById,
  } = useTaskBoard(initialBoard);

  // Sensors para melhor UX no drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Estados dos modais
  const [activeId, setActiveId] = useState<string | null>(null);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [createStageModalOpen, setCreateStageModalOpen] = useState(false);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTask = getTaskById(active.id as string);
    if (!activeTask) {
      setActiveId(null);
      return;
    }

    // Encontrar stage atual da task
    const currentStage = board.stages.find((stage) =>
      stage.taskIds.includes(active.id as string)
    );

    if (!currentStage) {
      setActiveId(null);
      return;
    }

    // Se dropped em um stage diferente
    if (over.id !== currentStage.id) {
      const overStage = board.stages.find((s) => s.id === over.id);
      if (overStage) {
        moveTask(active.id as string, currentStage.id, over.id as string);
      }
    }

    setActiveId(null);
  };

  const handleCreateTask = (stageId: string) => {
    setSelectedStageId(stageId);
    setCreateTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTaskModalOpen(true);
  };

  const handleCreateTaskSubmit = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">
  ) => {
    if (selectedStageId) {
      createTask(selectedStageId, taskData);
    }
  };

  const handleCreateStageSubmit = (
    stageData: Omit<StageType, "id" | "taskIds" | "boardId">
  ) => {
    createStage(stageData);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);
  };

  const getStageTitle = (stageId: string) => {
    return board.stages.find((s) => s.id === stageId)?.title || "";
  };

  const nextOrder = Math.max(...board.stages.map((s) => s.order), 0) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          {/* Títulos e informações do board */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
              {board.title}
            </h1>
            <p className="text-gray-600 text-lg">{board.description}</p>
            <div className="flex items-center gap-3 mt-3 text-sm text-gray-500 font-medium">
              <span>
                {board.stages.length} Estágio
                {board.stages.length > 1 ? "s" : ""}
              </span>
              <span className="text-gray-300">•</span>
              <span>
                {board.tasks.length} Task{board.tasks.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Botão Novo Estágio */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCreateStageModalOpen(true)}
            className="mt-4 sm:mt-0 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
          >
            <Plus size={20} />
            Novo Estágio
          </motion.button>
        </div>
      </motion.div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-6">
          {board.stages
            .sort((a, b) => a.order - b.order)
            .map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Stage
                  stage={stage}
                  tasks={getTasksByStageId(stage.id)}
                  onCreateTask={() => handleCreateTask(stage.id)}
                  onDeleteTask={deleteTask}
                  onEditTask={handleEditTask}
                  onDeleteStage={deleteStage}
                  onEditStage={(stage) => {
                    // TODO: Implementar modal de edição de stage
                    console.log("Edit stage:", stage);
                  }}
                />
              </motion.div>
            ))}

          {/* Empty state quando não há stages */}
          {board.stages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[400px] w-full"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum estágio ainda
                </h3>
                <p className="text-gray-600 mb-6">
                  Crie seu primeiro estágio para começar a organizar suas tasks
                </p>
                <button
                  onClick={() => setCreateStageModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar Primeiro Estágio
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="rotate-6 scale-105">
              <TaskCard task={getTaskById(activeId)!} isDragging={true} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      <CreateTaskModal
        isOpen={createTaskModalOpen}
        onClose={() => {
          setCreateTaskModalOpen(false);
          setSelectedStageId(null);
        }}
        onCreateTask={handleCreateTaskSubmit}
        stageTitle={selectedStageId ? getStageTitle(selectedStageId) : ""}
      />

      <CreateStageModal
        isOpen={createStageModalOpen}
        onClose={() => setCreateStageModalOpen(false)}
        onCreateStage={handleCreateStageSubmit}
        nextOrder={nextOrder}
      />

      <EditTaskModal
        isOpen={editTaskModalOpen}
        onClose={() => {
          setEditTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={deleteTask}
      />
    </div>
  );
};
