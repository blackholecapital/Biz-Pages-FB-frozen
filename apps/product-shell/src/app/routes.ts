export type RouteKey =
  | "home"
  | "members"
  | "access"
  | "tier-2"
  | "payme"
  | "engage"
  | "referrals"
  | "skins"
  | "admin";

export type AppRoute = {
  key: RouteKey;
  path: string;
  label: string;
};

export const routes: AppRoute[] = [
  { key: "home", path: "/", label: "Home" },
  { key: "members", path: "/members", label: "Members" },
  { key: "access", path: "/access", label: "Access" },
  { key: "payme", path: "/payme", label: "PayMe" },
  { key: "engage", path: "/engage", label: "Engage" },
  { key: "referrals", path: "/referrals", label: "Referrals" },
  { key: "skins", path: "/skins", label: "Skins" },
  { key: "admin", path: "/admin", label: "Admin" }
];
