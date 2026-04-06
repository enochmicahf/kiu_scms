
interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseClasses = "relative overflow-hidden bg-slate-100/80 rounded-3xl";
  const variantClasses = variant === 'circular' ? "rounded-full" : "rounded-3xl";
  
  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
        <div className="shimmer absolute inset-0" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center space-x-6 p-8 border-b border-slate-50 relative group">
      <div className="flex-1 space-y-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-72" />
        <div className="flex space-x-3">
           <Skeleton className="h-6 w-20" />
           <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <Skeleton className="h-12 w-12" variant="circular" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-14 w-14" variant="circular" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <div className="space-y-2">
         <Skeleton className="h-3 w-full" />
         <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
    return (
      <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm">
        <Skeleton className="h-12 w-12 mb-6" />
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-16" />
      </div>
    );
}
