# Goo Resident: login and office provisioning

The app opens on an email/password login design in the approved style. Fields and Sign in are disabled until supported authentication is connected. No passwords are collected or stored. Recovery explains its pending state; no email is sent. There is no public self-registration.

## Implemented preview

Each primary, secondary and dependent lease member can have an individual office-created account linked to the same apartment. Apartment 101 demonstrates three separate sample accounts: Alex, Sam and Casey Morgan. Every account sees that apartment's shared statement and primary leaseholder name. Preview identity is memory-only; refreshing returns to login. This is not an authentication or authorization boundary. Browser-local sample records remain inspectable by anyone with demo access.

Office → Accounts & lease members supports adding/editing members, creating individual invitation drafts and disabling/enabling sample access. Emails must be unique fictional example.invalid addresses. No invitations are sent, real accounts created or passwords generated. Office preview retains all billing, charge, announcement, event, maintenance, contact and settings controls. office@example.invalid is only a sample label, never an email-based authorization rule.

## Hosting findings and next decision

Sites documents platform-owned ChatGPT sign-in, sign-out and callback routes, trusted server identity, and D1 storage for a server application. Current private access remains owner-only before the app login screen. This is site access, not resident membership. The current static portal does not implement server authorization.

The supported documentation does not provide community email/password accounts, recovery or invitation delivery. It requires preserving platform authentication and confirming support before adding an external provider. No independent password/session stack has been deployed.

Smallest next decision: may residents use ChatGPT sign-in, or is community email/password mandatory? If email/password is required, select/configure a compatible identity provider and hosting arrangement first. Do not paste passwords or secrets into chat. After configuration, an approved office administrator email and a roster of lease members with individual verified emails are needed for real onboarding.

## Required before secure activation

- Move business records to authenticated server APIs and a database. Never ship all apartment records to residents.
- Resolve verified provider subject to an active individual account, recorded lease member and active lease on every request. Scope all apartment reads/writes to that membership. All three lease roles are eligible; resident responses omit blocks.
- Assign approved office accounts an explicit active administrator role server-side. Never grant rights from a typed email, email domain, client role switch or submitted role field. Require this role for all bills/prices, announcements, events, maintenance, contacts, account provisioning and settings mutations; audit changes.
- Only administrators provision accounts for recorded lease members. Use individual expiring, single-use, revocable provider invitations. Verify recipient email. Each person sets their own password where supported; no shared/plaintext credentials or public signup.
- Use provider-managed password hashing, secure sessions, verification, recovery, anti-enumeration and rate limiting. Configure CSRF/cookie/session expiry and office MFA. Disable/revoke sessions when accounts or leases end.
- Test actual residents in different apartments, all three roles sharing an apartment, administrators, disabled and invited accounts. Verify direct API authorization, recovery/invitation expiry, logout, cross-device persistence and audit records.

The SQL file is an unapplied schema design, not a deployed migration. No real resident authentication, secure session, account activation, recovery delivery or server-side apartment isolation is claimed in this release.
