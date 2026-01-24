"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

export default function NavbarClient({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/auth");
    router.refresh();
  }

  return (
    <>
      {/* Desktop logout */}
      <button
        onClick={handleLogout}
        className="hidden md:block rounded-md border border-foreground/20 px-4 py-1.5 text-sm hover:bg-foreground/5 transition"
      >
        Logout
      </button>

      {/* Mobile toggle */}
      <button onClick={() => setOpen((p) => !p)} className="md:hidden text-2xl">
        ☰
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 w-full border-b border-foreground/10 bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`text-sm hover:text-foreground ${
                  pathname === item.href
                    ? "font-medium text-foreground"
                    : "text-foreground/70"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="rounded-md border border-foreground/20 py-2 text-sm hover:bg-foreground/20 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
