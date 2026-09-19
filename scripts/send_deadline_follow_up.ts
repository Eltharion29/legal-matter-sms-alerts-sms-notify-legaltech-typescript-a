import { sendLegalAlert } from "../src/legal_alert_service.ts";

const clientPhone = process.env.DEMO_CLIENT_PHONE;
if (!clientPhone) throw new Error("DEMO_CLIENT_PHONE is required");

const result = await sendLegalAlert({
  event: "deadline_follow_up",
  matterId: "MAT-204",
  clientPhone,
  dueDate: "2026-10-01",
});

console.log(result);
