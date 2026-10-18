import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { SectionEyebrow } from "../SectionEyebrow";

export type TopicLink = {
  id: string;
  title: string;
  href: ComponentProps<typeof Link>["href"];
  current?: boolean;
};

type Props = {
  headings: { id: string; text: string }[];
  topics: TopicLink[];
};

const itemClass =
  "-ml-px flex min-h-11 items-center border-l py-1.5 pl-4 text-[14px] leading-[1.45] transition-colors focus-visible:outline-on-paper";

// Índice lateral de un artículo de la guía (sobre paper): los apartados del
// texto y los demás artículos del mismo tema.
export function GuideAside({ headings, topics }: Props) {
  const t = useTranslations("Guide");

  return (
    <aside className="flex flex-col gap-12 lg:sticky lg:top-[124px] lg:max-h-[calc(100vh-140px)] lg:self-start lg:overflow-y-auto">
      {!!headings.length && (
        <nav aria-label={t("onThisPage")}>
          <SectionEyebrow tone="light" variant="small">
            {t("onThisPage")}
          </SectionEyebrow>
          <ul className="mt-4 border-l border-on-paper/14">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    itemClass,
                    "border-transparent text-on-paper-body hover:border-burgundy hover:text-on-paper",
                  )}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {topics.length > 1 && (
        <nav aria-label={t("inThisTopic")}>
          <SectionEyebrow tone="light" variant="small">
            {t("inThisTopic")}
          </SectionEyebrow>
          <ul className="mt-4 border-l border-on-paper/14">
            {topics.map((topic) => (
              <li key={topic.id}>
                <Link
                  href={topic.href}
                  aria-current={topic.current ? "page" : undefined}
                  className={cn(
                    itemClass,
                    topic.current
                      ? "border-burgundy font-medium text-on-paper"
                      : "border-transparent text-on-paper-body hover:border-burgundy hover:text-on-paper",
                  )}
                >
                  {topic.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </aside>
  );
}
