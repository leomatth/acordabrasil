"use client";

import { ErrorState } from "@/components/states/ErrorState";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="container-page py-10">
      <ErrorState onRetry={reset} />
    </main>
  );
}
