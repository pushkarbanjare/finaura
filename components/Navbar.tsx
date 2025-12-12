"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (pathname === "/" || pathname === "/auth") return null;

  const active =
    "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1";
  const inactive = "text-gray-700 hover:text-indigo-600 transition nav-link";

  return (
    <>
      <nav
        className="
          sticky top-0 z-50 
          bg-white
          shadow-sm
          flex items-center justify-between
          px-6 py-4
        "
      >
        {/* Branding */}
        <div 
          className="text-3xl font-bold tracking-tight text-indigo-600"
          style={{ fontFamily: "var(--font-outfit)", fontWeight: 600 }}
        >
          Finaura
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className={pathname === "/dashboard" ? active : inactive}
          >
            Dashboard
          </Link>

          <Link
            href="/expense"
            className={pathname === "/expense" ? active : inactive}
          >
            Expense
          </Link>

          <Link
            href="/profile"
            className={pathname === "/profile" ? active : inactive}
          >
            Profile
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.replace("/auth");
            }}
            className="
              bg-indigo-600 text-white px-4 py-2 rounded-full
              font-medium shadow-sm hover:bg-indigo-700 transition
            "
          >
            Logout
          </button>
        </div>

        <button
          onClick={() => setOpenMenu((prev) => !prev)}
          className="md:hidden text-gray-700 text-3xl"
        >
          ☰
        </button>
      </nav>

      {openMenu && (
        <div
          className="
            md:hidden 
            bg-white 
            shadow-md 
            border-b border-gray-200
            flex flex-col 
            px-6 py-4 
            gap-4
            animate-slideDown
          "
        >
          <Link
            href="/dashboard"
            className={pathname === "/dashboard" ? active : inactive}
            onClick={() => setOpenMenu(false)}
          >
            Dashboard
          </Link>

          <Link
            href="/expense"
            className={pathname === "/expense" ? active : inactive}
            onClick={() => setOpenMenu(false)}
          >
            Expense
          </Link>

          <Link
            href="/profile"
            className={pathname === "/profile" ? active : inactive}
            onClick={() => setOpenMenu(false)}
          >
            Profile
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              setOpenMenu(false);
              router.replace("/auth");
            }}
            className="
              bg-indigo-600 text-white py-2 rounded-md
              shadow-sm font-medium
            "
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}
