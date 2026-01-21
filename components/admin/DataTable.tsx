"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  FileSearch,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type SortDirection = "asc" | "desc" | null;

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onCreate?: () => void;
  searchKey?: keyof T;
  title: string;
  isLoading?: boolean;
}

function SkeletonRow({
  columns,
  hasActions,
}: {
  columns: number;
  hasActions: boolean;
}) {
  return (
    <TableRow className="hover:bg-transparent">
      {Array.from({ length: columns }).map((_, i) => (
        <TableCell key={i} className="py-5 first:pl-6">
          <div className="h-5 bg-gradient-to-r from-purple/8 via-purple/12 to-purple/8 rounded-md animate-pulse" />
        </TableCell>
      ))}
      {hasActions && (
        <TableCell className="py-5 pr-6">
          <div className="flex items-center justify-end gap-2">
            <div className="h-9 w-9 bg-gradient-to-r from-purple/8 via-purple/12 to-purple/8 rounded-lg animate-pulse" />
            <div className="h-9 w-9 bg-gradient-to-r from-purple/8 via-purple/12 to-purple/8 rounded-lg animate-pulse" />
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onCreate,
  searchKey,
  title,
  isLoading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const itemsPerPage = 10;

  const handleSort = (key: keyof T | string) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  };

  const filteredAndSortedData = useMemo(() => {
    let result = data;

    if (searchKey) {
      result = data.filter((item) => {
        const value = item[searchKey];
        return String(value).toLowerCase().includes(search.toLowerCase());
      });
    }

    if (sortKey && sortDirection) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortKey as keyof T];
        const bValue = b[sortKey as keyof T];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();

        if (aString < bString) return sortDirection === "asc" ? -1 : 1;
        if (aString > bString) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchKey, search, sortKey, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between flex-wrap gap-5 p-7 rounded-2xl bg-gradient-to-br from-white via-purple/5 to-magent/8 border border-purple/20 shadow-[0_8px_24px_0_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.6)_inset] hover:shadow-[0_12px_32px_0_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.7)_inset] transition-all duration-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-magent/12 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-3 relative z-10">
          <h1 className="text-3xl font-bold text-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
            {title}
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-gradient-to-r from-purple via-magent to-purple rounded-full shadow-[0_2px_8px_rgba(120,63,208,0.4)]" />
            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple/15 to-magent/15 border border-purple/30 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)]">
              <p className="text-xs text-purple font-bold uppercase tracking-wider">
                {filteredAndSortedData.length}{" "}
                {filteredAndSortedData.length === 1 ? "registro" : "registros"}
              </p>
            </div>
          </div>
        </div>
        {onCreate && (
          <Button
            onClick={onCreate}
            className="bg-gradient-to-r from-purple to-magent hover:from-purple/90 hover:to-magent/90 shadow-[0_6px_20px_0_rgba(120,63,208,0.35),0_0_0_1px_rgba(255,255,255,0.3)_inset] hover:shadow-[0_8px_28px_0_rgba(120,63,208,0.45),0_0_0_1px_rgba(255,255,255,0.4)_inset] transition-all duration-500 font-bold relative z-10 border border-white/30 h-12 px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear nuevo
          </Button>
        )}
      </div>

      {searchKey && (
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple/50 group-focus-within:text-purple transition-colors" />
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="pl-12 pr-4 border border-purple/20 focus:border-purple focus:ring-2 focus:ring-purple/15 rounded-xl h-12 font-medium bg-white shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] focus:shadow-[0_4px_16px_0_rgba(120,63,208,0.15)] transition-all"
          />
        </div>
      )}

      <div className="border border-purple/15 rounded-2xl overflow-hidden bg-white shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.15)] transition-shadow duration-300">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-purple/10 to-magent/8 hover:bg-gradient-to-r hover:from-purple/12 hover:to-magent/10 border-b border-purple/20">
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className="font-bold text-black h-14 first:pl-6 text-sm uppercase tracking-wide"
                >
                  {col.sortable !== false ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-2 hover:text-purple transition-colors group"
                    >
                      <span>{col.label}</span>
                      {sortKey === col.key ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="w-4 h-4 text-purple" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-purple" />
                        )
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="w-32 text-right font-bold text-black pr-6 text-sm uppercase tracking-wide">
                  Acciones
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow
                    key={i}
                    columns={columns.length}
                    hasActions={hasActions}
                  />
                ))}
              </>
            ) : paginatedData.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="text-center py-20"
                >
                  <div className="flex flex-col items-center gap-5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple/20 to-magent/20 blur-xl rounded-full" />
                      <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple/10 to-magent/10 border-2 border-purple/20 flex items-center justify-center shadow-lg">
                        <FileSearch className="w-9 h-9 text-purple/60" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-black-400">
                        No se encontraron resultados
                      </p>
                      <p className="text-sm text-black-200 font-medium max-w-sm">
                        {search
                          ? "Intenta con otros términos de búsqueda"
                          : "No hay datos para mostrar"}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-gradient-to-r hover:from-purple/4 hover:to-magent/4 transition-all duration-150 border-b border-gray-100/50 last:border-0 group"
                >
                  {columns.map((col) => (
                    <TableCell
                      key={String(col.key)}
                      className="py-4 text-black-400 font-medium first:pl-6"
                    >
                      {col.render
                        ? col.render(item)
                        : String(item[col.key as keyof T] ?? "-")}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell className="py-4 pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onEdit(item)}
                            className="hover:bg-purple/10 transition-all border border-transparent hover:border-purple/20 rounded-lg hover:scale-105"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4 text-purple" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onDelete(item)}
                            className="hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 rounded-lg hover:scale-105"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-4 p-5 rounded-2xl bg-gradient-to-br from-purple/6 to-magent/6 border border-purple/15 shadow-[0_4px_16px_0_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple/12 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="px-4 py-2.5 rounded-xl bg-white border border-purple/20 shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] relative z-10">
            <span className="text-sm text-black-400 font-semibold">
              <span className="text-purple font-bold">
                {(page - 1) * itemsPerPage + 1}
              </span>
              {" - "}
              <span className="text-purple font-bold">
                {Math.min(page * itemsPerPage, filteredAndSortedData.length)}
              </span>
              {" de "}
              <span className="text-black font-bold">
                {filteredAndSortedData.length}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <Button
              variant="outline_magent"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="transition-all shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_0_rgba(235,68,156,0.2)] font-semibold"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>
            <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple to-magent text-white font-bold text-sm shadow-[0_4px_12px_0_rgba(120,63,208,0.3)] min-w-[80px] text-center border border-white/20">
              {page} / {totalPages}
            </div>
            <Button
              variant="outline_magent"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="transition-all shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_0_rgba(235,68,156,0.2)] font-semibold"
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
