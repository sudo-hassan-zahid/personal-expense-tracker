"use client";

import { useState } from "react";
import { addCategory, deleteCategory, updateCategory } from "@/actions/category";
import { ActionForm } from "./ActionForm";
import { Trash2, Edit2, Check, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { DeleteButton } from "./DeleteButton";

interface Category {
  id: string;
  name: string;
  type: string;
}

export function CategoryManager({ 
  initialExpenses, 
  initialIncomes 
}: { 
  initialExpenses: Category[], 
  initialIncomes: Category[] 
}) {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const categories = type === "expense" ? initialExpenses : initialIncomes;

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateCategory(id, editName);
      setEditingId(null);
      toast.success("Category updated successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };



  return (
    <div className="flex flex-col gap-8">
      {/* Type Toggle Slider */}
      <div className="flex justify-center">
        <div className="bg-(--color-canvas-dark) p-1 rounded-xl border border-(--color-hairline-on-dark) flex relative w-full max-w-[400px]">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-(--color-primary) rounded-lg transition-all duration-300 ease-out z-0 ${type === 'income' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`}
          />
          <button 
            onClick={() => setType("expense")}
            className={`flex-1 py-2 text-button relative z-10 transition-colors duration-200 ${type === 'expense' ? 'text-(--color-on-primary)' : 'text-(--color-muted) hover:text-(--color-on-dark)'}`}
          >
            Expenses
          </button>
          <button 
            onClick={() => setType("income")}
            className={`flex-1 py-2 text-button relative z-10 transition-colors duration-200 ${type === 'income' ? 'text-(--color-on-primary)' : 'text-(--color-muted) hover:text-(--color-on-dark)'}`}
          >
            Incomes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Categories List Section */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          <div className="bg-(--color-surface-card-dark) rounded-xl border border-(--color-hairline-on-dark) overflow-hidden">
            <div className="p-4 border-b border-(--color-hairline-on-dark) bg-(--color-canvas-dark)/30">
              <h3 className="text-title-sm text-(--color-on-dark)">Existing Categories</h3>
            </div>
            <div className="divide-y divide-(--color-hairline-on-dark)">
              {categories.length === 0 ? (
                <div className="p-8 text-center text-(--color-muted) italic">
                  No categories found for {type}s.
                </div>
              ) : (
                [...categories].sort((a, b) => a.name.localeCompare(b.name)).map((cat, index) => (
                  <div key={cat.id} className="flex items-center justify-between p-4 hover:bg-(--color-surface-elevated-dark) transition-colors animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-caption font-bold text-(--color-primary) w-6 opacity-50">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      {editingId === cat.id ? (
                        <div className="flex-1 flex items-center gap-2 mr-4">
                          <input 
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 bg-transparent border border-(--color-primary) rounded-md px-3 py-1.5 text-body-md focus:outline-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdate(cat.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                          />
                          <button onClick={() => handleUpdate(cat.id)} className="p-2 text-green-500 hover:bg-green-500/10 rounded-md">
                            <Check size={18} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-md">
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-body-md text-(--color-on-dark) font-medium">{cat.name}</span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleEdit(cat)}
                              className="p-2 text-(--color-muted) hover:text-(--color-primary) hover:bg-(--color-primary)/10 rounded-md transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <DeleteButton 
                              action={async () => await deleteCategory(cat.id)}
                              successMessage="Category deleted successfully"
                              className="p-2 text-(--color-muted) hover:text-(--color-trading-down) hover:bg-(--color-trading-down)/10 rounded-md transition-all"
                            >
                              <Trash2 size={16} />
                            </DeleteButton>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Add Category Section */}
        <div className="lg:col-span-4 order-1 lg:order-2">
          <div className="bg-(--color-surface-card-dark) p-6 rounded-xl border border-(--color-hairline-on-dark)">
            <h3 className="text-title-md mb-4 flex items-center gap-2">
              <Plus size={20} className="text-(--color-primary)" />
              Add {type === 'expense' ? 'Expense' : 'Income'} Category
            </h3>
            <ActionForm 
              action={addCategory} 
              successMessage="Category added successfully"
              className="flex flex-col gap-4"
            >
              <input type="hidden" name="type" value={type} />
              <div>
                <label className="block text-body-sm mb-1.5 text-(--color-muted)">Category Name</label>
                <input 
                  required 
                  name="name" 
                  placeholder="e.g. Food, Rent, Salary"
                  className="w-full bg-transparent border border-(--color-hairline-on-dark) rounded-lg px-4 py-2.5 text-body-md focus:border-(--color-primary) focus:outline-none transition-all"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-(--color-primary) text-(--color-on-primary) text-button rounded-lg py-3 hover:bg-(--color-primary-active) transition-all shadow-lg shadow-blue-500/10"
              >
                Create Category
              </button>
            </ActionForm>
          </div>
        </div>
      </div>
    </div>
  );
}
