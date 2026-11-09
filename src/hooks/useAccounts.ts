import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { AccountsResponse } from '../api/types'

export default function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => apiFetch<AccountsResponse>('/api/accounts'),
    select: (data) => data.accounts,
    retry: false,
  })
}
