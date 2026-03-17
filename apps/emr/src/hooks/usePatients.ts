import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { ApiResponse, PatientSummary } from '@patient-health/types'

interface UsePatientsOptions {
  search?: string
  page?: number
  pageSize?: number
}

export function usePatients({ search = '', page = 1, pageSize = 20 }: UsePatientsOptions = {}) {
  return useQuery({
    queryKey: ['patients', { search, page, pageSize }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.set('q', search)
      params.set('page', String(page))
      params.set('pageSize', String(pageSize))

      const { data } = await api.get<ApiResponse<PatientSummary[]>>(`/api/patients?${params}`)
      return data
    },
    placeholderData: (prev) => prev, // keep previous data while fetching new page
  })
}
