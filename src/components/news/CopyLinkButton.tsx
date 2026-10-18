"use client";

import { useEffect, useState } from "react";

type Props = { label: string; copiedLabel: string; className?: string };

// Copia la dirección de la página; el aviso «Lien copié» se anuncia a los
// lectores de pantalla.
export function CopyLinkButton({ label, copiedLabel, className }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      // Sin permiso para el portapapeles: no se muestra el aviso.
    }
  };

  return (
    <button type="button" onClick={copy} className={className}>
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
