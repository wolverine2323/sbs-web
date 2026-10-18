import { draftMode } from "next/headers";
import { Suspense, type ReactNode } from "react";
import { getDynamicFetchOptions, type DynamicFetchOptions } from "./live";

type Render = (options: DynamicFetchOptions) => ReactNode;

// Opciones de consulta de una página: lo publicado (prerenderizado) o, en la
// vista previa del Studio, los borradores con edición con clic. Los
// borradores leen cookies, por eso van dentro de Suspense.
export async function WithFetchOptions({ children }: { children: Render }) {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return children({ perspective: "published", stega: false });
  return (
    <Suspense>
      <DraftOptions>{children}</DraftOptions>
    </Suspense>
  );
}

async function DraftOptions({ children }: { children: Render }) {
  return children(await getDynamicFetchOptions());
}
