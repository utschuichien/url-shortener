import React from 'react';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between mt-8 border-t-2 border-foreground pt-6">
            <button
                className="neobrutalist-button bg-white text-foreground px-4 py-2 border-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
            >
                Trang trước
            </button>
            <span className="font-semibold text-foreground bg-secondary px-4 py-2 border-2 border-foreground shadow-[1px_1px_0_#1a1a1a]">
                Trang {page} / {totalPages}
            </span>
            <button
                className="neobrutalist-button bg-white text-foreground px-4 py-2 border-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
            >
                Trang sau
            </button>
        </div>
    );
}
