import { NextResponse } from "next/server";
import { z } from "zod";
import { sendNotification } from "@/server/email";
import { createContact } from "@/server/repo";

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().optional().default(""),
  email: z.string().email(),
  vehicle: z.string().optional().default(""),
  message: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const contact = await createContact(body);
    await sendNotification(
      `New inquiry from ${contact.name}`,
      [
        `Name: ${contact.name}`,
        `Phone: ${contact.phone || "n/a"}`,
        `Email: ${contact.email}`,
        `Vehicle: ${contact.vehicle || "n/a"}`,
        `Message: ${contact.message}`,
        `Status: ${contact.status}`,
        `ID: ${contact.id}`,
      ].join("\n"),
    );
    return NextResponse.json({ ok: true, id: contact.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
