import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Webhook de Sanity (se da de alta en la Fase 9). Al publicar un documento,
// Sanity llama aquí con {"_type": "..."} firmado con SANITY_REVALIDATE_SECRET
// y se renueva la caché de todas las consultas de ese tipo.
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Falta SANITY_REVALIDATE_SECRET" }, { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(request, secret);
  if (!isValidSignature) {
    return NextResponse.json({ message: "Firma no válida" }, { status: 401 });
  }
  if (!body?._type) {
    return NextResponse.json({ message: "Falta _type" }, { status: 400 });
  }

  // expire: 0 → la siguiente visita ya recibe el contenido nuevo.
  revalidateTag(body._type, { expire: 0 });
  return NextResponse.json({ revalidated: body._type });
}
