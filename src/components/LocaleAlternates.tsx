"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/i18n/routing";

// Dirección de la página actual en cada idioma, p. ej.
// { fr: "/fr/expertises/immobilier", es: "/es/areas-de-practica/inmobiliario" }.
export type Alternates = Partial<Record<Locale, string>>;

const AlternatesContext = createContext<{
  alternates: Alternates | null;
  setAlternates: (alternates: Alternates | null) => void;
}>({ alternates: null, setAlternates: () => {} });

export function AlternatesProvider({ children }: { children: ReactNode }) {
  const [alternates, setAlternates] = useState<Alternates | null>(null);
  const value = useMemo(() => ({ alternates, setAlternates }), [alternates]);
  return <AlternatesContext value={value}>{children}</AlternatesContext>;
}

export function useAlternates() {
  return useContext(AlternatesContext).alternates;
}

// La incluye cada página con contenido de Sanity para que el selector de
// idioma lleve a sus traducciones (los slugs cambian de un idioma a otro).
export function PageAlternates({ alternates }: { alternates: Alternates }) {
  const { setAlternates } = useContext(AlternatesContext);
  const serialized = JSON.stringify(alternates);

  useEffect(() => {
    setAlternates(JSON.parse(serialized));
    return () => setAlternates(null);
  }, [serialized, setAlternates]);

  return null;
}
