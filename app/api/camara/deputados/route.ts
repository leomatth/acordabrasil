import { NextRequest, NextResponse } from "next/server";
import { fetchDeputadosFromCamara } from "@/lib/services/camaraService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partido = searchParams.get("partido") || undefined;
    const estado = searchParams.get("estado") || undefined;
    const pagina = Number(searchParams.get("pagina") || "1");
    const itens = Number(searchParams.get("itens") || "100");

    const dados = await fetchDeputadosFromCamara({
      partido,
      estado,
      pagina,
      itens,
    });

    return NextResponse.json({ dados }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível buscar deputados na Câmara.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 502 },
    );
  }
}
