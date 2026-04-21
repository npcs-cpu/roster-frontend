'use client'

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

export default function TopBar({
  year, month, onPrev, onNext, onToday,
  searchCrewId, onSearchChange,
  activityFilter, onActivityChange,
  flyingFilter, onFlyingChange,
  lastSync, loading, onRefresh
}) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
      <div className="max-w-full px-4 py-3 flex flex-wrap items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-2">
          <span className="text-2xl">✈️</span>
          <span className="font-bold text-slate-800 text-lg tracking-tight">CrewLove</span>
        </div>

        {/* Month nav */}
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
            title="Previous month"
          >
            ◀
          </button>
          <span className="font-semibold text-slate-700 min-w-[140px] text-center text-sm">
            {MONTH_NAMES[month - 1]} {year}
          </span>
          <button
            onClick={onNext}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
            title="Next month"
          >
            ▶
          </button>
          <button
            onClick={onToday}
            className="ml-1 px-2 py-1 text-xs rounded border border-slate-300 hover:bg-slate-50 text-slate-600"
          >
            Today
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search crew ID..."
          value={searchCrewId}
          onChange={e => onSearchChange(e.target.value)}
          className="border border-slate-300 rounded px-2 py-1 text-sm w-36 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />

        {/* Activity filter */}
        <select
          value={activityFilter}
          onChange={e => onActivityChange(e.target.value)}
          className="border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="all">All Activities</option>
          <option value="flight">Flights</option>
          <option value="hotel">Hotel</option>
          <option value="standby">Standby</option>
          <option value="reserve">Reserve</option>
          <option value="rest">Rest</option>
          <option value="day_off">Day Off</option>
          <option value="other">Other</option>
        </select>

        {/* Flying filter */}
        <select
          value={flyingFilter}
          onChange={e => onFlyingChange(e.target.value)}
          className="border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="all">Flying + Non-Flying</option>
          <option value="flying">Flying Only</option>
          <option value="nonflying">Non-Flying Only</option>
        </select>

        {/* Sync status */}
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
          {lastSync && !loading && (
            <span>Synced {lastSync.toLocaleTimeString()}</span>
          )}
          {loading && <span className="text-blue-500 animate-pulse">Loading…</span>}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-2 py-1 rounded border border-slate-300 hover:bg-slate-50 text-slate-600 disabled:opacity-40"
            title="Refresh"
          >
            ↻ Refresh
          </button>
        </div>
      </div>
    </header>
  )
}
