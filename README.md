# Meridian Banking — Chai Yew Meng

- Deployed: https://yewmeng28.github.io/fe-assignment
- Run locally: `npm install && npm run dev`
- Checks: `npm run check` (lint + typecheck + tests) and `npm run build`

## Project structure

```
src/
  api/                  Typed fetch helper (apiFetch / ApiError) and API types
  hooks/                One hook per server resource (TanStack Query) + usePreference
  lib/                  Pure helpers: formatting, search, account totals, transfer rules
  components/
    ui/                 Generic, reusable pieces (Button, Card, Modal, Field, Stepper, ...)
    transfer/           The transfer dialog: one component per step, plus the dialog
    (root)              Dashboard pieces: Header, BalanceHero, AccountList, TransactionTable, ...
  mocks/, test/         Starter mock API and test setup (unchanged, except test cleanup)
```

- **`components/ui/`** knows nothing about banking. Anything with Meridian
  wording or API types lives one level up.
- **`lib/`** holds logic that doesn't need React, so it is easy to test and read.
  `lib/transfer.ts` is the single home of every transfer validation rule.
- Styles are plain CSS next to the components (`ui.css`, `dashboard.css`,
  `transfer.css`), using only the tokens from `brief/design-tokens.css`.

## Decisions and trade-offs

- **Server state vs UI state:** 
  - All API data goes through TanStack Query and is never copied into `useState`. 
  - `useState` is only used for UI state: which step the dialog is on, the search text, whether the dialog is open. 
  - Totals are calculated (`lib/accounts.ts`), not stored.
- **Forms and validation:** 
  - React Hook Form with one Zod schema (`createTransferSchema`) defines every rule once. The same schema runs for
    inline errors (on blur), for `Continue` (per step, via `trigger`) and for
    submit. The amount rules need the account balance and the remaining daily
    limit, so the schema is built from those. The form is a single `useForm` shared
    by all three steps, so `Back` keeps what was entered.
- **Refreshing after a transfer:** 
  - `useCreateTransfer` invalidates the customer, accounts and transactions queries. 
    I chose this over patching the cache by hand
    because the server remains to be the source of truth (balance, daily limit and the new
    transaction all come back consistent). 
  - The mutation waits for the refetch, so
    the dashboard behind the dialog is already updated when the `Transfer sent` popup / screen shows.
- **Theming:** 
  - `data-theme` and `data-segment` live on `<html>`, as the tokens expect. 
  - A small script in `index.html` applies the saved or system choice before first paint, to prevent screen flash. 
  - `usePreference` reads and writes them with `useSyncExternalStore`, so any component can use them and stay in sync, 
    and it saves to `localStorage`.
- **Transaction search:** 
  - It filters the rows already loaded, in the browser, rather
    than calling `?q=`, since the dataset is small now.
  - The list is at most 8 rows (50 with `View all`), so it is
    instant and there are no extra requests or loading states while typing.
- **Greeting:** 
  - I decided to have a dynamic greeting .
- **`View all`:** 
  - This goes beyond the brief (which shows the 8 newest). It refetches with `limit=50` and keeps the old rows on screen meanwhile.
  - As mentioned in the other 'More time' section, pagination was not implemented this time.
- **Modal:** 
  - I wrote a small `Modal` instead of using `<dialog>` or a library: it traps focus, closes on `Esc`/`✕`, 
    locks page scroll and returns focus to the `New transfer` button. 
  - It is a centred dialog for 1024px and above resolutions and a full-screen sheet below that. 
  - `Esc` and `✕` are disabled while a transfer is sending.
- **Mobile layout:**  
  - On mobile, CSS pins the `New transfer` button to
    the bottom of the screen, so there are no duplicate buttons in the DOM. 
  - The Retail/Premium switch wraps onto its own row in the header. Although taking up a whole row is not ideal,
    I prioritized the text in the button to be fully visible and not have any layout issues.
  - The accounts section is a horizontal scroll so that users do not have to scroll down 
    vertically too much to see their transaction information.
  - Transfer dialog opens up and fills the whole screen, so the dashboard is not visible behind it.
  - The placement of the daily limit card was not stated in the brief, presumably to leave it out to save space on mobile. 
    However, I deliberately added it in as a UX decision, since it alerts the user whether they are able to make the desired
    transfer before clicking on the New transfer button and going through the workflow. Otherwise, they will only be able to see 
    the remaining daily limit in the second step.
