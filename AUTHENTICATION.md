# Authentication in the new implementation

The current operational backend is `live/server.cjs`; the previous static preview is retained under `dist/` only. This document supersedes the earlier preview-only authentication description.

Real email/password login and one-time activation are implemented using Node scrypt (random salts, N=32768/r=8/p=1, 64-byte derived values), timing-safe comparison, 256-bit random opaque session tokens stored only as SHA-256 hashes in SQLite, 12-hour session expiry, server-side role/active-lease checks and login attempt limits. Web sessions use HttpOnly/SameSite=Strict cookies with Secure enabled for an HTTPS public origin. Mutating web requests require JSON and an allowed origin; native requests use explicit bearer tokens stored through Expo SecureStore.

Only office administrators can provision resident accounts or issue new activation/reset links. These links expire in 24 hours, are single-use and replaced when reissued. Password reset consumption revokes existing sessions. Disabling an account or ending apartment lease access also revokes existing sessions and invitations. There is no public registration and typing an administrator email does not grant rights.

The supplied office email is bootstrapped once as an inactive administrator. The user must set their own password through a private setup link printed in the local terminal. No default administrator password is generated or shipped. The local operator-only reset utility can issue a replacement activation link.

API responses scope apartment data on the server and omit blocks, staff notes and all other residents' account data. Individual violations additionally check the recipient account. Authentication/account/data authorization behavior is covered by the integration test. Passwords, tokens and records are not written to localStorage.

Not yet implemented: automated verification/recovery email delivery, administrator MFA, managed-provider SSO, advanced abuse monitoring, lease-period archival isolation for tenant turnover, and independently audited production operations. The local password backend is not the old Sites hosted authentication stack, and the existing static Sites URL has not been switched over. Internet rollout requires an HTTPS server host with persistent storage and an appropriate security/operations review.
