export type RouteDetailChildType = {
  icon: string;
  title: string;
  icon2: string;
  href: (role: string) => string;
  href2: (pathname: string) => string;
  slice: string;
};
