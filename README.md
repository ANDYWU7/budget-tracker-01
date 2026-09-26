# Pocket

A responsive, kid-friendly budget tracker built with only HTML, CSS, and JavaScript. No packages, frameworks, external fonts, or network calls are required.

Open `dist/index.html` directly, or serve `dist` with any static server. From the parent workspace, `node preview.cjs` serves it at http://127.0.0.1:4173.

## Using the tracker

- Start with an empty budget and use **Add money** to enter your balance. The sample budget is optional under **Budget settings**.
- Daily spending bars and a category pie chart appear directly on the overview. Choose **Last 7 days** or **This month** to change both charts together. Paid subscriptions have their own slice; unpaid charges are excluded from spent totals. Both charts update from recorded expenses, including payment records.
- Savings progress shows four checkpoints at 25%, 50%, 75%, and 100% of a selected goal. Adding savings across a checkpoint triggers a milestone message; withdrawing savings updates progress too.
- The forecast, upcoming payments, and recent activity appear by default below the main visuals. Use **Choose sections** to hide or restore any of them. Selections persist in this browser.
- Each tracker page initially shows a short list. **Show more** reveals additional records when needed.
- Log spending and mark it as essential or nice to have. Add income in **My spending**.
- Add monthly or weekly subscriptions and one-time debts. Mark payments paid only after you pay them.
- Create savings goals and reserve money toward them. Reserved money is excluded from safe-to-spend totals.
- Use the 7-day, 30-day, or one-year forecast to see the money left after scheduled charges. The **Past** range shows the previous seven days of cash balance, based on dated income and expenses. A "3 days ago" value also appears beside the forecast; days before tracking began show no value. Past savings reservations are not included because goal contributions do not have dates. Reminders have no dismiss action; they remain until the payment is recorded or the underlying entry is removed.
- Select **Budget settings** to start a new budget or load the sample.

## Calculations and storage

Amounts are stored as integer cents. Current balance is opening balance plus income minus recorded expenses. Safe to spend is current balance minus reserved savings and unpaid scheduled charges through the forecast date, including overdue charges. Forecasts exclude unrecorded spending and future income. Monthly renewals preserve their original day, clamping to the last day of shorter months.

Data is local to this browser and origin using localStorage. There is no bank connection, login, backend, cross-device sync, or push notification service. Clearing browser storage removes the budget. Reminders are visible inside the app. Moving between a local preview and a hosted URL starts a separate budget.

## Verification

Run `node tests/budget.test.cjs` for calculation and validation checks, and `node --check dist/app.js` for syntax validation. The interface uses semantic controls, keyboard-accessible native dialogs, accessible chart summaries, and responsive layouts.
