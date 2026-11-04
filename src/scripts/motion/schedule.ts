type Step = () => void;

const IDLE_TIMEOUT_MS = 300;

export function runWhenIdle(steps: readonly Step[], run: (step: Step) => void): () => void {
  const queue = [...steps];
  let cancelled = false;
  let cancelPending: () => void = () => undefined;

  const schedule = (callback: () => void): void => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT_MS });
      cancelPending = () => {
        window.cancelIdleCallback(id);
      };
    } else {
      const id = setTimeout(callback, 16);
      cancelPending = () => {
        clearTimeout(id);
      };
    }
  };

  const next = (): void => {
    const step = queue.shift();
    if (cancelled || !step) return;
    run(step);
    schedule(next);
  };

  schedule(next);

  return () => {
    cancelled = true;
    cancelPending();
  };
}
