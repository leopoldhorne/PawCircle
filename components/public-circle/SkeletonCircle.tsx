import { Skeleton } from "../ui/skeleton";

const SkeletonCircle = () => {
    return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 w-full justify-center">
        {/* Profile Image */}
        <Skeleton className="h-14 w-14 rounded-full" />

        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* Blurb */}
      <div className="rounded-2xl bg-slate-50 px-4 py-3 w-full">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>

      {/* Images Grid */}
      <div className="rounded-2xl bg-slate-50 px-4 py-4 w-full">
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <Skeleton className="aspect-square w-full rounded-xl" />
          <Skeleton className="aspect-square w-full rounded-xl" />
        </div>
      </div>

      {/* Support Section */}
      <div className="rounded-2xl bg-slate-50 px-4 py-4 space-y-3 text-center w-full">
        <Skeleton className="h-4 w-40 mx-auto" />
        <Skeleton className="h-3 w-56 mx-auto" />
        <Skeleton className="h-10 w-44 mx-auto rounded-full" />
      </div>
    </>
    );
}

export default SkeletonCircle;
