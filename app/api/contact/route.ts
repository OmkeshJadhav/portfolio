import { NextResponse } from "next/server";
import { validateContactForm } from "@/lib/validate-contact";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as { name?: string; email?: string; message?: string };
  const errors = validateContactForm(data);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const { name, email, message } = data as { name: string; email: string; message: string };

  // Wire up a real email provider here. Resend is used as the example
  // since it needs no extra SDK — just fetch + an API key. Set
  // RESEND_API_KEY and CONTACT_TO_EMAIL in your environment to enable it.
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (apiKey && toEmail) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: [toEmail],
          reply_to: email,
          subject: `New message from ${name}`,
          text: `From: ${name} <${email}>\n\n${message}`,
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        console.error("Resend API error:", detail);
        return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 502 });
      }
    } catch (error) {
      console.error("Contact form send failed:", error);
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 502 });
    }
  } else {
    // Dev fallback so the form is testable before an email provider is
    // configured — logs to the server console instead of sending.
    console.log("[contact-form] RESEND_API_KEY / CONTACT_TO_EMAIL not set. Message received:", {
      name,
      email,
      message,
    });
  }

  return NextResponse.json({ success: true });
}
