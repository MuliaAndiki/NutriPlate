import { Skeleton } from "@/components/ui/skeleton";

const SectionSkeleton = () => {
  return (
    <div className="w-full min-h-screen p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 w-48" />
      </div>
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
};

export default SectionSkeleton;
