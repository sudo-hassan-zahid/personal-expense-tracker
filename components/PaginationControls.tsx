"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onLimitChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    if (name === 'limit') {
       params.set('page', '1'); // reset to page 1 on limit change
    }
    return params.toString();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-(--color-hairline-on-dark) gap-4">
      <div className="text-caption text-(--color-muted)">
        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
           <span className="text-caption text-(--color-muted)">Per page:</span>
           <select 
             value={itemsPerPage}
             onChange={(e) => {
               const val = parseInt(e.target.value);
               if (onLimitChange) onLimitChange(val);
               else router.push(pathname + "?" + createQueryString("limit", String(val)), { scroll: false });
             }}
             className="bg-transparent border border-(--color-hairline-on-dark) rounded-md px-2 py-1 text-body-sm text-(--color-on-dark) focus:border-(--color-primary) focus:outline-none"
           >
             <option value="5" className="bg-(--color-surface-elevated-dark)">5</option>
             <option value="10" className="bg-(--color-surface-elevated-dark)">10</option>
             <option value="20" className="bg-(--color-surface-elevated-dark)">20</option>
             <option value="50" className="bg-(--color-surface-elevated-dark)">50</option>
             <option value="100" className="bg-(--color-surface-elevated-dark)">100</option>
           </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newPage = Math.max(1, currentPage - 1);
              if (onPageChange) onPageChange(newPage);
              else router.push(pathname + "?" + createQueryString("page", String(newPage)), { scroll: false });
            }}
            disabled={currentPage === 1}
            className={`p-2 rounded border border-(--color-hairline-on-dark) ${currentPage === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-(--color-surface-elevated-dark) text-(--color-on-dark)'}`}
          >
            <ChevronLeft size={16} />
          </button>
          <div className="text-body-sm text-(--color-on-dark) px-2">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => {
              const newPage = Math.min(totalPages, currentPage + 1);
              if (onPageChange) onPageChange(newPage);
              else router.push(pathname + "?" + createQueryString("page", String(newPage)), { scroll: false });
            }}
            disabled={currentPage === totalPages}
            className={`p-2 rounded border border-(--color-hairline-on-dark) ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : 'hover:bg-(--color-surface-elevated-dark) text-(--color-on-dark)'}`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
