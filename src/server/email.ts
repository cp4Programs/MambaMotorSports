import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

function notifyTo() {
  return process.env.NOTIFY_EMAIL || process.env.OWNER_EMAIL || "";
}

function fromAddress() {
  return process.env.SES_FROM_EMAIL || process.env.NOTIFY_EMAIL || "";
}

export async function sendNotification(subject: string, body: string) {
  const to = notifyTo();
  const from = fromAddress();

  if (!to) {
    console.info("[email:skipped] No NOTIFY_EMAIL configured");
    console.info(subject, body);
    return { skipped: true as const };
  }

  // Without SES credentials / verified identities, log and continue so forms still work.
  if (!process.env.AWS_ACCESS_KEY_ID && !process.env.AWS_PROFILE && !process.env.AWS_REGION) {
    console.info("[email:dev-log]", { to, subject, body });
    return { skipped: true as const };
  }

  if (!from) {
    console.info("[email:dev-log]", { to, subject, body });
    return { skipped: true as const };
  }

  try {
    const client = new SESClient({
      region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-west-2",
    });
    await client.send(
      new SendEmailCommand({
        Source: from,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject },
          Body: { Text: { Data: body } },
        },
      }),
    );
    return { skipped: false as const };
  } catch (err) {
    console.error("[email:error]", err);
    console.info("[email:fallback-log]", { to, subject, body });
    return { skipped: true as const };
  }
}
