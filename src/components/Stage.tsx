"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, MoreVertical, Trash2, Edit2 } from "lucide-react";
import { StageType, Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableTaskProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

function SortableTask({ task, onEdit, onDelete }: SortableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

interface StageProps {
  stage: StageType;
  tasks: Task[];
  onCreateTask: () => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteStage: (stageId: string) => void;
  onEditStage: (stage: StageType) => void;
}

export const Stage = ({
  stage,
  tasks,
  onCreateTask,
  onDeleteTask,
  onEditTask,
  onDeleteStage,
  onEditStage,
}: StageProps) => {
  const [showActions, setShowActions] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
    data: {
      type: "stage",
      accepts: ["task"],
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        bg-gray-50 rounded-lg p-4 min-h-[500px] w-80 flex flex-col
        border-2 transition-all duration-200
        ${isOver ? "border-blue-300 bg-blue-50" : "border-transparent"}
      `}
    >
      {/* Header do Stage */}
      <div
        className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: stage.color || "#6b7280" }}
          />
          <h2 className="font-semibold text-gray-900">{stage.title}</h2>
          <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: showActions ? 1 : 0 }}
            onClick={() => onEditStage(stage)}
            className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700"
          >
            <Edit2 size={16} />
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: showActions ? 1 : 0 }}
            onClick={() => onDeleteStage(stage.id)}
            className="p-1 rounded hover:bg-red-100 text-gray-500 hover:text-red-500"
          >
            <Trash2 size={16} />
          </motion.button>

          <button
            onClick={onCreateTask}
            className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-blue-600"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Lista de Tasks */}
      <div ref={setNodeRef} className="flex-1 space-y-3 min-h-[400px]">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.05,
                }}
              >
                {/* <-- Aqui substituímos TaskCard direto por SortableTask -->
               O SortableTask já aplica useSortable, então o drag funciona */}
                <SortableTask
                  task={task}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </SortableContext>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-gray-400"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
              <Plus size={24} />
            </div>
            <p className="text-sm">Nenhuma task ainda</p>
            <button
              onClick={onCreateTask}
              className="text-blue-500 hover:text-blue-600 text-sm mt-2 font-medium"
            >
              Criar primeira task
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
