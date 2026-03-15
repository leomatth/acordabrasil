export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  STATE_CLICK: "state_click",
  STATE_FILTER_CHANGE: "state_filter_change",
  PEC_CLICK: "pec_click",
  PEC_FILTER_CHANGE: "pec_filter_change",
  PEC_DETAIL_VIEW: "pec_detail_view",
  POLITICIAN_SEARCH: "politician_search",
  POLITICIAN_FILTER_CHANGE: "politician_filter_change",
  POLITICIAN_PROFILE_VIEW: "politician_profile_view",
  TAX_SIMULATION_VIEW: "tax_simulation_view",
  TAX_SIMULATION_RUN: "tax_simulation_run",
  NEWSLETTER_SIGNUP: "newsletter_signup",
  SUPPORT_CLICK: "support_click",
  PIX_COPY: "pix_copy",
  SHARE_RESULT: "share_result",
  CANDIDATE_CLICK: "candidate_click",
  POLL_INTERACTION: "poll_interaction",
  CTA_CLICK: "cta_click",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
