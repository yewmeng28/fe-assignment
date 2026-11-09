import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { formatMoney } from './lib/format'

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

describe('dashboard', () => {
  it('shows the total of the deposit accounts only', async () => {
    renderApp()

    // formatMoney uses a non-breaking space, which Testing Library's text
    // normalisation would turn into a normal one, so compare textContent.
    const total = await screen.findByText(
      (_, element) => element?.textContent === formatMoney(17120.55),
      {},
      { timeout: 3000 },
    )
    expect(total).toBeInTheDocument()
    expect(screen.getByText('Across 2 deposit accounts')).toBeInTheDocument()
  })

  it('shows an empty state with Clear search when nothing matches', async () => {
    const user = userEvent.setup()
    renderApp()

    const search = await screen.findByRole(
      'searchbox',
      { name: 'Search transactions' },
      { timeout: 3000 },
    )
    await user.type(search, 'zzzz')

    expect(
      screen.getByText('No transactions match your search.'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear search' }))

    expect(search).toHaveValue('')
    expect(screen.getByText('FairPrice Finest')).toBeInTheDocument()
  })
})
