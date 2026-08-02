import { NextResponse } from "next/server";
import { z } from "zod";
import { notifyBooking } from "@/server/email";
import { createBooking } from "@/server/repository";

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.string().min(1),
  serviceType: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  issue: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const booking = await createBooking(body);
    await notifyBooking(booking);
    return NextResponse.json({ ok: true, id: booking.id });
  } catch (err) {
    const status = err instanceof z.ZodError ? 400 : 500;
    return NextResponse.json(
      {
        error:
          err instanceof z.ZodError
            ? "Please fill out all required fields."
            : err instanceof Error
              ? err.message
              : "Invalid booking",
      },
      { status },
    );
  }
}
