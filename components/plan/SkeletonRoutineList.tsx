"use client";

import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  count?: number;
};

export function SkeletonRoutineList({ count = 4 }: Props) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, routineIdx) => (
        <div key={`routine-${routineIdx}`} className="space-y-3">
          {/* Routine title */}
          <Skeleton className="h-[18px] w-[45%]" />

          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, exerciseIdx) => (
              <div
                key={`exercise-${routineIdx}-${exerciseIdx}`}
                className="flex items-center gap-3 p-4 h-24 rounded-xl border border-gray-200 bg-white"
              >
                {/* Exercise icon */}
                <Skeleton className="h-10 w-10 rounded-md" />

                {/* Text */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-[14px] w-[60%]" />
                  <Skeleton className="h-[12px] w-[40%]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
