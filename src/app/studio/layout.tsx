import type { ReactNode } from "react";

// Layout raíz propio del Studio: sin los estilos ni las fuentes del sitio.
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
