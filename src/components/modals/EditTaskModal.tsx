"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Flag, Type, AlignLeft, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Task } from "@/types/task";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const EditTaskModal = ({
  isOpen,
  onClose,
  task,
  onUpdateTask,
  onDeleteTask,
}: EditTaskModalProps) => {
  const [formData, setFormData] = useState<
    Pick<Task, "title" | "description" | "priority">
  >({
    title: "",
    description: "",
    priority: "medium",
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!task || !formData.title.trim()) return;

    onUpdateTask(task.id, {
      ...formData,
      updatedAt: new Date(),
    });

    onClose();
  };

  const handleDelete = () => {
    if (!task) return;
    onDeleteTask(task.id);
    onClose();
  };

  const priorityOptions = [
    { value: "low", label: "Baixa", color: "bg-green-500" },
    { value: "medium", label: "Média", color: "bg-yellow-500" },
    { value: "high", label: "Alta", color: "bg-red-500" },
  ];

  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Editar Task
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Criada em{" "}
                  {new Date(task.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                  title="Deletar task"
                >
                  <Trash2 size={18} />
                </button>

                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            {!showDeleteConfirm ? (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Type size={16} />
                    Título da Task
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <AlignLeft size={16} />
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Flag size={16} />
                    Prioridade
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            priority: option.value as any,
                          }))
                        }
                        className={`
                          flex items-center gap-2 p-3 rounded-lg border-2 transition-all
                          ${
                            formData.priority === option.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }
                        `}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${option.color}`}
                        />
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.title.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={24} className="text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Deletar Task
                  </h3>
                  <p className="text-gray-600">
                    Tem certeza que deseja deletar{" "}
                    <strong>"{task.title}"</strong>? Esta ação não pode ser
                    desfeita.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
