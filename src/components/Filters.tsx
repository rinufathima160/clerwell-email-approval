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
    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search emails..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search emails"
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />

        {/* Priority */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          aria-label="Filter by priority"
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
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
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
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
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        >
          <option value="all">All statuses</option>
          <option value="pending_review">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Clear */}
        <button
          type="button"
          onClick={clearFilters}
          className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:bg-slate-200 sm:col-span-2 lg:col-span-4"
        >
          Clear filters
        </button>
      </div>
    </section>
  );
}

export default Filters;