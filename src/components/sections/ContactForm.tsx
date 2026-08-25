import { useState } from "react";

// The submit can be in one of four states. Modeling it as a union (instead of
// a bunch of booleans like isLoading/isError) makes impossible combos
// unrepresentable and the UI logic below trivial to read.
type Status = "idle" | "submitting" | "success" | "error";

const initialForm = { name: "", email: "", message: "" };

export default function ContactForm() {
  // One state object holds all three fields. `status` drives button + messages.
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<Status>("idle");

  // One handler for all inputs. The input's `name` attribute tells us which
  // field changed — we use a computed key [name] to update just that one.
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the browser's default full-page form reload

    // The honeypot below is a DOM-only input — it's deliberately not in React
    // state, so nothing but a bot's autofill ever sets it. That means its value
    // has to be read off the form element itself; a `name` attribute only
    // travels on its own during a native submit, and preventDefault() means
    // there isn't one.
    //
    // Two things this line depends on:
    //   - An unchecked checkbox is ABSENT from FormData, not `false`. Checked,
    //     with no value attribute, it's the string "on". So presence is the test.
    //   - It must run before the first `await`: React reassigns e.currentTarget
    //     once the event finishes dispatching, so reading it after the fetch
    //     would be null at runtime while still typechecking.
    const botcheck = new FormData(e.currentTarget).get("botcheck") !== null;

    setStatus("submitting");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          // Astro exposes PUBLIC_-prefixed vars to client code and inlines
          // them at build time — the NEXT_PUBLIC_ equivalent.
          access_key: import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY,
          ...form,
          botcheck,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setForm(initialForm); // clear the fields on success
      } else {
        setStatus("error");
      }
    } catch {
      // network error, etc.
      setStatus("error");
    }
  }

  // Shared input styles — pulled into a const so the three fields stay in sync.
  const fieldClasses =
    "rounded-lg border border-foreground/10 bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50";

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-xl flex-col gap-5">
      {/* Web3Forms honeypot: bots fill hidden fields, humans can't see them.
          A submission with this checked is silently dropped as spam. */}
      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          className={fieldClasses}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className={fieldClasses}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="text-sm font-medium text-foreground"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="What's on your mind?"
          className={`${fieldClasses} resize-y`}
        />
      </div>

      <button
        type="submit"
        data-avatar-react
        disabled={status === "submitting"}
        className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>

      {/* Status feedback — only one of these renders at a time */}
      {status === "success" && (
        <p className="text-sm text-accent">
          Thanks! Your message has been sent.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400">
          Something went wrong. Please try again, or email me directly.
        </p>
      )}
    </form>
  );
}
