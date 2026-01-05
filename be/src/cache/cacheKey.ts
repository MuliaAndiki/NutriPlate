export const cacheKeys = {
  user: {
    byID: (id: string) => `user:${id}`,
    list: () => `user:list`,
  },
  kader: {
    list: () => `kader:list`,
    byID: (id: string) => `kader:posyandu:${id}`,
  },
  posyandu: {
    byID: (id: string) => `posyandu:${id}`,
    list: () => `posyandu:list`,
  },
  child: {
    list: () => `child:list`,
    byRole: (role: string) => `child:parent:${role}`,
    byID: (id: string) => `child:id:${id}`,
    byPosyanduList: (posyandu: string) => `child:posyandu:list:${posyandu}`,
  },
  parent: {
    list: () => `parent:list`,
    byID: (id: string) => `parent:${id}`,
  },
  notify: {
    list: () => `notif:list`,
    byID: (id: string) => `notif:${id}`,
    byRole: (role: string) => `notif:role:${role}`,
  },
  program: {
    list: () => `program:list`,
    byID: (id: string) => `program:id:${id}`,
  },
  progres: {
    list: () => `progres:list`,
    byID: (id: string) => `progres:id:${id}`,
    byRole: (role: string) => `progres:role:${role}`,
  },
  history: {
    list: () => `history:list`,
    byID: (id: string) => `history:id:${id}`,
    byRole: (role: string) => `history:role:${role}`,
  },
  task: {
    list: () => `task:list`,
    byRole: (role: string) => `task:role:${role}`,
  },
  who: {
    list: () => `who:list`,
    byGrowt: (id: string) => `who:child:${id}`,
  },
  measurement: {
    list: () => `measurement:list`,
    byChild: (id: string) => `measurement:child:${id}`,
  },
  evalution: {
    list: () => `evalution:list`,
    byChild: (id: string) => `evalution:child:${id}`,
  },
};
