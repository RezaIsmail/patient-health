import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Calendar, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react'
import { Button } from '@patient-health/ui'
import { api } from '../lib/api'
import type { PatientChartDto, PatientSummary } from '@patient-health/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScheduleAppointment {
  id: string
  patientId: string
  patientName: string
  type: string
  startTime: string   // "HH:MM"
  durationMinutes: number
  status: 'booked' | 'arrived' | 'cancelled' | 'no-show'
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toLocalDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function isToday(date: Date): boolean {
  return toLocalDateString(date) === toLocalDateString(new Date())
}

// Generate 30-min time slots from 08:00 to 17:00
const TIME_SLOTS: string[] = (() => {
  const slots: string[] = []
  for (let h = 8; h < 17; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
    slots.push(`${String(h).padStart(2, '0')}:30`)
  }
  slots.push('17:00')
  return slots
})()

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_STYLES: Record<ScheduleAppointment['status'], string> = {
  booked:    'bg-blue-50 border-blue-200 text-blue-800',
  arrived:   'bg-green-50 border-green-200 text-green-800',
  cancelled: 'bg-gray-100 border-gray-200 text-gray-500',
  'no-show': 'bg-red-50 border-red-200 text-red-700',
}

const STATUS_LABELS: Record<ScheduleAppointment['status'], string> = {
  booked:    'Booked',
  arrived:   'Arrived',
  cancelled: 'Cancelled',
  'no-show': 'No Show',
}

// ─── Appointment card ─────────────────────────────────────────────────────────

interface AppointmentCardProps {
  appointment: ScheduleAppointment
  onClick: () => void
}

