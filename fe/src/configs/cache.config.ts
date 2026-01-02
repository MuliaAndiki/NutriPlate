export const cacheKey = {
  child: {
    list: () => ["child"] as const,
    byID: (id: string) => ["child", id],
  },
};
