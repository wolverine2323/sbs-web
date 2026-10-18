// Cache Components exige al menos un valor en generateStaticParams. Mientras
// no haya contenido se prerenderiza un valor de relleno, que responde 404.
export const PLACEHOLDER = "_";

export function withPlaceholder<Params extends Record<string, string>>(
  params: Params[],
  placeholder: Params,
) {
  return params.length ? params : [placeholder];
}
