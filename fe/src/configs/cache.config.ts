export const cacheKey = {
  child: {
    byToken: (token: string) => [`child:token:${token}`],
    byID: (id: string) => [`child:${id}`],
    byAll: (role: any, posyanduId: any) => ["child", role, posyanduId],
    byParent: (id: string) => [`child:parent:${id}`],
    byPosyandu: (id: string) => [`child:posyandu:${id}`],
  },

  evaluate: {
    byChild: (id: string) => [`evaluate:child:${id}`],
  },
  evaluation: {
    list: () => ["evaluation:list"],
    byID: (id: string) => [`evaluation:id:${id}`],
    byChild: (id: string) => [`evaluation:child:${id}`],
  },

  profile: {
    user: () => ["user:profile"],
    parent: () => ["user:parent"],
    parentById: (id: string) => [`user:parent:${id}`],
    kaderById: (id: string) => [`user:kader:${id}`],
  },
  user: {
    list: () => ["user:list"],
    byID: (id: string) => [`user:id:${id}`],
    byProfileId: (id: string) => [`user:profile:${id}`],
  },
  parent: {
    list: () => ["parent:list"],
    byID: (id: string) => [`parent:id:${id}`],
    byPosyandu: (id: string) => [`parent:posyandu:${id}`],
  },
  kader: {
    list: () => ["kader:list"],
    byID: (id: string) => [`kader:id:${id}`],
  },
  measurement: {
    list: () => ["measurement:list"],
    byID: (id: string) => [`measurement:id:${id}`],
    byChild: (id: string) => [`measurement:child:${id}`],
    byPosyandu: (id: string) => [`measurement:child:posyandu:${id}`],
  },
  program: {
    list: () => [`programs:list`],
    byID: (id: string) => [`programs:id:${id}`],
    byUser: (id: string) => [`programs:user:${id}`],
    byPosyandu: (id: string) => [`programs:posyandu:${id}`],
  },
  progres: {
    list: () => ["progres:list"],
    byID: (id: string) => [`progres:id:${id}`],
    byChildList: (id: string) => [`progres:list:child:${id}`],
    byChild: (id: string) => [`progres:child:${id}`],
    byRole: (role: string) => [`progres:role:${role}`],
  },
  history: {
    list: () => ["history:list"],
    byID: (id: string) => [`history:id:${id}`],
    byRole: (role: string) => [`history:role:${role}`],
  },
  foodSummaryDaily: {
    byChild: (child: string) => [`food:summary:child:${child}`],
    byRange: (child: string, params: any) => [
      `food:summary:child:range:${child}/${params}`,
    ],
  },
  food: {
    byUser: (id: string) => [`food:user:${id}`],
    byID: (id: string) => [`food:id:${id}`],
    history: (
      userId: string,
      childId: string,
      page?: number,
      limit?: number,
      startDate?: string,
      endDate?: string,
      search?: string,
    ) => [
      `food:history:${userId}:${childId}${page ? `:${page}` : ""}${limit ? `:${limit}` : ""}${startDate ? `:${startDate}` : ""}${endDate ? `:${endDate}` : ""}${search ? `:${search}` : ""}`,
    ],
    historyByChild: (
      childId: string,
      page?: number,
      limit?: number,
      startDate?: string,
      endDate?: string,
    ) => [
      `food:history:child:${childId}${page ? `:${page}` : ""}${limit ? `:${limit}` : ""}${startDate ? `:${startDate}` : ""}${endDate ? `:${endDate}` : ""}`,
    ],
  },
  foodIntake: {
    list: () => [`food:list`],
    byId: (id: string) => [`food:byid:${id}`],
    clases: () => [`food:clases`],
  },
  posyandu: {
    list: () => [`posyandu:list`],
    children: (posyanduId: string) => [`posyandu:children;${posyanduId}`],
    byId: (id: string) => [`posyandu:byid:${id}`],
    kaderList: () => ["posyandu:kader:list"],
    byUser: (id: string) => [`posyandu:user:${id}`],
  },
  notification: {
    list: () => ["notifikasi:list"],
    byUser: (token: string) => [`notifikasi:user:${token}`],
    byId: (id: string) => [`notifikasi:id:${id}`],
  },
  regisProgram: {
    list: () => [`regis:program:list`],
  },
  programregistration: {
    byID: (id: string) => [`programregistration:id:${id}`],
    byParent: (id: string) => [`programregistration:parent:${id}`],
    byPosyandu: (id: string, status?: string | null) => [
      `programregistration:posyandu:${id}${status ? `:${status}` : ""}`,
    ],
    pending: (posyanduId: string) => [
      `programregistration:pending:${posyanduId}`,
    ],
    accepted: (posyanduId: string) => [
      `programregistration:accepted:${posyanduId}`,
    ],
  },
  task: {
    list: () => ["task:list"],
    byID: (id: string) => [`task:id:${id}`],
    byProgresId: (id: string) => [`task:progres:${id}`],
    byRole: (role: string) => [`task:role:${role}`],
    notBroadcast: () => [`task:notBroadcast`],
  },
  registrion: {
    myRegister: () => [`registrion:myRegister`],
    pending: () => [`registrion:pending`],
    accepted: () => [`registrion:accepted`],
    reject: () => [`registrion:reject`],
  },
  kaderregistration: {
    byID: (id: string) => [`kaderregistration:id:${id}`],
    byKader: (id: string) => [`kaderregistration:kader:${id}`],
    byPosyandu: (id: string) => [`kaderregistration:posyandu:${id}`],
    pending: (posyanduId: string) => [
      `kaderregistration:pending:${posyanduId}`,
    ],
    accepted: (posyanduId: string) => [
      `kaderregistration:accepted:${posyanduId}`,
    ],
    reject: (posyanduId: string) => [`kaderregistration:reject:${posyanduId}`],
  },
  who: {
    list: () => ["who:list"],
    byChild: (id: string) => [`who:child:${id}`],
  },
  models: {
    detect: (image: any) => [`ml:detect:${image}`],
    list: () => ["ml:list"],
  },
  services: {
    fastApi: () => ["service:fastapi"],
    health: () => ["service:health"],
    statusIot: () => ["service:status:iot"],
  },

  iot: {
    list: () => ["iot:list"],
    device: (token: string) => [`iot:device:${token}`],
  },
  session: {
    active: () => ["session:active"],
    list: () => ["session:list"],
  },
};
