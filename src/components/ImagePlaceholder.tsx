import { cn } from "@/lib/cn";
import { ImageIcon } from "./icons";

const ratios = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-video",
  square: "aspect-square",
};

type Props = {
  // Qué foto irá aquí, p. ej. "Photo · Les associés fondateurs".
  label: string;
  ratio?: keyof typeof ratios;
  className?: string;
};

// Recuadro rotulado mientras faltan las fotos de la firma.
export function ImagePlaceholder({ label, ratio = "portrait", className }: Props) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn("relative flex items-end bg-ink-raised p-7", ratios[ratio], className)}
    >
      <ImageIcon
        size={56}
        strokeWidth={1}
        className="absolute inset-0 m-auto text-bronze-light"
      />
      <span
        aria-hidden="true"
        className="relative text-[11px] tracking-[0.24em] text-bronze-light uppercase"
      >
        {label}
      </span>
    </div>
  );
}
