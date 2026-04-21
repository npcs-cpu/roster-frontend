'use client'

import { useState, useEffect, useCallback } from 'react'
import CalendarGrid from '../components/CalendarGrid'
import DayDrawer from '../components/DayDrawer'
import TopBar from '../components/TopBar'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://roster-backend-984r.onrender.com'

export default function Home() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [calendarData, setCalendarData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [dayDetail, setDayDetail] = useState(null)
  const [dayLoading, setDayLoading] = useState(false)
  const [searchCrewId, setSearchCrewId] = useState('')
  const [activityFilter, setActivityFilter] = useState('all')
  const [flyingFilter, setFlyingFilter] = useState('all')
  const [lastSync, setLastSync] = useState(null)

  const fetchMonth = useCallback(async (y, m) => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/calendar/month?year=${y}&month=${m}`)
      const data = await res.json()
      setCalendarData(data)
      setLastSync(new Date())
    } catch (e) {
      console.error('Failed to fetch month', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMonth(year, month)
  }, [year, month, fetchMonth])

  const handleDayClick = async (date) => {
    setSelectedDate(date)
    setDayLoading(true)
    try {
      const res = await fetch(`${API}/api/calendar/day?date=${date}`)
      const data = await res.json()
      setDayDetail(data)
    } catch (e) {
      console.error('Failed to fetch day detail', e)
      setDayDetail(null)
    } finally {
      setDayLoading(false)
    }
  }

  const handlePrevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  const handleNextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const handleToday = () => {
    const n = new Date()
    setYear(n.getFullYear())
    setMonth(n.getMonth() + 1)
  }

  const closeDrawer = () => {
    setSelectedDate(null)
    setDayDetail(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar
        year={year}
        month={month}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
        onToday={handleToday}
        searchCrewId={searchCrewId}
        onSearchChange={setSearchCrewId}
        activityFilter={activityFilter}
        onActivityChange={setActivityFilter}
        flyingFilter={flyingFilter}
        onFlyingChange={setFlyingFilter}
        lastSync={lastSync}
        loading={loading}
        onRefresh={() => fetchMonth(year, month)}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          <CalendarGrid
            year={year}
            month={month}
            calendarData={calendarData}
            loading={loading}
            selectedDate={selectedDate}
            onDayClick={handleDayClick}
            searchCrewId={searchCrewId}
            activityFilter={activityFilter}
            flyingFilter={flyingFilter}
          />
        </div>

        {selectedDate && (
          <DayDrawer
            date={selectedDate}
            detail={dayDetail}
            loading={dayLoading}
            onClose={closeDrawer}
            searchCrewId={searchCrewId}
          />
        )}
      </div>
    </div>
  )
}
