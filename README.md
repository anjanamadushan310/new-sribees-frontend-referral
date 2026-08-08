# SRIBEES Partner Portal

The professional referral team's dashboard. **Separate from the admin
dashboard on purpose.**

## Why it is a separate app

Agents are outside contractors. Putting them behind the same login as the
people who run the business means every admin route is one missing role check
away from being reachable by them.

A separate frontend on its own would not achieve that — anyone can open
devtools and call whatever the API allows. **The API is the boundary**, and the
separation is enforced there:

| Layer | Separation |
|---|---|
| Identity | `partners` table, not `admins` |
| Token | `is_partner` claim. `/admin/*` refuses it; admin and customer tokens are refused here |
| Endpoints | `/api/v1/partner/*` only |
| Login | `POST /partner/auth/login`, which does not accept admin credentials |
| Origin | Own port in development, own subdomain in production — no shared `localStorage` |

All four directions are covered: a partner token cannot reach `/admin/*` or the
customer API, an admin token cannot reach `/partner/*`, and admin credentials
are rejected by the partner login.

## Commission model

Two levels, and only two — a deeper chain is a pyramid, not a referral scheme.

```
Partner A recruits Partner B      (B.parent_partner_id = A)
B signs up a customer             (users.referred_by_partner_id = B)
That customer places an order  ->  B earns level 1, A earns level 2
```

Rates come from `referral_commission_percent` (level 1) and
`referral_level2_percent` (level 2), and are snapshotted onto each commission
row — changing a rate never rewrites what has already been earned.

Commission accrues as `pending` when an order is placed and only becomes
`claimable` when it is **delivered**. Cancelling or refunding reverses it.

## Privacy

A partner sees a customer's name, a short member id, and the commission earned
from them. Not the customer's phone, and not what any order was worth — the API
does not send those.

## Running

```bash
npm install
npm run dev        # http://localhost:5174, proxying /api to api.sribees.com
```

Point somewhere else with `VITE_PROXY_TARGET=http://localhost:8000 npm run dev`.

## Not built yet

- **Payout requests.** Partners have no wallet; settlement happens out of band
  today, and this ledger is what finance reconciles against.
- **Partner self-registration.** Accounts are created by a Super Admin — there
  is deliberately no public sign-up, since a partner account earns money.
- **Recruit invitations.** `parent_partner_id` is set directly today; a partner
  cannot yet recruit through the portal.
