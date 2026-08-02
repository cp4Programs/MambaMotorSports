import { NextResponse } from "next/server";
import { z } from "zod";
import { sendNotification } from "@/server/email";
import { createBooking } from "@/server/repo";

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  make: z.string().min(1),
  model: z.string().optional().default(""),
  year: z.string().optional().default(""),
  serviceType: z.string().min(1),
  date: z.string().optional().default(""),
  time: z.string().optional().default(""),
  issue: z.string().optional().default(""),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const booking = await createBooking(body);
    await sendNotification(
      `New booking: ${booking.serviceType} — ${booking.name}`,
      [
        `Name: ${booking.name}`,
        `Phone: ${booking.phone}`,
        `Email: ${booking.email}`,
        `Vehicle: ${booking.year} ${booking.make} ${booking.model}`.trim(),
        `Service: ${booking.serviceType}`,
        `Preferred: ${booking.date || "n/a"} ${booking.time || ""}`.trim(),
        `Issue: ${booking.issue || "n/a"}`,
        `Status: ${booking.status}`,
        `ID: ${booking.id}`,
      ].join("\n"),
    );
    return NextResponse.json({ ok: true, id: booking.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
