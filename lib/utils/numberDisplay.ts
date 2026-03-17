type NumberTone = "hero" | "primary" | "compact";

export function getNumberScaleClass(value: string, tone: NumberTone): string {
  const digits = value.replace(/\D/g, "").length;

  if (tone === "hero") {
    if (digits >= 16) {
      return "text-[clamp(1.55rem,4.2vw,2.45rem)]";
    }
    if (digits >= 13) {
      return "text-[clamp(1.7rem,4.7vw,2.9rem)]";
    }
    return "text-[clamp(1.9rem,5.2vw,3.35rem)]";
  }

  if (tone === "primary") {
    if (digits >= 16) {
      return "text-[clamp(1.3rem,3.8vw,2rem)]";
    }
    if (digits >= 13) {
      return "text-[clamp(1.45rem,4.2vw,2.35rem)]";
    }
    return "text-[clamp(1.65rem,4.7vw,2.65rem)]";
  }

  if (digits >= 16) {
    return "text-[clamp(1rem,2.5vw,1.22rem)]";
  }
  if (digits >= 13) {
    return "text-[clamp(1.05rem,2.75vw,1.35rem)]";
  }
  return "text-[clamp(1.1rem,3vw,1.5rem)]";
}
