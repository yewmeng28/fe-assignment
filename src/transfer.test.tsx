import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { formatMoney } from './lib/format'
import { server } from './test/setup'

const WAIT = { timeout: 3000 }

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  )
}

/** Opens the dialog, picks Jamie Tan and moves to the amount step. */
async function openAmountStep(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    await screen.findByRole('button', { name: 'New transfer' }, WAIT),
  )
  await user.click(await screen.findByRole('radio', { name: /Jamie Tan/ }, WAIT))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await screen.findByRole('heading', { name: 'How much?' })
}

describe('transfer', () => {
  it('shows an error and sends nothing when the amount is over the balance', async () => {
    const sendTransfer = vi.fn()
    server.use(
      http.post('*/api/transfers', () => {
        sendTransfer()
        return HttpResponse.json({}, { status: 201 })
      }),
    )
    const user = userEvent.setup()
    renderApp()

    await openAmountStep(user)
    await user.type(screen.getByLabelText('Amount'), '4500')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByLabelText('Amount')).toHaveAccessibleDescription(
      `Amount can't be more than your available balance (${formatMoney(4280.55)}).`,
    )
    expect(screen.getByRole('heading', { name: 'How much?' })).toBeInTheDocument()
    expect(sendTransfer).not.toHaveBeenCalled()
  })

  it('shows the success screen and updates the dashboard after sending', async () => {
    const user = userEvent.setup()
    renderApp()

    await openAmountStep(user)
    await user.type(screen.getByLabelText('Amount'), '120')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('button', { name: 'Confirm transfer' }))

    const dialog = await screen.findByRole('dialog', {}, WAIT)
    expect(await within(dialog).findByText('Transfer sent', {}, WAIT)).toBeInTheDocument()
    expect(within(dialog).getByText(/^TRF-/)).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Back to dashboard' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(
      screen.getByText((_, element) => element?.textContent === formatMoney(4160.55)),
    ).toBeInTheDocument()
  })

  it('stays on the review step with an alert when sending fails', async () => {
    const user = userEvent.setup()
    renderApp()

    await openAmountStep(user)
    await user.type(screen.getByLabelText('Amount'), '10')
    await user.type(screen.getByLabelText('Note (optional)'), '#fail')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('button', { name: 'Confirm transfer' }))

    expect(await screen.findByRole('alert', {}, WAIT)).toHaveTextContent(
      "Something went wrong. Your money hasn't left your account. Try again.",
    )
    expect(screen.getByRole('heading', { name: 'Check the details' })).toBeInTheDocument()
    expect(screen.queryByText('Transfer sent')).not.toBeInTheDocument()
  })
})

describe('dashboard errors', () => {
  it('shows an error, and Retry loads the dashboard', async () => {
    server.use(
      http.get(
        '*/api/accounts',
        () =>
          HttpResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Down' } },
            { status: 500 },
          ),
        { once: true },
      ),
    )
    const user = userEvent.setup()
    renderApp()

    expect(
      await screen.findByText("We couldn't load your dashboard.", {}, WAIT),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByText('Total available', {}, WAIT)).toBeInTheDocument()
  })
})

describe('debug menu', () => {
  it('is hidden by default and can show the error and empty states', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/?debug')
    renderApp()

    await screen.findByText('Total available', {}, WAIT)

    await user.click(screen.getByRole('radio', { name: /Requests fail/ }))
    expect(
      await screen.findByText("We couldn't load your dashboard.", {}, WAIT),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'No transactions' }))
    expect(
      await screen.findByText('No transactions to display', {}, WAIT),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Normal' }))
    expect(await screen.findByText('FairPrice Finest', {}, WAIT)).toBeInTheDocument()

    window.history.pushState({}, '', '/')
  })

  it('can make the API reject a transfer that passes the form checks', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/?debug')
    renderApp()

    await user.click(
      await screen.findByRole('radio', { name: 'API rejects the transfer' }, WAIT),
    )
    await openAmountStep(user)
    await user.type(screen.getByLabelText('Amount'), '10')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('button', { name: 'Confirm transfer' }))

    expect(await screen.findByRole('alert', {}, WAIT)).toHaveTextContent(
      'Amount exceeds available balance.',
    )
    expect(screen.getByRole('heading', { name: 'Check the details' })).toBeInTheDocument()
    expect(screen.queryByText('Transfer sent')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))
    await user.click(screen.getByRole('radio', { name: 'Normal' }))
    window.history.pushState({}, '', '/')
  })
})
