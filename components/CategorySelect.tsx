"use client";

import { useState } from "react";
import { addCategory } from "@/actions/category";

type Category = {
  id: string;
  name: string;
  type: string;
  parent_id: string | null;
};

export function CategorySelect({
  categories,
  type,
  name,
  label,
}: {
  categories: Category[];
  type: "expense" | "income";
  name: string;
  label: string;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("name", newCategoryName.trim());
      formData.set("type", type);
      await addCategory(formData);

      // Optimistically add to local state
      setLocalCategories((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          name: newCategoryName.trim(),
          type,
          parent_id: null,
        },
      ].sort((a, b) => a.name.localeCompare(b.name)));

      setNewCategoryName("");
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to add category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <label className="block text-body-sm mb-1 text-(--color-body-on-light)">
        {label}
      </label>

      {!isAdding ? (
        <div className="flex gap-2">
          <select
            required
            name={name}
            className="flex-1 bg-transparent border border-(--color-hairline-on-light) rounded-md px-3 py-2 text-body-md focus:border-(--color-primary) focus:outline-none"
          >
            {localCategories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.parent_id ? `  └ ${cat.name}` : cat.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="px-3 py-2 border border-(--color-hairline-on-light) rounded-md text-body-md text-(--color-primary) hover:bg-(--color-surface-soft-light) transition-colors shrink-0"
            title="Add new category"
          >
            +
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              className="flex-1 bg-transparent border border-(--color-primary) rounded-md px-3 py-2 text-body-md focus:outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCategory();
                }
                if (e.key === "Escape") {
                  setIsAdding(false);
                  setNewCategoryName("");
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddCategory}
              disabled={isSubmitting || !newCategoryName.trim()}
              className="px-3 py-2 bg-(--color-primary) text-(--color-on-primary) rounded-md text-body-md hover:bg-(--color-primary-active) transition-colors disabled:opacity-50 shrink-0"
            >
              {isSubmitting ? "..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewCategoryName("");
              }}
              className="px-3 py-2 border border-(--color-hairline-on-light) rounded-md text-body-md text-(--color-muted) hover:text-(--color-ink) transition-colors shrink-0"
            >
              ✕
            </button>
          </div>
          {/* Hidden select so the form still has a value while adding */}
          <select name={name} className="hidden" defaultValue={localCategories[0]?.name}>
            {localCategories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
