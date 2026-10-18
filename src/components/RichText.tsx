import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { headingId, type TextBlock } from "@/lib/portable-text";
import { imageDimensions, urlFor } from "@/sanity/lib/image";
import type { Tone } from "./tone";

type AccessibleImage = {
  asset?: { _ref?: string };
  alt?: string;
};

// Colores del texto según el fondo: ink ("dark") o paper ("light").
const tones = {
  dark: {
    body: "text-stone",
    heading: "text-cream",
    strong: "text-cream",
    rule: "border-bronze-light/45",
    marker: "marker:text-bronze-light",
    link: "text-bronze-light hover:text-cream",
  },
  light: {
    body: "text-on-paper-body",
    heading: "text-on-paper",
    strong: "text-on-paper",
    rule: "border-bronze",
    marker: "marker:text-bronze-text",
    link: "text-burgundy hover:text-burgundy-mid focus-visible:outline-on-paper",
  },
} satisfies Record<Tone, Record<string, string>>;

// Texto enriquecido de Sanity con el estilo Nocturne. Los h2 llevan id para
// el índice lateral (scroll-mt: que el header fijo no los tape).
function components(tone: Tone): PortableTextComponents {
  const c = tones[tone];
  return {
    block: {
      normal: ({ children }) => (
        <p className={cn("mt-6 text-[17px] leading-[1.8]", c.body)}>{children}</p>
      ),
      h2: ({ children, value }) => (
        <h2
          id={headingId(value as TextBlock)}
          className={cn(
            "mt-16 scroll-mt-[120px] font-serif text-[clamp(30px,3vw,40px)] leading-[1.1] font-normal",
            c.heading,
          )}
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3
          className={cn(
            "mt-12 font-serif text-[clamp(24px,2.4vw,30px)] leading-[1.2] font-medium",
            c.heading,
          )}
        >
          {children}
        </h3>
      ),
      blockquote: ({ children }) => (
        <blockquote
          className={cn(
            "mt-10 border-l pl-6 font-serif text-[clamp(22px,2.2vw,28px)] leading-[1.4] italic",
            c.rule,
            c.heading,
          )}
        >
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className={cn("mt-6 list-disc space-y-2 pl-6 text-[17px] leading-[1.7]", c.body, c.marker)}>
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className={cn("mt-6 list-decimal space-y-2 pl-6 text-[17px] leading-[1.7]", c.body, c.marker)}>
          {children}
        </ol>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className={cn("font-semibold", c.strong)}>{children}</strong>,
      link: ({ value, children }) => {
        const href: string = value?.href ?? "#";
        const external = /^https?:\/\//.test(href);
        return (
          <a
            href={href}
            {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            className={cn("underline underline-offset-4", c.link)}
          >
            {children}
          </a>
        );
      },
    },
    types: {
      accessibleImage: ({ value }: { value: AccessibleImage }) => {
        const size = imageDimensions(value.asset?._ref);
        if (!value.asset || !size) return null;
        return (
          <figure className="mt-10">
            <Image
              src={urlFor(value).width(1600).url()}
              alt={value.alt ?? ""}
              width={size.width}
              height={size.height}
              sizes="(min-width: 820px) 760px, 100vw"
              className="h-auto w-full"
            />
          </figure>
        );
      },
    },
  };
}

const byTone = { dark: components("dark"), light: components("light") };

type Props = {
  value: ComponentProps<typeof PortableText>["value"];
  tone?: Tone;
};

export function RichText({ value, tone = "dark" }: Props) {
  return <PortableText value={value} components={byTone[tone]} />;
}
