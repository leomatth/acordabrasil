import { NextResponse } from "next/server";
import { getVotacoesByProposicao } from "@/lib/services/camaraService";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);

  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "ID de proposição inválido." }, { status: 400 });
  }

  try {
    const dados = await getVotacoesByProposicao(id);
    return NextResponse.json({ dados }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível buscar votações da proposição na Câmara.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 502 },
    );
  }
}