export async function promiseAllRateLimited<T>(
  tasks: (() => Promise<T>)[],
  rateLimit: number,
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  const taskQueue = tasks.slice();
  let activeTasks = 0;

  async function* taskGenerator() {
    while (taskQueue.length > 0 || activeTasks > 0) {
      if (taskQueue.length > 0 && activeTasks < concurrency) {
        activeTasks++;
        const task = taskQueue.shift();
        if (task) {
          yield task().finally(() => {
            activeTasks--;
          });
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, rateLimit));
      }
    }
  }

  for await (const result of taskGenerator()) {
    results.push(result);
  }

  return results;
}
