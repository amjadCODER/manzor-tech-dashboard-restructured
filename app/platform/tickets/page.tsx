"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, insert, select, update } from "@/lib/supabase-rest";

type StaffProfile = {
  role: "customer" | "employee" | "admin";
  status: "active" | "disabled";
};

type Ticket = {
  id: string;
  ticket_number: number;
  customer_id: string;
  subject: string;
  body: string;
  status: string;
  created_at: string;
  profiles?: { full_name: string; email: string };
};

type TicketMessage = {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  is_staff: boolean;
  created_at: string;
};

const statusLabels: Record<string, string> = {
  open: "مفتوحة",
  in_progress: "قيد المعالجة",
  waiting_customer: "بانتظار العميل",
  resolved: "تم الحل",
  closed: "مغلقة",
};

const ticketStatuses = [
  ["open", "مفتوحة"],
  ["in_progress", "قيد المعالجة"],
  ["waiting_customer", "بانتظار العميل"],
  ["resolved", "تم الحل"],
  ["closed", "مغلقة"],
] as const;

function formatTicketNumber(ticketNumber: number) {
  return `MT-${String(ticketNumber || 0).padStart(6, "0")}`;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function loadTickets() {
    setError("");
    const session = getSession();

    if (!session) {
      router.replace("/login");
      return;
    }

    const profiles = await select<StaffProfile[]>(
      "profiles",
      `select=role,status&id=eq.${session.user.id}`,
    );
    const profile = profiles[0];

    if (!profile || profile.status !== "active") {
      router.replace("/login");
      return;
    }

    if (profile.role === "customer") {
      router.replace("/profile");
      return;
    }

    const [ticketRows, messageRows] = await Promise.all([
      select<Ticket[]>("tickets", "select=*,profiles(full_name,email)&order=created_at.desc"),
      select<TicketMessage[]>("ticket_messages", "select=*&order=created_at.asc"),
    ]);

    setTickets(ticketRows);
    setMessages(messageRows);
    setActiveTicketId((currentId) => currentId ?? ticketRows[0]?.id ?? null);
  }

  useEffect(() => {
    loadTickets().catch((exception) => {
      setError(getErrorMessage(exception, "تعذر تحميل التذاكر"));
    });
  }, [router]);

  const activeTicket = tickets.find((ticket) => ticket.id === activeTicketId) ?? null;
  const activeThread = useMemo(
    () => messages.filter((message) => message.ticket_id === activeTicketId),
    [messages, activeTicketId],
  );

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeTicket || !reply.trim()) return;

    setBusy(true);
    setError("");

    try {
      const session = getSession();
      if (!session) throw new Error("انتهت جلسة الدخول");

      await insert("ticket_messages", {
        ticket_id: activeTicket.id,
        sender_id: session.user.id,
        message: reply.trim(),
      });
      await update("tickets", `id=eq.${activeTicket.id}`, { status: "waiting_customer" });

      setReply("");
      await loadTickets();
    } catch (exception) {
      setError(getErrorMessage(exception, "تعذر ارسال الرد"));
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(status: string) {
    if (!activeTicket) return;

    setBusy(true);
    setError("");

    try {
      await update("tickets", `id=eq.${activeTicket.id}`, { status });
      await loadTickets();
    } catch (exception) {
      setError(getErrorMessage(exception, "تعذر تحديث الحالة"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="app-shell">
      <div className="topbar">
        <Link href="/platform">العودة للمنصة</Link>
        <strong>تذاكر العملاء — Customer Tickets</strong>
      </div>

      <section className="panel ticket-admin-layout">
        <aside className="ticket-sidebar">
          <h1>التذاكر</h1>
          {error && <div className="message error">{error}</div>}

          <div className="ticket-list">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                className={`ticket ticket-select ${activeTicketId === ticket.id ? "active" : ""}`}
                onClick={() => setActiveTicketId(ticket.id)}
              >
                <span className="ticket-code">{formatTicketNumber(ticket.ticket_number)}</span>
                <strong>{ticket.subject}</strong>
                <small>
                  {ticket.profiles?.full_name || "عميل"} · {statusLabels[ticket.status] ?? ticket.status}
                </small>
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
                  <p>
                    {activeTicket.profiles?.full_name} — {activeTicket.profiles?.email}
                  </p>
                </div>

                <label className="status-control">
                  الحالة
                  <select
                    value={activeTicket.status}
                    disabled={busy}
                    onChange={(event) => changeStatus(event.target.value)}
                  >
                    {ticketStatuses.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="conversation">
                <article className="bubble customer">
                  <small>رسالة العميل</small>
                  <p>{activeTicket.body}</p>
                </article>

                {activeThread.map((message) => (
                  <article
                    key={message.id}
                    className={`bubble ${message.is_staff ? "staff" : "customer"}`}
                  >
                    <small>{message.is_staff ? "رد الدعم" : "رد العميل"}</small>
                    <p>{message.message}</p>
                    <time>{new Date(message.created_at).toLocaleString("ar-SA")}</time>
                  </article>
                ))}
              </div>

              <form className="reply-form" onSubmit={sendReply}>
                <label className="field">
                  الرد على العميل
                  <textarea
                    required
                    rows={4}
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder="اكتب الرد هنا"
                  />
                </label>
                <button className="action primary" disabled={busy}>
                  {busy ? "جاري الارسال" : "ارسال الرد"}
                </button>
              </form>
            </>
          ) : (
            <div className="empty-state">اختر تذكرة لعرض تفاصيلها والرد عليها</div>
          )}
        </div>
      </section>
    </main>
  );
}
