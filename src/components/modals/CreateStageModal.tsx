"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Hash, Palette, ArrowRight } from "lucide-react";
import { useState } from "react";
import { StageType } from "@/types/task";

interface CreateStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateStage: (
    stageData: Omit<StageType, "id" | "taskIds" | "boardId">
  ) => void;
  nextOrder: number;
}

export const CreateStageModal = ({
  isOpen,
  onClose,
  onCreateStage,
  nextOrder,
}: CreateStageModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    color: "#6366f1",
  });

  const colorOptions = [
    { name: "Azul", value: "#3b82f6" },
    { name: "Roxo", value: "#8b5cf6" },
    { name: "Rosa", value: "#ec4899" },
    { name: "Vermelho", value: "#ef4444" },
    { name: "Laranja", value: "#f59e0b" },
    { name: "Verde", value: "#10b981" },
    { name: "Cyan", value: "#06b6d4" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Cinza", value: "#6b7280" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    onCreateStage({
      title: formData.title,
      color: formData.color,
      order: nextOrder,
    });

    // Reset form
    setFormData({
      title: "",
      color: "#6366f1",
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          />

          {/* Modal */}
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
                  Novo Estágio
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Organize suas tasks em estágios personalizados
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Título */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Hash size={16} />
                  Nome do Estágio
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Ex: Em Revisão, Aguardando Feedback..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>

              {/* Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Preview:</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: formData.color }}
                  />
                  <span className="font-medium text-gray-900">
                    {formData.title || "Nome do Estágio"}
                  </span>
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                    0
                  </span>
                </div>
              </div>

              {/* Cor */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Palette size={16} />
                  Cor do Estágio
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, color: color.value }))
                      }
                      className={`
                        w-full aspect-square rounded-lg border-2 transition-all relative overflow-hidden
                        ${
                          formData.color === color.value
                            ? "border-gray-900 scale-110"
                            : "border-gray-300 hover:border-gray-400"
                        }
                      `}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {formData.color === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
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
                  Criar Estágio
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
