"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useSidebarStore } from "@/store/sidebar-store";
import { useAuthStore } from "@/store/auth-store";

const NAV_ITEMS = [
  { href: "/map", label: "Map", icon: MapIcon },
  { href: "/events", label: "Events", icon: ListIcon },
  { href: "/analytics", label: "Analytics", icon: ChartIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isSettingsActive =
    pathname === "/settings" || pathname.startsWith("/settings/");
  const isFavoritesActive = pathname === "/favorites";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfile(false);
      }
    }
    if (showProfile) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showProfile]);

  return (
    <>
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-[999] md:hidden"
          onClick={toggle}
        />
      )}

      <aside
        className={`shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-full z-[1000] transition-all duration-200 ${
          collapsed ? "w-[56px]" : "w-[220px]"
        } ${collapsed ? "" : "max-md:fixed max-md:left-0 max-md:top-0 max-md:bottom-0 max-md:shadow-2xl"}`}
      >
        {/* Top: logo + collapse */}
        <div
          className={`shrink-0 border-b border-sidebar-border flex items-center ${collapsed ? "justify-center p-2" : "justify-between p-3"}`}
        >
          {!collapsed && (
            <Link href="/" className="flex items-center pl-1 min-w-0">
              <Image
                src={
                  theme === "dark"
                    ? "/logos/light-logo.png"
                    : "/logos/dark-logo.png"
                }
                alt="Orbis"
                width={100}
                height={28}
                className="h-12 md:h-16 w-auto"
              />
            </Link>
          )}
          <button
            onClick={toggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            {collapsed ? <MenuIcon /> : <CollapseIcon />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-1.5 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                  collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon active={isActive} />
                {!collapsed && item.label}
              </Link>
            );
          })}

          {/* Favorites — only when logged in */}
          {user && (
            <Link
              href="/favorites"
              title={collapsed ? "Favorites" : undefined}
              className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
              } ${
                isFavoritesActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <HeartIcon active={isFavoritesActive} />
              {!collapsed && "Favorites"}
            </Link>
          )}
        </nav>

        {/* Bottom */}
        <div className="shrink-0 border-t border-sidebar-border p-1.5 space-y-0.5">
          <Link
            href="/settings"
            title={collapsed ? "Settings" : undefined}
            className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
              collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
            } ${
              isSettingsActive
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <SettingsIcon active={isSettingsActive} />
            {!collapsed && "Settings"}
          </Link>

          <button
            onClick={toggleTheme}
            title={
              collapsed
                ? theme === "dark"
                  ? "Light mode"
                  : "Dark mode"
                : undefined
            }
            className={`flex items-center gap-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors w-full ${
              collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
            }`}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            {!collapsed && (theme === "dark" ? "Light Mode" : "Dark Mode")}
          </button>

          {/* Login / Profile */}
          <div className="relative" ref={profileRef}>
            {user ? (
              <>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  title={
                    collapsed ? (user.displayName ?? "Profile") : undefined
                  }
                  className={`flex items-center gap-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors w-full ${
                    collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
                  }`}
                >
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt=""
                      width={22}
                      height={22}
                      className="rounded-full shrink-0"
                    />
                  ) : (
                    <div className="w-[22px] h-[22px] rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-primary-foreground text-[10px] font-bold">
                        {(user.displayName ??
                          user.email ??
                          "U")[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  {!collapsed && (
                    <span className="truncate">
                      {user.displayName ?? user.email}
                    </span>
                  )}
                </button>

                {showProfile && (
                  <div
                    className={`absolute bottom-full mb-1 ${collapsed ? "left-0" : "left-1.5 right-1.5"} bg-card border border-border rounded-xl shadow-lg p-3 z-50 min-w-[180px]`}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt=""
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-primary-foreground text-sm font-bold">
                            {(user.displayName ?? "U")[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setShowProfile(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-muted rounded-lg transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                title={collapsed ? "Sign in" : undefined}
                className={`flex items-center gap-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors ${
                  collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
                }`}
              >
                <UserIcon />
                {!collapsed && "Sign in"}
              </Link>
            )}
          </div>

          {!collapsed && (
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </svg>
  );
}

function MapIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? "text-sidebar-primary" : ""}
    >
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? "text-sidebar-primary" : ""}
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? "text-sidebar-primary" : ""}
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? "text-sidebar-primary" : ""}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? "text-sidebar-primary" : ""}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
