import { AlertTriangle } from 'lucide-react'
import type { PatientSummary } from '@patient-health/types'
import { Badge } from '@patient-health/ui'
import { format } from 'date-fns'

interface PatientHeaderProps {
  patient: PatientSummary
  allergyCount: number
}

function getGenderLabel(gender: string): string {
  const map: Record<string, string> = {
    male: 'Male',
    female: 'Female',
    other: 'Other',
    unknown: 'Unknown',
  }
  return map[gender] ?? gender
}

export default function PatientHeader({ patient, allergyCount }: PatientHeaderProps) {
  const displayName = patient.preferredName
    ? `${patient.firstName} "${patient.preferredName}" ${patient.lastName}`
    : `${patient.firstName} ${patient.lastName}`

  const dob = (() => {
    try {
      return format(new Date(patient.dateOfBirth), 'MMM d, yyyy')
    } catch {
      return patient.dateOfBirth
    }
  })()

  return (
    <header
      className="sticky top-0 z-20 border-b border-gray-200 bg-white sticky-header"
      aria-label="Patient context header"
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
        {/* Initials avatar */}
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700"
          aria-hidden="true"
        >
          {patient.firstName[0]}
          {patient.lastName[0]}
        </div>

        {/* Patient identity */}
        <div>
          <h1 className="text-base font-semibold text-gray-900 leading-tight">{displayName}</h1>
          <p className="text-xs text-gray-500">
            MRN: <span className="font-medium text-gray-700">{patient.mrn}</span>
          </p>
        </div>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-gray-200 sm:block" aria-hidden="true" />

        {/* Demographics */}
        <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
          <div>
            <dt className="text-gray-400 inline">DOB: </dt>
            <dd className="text-gray-700 font-medium inline">
              {dob} · {patient.age} yrs
            </dd>
          </div>
          <div>
            <dt className="text-gray-400 inline">Sex: </dt>
            <dd className="text-gray-700 font-medium inline">{getGenderLabel(patient.gender)}</dd>
          </div>
          {patient.primaryInsurance && (
            <div>
              <dt className="text-gray-400 inline">Insurance: </dt>
              <dd className="text-gray-700 font-medium inline">{patient.primaryInsurance}</dd>
            </div>
          )}
        </dl>

        {/* Allergy badge — always visible, high contrast */}
        <div className="ml-auto flex items-center">
          {allergyCount > 0 ? (
            <Badge
              variant="destructive"
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1"
              aria-label={`${allergyCount} known ${allergyCount === 1 ? 'allergy' : 'allergies'}`}
            >
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              {allergyCount} {allergyCount === 1 ? 'Allergy' : 'Allergies'}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              No Known Allergies
            </Badge>
          )}
        </div>
      </div>
    </header>
  )
}
