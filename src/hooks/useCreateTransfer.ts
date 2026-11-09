import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { CreateTransferRequest, TransferResponse } from '../api/types'

/**
 * Sends a transfer, then refetches everything it changes (balances, the
 * transaction list, the daily limit). The returned promise resolves after the
 * refetch, so the dashboard behind the dialog is already up to date when the
 * success screen appears. Invalidating is simpler than patching the cache by
 * hand and always matches the server.
 */
export default function useCreateTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateTransferRequest) =>
      apiFetch<TransferResponse>('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['customer'] }),
        queryClient.invalidateQueries({ queryKey: ['accounts'] }),
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
      ]),
  })
}
