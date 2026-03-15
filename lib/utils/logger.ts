type LoggerPayload = Record<string, unknown> | undefined;

function canLog(): boolean {
  return process.env.NODE_ENV !== "test";
}

export const logger = {
  info(message: string, payload?: LoggerPayload) {
    if (!canLog()) {
      return;
    }

    if (payload) {
      console.info(`[AcordaBrasil] ${message}`, payload);
      return;
    }

    console.info(`[AcordaBrasil] ${message}`);
  },
  warn(message: string, payload?: LoggerPayload) {
    if (!canLog()) {
      return;
    }

    if (payload) {
      console.warn(`[AcordaBrasil] ${message}`, payload);
      return;
    }

    console.warn(`[AcordaBrasil] ${message}`);
  },
  error(message: string, payload?: LoggerPayload) {
    if (!canLog()) {
      return;
    }

    if (payload) {
      console.error(`[AcordaBrasil] ${message}`, payload);
      return;
    }

    console.error(`[AcordaBrasil] ${message}`);
  },
};