- **Debug menu:** 
  - Visible at https://yewmeng28.github.io/fe-assignments?debug
  - To show the error and empty states on the deployed site, the
    page has an optional menu that only appears with `?debug` in the URL (so it is
    not part of the normal UI). 
  - It makes `apiFetch` add the mock API's `?scenario=` parameter (`src/lib/debug.ts`) and resets the queries so the
    loading and error states show again.
  - A table containing the detailed debug scenarios is found below.

What I'd change with more time: (for context, I was caught up with a family medical emergency for the whole of last weekend so I only focused on the priority items and some easier good-to-have items)
- Show the API's field errors under the matching
input and add the `Discard this transfer?` prompt.
- Have a cleaner commit history. I would have liked to have a cleaner separation of AI generated code and my own code, but in the end the commits were a mix of both. 
- Pagination for the transactions table, with a dropdown to select maximum number of results per page (10, 20, 50, etc.)

## Loading, empty and error states

| State | How it is handled | How to see it |
| --- | --- | --- |
| Dashboard loading | `DashboardSkeleton` has the same layout as the loaded page, so nothing jumps | Reload the page (the mock API takes about 500 ms) |
| Dashboard error | `We couldn't load your dashboard.` with `Retry`, which refetches only what failed | Add `?debug` to the URL and choose `Requests fail` in the debug menu at the bottom of the page |
| No transactions match | `No transactions match your search.` with `Clear search` | Type `zzz` in `Search transactions` |
| No transactions at all | `No transactions to display` | Add `?debug` to the URL and choose `No transactions` |
| Payees loading / error / none / no match | Skeleton rows, `We couldn't load your payees.` with `Retry`, and empty messages | Open `New transfer` and look at step 1 (with `?debug`, `No saved payees` shows the empty list) |
| Send failure | `role="alert"` on the review step, data kept, can retry | Put `#fail` in the note (a server error), or add `?debug` and choose `API rejects the transfer` (the API refuses it with its own message) |
| Field errors | Under each field, linked with `aria-describedby`, focus moves to the first invalid field | Press `Continue` with empty fields, or enter more than the balance |

## Tests

`npm test` runs four behaviour tests (Testing Library + MSW, no implementation
details):

1. An amount over the balance shows the error and sends no request.
2. A successful transfer shows `Transfer sent` and the dashboard balance updates.
3. A failed dashboard request shows the error, and `Retry` loads it.
4. A failed send (`#fail` in the note) stays on the review step with an alert and
   never shows success.

There are also two dashboard tests (the total only includes deposit accounts; the
search empty state and `Clear search`). I picked the cases above because they are
the rules most likely to break quietly: money rules, the refresh after sending,
and the error paths.

## AI use

- **ChatGPT:** 
  - The first version of the light/dark and Retail/Premium toggles
- **Claude Code:** 
  - The Meridian "M" logo and `AC` avatar icon designs
  - Refactoring the components into the reusable `components/ui/` set
  - CSS styles and the `usePreference` hook for style tokens and localStorage
  - The rest of the dashboard layout boilerplate code (hero, account cards, daily limit, skeletons, responsive styles)
  - The transfer dialog and its validation
  - Debug menu functionality
  - Tests

Places where I changed or fixed what the AI produced:

- Claude first used the fixed greeting from the brief, I changed it back to the
  time-of-day greeting because it feels more refined to have the greeting adapt to the time of day.
- Claude triggered the 'Light/Dark' modes transition immediately on click, which is not user-friendly. 
  I added a delay so that the user does not get screen flash.
- Claude's first test for the dashboard total failed: `formatMoney` uses a
  non-breaking space that Testing Library normalizes, so the test compares
  `textContent` instead.

## Not done / known issues

- Optional items not built: `Discard this transfer?`, balance-hide toggle, third
  segment, `#transfer` deep link, end-to-end test, CI workflow.
- If the API rejects a transfer, its message shows in the alert, but its field
  errors are not mapped back to the inputs.
- `Cards`, `Payments` and `Insights` are disabled, as the brief says.
