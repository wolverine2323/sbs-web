import { notFound } from "next/navigation";
import { PLACEHOLDER } from "@/sanity/lib/params";

// Cualquier otra dirección con idioma (/fr/a/b…) muestra la página 404 del
// sitio, en su idioma y con el header y el pie.

export function generateStaticParams() {
  return [{ rest: [PLACEHOLDER, PLACEHOLDER] }];
}

export default function CatchAllPage() {
  notFound();
}
