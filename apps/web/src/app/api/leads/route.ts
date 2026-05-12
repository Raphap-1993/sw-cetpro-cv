export const dynamic = "force-dynamic";

const apiUrl =
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4010/api";

function buildApiUrl(path: string) {
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Solicitud invalida." }, { status: 400 });
  }

  try {
    const response = await fetch(buildApiUrl("/leads"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });

    const data = await response.json().catch(() => null);

    return Response.json(data ?? {}, {
      status: response.status
    });
  } catch {
    return Response.json(
      { message: "No se pudo conectar con el API." },
      { status: 502 }
    );
  }
}
