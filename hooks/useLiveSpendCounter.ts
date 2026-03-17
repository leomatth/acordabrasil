"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getAccumulatedValue } from "@/lib/liveSpend";

type UseLiveSpendCounterParams = {
  amountPerSecond: number;
  minFrameMs?: number;
  startDelayMs?: number;
};

export function useLiveSpendCounter({
  amountPerSecond,
  minFrameMs = 80,
  startDelayMs = 700,
}: UseLiveSpendCounterParams): number {
  const [value, setValue] = useState(0);

  const safeRate = useMemo(
    () => (Number.isFinite(amountPerSecond) ? Math.max(0, amountPerSecond) : 0),
    [amountPerSecond],
  );

  const lastRoundedValueRef = useRef(0);

  useEffect(() => {
    setValue(0);
    lastRoundedValueRef.current = 0;

    if (safeRate <= 0) {
      return;
    }

    const startedAt = performance.now() + Math.max(0, startDelayMs);
    let lastFrameAt = startedAt;
    let frame = 0;

    const tick = (now: number) => {
      if (now - lastFrameAt >= minFrameMs) {
        const elapsedSeconds = Math.max(0, now - startedAt) / 1000;
        const nextValue = Math.round(
          getAccumulatedValue({ amountPerSecond: safeRate }, elapsedSeconds, 0),
        );

        if (nextValue !== lastRoundedValueRef.current) {
          lastRoundedValueRef.current = nextValue;
          setValue(nextValue);
        }

        lastFrameAt = now;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [safeRate, minFrameMs, startDelayMs]);

  return value;
}
