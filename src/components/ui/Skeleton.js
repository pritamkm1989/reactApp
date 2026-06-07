import React from 'react';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-surface-200 dark:bg-surface-700 rounded-lg ${className}`} />
);

const ServiceCardSkeleton = () => (
  <div className="min-w-[200px] w-[200px] shrink-0">
    <Skeleton className="aspect-[4/3] rounded-t-2xl" />
    <div className="p-3 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-full" />
    </div>
  </div>
);

const ServiceListSkeleton = () => (
  <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5">
    <div className="flex gap-4 overflow-hidden">
      {[1, 2, 3, 4].map(i => <ServiceCardSkeleton key={i} />)}
    </div>
  </div>
);

const CategoryPillSkeleton = () => (
  <div className="flex gap-2 mb-8">
    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-24 rounded-xl" />)}
  </div>
);

const TableSkeleton = ({ rows = 3 }) => (
  <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
    <div className="p-5 border-b border-surface-100 dark:border-surface-700">
      <Skeleton className="h-6 w-48" />
    </div>
    <div className="divide-y divide-surface-100 dark:divide-surface-700">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="p-4 flex gap-4">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-32 flex-1" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-40 flex-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  </div>
);

export { Skeleton, ServiceCardSkeleton, ServiceListSkeleton, CategoryPillSkeleton, TableSkeleton };
export default Skeleton;
