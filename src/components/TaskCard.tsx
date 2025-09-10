"use client";

import { motion } from "framer-motion";
import { Calendar, Flag, MoreVertical, Trash2, Edit } from "lucide-react";
import { Task } from "@/types/task";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onDelete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  isDragging?: boolean;
}

export const TaskCard = ({
  task,
  onDelete,
  onEdit,
  isDragging,
}: TaskCardProps) => {
  const [showActions, setShowActions] = useState(false);

  const priorityColors = {
    low: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    high: "bg-red-100 text-red-700 border-red-200",
  };

  const priorityIcons = {
    low: "●",
    medium: "●●",
    high: "●●●",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDragging ? 0.5 : 1,
        y: 0,
        scale: isDragging ? 0.95 : 1,
        rotate: isDragging ? 5 : 0,
      }}
      whileHover={{
        scale: 1.02,
        y: -2,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        bg-white rounded-lg border border-gray-200 p-4 cursor-grab
        hover:shadow-md transition-all duration-200 relative
        ${isDragging ? "shadow-2xl z-50" : ""}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header com prioridade e ações */}
      <div className="flex items-start justify-between mb-2">
        <span
          className={`
          text-xs px-2 py-1 rounded-full border font-medium
          ${priorityColors[task.priority]}
        `}
        >
          {priorityIcons[task.priority]} {task.priority.toUpperCase()}
        </span>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showActions ? 1 : 0 }}
          className="flex items-center gap-1"
        >
          <button
            onClick={() => onEdit?.(task)}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete?.(task.id)}
            className="p-1 rounded hover:bg-red-50 text-gray-500 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </motion.div>
      </div>

      {/* Título */}
      <h3 className="font-semibold text-gray-900 mb-2 leading-tight">
        {task.title}
      </h3>

      {/* Descrição */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer com data */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{new Date(task.createdAt).toLocaleDateString("pt-BR")}</span>
        </div>
      </div>
    </motion.div>
  );
};
