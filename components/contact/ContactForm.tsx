"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { validateContactForm, type ContactFormData, type ContactFormErrors } from "@/lib/validate-contact";

type Status = "idle" | "submitting" | "success" | "error";

const inputStyle = {
  backgroundColor: "var(--color-card)",
  borderColor: "var(--color-border)",
  color: "var(--color-ink)",
};

export function ContactForm() {
  const [values, setValues] = useState<ContactFormData>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (field: keyof ContactFormData) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);

    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setValues({ name: "", email: "", message: "" });
    } catch {
      setServerError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border p-10 text-center"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
      >
        <CheckCircle2 className="h-8 w-8" style={{ color: "var(--color-success)" }} strokeWidth={1.75} />
        <p className="font-medium">Message sent — thanks for reaching out.</p>
        <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
          I&apos;ll get back to you as soon as I can.
        </p>
        <button
          type="button"
          data-cursor="pointer"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-medium underline"
          style={{ color: "var(--color-accent)" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={handleChange("name")}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
          style={inputStyle}
        />
        {errors.name ? (
          <p id="contact-name-error" className="mt-1.5 text-xs" style={{ color: "#DC2626" }}>
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange("email")}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-accent)] [&:-webkit-autofill]:!bg-[var(--color-card)] [&:-webkit-autofill]:shadow-[0_0_0_1000px_var(--color-card)_inset]"
          style={inputStyle}
        />
        {errors.email ? (
          <p id="contact-email-error" className="mt-1.5 text-xs" style={{ color: "#DC2626" }}>
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={handleChange("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className="w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
          style={inputStyle}
        />
        {errors.message ? (
          <p id="contact-message-error" className="mt-1.5 text-xs" style={{ color: "#DC2626" }}>
            {errors.message}
          </p>
        ) : null}
      </div>

      {status === "error" && serverError ? (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
          style={{ borderColor: "#DC2626", color: "#DC2626" }}
        >
          <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          {serverError}
        </div>
      ) : null}

      <MagneticButton type="submit" variant="primary" className="self-start" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
            Sending…
          </>
        ) : (
          "Send Message"
        )}
      </MagneticButton>
    </form>
  );
}
