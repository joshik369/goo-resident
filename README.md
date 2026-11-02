# Goo Resident — website and native apps

This workspace now contains an operational database-backed local website in `live/` and an Expo/React Native iPhone + Android app in `mobile/`. The original static prototype remains in `dist/` as a historical reference; it is no longer the default run target.

## Start the real website in VS Code

Open `Goo-Resident.code-workspace` and press F5. The server runs at http://127.0.0.1:4180. On the first run, its terminal prints a private, single-use setup link for the initial office administrator. Open that link and set your own password (12–128 characters), then sign in. Do not share the setup link.

The initial administrator is joshik.natarajan@gmail.com, as requested. No password has been created for you. An operator can issue a replacement link using `node live/admin-reset.cjs` on the server machine; this is not an internet endpoint. Tokens expire in 24 hours.

This PC's VS Code launch configuration uses the installed Codex Node runtime directly. Other machines should install Node 24.22 or later and use `npm start` or `node live/server.cjs`.

## Working features

- Real password activation/login/logout; scrypt password hashes; hashed opaque expiring sessions; HTTP-only cookies on web and SecureStore session storage in the native app; disabled account / ended-lease access enforcement.
- Empty 100-apartment directory across 5 staff-only blocks; no fictitious financial history or residents in the operational database.
- Office provisions separate accounts for primary, secondary and dependent lease members. Office-issued one-time activation/reset links are delivered manually, not by automatic email. No public signup or role switch.
- Server-scoped apartment statements, maintenance and preferences. Other apartments and individual violation recipients are filtered before responses. Resident responses omit blocks, directory data and staff notes.
- Office controls charge entry/current-month corrections, manually verified payment records, events, announcements, contacts, account access, lease access and settings. Monetary values use integer cents; duplicate payment references are rejected. Previous-month charges cannot be overwritten.
- Resident maintenance submission and shared apartment request history, with staff-managed statuses.
- Office-created violations with apartment/individual scope, rules, dates, actions, deadlines, staff notes and status. Residents have read-only access to applicable notices.
- Website calendar and native event agenda use exact event dates/times and the configured community timezone.
- External HTTPS payment handoff; shared monthly auto-pay preferences limited to days 1–3 and eligible categories, with no electricity.
- Office audit log, durable SQLite storage, network-required private data, and a PWA shell that never caches API responses.

## Important boundaries

This is a working local implementation, not a finished public production deployment or an independent security certification. The original Sites URL and GitHub repository still contain the previously published prototype until explicitly updated/migrated. The new Node/SQLite runtime cannot be deployed as static files to that old Site.

Real recurring payment collection, provider webhooks/reconciliation, email/SMS/push delivery, automated account recovery delivery, administrator MFA, store signing and production hosting are not connected. Payments displayed as office-recorded require independent verification by staff. Saved auto-pay preferences never claim collection is active. Invitations/reset links work but must be privately delivered by the office after identity verification.

Historical data is retained under the current apartment scope. A real tenant-turnover workflow needs lease-period IDs and archival segregation before moving a new household into a previously occupied apartment. Ending lease access blocks all apartment members; restoring re-enables eligible existing accounts. Do not use restoration to onboard an unrelated household.

The server is a single-instance SQLite deployment. Before real resident rollout, configure HTTPS, persistent storage, backups/restore testing, operating-system access controls, administrator MFA, monitoring, an independent security review, and the provider integrations above. Do not expose the development server directly to the internet.

## Verification

Run `node --test live/server.test.cjs`. The integration test verifies activation token replay rejection, primary/secondary/dependent accounts, staff authorization, cross-apartment and individually scoped violation isolation, omitted staff data, maintenance scope enforcement, auto-pay date/category validation, duplicate payment rejection, cross-origin rejection, session revocation, lease termination, persistence across restart, and hashed password storage.

The website login and office violation creation were also tested in a browser against an isolated, in-memory QA server. Android and iOS JavaScript/Hermes bundles compiled using Expo export. No signed APK/IPA, simulator/device runtime test or app-store submission has been completed.

## iPhone and Android app

See `mobile/README.md`. Both platforms share the same backend. Set `EXPO_PUBLIC_API_URL` to the shared HTTPS origin before a release build. Only this public URL belongs in that variable; never put secrets in EXPO_PUBLIC variables.

## Deployment

`live/Dockerfile` provides a Node container. Build from the repository root with `docker build -f live/Dockerfile -t goo-resident .`. Configure `PUBLIC_ORIGIN`, `ADMIN_EMAIL`, `HOST`, `PORT` and `NODE_ENV` (see `live/.env.example`). Mount persistent storage at `/app/live/data`, terminate HTTPS at a trusted reverse proxy, and retain one writer instance. Restrict access to first-start logs because they contain the private administrator activation link. Never commit databases, activation links, passwords, `.env` files or session tokens.
