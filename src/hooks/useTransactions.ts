import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { TransactionsResponse } from '../api/types'

/** Newest first. Changing `limit` keeps the old rows on screen while loading. */
export default function useTransactions(limit: number) {
  return useQuery({
    queryKey: ['transactions', limit],
    queryFn: () =>
      apiFetch<TransactionsResponse>(`/api/transactions?limit=${limit}`),
    placeholderData: keepPreviousData,
    retry: false,
  })
}
