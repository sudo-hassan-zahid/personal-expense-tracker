"use client";
import { useRouter, useSearchParams } from "next/navigation";

export function SortButton({ field }: { field: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort");
  const isDesc = currentSort === `${field}_desc`;
  
  return (
    <button 
      onClick={() => {
        const params = new URLSearchParams(searchParams.toString());
        if (isDesc) params.set("sort", `${field}_asc`);
        else params.set("sort", `${field}_desc`);
        router.push(`?${params.toString()}`);
      }} 
      className={`text-xs ml-1 hover:text-(--color-on-dark) px-1 rounded ${currentSort?.startsWith(field) ? 'text-(--color-primary)' : 'text-(--color-muted)'}`}
      title="Sort"
    >
      {isDesc ? '↓' : '↑'}
    </button>
  );
}
