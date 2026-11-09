import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { CustomerResponse } from '../api/types'

export default function useCustomer() {
  return useQuery({
    queryKey: ['customer'],
    queryFn: () => apiFetch<CustomerResponse>('/api/customer'),
    select: (data) => data.customer,
    retry: false,
  })
}
