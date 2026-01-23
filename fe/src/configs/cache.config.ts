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
  progres: {
    byID: (id: string) => [`progres:id:${id}`],
    list: () => [`progres:list:`],
  },
  foodSummaryDaily: {
    byChild: (child: string) => [`food:summary:child:${child}`],
  },
  posyandu: {
    list: () => [`posyandu:list`],
  },
  notification: {
    byUser: () => [`notifikasi:user`],
    byId: (id: string) => [`notifikasi:id:${id}`],
  },
  regisProgram: {
    list: () => [`regis:program:list`],
  },
};
