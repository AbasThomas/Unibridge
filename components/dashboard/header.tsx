"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";
import { getNotifications, markAllNotificationsRead } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export function Header({ userName, userEmail, userAvatar }: HeaderProps) {
  const [notifs, setNotifs] = useState<{ id: string; title: string; message: string; read: boolean; type: string; created_at: string }[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const loadNotifications = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      try {
        const data = await getNotifications(supabase, user.id, 10);
        setNotifs(data as typeof notifs);
      } catch {
        // gracefully ignore if table doesn't exist yet
      }
    };
    void loadNotifications();
  }, [supabase]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    try {
      await markAllNotificationsRead(supabase, user.id);
      setNotifs((n) => n.map((item) => ({ ...item, read: true })));
    } catch {
      // ignore
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-transparent px-6 backdrop-blur-sm">
      {/* Left: search (desktop only) */}
      <div className="hidden items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 text-sm text-neutral-400 focus-within:border-[#0A8F6A]/30 focus-within:bg-white/10 transition-all md:flex w-96">
        <Search className="h-4 w-4 text-neutral-500" />
        <input
          type="text"
          placeholder="Search lectures, resources…"
          className="bg-transparent border-none outline-none w-full placeholder:text-neutral-600 text-white"
        />
      </div>

      {/* Spacer for mobile */}
      <div className="w-10 lg:hidden" />

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-neutral-400 hover:text-white"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0A8F6A] text-[10px] font-bold text-white shadow-lg shadow-[#0A8F6A]/20 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifs(false)}
              />
              <div className="absolute right-0 top-12 z-20 w-80 rounded-xl border border-white/10 bg-[#0A0A0A] shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-[#0A8F6A] hover:text-[#0A8F6A]/80 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifs.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-neutral-500">
                      No notifications yet
                    </p>
                  ) : (
                    notifs.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          "border-b border-white/5 px-4 py-3 last:border-0 hover:bg-white/5 transition-colors",
                          !notif.read && "bg-[#0A8F6A]/5",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                              !notif.read ? "bg-[#0A8F6A]" : "bg-transparent",
                            )}
                          />
                          <div>
                            <p className="text-sm font-medium text-white">{notif.title}</p>
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{notif.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Avatar */}
        <Link href="/dashboard/profile" className="flex items-center gap-3 group">
          <div className="flex text-right flex-col hidden md:block">
            <p className="text-sm font-medium leading-tight text-white group-hover:text-[#0A8F6A] transition-colors">{userName ?? "User"}</p>
            <p className="text-xs text-neutral-500 group-hover:text-neutral-400">{userEmail}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A8F6A]/20 border border-[#0A8F6A]/30 text-sm font-bold text-[#0A8F6A] ring-2 ring-transparent group-hover:ring-[#0A8F6A]/20 transition-all">
            {userAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userAvatar} alt={userName} className="h-full w-full rounded-full object-cover" />
            ) : (
              getInitials(userName ?? userEmail ?? "U")
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
