-- Design artifact ONLY. Not applied or deployed. No password storage.
-- Provider subjects must come from a verified server-side identity, never browser input.
CREATE TABLE apartments (
 id TEXT PRIMARY KEY,
 apartment_number TEXT NOT NULL UNIQUE,
 block_code TEXT NOT NULL CHECK(block_code IN ('A','B','C','D','E'))
);
CREATE TABLE leases (
 id TEXT PRIMARY KEY,
 apartment_id TEXT NOT NULL REFERENCES apartments(id),
 status TEXT NOT NULL CHECK(status IN ('active','ended'))
);
CREATE UNIQUE INDEX one_active_lease ON leases(apartment_id) WHERE status='active';
CREATE TABLE lease_members (
 id TEXT PRIMARY KEY,
 lease_id TEXT NOT NULL REFERENCES leases(id),
 full_name TEXT NOT NULL,
 relationship TEXT NOT NULL CHECK(relationship IN ('primary','secondary','dependent'))
);
CREATE UNIQUE INDEX one_primary_leaseholder ON lease_members(lease_id) WHERE relationship='primary';
CREATE TABLE resident_accounts (
 id TEXT PRIMARY KEY,
 member_id TEXT NOT NULL UNIQUE REFERENCES lease_members(id),
 provider_subject TEXT UNIQUE,
 verified_email TEXT UNIQUE COLLATE NOCASE,
 status TEXT NOT NULL CHECK(status IN ('invited','active','disabled'))
);
CREATE TABLE staff_accounts (
 provider_subject TEXT PRIMARY KEY,
 role TEXT NOT NULL CHECK(role IN ('administrator','staff')),
 status TEXT NOT NULL CHECK(status IN ('active','disabled'))
);
CREATE TABLE invitation_audit (
 id TEXT PRIMARY KEY,
 account_id TEXT NOT NULL REFERENCES resident_accounts(id),
 created_by_subject TEXT NOT NULL REFERENCES staff_accounts(provider_subject),
 created_at TEXT NOT NULL,
 provider_invitation_id TEXT,
 state TEXT NOT NULL CHECK(state IN ('pending','sent','accepted','expired','revoked'))
);
-- Required server authorization query: bind :verified_subject from trusted auth only.
-- Never accept apartment_id, account_id, staff status, or block from the client as authority.
-- SELECT l.apartment_id FROM resident_accounts a
-- JOIN lease_members m ON m.id=a.member_id JOIN leases l ON l.id=m.lease_id
-- WHERE a.provider_subject=:verified_subject AND a.status='active'
-- AND l.status='active';
-- Each protected record query must JOIN the resulting apartment scope.
-- Staff endpoints separately require an active staff_accounts row. Resident responses omit block_code.

