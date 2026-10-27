export function topKFrequent(nums: number[], k: number): number[] {
  const limit = Math.max(0, Math.trunc(k));
  if (limit === 0 || nums.length === 0) return [];

  const counts = new Map<number, number>();
  for (const number of nums) {
    counts.set(number, (counts.get(number) ?? 0) + 1);
  }

  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [value, count] of counts) {
    buckets[count]!.push(value);
  }

  const result: number[] = [];
  for (let count = nums.length; count >= 1 && result.length < limit; count -= 1) {
    const bucket = buckets[count];
    if (!bucket || bucket.length === 0) continue;
    bucket.sort((a, b) => a - b);
    for (const value of bucket) {
      result.push(value);
      if (result.length === limit) break;
    }
  }

  return result;
}
