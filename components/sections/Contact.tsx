import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24 md:px-16 lg:px-24">
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Contact
      </h2>

      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
        Have a project in mind, or just want to say hi? Drop me a message and
        I&apos;ll get back to you.
      </p>

      {/* Contact.tsx stays a server component; only the interactive form
          opts into 'use client'. Keeps the client bundle small. */}
      <ContactForm />
    </section>
  );
}
