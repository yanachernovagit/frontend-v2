import { SkeletonLoader } from "@/components/shared";

export function SkeletonWelcome() {
  return (
    <div className="bg-blue w-full relative flex flex-col justify-center rounded-xl p-3">
      <div className="flex flex-col w-full pl-5 pr-6 space-y-2">
        <SkeletonLoader width={200} height={22} />
        <SkeletonLoader width={240} height={30} />
        <SkeletonLoader width={180} height={30} />
      </div>
    </div>
  );
}
