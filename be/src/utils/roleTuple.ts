export const Tuple_Roles = ["PARENT", "KADER", "POSYANDU"] as const;
export type Roles = (typeof Tuple_Roles)[number];
