import { NextResponse } from "next/server";
import { getVotosByVotacao } from "@/lib/services/camaraService";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const id = String(params.id || "").trim();

  if (!id) {
    return NextResponse.json({ error: "ID de votação inválido." }, { status: 400 });
  }

  try {
    const dados = await getVotosByVotacao(id);
    return NextResponse.json({ dados }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível buscar votos nominais da votação na Câmara.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 502 },
    );
  }
}