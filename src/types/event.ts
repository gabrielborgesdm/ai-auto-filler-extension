import { EventKeys } from "@/events-keys";

export interface EventData {
  tabId: number;
  action: EventKeys;
  payload?: any;
}
