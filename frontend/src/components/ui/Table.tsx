import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TableProps {
  children: React.ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-[2rem] border border-slate-100/60 shadow-sm bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-shadow duration-500">
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-slate-50/50 border-b border-slate-100/60 text-slate-500 font-black text-[10px] uppercase tracking-widest">
      {children}
    </thead>
  );
}

export function TableHeaderCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-8 py-5 whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return (
    <tbody className="divide-y divide-slate-50/80 text-sm font-medium text-slate-700">
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={`hover:bg-slate-50/50 transition-colors group ${className}`}>
      {children}
    </tr>
  );
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  className?: string;
}

export function TableCell({ children, className = '', ...props }: TableCellProps) {
  return (
    <td className={`px-8 py-5 whitespace-nowrap group-hover:text-slate-900 transition-colors ${className}`} {...props}>
      {children}
    </td>
  );
}

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export function TablePagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }: TablePaginationProps) {
  if (totalItems <= itemsPerPage) return null;

  return (
    <div className="px-8 py-5 border-t border-slate-50 flex items-center justify-between bg-slate-50/30 rounded-b-[2rem]">
      <p className="text-xs font-bold text-slate-500">
        Showing <span className="text-slate-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="text-slate-900">{totalItems}</span>
      </p>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all text-slate-600 active:scale-95"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all text-slate-600 active:scale-95"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
