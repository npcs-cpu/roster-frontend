'use client'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const ACTIVITY_COLORS = {
  flight:  'bg-blue-100 text-blue-800',
  hotel:   'bg-purple-100 text-purple-800',
  standby: 'bg-yellow-100 text-yellow-800',
  reserve: 'bg-orange-100 text-orange-800',
  rest:    'bg-green-100 text-green-800',
  day_off: 'bg-slate-100 text-slate-600',
  other:   'bg-slate-100 text-slate-600',
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month - 1, 1).getDay()
}

function padDate(n) {
  return String(n).padStart(2, '0')
}

function matchesFilters(item, searchCrewId, activityFilter, flyingFilter) {
  if (searchCrewId) {
    const q = searchCrewId.trim().toLowerCase()
    if (!item.crew_ids.some(id => id.toLowerCase().includes(q))) return false
  }

  if (activityFilter !== 'all') {
    if (!item.activity_type || item.activity_type !== activityFilter) return false
  }

  if (flyingFilter === 'flying' && item.activity_type !== 'flight') return false
  if (flyingFilter === 'nonflying' && item.activity_type === 'flight') return false

  return true
}

export default function CalendarGrid({
  year, month, calendarData, loading,
  selectedDate, onDayClick,
  searchCrewId, activityFilter, flyingFilter
}) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDow = getFirstDayOfWeek(year, month)
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${padDate(today.getMonth()+1)}-${padDate(today.getDate())}`

  // Build a map of date -> items
  const dayMap = {}
  if (calendarData?.days) {
    for (const d of calendarData.days) {
      dayMap[d.date] = d.items || []
    }
  }

  const cells = []
  // Empty cells before first day
  for (let i = 0; i < firstDow; i++) {
    cells.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d)
  }

  return (
    <div className="w-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="min-h-[100px]" />
          }

          const dateStr = `${year}-${padDate(month)}-${padDate(day)}`
          const rawItems = dayMap[dateStr] || []
          const items = rawItems.filter(item =>
            matchesFilters(item, searchCrewId, activityFilter, flyingFilter)
          )

          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDate
          const MAX_VISIBLE = 4

          return (
            <div
              key={dateStr}
              onClick={() => onDayClick(dateStr)}
              className={`
                min-h-[100px] rounded-lg border cursor-pointer p-1.5 transition-all
                ${isSelected
                  ? 'border-blue-400 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'}
              `}
            >
              {/* Date number */}
              <div className="flex items-center justify-between mb-1">
                <span className={`
                  text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full
                  ${isToday ? 'bg-blue-500 text-white' : 'text-slate-600'}
                `}>
                  {day}
                </span>
                {items.length > 0 && (
                  <span className="text-[10px] text-slate-400">{items.length}</span>
                )}
              </div>

              {/* Activity lines */}
              <div className="space-y-0.5">
                {items.slice(0, MAX_VISIBLE).map((item, i) => {
                  const colorClass = ACTIVITY_COLORS[item.activity_type] || ACTIVITY_COLORS.other
                  const crewStr = item.crew_ids.slice(0, 3).join(', ') +
                    (item.crew_ids.length > 3 ? ` +${item.crew_ids.length - 3}` : '')
                  return (
                    <div
                      key={i}
                      className={`text-[10px] rounded px-1 py-0.5 truncate ${colorClass}`}
                      title={`${item.label} — ${item.crew_ids.join(', ')}`}
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.crew_ids.length > 0 && (
                        <span className="ml-1 opacity-70">— {crewStr}</span>
                      )}
                    </div>
                  )
                })}
                {items.length > MAX_VISIBLE && (
                  <div className="text-[10px] text-slate-400 pl-1">
                    +{items.length - MAX_VISIBLE} more
                  </div>
                )}
              </div>

              {loading && items.length === 0 && (
                <div className="mt-1 text-[10px] text-slate-300 animate-pulse">…</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
