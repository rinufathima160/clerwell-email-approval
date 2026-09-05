type FiltersProps = {
  search: string;
  priorityFilter: string;
  riskFilter: string;
  statusFilter: string;
  setSearch: (value: string) => void;
  setPriorityFilter: (value: string) => void;
  setRiskFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  clearFilters: () => void;
};

function Filters({
  search,
  priorityFilter,
  riskFilter,
  statusFilter,
  setSearch,
  setPriorityFilter,
  setRiskFilter,
  setStatusFilter,
  clearFilters,
}: FiltersProps) {
  return (
    <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-xl shadow-black/10 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">
            Filter queue
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Find emails that need your attention
          </p>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          >
            <circle
              cx="11"
              cy="11"
              r="6.5"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M16 16L20 20"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>

          <input
            type="text"
            placeholder="Search emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search emails"
            className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-10 pr-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 hover:border-zinc-600 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/10"
          />
        </div>

        {/* Priority */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          aria-label="Filter by priority"
          className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-300 outline-none transition hover:border-zinc-600 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/10"
        >
          <option value="all">All priorities</option>
          <option value="critical">Critical</option>
          <option value="urgent">Urgent</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>

        {/* Risk */}
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          aria-label="Filter by risk"
          className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-300 outline-none transition hover:border-zinc-600 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/10"
        >
          <option value="all">All risks</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-300 outline-none transition hover:border-zinc-600 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/10"
        >
          <option value="all">All statuses</option>
          <option value="pending_review">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="escalated">Escalated</option>
        </select>
      </div>
    </section>
  );
}

export default Filters;