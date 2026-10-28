# Goo Resident

Responsive resident website and installable progressive web app. Fictional community: Willow Commons. No app-store native binary is included.

## Run

With Node.js installed, run `node serve.cjs` in this folder and open http://127.0.0.1:4173. Hosting the `dist` folder over HTTPS also works. Install using Chrome/Edge's install action, or Safari Share → Add to Home Screen. Browser and private-host access may affect installation. Offline assets are available after the first successful online visit.

## Demo features

- 100 apartments across five administrative blocks of 20. Resident pages show only the selected apartment, with no block information.
- Primary leaseholder, separate community name, apartment number, office-controlled statement, and side-by-side payment / auto-pay actions.
- Rent, water, renters insurance, trash, pest control and additional charges; no electricity billing.
- External HTTPS payment destination configurable in Office → Settings. No destination is supplied initially. No card collection or fake payment-success flow.
- Auto-pay preferences for rent, trash, water/utilities and pest control, once monthly on the 1st, 2nd or 3rd. Saving does not activate payments.
- Twelve sample monthly payment records (November 2025–October 2026); maintenance creation/history/status, event calendar with exact Central times, announcements and staff contacts.
- Office controls leaseholders and charges, CRUD for events/announcements/contacts, maintenance statuses, community name and payment URL. Search apartment records or preview a chosen resident.
- Browser-local persistence. Sample contact addresses are intentionally non-deliverable.

## Required before real resident use

Authenticated resident/staff accounts and server-enforced apartment authorization; database, audit logs and backups; payment-provider integration, verified webhook reconciliation and real history; consent and tokenized recurring payment setup with monthly idempotency; actual staff contacts and notifications; production accessibility/security review and operational monitoring. The local role switch and browser storage are demonstration tools, not security boundaries. Do not enter real personal or payment data.

The statement period and sample history are intentionally fixed demo data. The app does not accrue bills or collect payments. The resident history is synthetic and is not altered when office edits the current statement.

## Login and individual accounts
The entry screen and office-provisioned account/lease-member preview are implemented. Credential fields remain disabled until supported authentication is configured. Primary, secondary and dependent members can each have individual accounts; there is no public signup. See AUTHENTICATION.md for implementation boundaries and activation requirements.
