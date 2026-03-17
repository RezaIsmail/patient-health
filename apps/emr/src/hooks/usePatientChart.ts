import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { ApiResponse, PatientChartDto } from '@patient-health/types'

export function usePatientChart(patientId: string) {
  return useQuery({
    queryKey: ['patient-chart', patientId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PatientChartDto>>(
        `/api/patients/${patientId}/chart`
      )
      return data.data
    },
    enabled: !!patientId,
    staleTime: 1000 * 60 * 2, // Chart data: 2 min stale time (more frequently changing than list)
  })
}
