const LATENCY_MS = 220;

export function mockRequest<T>(produce: () => T, latency = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(produce())), latency);
  });
}
