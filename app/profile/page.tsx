"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, insert, select, signOut } from "@/lib/supabase-rest";

type CustomerProfile = {
  id: string;
  full_name: string;
  email: string;
  role: "customer" | "employee" | "admin";
  status: "active" | "disabled";
};

type Ticket = {
  id: string;
  ticket_number: number;
  subject: string;
  body: string;
  status: string;
  created_at: string;
};

type TicketMessage = {
  id: string;
  ticket_id: string;
  message: string;
  is_staff: boolean;
  created_at: string;
};

const statusLabels: Record<string, string> = {
  open: "مفتوحة",
  in_progress: "قيد المعالجة",
  waiting_customer: "بانتظار ردك",
  resolved: "تم الحل",
  closed: "مغلقة",
};

function formatTicketNumber(ticketNumber: number) {
  return `MT-${String(ticketNumber || 0).padStart(6, "0")}`;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function loadProfile() {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }

    const profiles = await select<CustomerProfile[]>(
      "profiles",
      `select=*&id=eq.${session.user.id}`,
    );
    const currentProfile = profiles[0];

    if (!currentProfile || currentProfile.status !== "active") {
      router.replace("/login");
      return;
    }

    if (currentProfile.role !== "customer") {
      router.replace("/platform");
      return;
    }

    setProfile(currentProfile);

    const [ticketRows, messageRows] = await Promise.all([
      select<Ticket[]>(
        "tickets",
        `select=*&customer_id=eq.${session.user.id}&order=created_at.desc`,
      ),
      select<TicketMessage[]>("ticket_messages", "select=*&order=created_at.asc"),
    ]);

    setTickets(ticketRows);
    setMessages(messageRows);
    setActiveTicketId((currentId) => currentId ?? ticketRows[0]?.id ?? null);
  }

  useEffect(() => {
    loadProfile().catch(() => router.replace("/login"));
  }, [router]);

  const activeTicket = tickets.find((ticket) => ticket.id === activeTicketId) ?? null;
  const activeThread = useMemo(
    () => messages.filter((message) => message.ticket_id === activeTicketId),
    [messages, activeTicketId],
  );

  async function createTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const created = await insert<Ticket[]>("tickets", {
        customer_id: session.user.id,
        subject: subject.trim(),
        body: body.trim(),
      });

      setSubject("");
      setBody("");
      if (created[0]) setActiveTicketId(created[0].id);
      await loadProfile();
    } catch (exception) {
      setError(getErrorMessage(exception, "تعذر ارسال التذكرة"));
    } finally {
      setBusy(false);
    }
  }

  async function replyToTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeTicketId || !reply.trim()) return;

    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }

    setBusy(true);
    setError("");

    try {
      await insert("ticket_messages", {
        ticket_id: activeTicketId,
        sender_id: session.user.id,
        message: reply.trim(),
      });
      setReply("");
      await loadProfile();
    } catch (exception) {
      setError(getErrorMessage(exception, "تعذر ارسال الرد"));
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    signOut();
    router.replace("/");
  }

  if (!profile) {
    return <div className="loading">جاري تحميل الحساب</div>;
  }

  return (
    <main className="app-shell">
      <div className="topbar">
        <Link href="/">الموقع</Link>
        <button className="action secondary" type="button" onClick={logout}>
          تسجيل الخروج
        </button>
      </div>

      <section className="panel">
        <h1>ملفي الشخصي</h1>
        <div className="profile-grid">
          <div className="profile-item">
            <small>الاسم</small>
            <strong>{profile.full_name}</strong>
          </div>
          <div className="profile-item">
            <small>البريد</small>
            <strong>{profile.email}</strong>
          </div>
          <div className="profile-item">
            <small>نوع الحساب</small>
            <strong>عميل</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>فتح تذكرة جديدة</h2>
        {error && <div className="message error">{error}</div>}

        <form onSubmit={createTicket}>
          <label className="field">
            عنوان التذكرة
            <input
              required
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
          </label>
          <label className="field">
            التفاصيل
            <textarea
              required
              rows={4}
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
          </label>
          <button className="action primary" disabled={busy}>
            {busy ? "جاري الارسال" : "ارسال التذكرة"}
          </button>
        </form>
      </section>

      <section className="panel ticket-customer-layout">
        <aside>
          <h2>تذاكري</h2>
          <div className="ticket-list">
            {tickets.map((ticket) => (
              <button
                className={`ticket ticket-select ${activeTicketId === ticket.id ? "active" : ""}`}
                key={ticket.id}
                type="button"
                onClick={() => setActiveTicketId(ticket.id)}
              >
                <span className="ticket-code">{formatTicketNumber(ticket.ticket_number)}</span>
                <strong>{ticket.subject}</strong>
                <small>{statusLabels[ticket.status] ?? ticket.status}</small>
              </button>
            ))}
            {!tickets.length && <p>لا توجد تذاكر حاليا</p>}
          </div>
        </aside>

        <div className="ticket-detail">
          {activeTicket ? (
            <>
              <div className="ticket-detail-head">
                <div>
                  <span className="ticket-code">
                    {formatTicketNumber(activeTicket.ticket_number)}
                  </span>
                  <h2>{activeTicket.subject}</h2>
                  <small>{statusLabels[activeTicket.status] ?? activeTicket.status}</small>
                </div>
              </div>

              <div className="conversation">
                <article className="bubble customer">
                  <small>رسالتك</small>
                  <p>{activeTicket.body}</p>
                </article>

                {activeThread.map((message) => (
                  <article
                    key={message.id}
                    className={`bubble ${message.is_staff ? "staff" : "customer"}`}
                  >
                    <small>{message.is_staff ? "رد الدعم" : "ردك"}</small>
                    <p>{message.message}</p>
                    <time>{new Date(message.created_at).toLocaleString("ar-SA")}</time>
                  </article>
                ))}
              </div>

              {activeTicket.status !== "closed" && (
                <form className="reply-form" onSubmit={replyToTicket}>
                  <label className="field">
                    اضافة رد
                    <textarea
                      required
                      rows={3}
                      value={reply}
                      onChange={(event) => setReply(event.target.value)}
                    />
                  </label>
                  <button className="action primary" disabled={busy}>
                    ارسال الرد
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="empty-state">اختر تذكرة لعرض الردود</div>
          )}
        </div>
      </section>
    </main>
  );
}