function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-md border px-3 py-2 text-left transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS_STYLES[appointment.status]}`}
      aria-label={`${appointment.patientName} — ${appointment.type}, ${appointment.status}`}
    >
      <p className="text-sm font-medium leading-tight">{appointment.patientName}</p>
      <p className="mt-0.5 text-xs opacity-75">
        {appointment.type} · {appointment.durationMinutes} min ·{' '}
        <span className="font-medium">{STATUS_LABELS[appointment.status]}</span>
      </p>
    </button>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <Calendar className="h-7 w-7 text-gray-400" aria-hidden="true" />
      </div>
      <h2 className="text-sm font-semibold text-gray-900">No appointments for this day</h2>
      <p className="mt-1 text-sm text-gray-500 max-w-xs">
        Appointments will appear here once the scheduling system is connected.
      </p>
      <div className="mt-6">
        <Button variant="outline" size="sm" disabled title="New Appointment — coming in Phase 2">
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          New Appointment
        </Button>
      </div>
    </div>
  )
}

// ─── Schedule grid ────────────────────────────────────────────────────────────

interface ScheduleGridProps {
  appointments: ScheduleAppointment[]
  onAppointmentClick: (appointment: ScheduleAppointment) => void
}

function ScheduleGrid({ appointments, onAppointmentClick }: ScheduleGridProps) {
  if (appointments.length === 0) {
    return <EmptyState />
  }

  const appointmentsBySlot = new Map<string, ScheduleAppointment[]>()
  for (const appt of appointments) {
    const existing = appointmentsBySlot.get(appt.startTime) ?? []
    appointmentsBySlot.set(appt.startTime, [...existing, appt])
  }

  return (
    <div className="divide-y divide-gray-100">
      {TIME_SLOTS.map((slot) => {
        const slotAppts = appointmentsBySlot.get(slot) ?? []
        return (
          <div key={slot} className="flex min-h-[56px] items-start gap-4 px-6 py-3">
            <span className="w-12 flex-shrink-0 pt-0.5 text-xs font-medium text-gray-400 tabular-nums">
              {slot}
            </span>
            <div className="flex flex-1 flex-col gap-2">
              {slotAppts.length > 0 ? (
                slotAppts.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    onClick={() => onAppointmentClick(appt)}
                  />
                ))
              ) : (
                <span className="text-xs text-gray-300 pt-0.5">—</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Data fetching ────────────────────────────────────────────────────────────

// The schedule endpoint is not yet available on the backend. We derive
// appointments from the patients list as a best-effort fallback, and
// gracefully return an empty list when the endpoint is unavailable.

interface PatientsApiResponse {
  data: PatientSummary[]
  meta: { page: number; pageSize: number; total: number }
}

async function fetchSchedule(_date: string): Promise<ScheduleAppointment[]> {
  try {
    // Attempt the schedule endpoint first; expected to return 404 until implemented
    const response = await api.get<{ data: ScheduleAppointment[] }>(`/api/schedule`, {
      params: { date: _date },
    })
    return response.data.data ?? []
  } catch {
    // Endpoint not yet available — derive from patients' upcomingAppointments
    try {
      const patientsResponse = await api.get<PatientsApiResponse>('/api/patients', {
        params: { pageSize: 50 },
      })
      const patients = patientsResponse.data.data ?? []

      const derived: ScheduleAppointment[] = []
      for (const patient of patients) {
        const chart = patient as PatientSummary & {
          upcomingAppointments?: PatientChartDto['upcomingAppointments']
        }
        if (!chart.upcomingAppointments) continue
        for (const appt of chart.upcomingAppointments) {
          const apptDate = appt.date.split('T')[0]
          if (apptDate !== _date) continue
          const time = appt.date.includes('T')
            ? appt.date.split('T')[1].substring(0, 5)
            : '09:00'
          derived.push({
            id: appt.id,
            patientId: patient.id,
            patientName: `${patient.lastName}, ${patient.firstName}`,
            type: appt.type,
            startTime: time,
            durationMinutes: 30,
            status: (appt.status as ScheduleAppointment['status']) ?? 'booked',
          })
        }
      }
      return derived
    } catch {
      return []
    }
  }
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SchedulePage() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const datePickerRef = useRef<HTMLInputElement>(null)

  const dateString = toLocalDateString(selectedDate)

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['schedule', dateString],
    queryFn: () => fetchSchedule(dateString),
    staleTime: 60_000,
  })

  function goToPrev() {
    setSelectedDate((d) => addDays(d, -1))
  }

  function goToNext() {
    setSelectedDate((d) => addDays(d, 1))
  }

  function goToToday() {
    setSelectedDate(new Date())
  }

  function handleDatePickerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (value) {
      const [y, m, d] = value.split('-').map(Number)
      const date = new Date(y, m - 1, d)
      setSelectedDate(date)
    }
    setDatePickerOpen(false)
  }

  function handleAppointmentClick(appt: ScheduleAppointment) {
    navigate(`/patients/${appt.patientId}`)
  }

  const atToday = isToday(selectedDate)

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Schedule</h1>
          <p className="text-xs text-gray-500 mt-0.5">Daily appointment view</p>
        </div>

        {/* Date navigation */}
        <div className="flex items-center gap-2">
          {!atToday && (
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
          )}

          <div className="flex items-center rounded-md border border-gray-200 bg-white shadow-sm">
            <button
              onClick={goToPrev}
              className="flex h-8 items-center justify-center rounded-l-md px-2.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Previous day"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Date label — clicking opens native date picker */}
            <div className="relative">
              <button
                onClick={() => {
                  setDatePickerOpen((v) => !v)
                  setTimeout(() => datePickerRef.current?.showPicker?.(), 50)
                }}
                className="flex h-8 items-center px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label={`Selected date: ${formatDisplayDate(selectedDate)}. Click to open date picker.`}
              >
                {formatDisplayDate(selectedDate)}
              </button>

              {/* Hidden native date picker anchored below the button */}
              <input
                ref={datePickerRef}
                type="date"
                value={dateString}
                onChange={handleDatePickerChange}
                onBlur={() => setDatePickerOpen(false)}
                tabIndex={-1}
                aria-hidden="true"
                className="absolute left-0 top-full h-0 w-0 overflow-hidden opacity-0"
                style={{ visibility: datePickerOpen ? 'visible' : 'hidden' }}
              />
            </div>

            <button
              onClick={goToNext}
              className="flex h-8 items-center justify-center rounded-r-md px-2.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Next day"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Schedule body ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-auto bg-white">
        {isLoading ? (
          <div className="flex flex-col divide-y divide-gray-100">
            {TIME_SLOTS.slice(0, 8).map((slot) => (
              <div key={slot} className="flex min-h-[56px] items-start gap-4 px-6 py-3">
                <span className="w-12 flex-shrink-0 pt-0.5 text-xs font-medium text-gray-300 tabular-nums">
                  {slot}
                </span>
                <div className="flex-1 pt-1">
                  <div className="h-3 w-40 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ScheduleGrid
            appointments={appointments}
            onAppointmentClick={handleAppointmentClick}
          />
        )}
      </div>
    </div>
  )
}
