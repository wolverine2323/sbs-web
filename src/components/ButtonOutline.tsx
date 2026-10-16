import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import type { TrackEvent } from "@/lib/track";
import { buttonBase, buttonSizes, type ButtonSize } from "./button-styles";
import type { Tone } from "./tone";

type Props = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  size?: ButtonSize;
  tone?: Tone;
  fullWidth?: boolean;
  track?: TrackEvent;
};

const tones: Record<Tone, string> = {
  dark: "border-cream/40 text-cream hover:bg-cream hover:text-ink",
  light:
    "border-on-paper/40 text-on-paper hover:bg-on-paper hover:text-paper focus-visible:outline-on-paper",
};

// Botón secundario con filete (p. ej. "Appeler le cabinet").
export function ButtonOutline({
  href,
  size = "lg",
  tone = "dark",
  fullWidth = false,
  track,
  className,
  children,
  ...rest
}: Props) {
  return (
    <a
      href={href}
      data-track={track}
      className={cn(
        buttonBase,
        buttonSizes[size],
        fullWidth ? "flex w-full" : "inline-flex",
        "border",
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
