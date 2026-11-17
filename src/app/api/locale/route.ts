import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  locale: z.enum(["es", "en"]),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_locale" }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set("locale", parsed.data.locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  const session = await requireSession();
  if (session?.user?.id) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { locale: parsed.data.locale },
    });
  }

  return NextResponse.json({ locale: parsed.data.locale });
}
