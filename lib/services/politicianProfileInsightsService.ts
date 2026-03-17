import { getFederalDeputyRelatedLegislation } from "@/lib/services/federalDeputyLegislationService";
import { getFederalDeputyPresenceInsight } from "@/lib/services/federalDeputyPresenceService";
import { getFederalDeputyStaff } from "@/lib/services/federalDeputyStaffService";
import { getFederalDeputyVotingHistory } from "@/lib/services/federalDeputyVotesService";

export const getDeputadoVotingHistory = getFederalDeputyVotingHistory;
export const getDeputadoPresenceInsight = getFederalDeputyPresenceInsight;
export const getDeputadoStaff = getFederalDeputyStaff;
export const getDeputadoRelatedLegislationItems = getFederalDeputyRelatedLegislation;
