export const EventKeys = {
  background_StartedAutoFill: "background_StartedAutoFill",
  content_StartedObserving: "content_StartedObserving",
  background_FoundInputElement: "background_FoundInputElement",
  content_ProcessedElement: "content_ProcessedElement",
} as const;

export type EventKeys = (typeof EventKeys)[keyof typeof EventKeys];
