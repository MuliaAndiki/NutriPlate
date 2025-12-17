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
    byParent: (parentID: string) => `child:parent:${parentID}`,
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
};
