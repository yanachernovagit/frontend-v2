"use client";

import { Fragment, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Dumbbell,
  ListChecks,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PhaseEnum, PHASE_LABELS } from "@/constants/enums";
import { RoutineVariation } from "@/types";

interface RoutineVariationsTableProps {
  data: RoutineVariation[];
  isLoading?: boolean;
  onEdit: (item: RoutineVariation) => void;
  onDelete: (item: RoutineVariation) => void;
  onCreate: () => void;
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getPhaseLabel(phase: number): string {
  return PHASE_LABELS[phase as PhaseEnum] ?? `Fase ${phase}`;
}

function formatAvailableWeeks(availableWeeks: number[]): string {
  if (!availableWeeks || availableWeeks.length === 0) return "-";
  return availableWeeks
    .slice()
    .sort((a, b) => a - b)
    .map((week) => `S${week}`)
    .join(" | ");
}

function getExerciseCount(item: RoutineVariation): number {
  return item.routines.reduce(
    (sum, routine) => sum + (routine.exercises?.length ?? 0),
    0,
  );
}

export function RoutineVariationsTable({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  onCreate,
}: RoutineVariationsTableProps) {
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((item) => item.name.toLowerCase().includes(term));
  }, [data, search]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between flex-wrap gap-5 p-7 rounded-2xl bg-gradient-to-br from-white via-purple/5 to-magent/8 border border-purple/20 transition-all duration-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-magent/12 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <h1 className="text-3xl font-bold text-black tracking-tight">
            Variaciones de Rutina
          </h1>
          <span className="px-3 py-1 rounded-lg bg-purple/10 text-xs text-purple font-bold uppercase tracking-wider">
            {filteredData.length}{" "}
            {filteredData.length === 1 ? "registro" : "registros"}
          </span>
        </div>
        <Button
          onClick={onCreate}
          className="bg-gradient-to-r from-purple to-magent hover:from-purple/90 hover:to-magent/90 shadow-[0_6px_20px_0_rgba(120,63,208,0.35),0_0_0_1px_rgba(255,255,255,0.3)_inset] hover:shadow-[0_8px_28px_0_rgba(120,63,208,0.45),0_0_0_1px_rgba(255,255,255,0.4)_inset] transition-all duration-500 font-bold relative z-10 border border-white/30 h-12 px-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear nuevo
        </Button>
      </div>

      <div className="relative w-full max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple/50 group-focus-within:text-purple transition-colors" />
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-12 pr-4 border border-purple/20 focus:border-purple focus:ring-2 focus:ring-purple/15 rounded-xl h-12 font-medium bg-white shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] focus:shadow-[0_4px_16px_0_rgba(120,63,208,0.15)] transition-all"
        />
      </div>

      <div className="border border-purple/15 rounded-2xl overflow-hidden bg-white shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] transition-shadow duration-300">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-purple/10 to-magent/8 border-b border-purple/20">
              <TableHead className="w-14" />
              <TableHead className="font-bold text-black h-14 text-sm uppercase tracking-wide">
                Nombre
              </TableHead>
              <TableHead className="font-bold text-black h-14 text-sm uppercase tracking-wide">
                Fase
              </TableHead>
              <TableHead className="font-bold text-black h-14 text-sm uppercase tracking-wide">
                Semanas disponibles
              </TableHead>
              <TableHead className="font-bold text-black h-14 text-sm uppercase tracking-wide">
                Contenido
              </TableHead>
              <TableHead className="font-bold text-black h-14 text-sm uppercase tracking-wide">
                Creado
              </TableHead>
              <TableHead className="w-32 text-right font-bold text-black pr-6 text-sm uppercase tracking-wide">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7} className="py-5">
                    <div className="h-5 bg-gradient-to-r from-purple/8 via-purple/12 to-purple/8 rounded-md animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-black-300"
                >
                  No hay variaciones para mostrar
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => {
                const isExpanded = expandedIds.has(item.id);
                const exerciseCount = getExerciseCount(item);

                return (
                  <Fragment key={item.id}>
                    <TableRow
                      className={`transition-all duration-150 border-b border-gray-100/50 group ${
                        isExpanded
                          ? "bg-gray-100"
                          : "hover:bg-gradient-to-r hover:from-purple/4 hover:to-magent/4"
                      }`}
                    >
                      <TableCell className="pl-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => toggleExpanded(item.id)}
                          className="rounded-lg hover:bg-purple/10"
                          title={
                            isExpanded ? "Contraer detalle" : "Expandir detalle"
                          }
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-purple" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-purple" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="py-4 text-black-400 font-semibold">
                        {item.name}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className="bg-purple/10 text-purple border border-purple/20 font-semibold">
                          {getPhaseLabel(item.phase)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className="bg-magent/10 text-magent border border-magent/20 font-semibold">
                          {formatAvailableWeeks(item.availableWeeks)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-600">
                        {item.routines.length} rutina
                        {item.routines.length !== 1 && "s"} | {exerciseCount}{" "}
                        ejercicio{exerciseCount !== 1 && "s"}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-600">
                        {formatDate(item.createdAt)}
                      </TableCell>
                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onEdit(item)}
                            className="hover:bg-purple/10 transition-all border border-transparent hover:border-purple/20 rounded-lg hover:scale-105"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4 text-purple" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onDelete(item)}
                            className="hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 rounded-lg hover:scale-105"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {isExpanded && (
                      <TableRow className="bg-gray-50/40">
                        <TableCell colSpan={7} className="py-2 px-4">
                          <div className="space-y-2">
                            {item.routines.length === 0 ? (
                              <p className="text-xs text-gray-500">
                                Esta variación no tiene rutinas.
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                                {item.routines
                                  .slice()
                                  .sort((a, b) => a.order - b.order)
                                  .map((routine, routineIndex) => (
                                    <div
                                      key={routine.id}
                                      className="rounded-lg border border-purple/15 bg-white p-2"
                                    >
                                      <div className="flex items-center justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                          <ListChecks className="w-3.5 h-3.5 text-purple shrink-0" />
                                          <p className="text-xs font-semibold text-black truncate">
                                            {routineIndex + 1}.{" "}
                                            {routine.routineCatalog?.title ??
                                              "Rutina sin catálogo"}
                                          </p>
                                        </div>
                                      </div>

                                      {routine.exercises.length === 0 ? (
                                        <p className="text-[11px] text-gray-500 pl-1">
                                          Sin ejercicios asignados.
                                        </p>
                                      ) : (
                                        <div className="space-y-1 pl-1">
                                          {routine.exercises
                                            .slice()
                                            .sort((a, b) => a.order - b.order)
                                            .map((exercise) => (
                                              <div
                                                key={exercise.id}
                                                className="flex items-center gap-1.5 py-0.5"
                                              >
                                                <Dumbbell className="w-3 h-3 text-magent shrink-0" />
                                                <p className="text-[11px] text-gray-700 leading-tight">
                                                  <span className="font-semibold mr-1">
                                                    {exercise.order}.
                                                  </span>
                                                  {exercise.exerciseCatalog
                                                    ?.name ??
                                                    "Ejercicio sin catálogo"}
                                                  {exercise.exerciseCatalog
                                                    ?.bodyPart
                                                    ? ` (${exercise.exerciseCatalog.bodyPart})`
                                                    : ""}
                                                </p>
                                              </div>
                                            ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
