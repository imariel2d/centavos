import { NewsletterForm } from "@/components/NewsletterForm";

export function NewsletterCTA() {
  return (
    <section id="newsletter" className="mx-auto max-w-screen-md px-4 pt-10 md:pt-14">
      <div className="bg-mandarina text-ink rounded-3xl px-6 py-7 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-yolk/50" aria-hidden />
        <div className="relative">
          <div className="font-hand text-2xl leading-none mb-1">psst...</div>
          <h3 className="font-display text-[26px] md:text-3xl font-extrabold tracking-[-0.028em] leading-none mb-2.5">
            Centavo en tu correo,<br />cada martes.
          </h3>
          <p className="text-[13px] opacity-80 leading-snug mb-4">
            Lo mejor de la semana resumido. Cero spam, garantizado por nuestro abogado (y por nosotros, que no tenemos abogado).
          </p>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
