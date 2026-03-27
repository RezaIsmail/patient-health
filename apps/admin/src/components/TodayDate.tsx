import { CalendarDays } from 'lucide-react'

export default function TodayDate() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5">
      <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
      <span className="text-xs font-medium text-gray-600">{today}</span>
    </div>
  )
}
