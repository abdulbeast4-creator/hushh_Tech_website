export function trackEvent(eventName: string, payload?: Record<string, unknown>) {
  console.log(`[analytics] ${eventName}`, payload ?? {});
}
