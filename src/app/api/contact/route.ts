import { NextResponse } from "next/server";
import { z } from "zod";
import { notifyContact } from "@/server/email";
import { createContact } from "@/server/repository";

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email(),
  vehicle: z.string().optional(),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const message = await createContact(body);
    await notifyContact(message);
    return NextResponse.json({ ok: true, id: message.id });
  } catch (err) {
    const status = err instanceof z.ZodError ? 400 : 500;
    return NextResponse.json(
      {
        error:
          err instanceof z.ZodError
            ? "Please fill out all required fields."
            : err instanceof Error
              ? err.message
              : "Invalid contact",
      },
      { status },
    );
  }
}
