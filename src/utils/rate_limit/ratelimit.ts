export async function promiseAllWithRateLimit<T>(
  promiseFactories: Array<() => Promise<T>>,
  limit = 10
): Promise<T[]> {
  const results: T[] = [];
  let currentIndex = 0;

  // A helper function to execute the next promise in the queue.
  const executeNext = async (): Promise<void> => {
    if (currentIndex >= promiseFactories.length) {
      return;
    }

    const currentPromiseFactory = promiseFactories[currentIndex];
    currentIndex++;

    const result = await currentPromiseFactory();
    results.push(result);

    // Continue executing the next promise in the queue.
    return executeNext();
  };

  // Start executing promises concurrently, up to the specified limit.
  const concurrentExecutions = [];
  for (let i = 0; i < Math.min(limit, promiseFactories.length); i++) {
    concurrentExecutions.push(executeNext());
  }

  // Wait for all concurrent executions to complete.
  await Promise.all(concurrentExecutions);

  return results;
}
