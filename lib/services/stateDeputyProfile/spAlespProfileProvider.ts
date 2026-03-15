import {
  getAlespDeputadoDetailByMatricula,
  getAlespDeputadoExpensesByMatricula,
  getAlespDeputadoPresenceInsight,
} from "@/lib/services/alespStateDeputyService";
import type { StateDeputyProfileProvider } from "@/lib/services/stateDeputyProfile/types";

export const spAlespProfileProvider: StateDeputyProfileProvider = {
  key: "alesp-profile",
  stateCode: "SP",
  enrichProfileByExternalId: async (externalId) => getAlespDeputadoDetailByMatricula(externalId),
  getExpensesByExternalId: async (externalId, filters = {}) =>
    getAlespDeputadoExpensesByMatricula(externalId, {
      ano: filters.ano,
      mes: filters.mes,
    }),
  getPresenceByScopedId: async (stateDeputyScopedId) => getAlespDeputadoPresenceInsight(stateDeputyScopedId),
};
