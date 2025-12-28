import { Skeleton } from "@/components/ui/skeleton";

type SkeletonLoaderProps = {
  width: number | string;
  height: number | string;
};

export function SkeletonLoader({ width, height }: SkeletonLoaderProps) {
  return (
    <Skeleton
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}
