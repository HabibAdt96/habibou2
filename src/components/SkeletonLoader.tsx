import React from "react";

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-gray-100 dark:bg-white/5 rounded-3xl mb-6"></div>
      <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-full w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-full w-1/2 mb-8"></div>
      <div className="flex justify-between items-end">
        <div className="h-6 bg-gray-100 dark:bg-white/5 rounded-full w-24"></div>
        <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-xl"></div>
      </div>
    </div>
  );
}

export function SkeletonHeader() {
  return (
    <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 p-4 md:p-6 animate-pulse">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="w-32 h-8 bg-gray-100 dark:bg-white/5 rounded-xl"></div>
        <div className="hidden md:flex gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-20 h-4 bg-gray-100 dark:bg-white/5 rounded-full"></div>
          ))}
        </div>
        <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-full"></div>
      </div>
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505]">
      <SkeletonHeader />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Categories Skeletons */}
        <div className="flex gap-4 mb-12 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="w-32 h-12 bg-white dark:bg-[#111] rounded-full shrink-0 animate-pulse border border-gray-100 dark:border-white/5"></div>
          ))}
        </div>

        {/* Grid Skeletons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
