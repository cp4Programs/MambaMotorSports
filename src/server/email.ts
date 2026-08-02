import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import type { BookingRecord, ContactRecord } from "@/server/types";

function shopInbox() {
  return process.env.SHOP_NOTIFY_EMAIL || process.env.SES_FROM_EMAIL || "";
}

function fromAddress() {
  return process.env.SES_FROM_EMAIL || shopInbox();
}

export async function notifyBooking(booking: BookingRecord) {
  const to = shopInbox();
  const subject = `New booking — ${booking.name} · ${booking.serviceType}`;
  const body = [
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
    `Vehicle: ${booking.year} ${booking.make} ${booking.model}`,
    `Service: ${booking.serviceType}`,
    `Preferred: ${booking.date} · ${booking.time}`,
    ``,
    `Issue:`,
    booking.issue,
  ].join("\n");

  await send(to, subject, body);
}

export async function notifyContact(message: ContactRecord) {
  const to = shopInbox();
  const subject = `New inquiry — ${message.name}`;
  const body = [
    `Name: ${message.name}`,
    `Phone: ${message.phone || "n/a"}`,
    `Email: ${message.email}`,
    `Vehicle: ${message.vehicle || "n/a"}`,
    ``,
    `Message:`,
    message.message,
  ].join("\n");

  await send(to, subject, body);
}

async function send(to: string, subject: string, body: string) {
  if (!to || !fromAddress() || process.env.EMAIL_MODE === "log") {
    console.log("[email:log]", { to: to || "(unset)", subject, body });
    return;
  }

  const client = new SESClient({
    region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-west-2",
  });

  await client.send(
    new SendEmailCommand({
      Source: fromAddress(),
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: body } },
      },
    }),
  );
}
