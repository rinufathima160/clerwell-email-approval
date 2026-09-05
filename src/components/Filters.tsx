type FiltersProps = {
  search: string;
  priorityFilter: string;
  riskFilter: string;
  setSearch: (value: string) => void;
  setPriorityFilter: (value: string) => void;
  setRiskFilter: (value: string) => void;
  clearFilters: () => void;
};

function Filters({
  search,
  priorityFilter,
  riskFilter,
  setSearch,
  setPriorityFilter,
  setRiskFilter,
  clearFilters,
}: FiltersProps) {
  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]">

        {/* Search */}
        <div className="min-w-0">
          <label
            htmlFor="email-search"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Search
          </label>

          <input
            id="email-search"
            type="text"
            placeholder="Search emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              h-10
              w-full
              rounded-lg
              border
              border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-800
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-slate-500
              focus:ring-2
              focus:ring-slate-200
            "
          />
        </div>

        {/* Priority */}
        <div>
          <label
            htmlFor="priority-filter"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Priority
          </label>

          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
            className="
              h-10
              w-full
              rounded-lg
              border
              border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-700
              outline-none
              transition
              focus:border-slate-500
              focus:ring-2
              focus:ring-slate-200
            "
          >
            <option value="all">All priorities</option>
            <option value="critical">Critical</option>
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Risk */}
        <div>
          <label
            htmlFor="risk-filter"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Risk
          </label>

          <select
            id="risk-filter"
            value={riskFilter}
            onChange={(e) =>
              setRiskFilter(e.target.value)
            }
            className="
              h-10
              w-full
              rounded-lg
              border
              border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-700
              outline-none
              transition
              focus:border-slate-500
              focus:ring-2
              focus:ring-slate-200
            "
          >
            <option value="all">All risks</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Clear filters */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={clearFilters}
            className="
              h-10
              w-full
              rounded-lg
              border
              border-slate-300
              bg-white
              px-4
              text-sm
              font-medium
              text-slate-700
              transition
              hover:bg-slate-50
              hover:border-slate-400
              active:bg-slate-100
              focus:outline-none
              focus:ring-2
              focus:ring-slate-200
              sm:w-auto
            "
          >
            Clear filters
          </button>
        </div>

      </div>
    </section>
  );
}

export default Filters;