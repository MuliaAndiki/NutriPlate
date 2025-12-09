export const cacheKeys = {
  user: {
    profile: (userId: string) => `user:profile:${userId}`,
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
    byPosyanduList: (posyandu: string) => `posyandu:list:${posyandu}`,
  },
  parent: {
    list: () => `parent:list`,
  },
};
