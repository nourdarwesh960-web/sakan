# SAKAN Security, Privacy & Compliance Architecture

## 1. Principles
SAKAN adheres to strict privacy and zero-trust engineering standards:
1. **Zero Brokerage Commissions**: Built-in safeguards and reporting mechanisms prevent unauthorized broker exploitation and unlawful fees.
2. **Least Privilege**: Row-Level Security (RLS) is applied on 100% of tables. Client keys never bypass RLS.
3. **No Unrestricted Message Snooping**: Staff and administrators do not have mass eavesdropping access to private chat channels. Narrow evidence is accessed strictly upon report escalation.
4. **Data Minimization**: No national ID numbers or identity cards are gathered by default. Private phone numbers and street addresses remain shielded unless explicitly disclosed by the user.

---

## 2. Row Level Security Matrix

| Table | Anonymous Visitor | Authenticated User | Owner / Participant | Staff / Admin |
| :--- | :--- | :--- | :--- | :--- |
| `profiles` | Read active public profiles | Read active profiles | Update own non-suspension fields | Full moderation access |
| `user_roles` | Denied | Read own assigned role | Denied | Super Admin write only |
| `listings` | Read `published` | Read `published` | Create, edit, pause, delete own | Full moderation access |
| `listing_photos` | Read if listing public | Read if listing public | Manage photos of owned listing | Manage all |
| `conversations` | Denied | Denied | Read/participate in own convos | Audit/escalation only |
| `messages` | Denied | Denied | Send/read in own convos | Escalate on complaint only |
| `complaints` | Denied | Submit complaint | View status of own reports | Full triage & resolution |
| `complaint_evidence`| Denied | Upload for own complaint| View evidence of own report | Assigned reviewer only |
| `admin_audit_logs` | Denied | Denied | Denied | Read-only staff view |

---

## 3. Storage Security
- `listing_photos`: 5MB max, image mime types only. Public read for published units, folder isolation by user UUID.
- `message_attachments`: 10MB max, private bucket. Authorized conversation participants only.
- `complaint_evidence`: 10MB max, private bucket. Reporter and assigned review staff only.
- `avatars`: 2MB max, user profile isolation.

---

## 4. Egyptian Phone Number Validation & Normalization
Egyptian mobile numbers are validated strictly against the official national prefix format:
- `+20 10xxxxxxxx` (Vodafone Egypt)
- `+20 11xxxxxxxx` (Etisalat Misr)
- `+20 12xxxxxxxx` (Orange Egypt)
- `+20 15xxxxxxxx` (WE / Telecom Egypt)

Leading zeros (e.g. `01012345678`) are automatically normalized to E.164 standard `+201012345678` before database operations.
