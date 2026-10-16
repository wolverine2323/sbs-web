import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import type { ComponentProps } from "react";
import { imageDimensions, urlFor } from "@/sanity/lib/image";

type AccessibleImage = {
  asset?: { _ref?: string };
  alt?: string;
};

// Texto enriquecido de Sanity con el estilo Nocturne (sobre ink).
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-6 text-[17px] leading-[1.8] text-stone">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-16 font-serif text-[clamp(30px,3vw,40px)] leading-[1.1] font-normal text-cream">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-12 font-serif text-[clamp(24px,2.4vw,30px)] leading-[1.2] font-medium text-cream">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-10 border-l border-bronze-light/45 pl-6 font-serif text-[clamp(22px,2.2vw,28px)] leading-[1.4] text-cream italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-6 list-disc space-y-2 pl-6 text-[17px] leading-[1.7] text-stone marker:text-bronze-light">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-6 list-decimal space-y-2 pl-6 text-[17px] leading-[1.7] text-stone marker:text-bronze-light">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-cream">{children}</strong>,
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external && { target: "_blank", rel: "noopener noreferrer" })}
          className="text-bronze-light underline underline-offset-4 hover:text-cream"
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

export function RichText({ value }: { value: ComponentProps<typeof PortableText>["value"] }) {
  return <PortableText value={value} components={components} />;
}
