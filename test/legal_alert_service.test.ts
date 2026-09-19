import assert from "node:assert/strict";
import test from "node:test";
import { buildAlert } from "../src/legal_alert_service.ts";

test("deadline follow-up keeps the document in the portal and makes the date visible", () => {
  const alert = buildAlert({
    event: "deadline_follow_up",
    matterId: "MAT-204",
    clientPhone: "+15555550123",
    dueDate: "2026-10-01",
  });

  assert.equal(alert.text, "Matter MAT-204: action is due 2026-10-01. Review the secure portal today.");
  assert.equal(alert.idempotencyKey, "deadline-follow-up:MAT-204:2026-10-01");
});
