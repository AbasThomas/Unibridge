"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar01Icon,
  Cancel01Icon,
  Location01Icon,
  PlusSignIcon,
  Search01Icon,
  UserGroupIcon,
  Wifi01Icon,
  ArrowUpRight01Icon,
  FilterIcon,
} from "hugeicons-react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { addUserPoints, createStudentEvent, getStudentEvents } from "@/lib/supabase/queries";
import { cn, formatDateTime, timeAgo } from "@/lib/utils";

type StudentEvent = {
  id: string;
  title: string;
  details: string;
  location: string;
  event_date: string;
  rsvp_url?: string;
  created_by?: string;
  created_by_name?: string;
  university?: string;
  is_virtual: boolean;
  created_at: string;
};

type EventForm = {
  title: string;
  location: string;
  event_date: string;
  details: string;
  rsvp_url: string;
  is_virtual: boolean;
};

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<StudentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mineOnly, setMineOnly] = useState(false);
  const [includePast, setIncludePast] = useState(false);

  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [submittingEvent, setSubmittingEvent] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    name: "",
    university: "",
  });

  const [eventForm, setEventForm] = useState<EventForm>({
    title: "",
    location: "",
    event_date: "",
    details: "",
    rsvp_url: "",
    is_virtual: false,
  });

  const supabase = useMemo(() => createClient(), []);

  const loadIdentity = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUserId(null);
      return;
    }

    setUserId(user.id);

    try {
      const { data } = await supabase
        .from("profiles")
        .select("name, university")
        .eq("id", user.id)
        .single();

      setProfile({
        name: data?.name ?? user.email?.split("@")[0] ?? "Student",
        university: data?.university ?? "",
      });
    } catch {
      setProfile({
        name: user.email?.split("@")[0] ?? "Student",
        university: "",
      });
    }
  }, [supabase]);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getStudentEvents(
        supabase,
        {
          search: search || undefined,
          createdBy: mineOnly && userId ? userId : undefined,
          includePast,
        },
        80,
      );
      setEvents(data as StudentEvent[]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load student events.");
    } finally {
      setLoading(false);
    }
  }, [includePast, mineOnly, search, supabase, userId]);

  useEffect(() => {
    void loadIdentity();
  }, [loadIdentity]);

  useEffect(() => {
    const timer = setTimeout(() => void loadEvents(), 250);
    return () => clearTimeout(timer);
  }, [loadEvents]);

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setShowCreatePanel(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const channel = supabase
      .channel("student-events-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "student_events" }, () => {
        void loadEvents();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadEvents, supabase]);

  const handleSubmitEvent = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId) {
      toast.error("Please sign in to post an event.");
      return;
    }

    if (!eventForm.title || !eventForm.location || !eventForm.event_date || !eventForm.details) {
      toast.error("Please complete all required fields.");
      return;
    }

    try {
      setSubmittingEvent(true);
      await createStudentEvent(supabase, {
        title: eventForm.title.trim(),
        location: eventForm.location.trim(),
        event_date: new Date(eventForm.event_date).toISOString(),
        details: eventForm.details.trim(),
        rsvp_url: eventForm.rsvp_url.trim() || undefined,
        created_by: userId,
        created_by_name: profile.name,
        university: profile.university || "",
        is_virtual: eventForm.is_virtual,
      });

      try {
        await addUserPoints(supabase, userId, 20);
      } catch {
        // Posting still succeeds even if points update fails.
      }

      toast.success("Event published successfully.");
      setShowCreatePanel(false);
      setEventForm({
        title: "",
        location: "",
        event_date: "",
        details: "",
        rsvp_url: "",
        is_virtual: false,
      });
      await loadEvents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish event.");
    } finally {
      setSubmittingEvent(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Student Events</h1>
          <p className="mt-1 text-sm text-neutral-400 font-light">
            Discover and publish campus events with date, location, and RSVP details.
          </p>
        </div>
        <button
          onClick={() => setShowCreatePanel(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0A8F6A] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <PlusSignIcon size={16} /> Post Event
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 focus-within:border-[#0A8F6A]/50 transition-colors">
          <Search01Icon size={16} className="text-neutral-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search events"
            className="w-52 bg-transparent text-sm outline-none text-neutral-200 placeholder:text-neutral-500"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <Cancel01Icon size={14} className="text-neutral-500 hover:text-white" />
            </button>
          )}
        </div>

        <button
          onClick={() => setMineOnly((prev) => !prev)}
          className={cn(
            "rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all",
            mineOnly
              ? "border-[#0A8F6A] bg-[#0A8F6A]/20 text-white"
              : "border-white/10 bg-black/20 text-neutral-500 hover:text-white",
          )}
        >
          My Events
        </button>

        <button
          onClick={() => setIncludePast((prev) => !prev)}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all",
            includePast
              ? "border-[#0A8F6A] bg-[#0A8F6A]/20 text-white"
              : "border-white/10 bg-black/20 text-neutral-500 hover:text-white",
          )}
        >
          <FilterIcon size={14} /> Show Past
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-56 rounded-2xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed py-16 text-center">
          <Calendar01Icon size={40} className="mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">No events found</p>
          <p className="mt-1 text-xs text-muted-foreground">Post an event to populate the student board.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((item) => (
            <div
              key={item.id}
              className="glass-panel flex flex-col rounded-2xl p-6 shadow-2xl group hover:border-[#0A8F6A]/30 transition-all duration-500"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0A8F6A]/10 border border-[#0A8F6A]/20 text-[#0A8F6A]">
                  <Calendar01Icon size={24} />
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.is_virtual && (
                    <span className="rounded-full bg-[#0A8F6A]/10 border border-[#0A8F6A]/20 px-3 py-1 text-[10px] font-bold text-[#0A8F6A] tracking-widest uppercase">
                      Virtual
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex-1">
                <p className="text-lg font-medium leading-tight text-white group-hover:text-[#0A8F6A] transition-colors duration-300">{item.title}</p>
                <p className="mt-3 text-xs text-neutral-500 font-light leading-relaxed line-clamp-3">{item.details}</p>
              </div>

              <div className="mt-6 space-y-2 border-t border-white/5 pt-5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                <div className="flex items-center gap-2">
                  <Calendar01Icon size={14} className="text-[#0A8F6A]" />
                  {formatDateTime(item.event_date)}
                </div>
                <div className="flex items-center gap-2">
                  <Location01Icon size={14} className="text-[#0A8F6A]" />
                  {item.location}
                </div>
                <div className="flex items-center gap-2">
                  <UserGroupIcon size={14} className="text-[#0A8F6A]" />
                  {item.created_by_name || "Student"} {item.university ? `- ${item.university}` : ""}
                </div>
              </div>

              <p className="mt-4 text-[10px] uppercase tracking-widest text-neutral-600">
                Posted {timeAgo(item.created_at)}
              </p>

              <div className="mt-5 flex gap-2">
                {item.rsvp_url ? (
                  <a
                    href={item.rsvp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0A8F6A] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    RSVP <ArrowUpRight01Icon size={15} />
                  </a>
                ) : (
                  <div className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    RSVP Link Not Set
                  </div>
                )}
                {item.is_virtual && (
                  <span className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 text-neutral-400">
                    <Wifi01Icon size={15} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreatePanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-black/80 p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-medium tracking-tight text-white">Post Student Event</h2>
              <button onClick={() => setShowCreatePanel(false)} className="rounded-full p-2 bg-white/5 border border-white/5 text-neutral-500 hover:text-white transition-all">
                <Cancel01Icon size={16} />
              </button>
            </div>
            <p className="mb-8 text-xs text-neutral-400 font-light leading-relaxed">
              Share what is happening on campus so students can discover and join quickly.
            </p>

            <form onSubmit={(event) => void handleSubmitEvent(event)} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Title *</label>
                  <input
                    value={eventForm.title}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, title: event.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-neutral-200 outline-none focus:border-[#0A8F6A]/50"
                    placeholder="Event title"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Location *</label>
                  <input
                    value={eventForm.location}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, location: event.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-neutral-200 outline-none focus:border-[#0A8F6A]/50"
                    placeholder="Campus hall, online room, etc"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Event Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={eventForm.event_date}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, event_date: event.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-neutral-200 outline-none focus:border-[#0A8F6A]/50"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">RSVP URL</label>
                  <input
                    type="url"
                    value={eventForm.rsvp_url}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, rsvp_url: event.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-neutral-200 outline-none focus:border-[#0A8F6A]/50"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Event Details *</label>
                <textarea
                  rows={4}
                  value={eventForm.details}
                  onChange={(event) => setEventForm((prev) => ({ ...prev, details: event.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-neutral-200 outline-none focus:border-[#0A8F6A]/50"
                  placeholder="Share details students should know before attending."
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={eventForm.is_virtual}
                  onChange={(event) => setEventForm((prev) => ({ ...prev, is_virtual: event.target.checked }))}
                />
                This is a virtual/online event
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreatePanel(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEvent}
                  className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-[#0A8F6A] py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60"
                >
                  {submittingEvent && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submittingEvent ? "Publishing..." : "Publish Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
