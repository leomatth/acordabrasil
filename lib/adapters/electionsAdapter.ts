import type { ElectionPollEntry } from "@/types/election";

export function mapExternalElectionPollToInternalModel(payload: unknown): ElectionPollEntry[] {
  const items = Array.isArray(payload) ? payload : [];

  return items
    .map((rawItem) => {
      const item = rawItem as Record<string, unknown>;
      const candidato = String(item.candidato ?? item.candidate ?? "");
      const percentual = Number(item.percentual ?? item.percentage ?? 0);

      if (!candidato || !Number.isFinite(percentual)) {
        return null;
      }

      return {
        candidato,
        percentual,
      };
    })
    .filter((item): item is ElectionPollEntry => Boolean(item));
}
