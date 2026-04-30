"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@repo/ui/components/ui/pagination";

export interface DynamicPaginationProps {
    currentPage: number;
    totalPages: number;
}

export function DynamicPagination({
    currentPage,
    totalPages,
}: DynamicPaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <Pagination className="w-auto mx-0">
            <PaginationContent>
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious href={createPageURL(currentPage - 1)} />
                    </PaginationItem>
                )}
                
                {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    if (
                        p === 1 || 
                        p === totalPages || 
                        (p >= currentPage - 2 && p <= currentPage + 2)
                    ) {
                        return (
                            <PaginationItem key={p} className="hidden sm:inline-block">
                                <PaginationLink 
                                    href={createPageURL(p)} 
                                    isActive={currentPage === p}
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    } else if (
                        p === currentPage - 3 || 
                        p === currentPage + 3
                    ) {
                        return (
                            <PaginationItem key={p} className="hidden sm:inline-block">
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }
                    return null;
                })}

                {currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationNext href={createPageURL(currentPage + 1)} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
