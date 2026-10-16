import { cn } from "@/lib/cn";

const variants = {
  // Doble anillo bronce. Solo texto: nada de escudos de embajadas (CLAUDE.md).
  embassy:
    "border border-bronze font-serif text-[22px] text-burgundy-deep italic shadow-[inset_0_0_0_6px_var(--color-paper),inset_0_0_0_7px_rgb(155_125_88/0.5)]",
  // Círculo ink (Chambers & Partners, LACCA).
  distinction: "bg-ink p-4 font-serif text-[19px] leading-[1.1] text-bronze-light",
};

type Props = {
  label: string;
  caption: string;
  variant?: keyof typeof variants;
};

// Sello de reconocimiento (sobre paper).
export function SealBadge({ label, caption, variant = "embassy" }: Props) {
  return (
    <div className="flex w-[140px] flex-col items-center gap-4 text-center sm:w-[170px]">
      <span
        className={cn(
          "flex size-32 items-center justify-center rounded-full",
          variants[variant],
        )}
      >
        {label}
      </span>
      <span className="text-[13px] leading-[1.45] text-on-paper-body">
        {caption}
      </span>
    </div>
  );
}
