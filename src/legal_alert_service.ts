import { z } from "zod";
import { InfraiError, infrai } from "./infrai_sms_client.ts";

const requestSchema = z.discriminatedUnion("event", [
  z.object({ event: z.literal("matter_intake"), matterId: z.string().min(1), clientPhone: z.string().min(8) }),
  z.object({ event: z.literal("signed_document_delivery"), matterId: z.string().min(1), clientPhone: z.string().min(8), documentName: z.string().min(1) }),
  z.object({ event: z.literal("deadline_follow_up"), matterId: z.string().min(1), clientPhone: z.string().min(8), dueDate: z.string().date() }),
]);

export type LegalAlertRequest = z.infer<typeof requestSchema>;

export function buildAlert(request: LegalAlertRequest): { text: string; idempotencyKey: string } {
  switch (request.event) {
    case "matter_intake":
      return { text: `Matter ${request.matterId}: intake received. We will contact you through your approved channel.`, idempotencyKey: `matter-intake:${request.matterId}` };
    case "signed_document_delivery":
      return { text: `Matter ${request.matterId}: ${request.documentName} is signed and ready in the secure portal.`, idempotencyKey: `signed-document:${request.matterId}:${request.documentName}` };
    case "deadline_follow_up":
      return { text: `Matter ${request.matterId}: action is due ${request.dueDate}. Review the secure portal today.`, idempotencyKey: `deadline-follow-up:${request.matterId}:${request.dueDate}` };
  }
}

export async function sendLegalAlert(input: unknown) {
  const request = requestSchema.parse(input);
  const alert = buildAlert(request);
  try {
    const delivery = await infrai.sms.batch.send(
      { messages: [{ to: request.clientPhone, text: alert.text }] },
      alert.idempotencyKey,
    );
    return { accepted: true, matterId: request.matterId, delivery };
  } catch (error) {
    if (error instanceof InfraiError) {
      return { accepted: false, status: error.status, message: error.message };
    }
    throw error;
  }
}
