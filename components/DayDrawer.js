'use client'

const ACTIVITY_COLORS = {
  flight:  'bg-blue-100 text-blue-800 border-blue-200',
  hotel:   'bg-purple-100 text-purple-800 border-purple-200',
  standby: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  reserve: 'bg-orange-100 text-orange-800 border-orange-200',
  rest:    'bg-green-100 text-green-800 border-green-200',
  day_off: 'bg-slate-100 text-slate-600 border-slate-200',
  other:   'bg-slate-100 text-slate-600 border-slate-200',
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime(isoStr) {
  if (!isoStr) return ''
  try {
    return new Date(isoStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

export default function DayDrawer({ date, detail, loading, onClose, searchCrewId }) {
  const items = detail?.items || []
  const filteredItems = searchCrewId
    ? items.filter(item => item.crew_ids.some(id =>
        id.toLowerCase().includes(searchCrewId.trim().toLowerCase())
      ))
    : items

  return (
    <div className="w-80 border-l border-slate-200 bg-white flex flex-col shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">Selected Day</div>
          <div className="font-semibold text-slate-800 text-sm mt-0.5">{formatDate(date)}</div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-xl leading-none p-1"
          title="Close"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && (
          <div className="text-sm text-slate-400 animate-pulse text-center mt-8">Loading…</div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-sm text-slate-400 text-center mt-8">
            No activities{searchCrewId ? ` matching "${searchCrewId}"` : ''} on this day.
          </div>
        )}

        {!loading && filteredItems.map((item, i) => {
          const colorClass = ACTIVITY_COLORS[item.activity_type] || ACTIVITY_COLORS.other
          return (
            <div key={i} className={`rounded-lg border p-3 ${colorClass}`}>
              <div className="font-semibold text-sm mb-2">{item.label}</div>

              {/* Crew IDs */}
              <div className="flex flex-wrap gap-1 mb-2">
                {item.crew_ids.map(id => (
                  <span
                    key={id}
                    className="bg-white bg-opacity-60 border border-current border-opacity-30 rounded px-1.5 py-0.5 text-xs font-mono font-medium"
                  >
                    {id}
                  </span>
                ))}
              </div>

              {/* Event times if available */}
              {item.events && item.events.length > 0 && item.events[0].start_at && (
                <div className="text-[11px] opacity-70 mt-1">
                  {formatTime(item.events[0].start_at)}
                  {item.events[0].end_at && ` – ${formatTime(item.events[0].end_at)}`}
                </div>
              )}

              {/* Source count */}
              {item.events && (
                <div className="text-[10px] opacity-50 mt-1">
                  {item.crew_ids.length} crew · {item.events.length} feed{item.events.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer summary */}
      {!loading && filteredItems.length > 0 && (
        <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
          {filteredItems.length} activit{filteredItems.length === 1 ? 'y' : 'ies'} ·{' '}
          {[...new Set(filteredItems.flatMap(i => i.crew_ids))].length} crew members
        </div>
      )}
    </div>
  )
}
