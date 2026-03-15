export type LiveSpendConfig = {
  initialValue?: number;
  intervalMs: number;
  amountPerSecond: number;
};

export function getElapsedSeconds(startTimestampMs: number, nowTimestampMs = Date.now()): number {
  const elapsedMs = Math.max(0, nowTimestampMs - startTimestampMs);
  return elapsedMs / 1000;
}

export function getAccumulatedValue(
  config: Pick<LiveSpendConfig, "amountPerSecond">,
  elapsedSeconds: number,
  initialValue = 0,
): number {
  const safeRate = Number.isFinite(config.amountPerSecond)
    ? Math.max(0, config.amountPerSecond)
    : 0;

  return initialValue + elapsedSeconds * safeRate;
}
