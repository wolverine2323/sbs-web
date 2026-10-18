import Image from "next/image";
import { cn } from "@/lib/cn";

const variants = {
  // Doble anillo bronce, para un sello sin logo.
  embassy:
    "border border-bronze font-serif text-[22px] text-burgundy-deep italic shadow-[inset_0_0_0_6px_var(--color-paper),inset_0_0_0_7px_rgb(155_125_88/0.5)]",
  // Círculo ink (Chambers & Partners, LACCA) sin logo.
  distinction: "bg-ink p-4 font-serif text-[19px] leading-[1.1] text-bronze-light",
};

export type SealLogo = { src: string; width: number; height: number };

type Props = {
  label: string;
  caption: string;
  variant?: keyof typeof variants;
  // Con logo (un solo color, fondo transparente) se muestra en lugar del círculo.
  logo?: SealLogo | null;
};

// Sello de reconocimiento (sobre paper).
export function SealBadge({ label, caption, variant = "embassy", logo }: Props) {
  return (
    <div className="flex w-[150px] flex-col items-center gap-4 text-center sm:w-[200px]">
      {logo ? (
        // Caja fija: cada logo cabe entero (los anchos llegan al ancho, los
        // altos al alto), así ninguno pesa más que los otros.
        <Image
          src={logo.src}
          width={logo.width}
          height={logo.height}
          alt={label}
          unoptimized
          className="h-[72px] w-[140px] object-contain sm:h-[88px] sm:w-[180px]"
        />
      ) : (
        <span
          className={cn(
            "flex size-32 items-center justify-center rounded-full",
            variants[variant],
          )}
        >
          {label}
        </span>
      )}
      <span className="text-[13px] leading-[1.45] text-on-paper-body">
        {caption}
      </span>
    </div>
  );
}
