import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import type { TrackEvent } from "@/lib/track";
import { buttonBase, buttonSizes, type ButtonSize } from "./button-styles";
import { ArrowRightIcon } from "./icons";
import type { Tone } from "./tone";

type Props = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  size?: ButtonSize;
  tone?: Tone;
  withArrow?: boolean;
  fullWidth?: boolean;
  track?: TrackEvent;
};

// Botón de acción burgundy. Hover: burgundy-hover sobre ink, burgundy-mid sobre paper.
export function ButtonPrimary({
  href,
  size = "lg",
  tone = "dark",
  withArrow = false,
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
        "bg-burgundy text-white",
        tone === "dark"
          ? "hover:bg-burgundy-hover"
          : "hover:bg-burgundy-mid focus-visible:outline-on-paper",
        className,
      )}
      {...rest}
    >
      {children}
      {withArrow && <ArrowRightIcon />}
    </a>
  );
}
