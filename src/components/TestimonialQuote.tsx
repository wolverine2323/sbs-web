import { cn } from "@/lib/cn";

type Props = {
  quote: string;
  name: string;
  role?: string | null;
  // "feature": una sola cita grande y centrada; "card": en la lista de Expériences.
  variant?: "feature" | "card";
};

// Cita de un cliente (sobre burgundy-deep), con el estilo del carrusel.
export function TestimonialQuote({ quote, name, role, variant = "feature" }: Props) {
  const feature = variant === "feature";
  return (
    <figure
      className={cn(
        "flex flex-col",
        feature ? "items-center text-center" : "h-full border border-bronze-light/25 p-8 sm:p-10",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "font-serif leading-[0.6] text-burgundy",
          feature ? "h-16 text-[140px]" : "h-10 text-[96px]",
        )}
      >
        “
      </span>
      <blockquote
        className={cn(
          "font-serif leading-[1.4] text-cream italic",
          feature ? "text-[clamp(26px,2.6vw,36px)]" : "text-[clamp(21px,1.9vw,25px)]",
        )}
      >
        {quote}
      </blockquote>
      <figcaption className={cn("flex flex-col gap-1.5", feature ? "mt-9" : "mt-auto pt-8")}>
        <span className="text-[13px] tracking-[0.24em] text-cream uppercase">{name}</span>
        {role && <span className="text-sm text-bronze-light">{role}</span>}
      </figcaption>
    </figure>
  );
}
