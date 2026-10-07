export type NavItem = { label: string; href: string };

// The first item is the logo cell on desktop and the "Home" row in the mobile menu.
export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Security", href: "/security" },
  { label: "Fees", href: "/fees" },
  { label: "Help", href: "/help" },
];

export const navCta: NavItem = { label: "Get the app", href: "/get-the-app" };

export function isCurrent(pathname: string, href: string) {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return href === "/"
    ? path === "/"
    : path === href || path.startsWith(`${href}/`);
}
