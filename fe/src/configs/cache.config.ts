export const cacheKey = {
  child: {
    list: () => ["child"] as const,
    byID: (id: string) => [`child:${id}`],
  },
  evaluate: {
    byChild: (id: string) => [`evaluate:child:${id}`],
  },
  measurement: {
    byChild: (id: string) => [`measurement:child:${id}`],
  },
};
