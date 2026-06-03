# Email Challenges

## Purpose

Email in Ankore is for recovery, verification, account linking, and admin login — not for first-use login walls.

## Minimal working example

```ts
const worker = createIdentityWorker(config, {
  async sendEmail(message) {
    console.log(message.to, message.token, message.otp)
  }
})
```

Request:

```bash
curl -X POST https://id.example.com/v1/identity/email/challenge   -H 'Content-Type: application/json'   -d '{"email":"person@example.com","purpose":"recover"}'
```

## Configuration required

```json
{
  "email": {
    "enabled": true,
    "storage": "hash",
    "purposes": ["recover", "verify_email"]
  }
}
```

## Security notes

Challenge creation returns the same generic success regardless of account existence. Tokens and OTPs are hashed in storage. Challenges expire and are single-use.

## Verification command

```bash
npm test -- tests/worker-contract.test.ts
```

## Known limits

Resend/provider-specific wiring is left to product Workers for now. Rate limits and challenge lockouts are planned hardening work.
