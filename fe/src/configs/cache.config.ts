export const cacheKey = {
  child: {
    list: () => ["child"] as const,
    byID: (id: string) => [`child:${id}`],
  },
  evaluate: {
    byChild: (id: string) => [`evaluate:child:${id}`],
  },
  profile: {
    user: () => ["user:profile"],
  },
  measurement: {
    byChild: (id: string) => [`measurement:child:${id}`],
  },
  program: {
    list: () => [`programs:list`],
    byID: (id: string) => [`programs:id:${id}`],
  },
};
