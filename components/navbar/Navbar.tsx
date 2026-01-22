import Link from "next/link";
import { cookies } from "next/headers";
import NavbarClient from "./NavbarClient";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Expense", href: "/expense" },
  { label: "Profile", href: "/profile" },
];

export default async function Navbar() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-foreground/10 bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Branding */}
        <Link href="/dashboard" className="font-heading text-2xl font-semibold">
          Finaura
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-foreground/70 hover:text-foreground transition"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <NavbarClient navItems={NAV_ITEMS} />
      </div>
    </nav>
  );
}
