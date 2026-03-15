import { NextRequest, NextResponse } from "next/server";
import { fetchProposicoesFromCamara } from "@/lib/services/camaraService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siglaTipo = searchParams.get("siglaTipo") || undefined;
    const ano = searchParams.get("ano");
    const pagina = Number(searchParams.get("pagina") || "1");
    const itens = Number(searchParams.get("itens") || "50");

    const dados = await fetchProposicoesFromCamara({
      siglaTipo,
      ano: ano ? Number(ano) : undefined,
      pagina,
      itens,
    });

    return NextResponse.json({ dados }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível buscar proposições na Câmara.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 502 },
    );
  }
}
