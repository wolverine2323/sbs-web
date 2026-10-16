import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

// Sale del modo borrador y vuelve a la portada.
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  return NextResponse.redirect(new URL("/", request.url));
}
