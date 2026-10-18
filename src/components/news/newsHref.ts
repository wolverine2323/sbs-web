// Dirección de una página de la lista de artículos (todas o una categoría).
export function newsHref(page: number, category?: string) {
  if (category) {
    return page === 1
      ? ({ pathname: "/actualite/categorie/[category]", params: { category } } as const)
      : ({
          pathname: "/actualite/categorie/[category]/page/[page]",
          params: { category, page: String(page) },
        } as const);
  }
  return page === 1
    ? ("/actualite" as const)
    : ({ pathname: "/actualite/page/[page]", params: { page: String(page) } } as const);
}

export const POSTS_PER_PAGE = 9;
