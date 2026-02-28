"use client";

export function SkeletonProfileQuestions() {
  return (
    <div className="space-y-4">
      <div className="h-5 w-2/5 animate-pulse rounded bg-gray-200" />
      <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
      <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
      <div className="h-24 w-full animate-pulse rounded-xl bg-gray-100" />
    </div>
  );
}
