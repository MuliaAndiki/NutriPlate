/**
 * Cache Key Naming Convention:
 * Format: <resource>:<scope>:<identifier?>
 *
 * Examples:
 * - user:id:<id>          (single user by id)
 * - user:list             (all users/admins)
 * - child:id:<id>         (single child by id)
 * - child:parent:<id>     (children by parent id)
 * - program:id:<id>       (single program by id)
 * - program:posyandu:<id> (programs by posyandu id)
 * - notification:id:<id>  (single notification by id)
 * - notification:role:<role> (notifications by role)
 */

export const cacheKeys = {
  user: {
    byID: (id: string) => `user:id:${id}`,
    list: () => `user:list`,
  },
  kader: {
    list: () => `kader:list`,
    byID: (id: string) => `kader:id:${id}`,
  },
  posyandu: {
    byID: (id: string) => `posyandu:id:${id}`,
    list: () => `posyandu:list`,
    byUser: (id: string) => `posyandu:user:${id}`,
  },
  child: {
    list: () => `child:list`,
    byID: (id: string) => `child:id:${id}`,
    byParent: (id: string) => `child:parent:${id}`,
    byPosyandu: (id: string) => `child:posyandu:${id}`,
  },
  parent: {
    list: () => `parent:list`,
    byID: (id: string) => `parent:id:${id}`,
  },
  notification: {
    list: () => `notification:list`,
    byID: (id: string) => `notification:id:${id}`,
    byUser: (id: string) => `notification:user:${id}`,
  },
  program: {
    list: () => `program:list`,
    byID: (id: string) => `program:id:${id}`,
    byUser: (id: string) => `program:user:${id}`,
    byPosyandu: (id: string) => `program:posyandu:${id}`,
  },
  progress: {
    list: () => `progress:list`,
    byID: (id: string) => `progress:id:${id}`,
    byChild: (id: string) => `progres:child:${id}`,
    byRole: (role: string) => `progress:role:${role}`,
  },
  history: {
    list: () => `history:list`,
    byID: (id: string) => `history:id:${id}`,
    byRole: (role: string) => `history:role:${role}`,
  },
  task: {
    list: () => `task:list`,
    byID: (id: string) => `task:id:${id}`,
    byRole: (role: string) => `task:role:${role}`,
  },
  who: {
    list: () => `who:list`,
    byChild: (id: string) => `who:child:${id}`,
  },
  measurement: {
    list: () => `measurement:list`,
    byChild: (id: string) => `measurement:child:${id}`,
  },
  evaluation: {
    list: () => `evaluation:list`,
    byChild: (id: string) => `evaluation:child:${id}`,
  },
  models: {
    detect: (image: any) => `ml:detect:${image}`,
  },
  food: {
    byUser: (id: string) => `food:parent:${id}`,
    byId: (id: string) => `food:id:${id}`,
  },
};
