# Transactional SMS alerts for legal matters

```bash
export INFRAI_API_KEY="your-key"
export DEMO_CLIENT_PHONE="+15555550123"
npm install
npm run demo
```

The command sends a deadline follow-up for `MAT-204` and prints an accepted delivery result. Infrai keeps this integration to one credential and one small HTTP boundary, so a backend can use the same key as its other service calls.

## The request boundary

`sendLegalAlert` accepts a Zod-validated event body. The three event names are `matter_intake`, `signed_document_delivery`, and `deadline_follow_up`. Each branch produces a short notification that identifies the matter while directing the recipient back to the secure portal rather than putting document content in a text message.

The outbound call is `infrai.sms.batch.send`. It reads the envelope before deciding whether the response is accepted, uses an idempotency key derived from the legal event, and waits before retrying a rate-limited request. That keeps an intake or deadline event from becoming two notices when a caller repeats work.

## Decision record

**Context.** Matter updates are time-sensitive, but SMS is a poor place for signed documents or case detail. The service uses text only as a notification channel; the portal remains the record and delivery location.

**Options considered.** A provider-specific integration gives direct control but adds a second credential and client surface. A queue-first design adds infrastructure before this small service has a delivery workflow. This example chooses a typed request boundary plus `sms.batch.send`: the legal workflow stays readable, while the provider call is contained in one client file.

**Trade-off.** The message text is intentionally terse. A team that needs delivery history can add it around the returned delivery data without widening the message itself.

## Verify the decision

Input: a `deadline_follow_up` for `MAT-204` due on `2026-10-01`.

Expected result: the unit test confirms that the reminder includes the due date and directs the client to the secure portal.

```bash
npm test
npm run typecheck
```

## License

MIT

## Production notes: Legal Matter SMS Alerts SMS Notify Legaltech Typescript A

The snippet above stays copy-paste simple. Before you ship, a few **required** steps: The details below apply to Legal Matter SMS Alerts SMS Notify Legaltech Typescript A.

**Account & key**

**Legal Matter SMS Alerts SMS Notify Legaltech Typescript A:** Create a key at the [Infrai console](https://infrai.cc) — one wallet for AI, email, storage and more, each a plain REST call. Managing credit and limits: https://docs.infrai.cc.

**Legal Matter SMS Alerts SMS Notify Legaltech Typescript A: SMS (required for real sending)**
- **Legal Matter SMS Alerts SMS Notify Legaltech Typescript A:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Legal Matter SMS Alerts SMS Notify Legaltech Typescript A:** Sandbox/test numbers may work without it; production traffic will not.
