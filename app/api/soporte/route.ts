import { NextResponse } from "next/server";

export const runtime = "nodejs";

// El backend de soporte quedó fuera de servicio. Mientras se conecta un nuevo
// destino, el formulario cae al enlace mailto de hola@centavos.mx. Este endpoint
// responde 503 para no aceptar mensajes que se perderían en silencio.
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "El envío por formulario no está disponible por ahora. Escríbenos a hola@centavos.mx.",
    },
    { status: 503 },
  );
}
