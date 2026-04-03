import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your filters or search criteria.',
  hasFilters = false,
  onClear,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
      <div className="mb-6">
        <Inbox className="w-16 h-16 text-slate-400 dark:text-slate-600 stroke-1" fill="none" />
      </div>
      <h3 className="text-base font-medium text-slate-700 dark:text-slate-300 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 text-center max-w-xs mb-6">
        {description}
      </p>
      {hasFilters && onClear && (
        <button
          onClick={onClear}
          className="border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white bg-slate-50 hover:bg-slate-100 dark:bg-transparent dark:hover:bg-white/5 rounded-xl px-4 py-2 text-sm font-medium transition-all"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
