import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { PayeesResponse } from '../api/types'

export default function usePayees() {
  return useQuery({
    queryKey: ['payees'],
    queryFn: () => apiFetch<PayeesResponse>('/api/payees'),
    select: (data) => data.payees,
    retry: false,
  })
}
