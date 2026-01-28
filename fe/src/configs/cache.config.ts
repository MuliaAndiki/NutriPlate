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
    byChildList: (id: string) => [`progres:list:child:${id}`],
  },
  foodSummaryDaily: {
    byChild: (child: string) => [`food:summary:child:${child}`],
    byRange: (child: string, params: any) => [
      `food:summary:child:range:${child}/${params}`,
    ],
  },
  foodIntake: {
    list: () => [`food:list`],
    byId: (id: string) => [`food:byid:${id}`],
  },
  posyandu: {
    list: () => [`posyandu:list`],
    children: (posyanduId: string) => [`posyandu:children;${posyanduId}`],
  },
  notification: {
    byUser: (token: string) => [`notifikasi:user:${token}`],
    byId: (id: string) => [`notifikasi:id:${id}`],
  },
  regisProgram: {
    list: () => [`regis:program:list`],
  },
  task: {
    byProgresId: (id: string) => [`task:progres:${id}`],
  },
  // not fix
  iot: {
    byItem: () => [`iot:item`],
    weight: () => [`iot:weight`],
  },
};
