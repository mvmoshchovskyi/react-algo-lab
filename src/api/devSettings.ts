import { useSyncExternalStore } from "react";

export type DevSettings = {
  delay: number;
  failNext: boolean;
};

let snapshot: DevSettings = { delay: 0, failNext: false };
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

export function useDevSettings(): DevSettings {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function setDelay(delay: number) {
  snapshot = { ...snapshot, delay };
  emit();
}

export function armFailNext() {
  snapshot = { ...snapshot, failNext: true };
  emit();
}

export function resetDevSettings() {
  snapshot = { delay: 0, failNext: false };
  emit();
}

/**
 * Повертає true один раз, якщо в DevPanel увімкнено «зламати наступний запит».
 * Викликається з API-клієнта, не з рендера.
 */
export function consumeFailNext(): boolean {
  if (!snapshot.failNext) return false;
  snapshot = { ...snapshot, failNext: false };
  emit();
  return true;
}

export function getDelay() {
  return snapshot.delay;
}
