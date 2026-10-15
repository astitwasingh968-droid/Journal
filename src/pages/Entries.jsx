import { useState } from "react";
import CalendarView from "../components/CalendarView";
import JournalList from "../components/JournalList";
import PageTransition from "../components/PageTransition";

function Entries() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <PageTransition>
      <div className="section-tag">Archive</div>
      <h2 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(20px, 4vw, 24px)",
        fontWeight: 600, color: "var(--text)", marginBottom: "20px",
      }}>
        Your entries
      </h2>

      <div style={{
        display: "flex", gap: "10px",
        marginBottom: "20px", alignItems: "center",
        flexWrap: "wrap",
      }}>
        <input
          type="text"
          placeholder="Search by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: "160px", marginBottom: 0 }}
        />
        <button
          onClick={() => setShowCalendar(prev => !prev)}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: showCalendar ? "1px solid var(--purple-border)" : "1px solid var(--border2)",
            background: showCalendar ? "var(--purple-muted)" : "transparent",
            color: showCalendar ? "var(--purple)" : "var(--text3)",
            fontSize: "13px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          📅 {showCalendar ? "Hide" : "Calendar"}
        </button>
      </div>

      {showCalendar && (
        <div className="card" style={{ marginBottom: "16px", animation: "fadeUp 0.25s ease forwards" }}>
          <div className="section-tag" style={{ marginBottom: "10px" }}>Pick a date</div>
          <CalendarView onDateChange={(date) => {
            setSelectedDate(date);
            setShowCalendar(false);
          }} />
        </div>
      )}

      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "14px", flexWrap: "wrap", gap: "8px",
      }}>
        <p style={{ fontSize: "12px", color: "var(--text3)", fontWeight: 500 }}>
          Showing entries for{" "}
          <span style={{ color: "var(--purple)", fontWeight: 600 }}>
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long", month: "long", day: "numeric", year: "numeric",
            })}
          </span>
        </p>
        <button
          onClick={() => setSelectedDate(new Date())}
          style={{
            fontSize: "11px", padding: "4px 12px",
            borderRadius: "99px", border: "1px solid var(--border2)",
            background: "transparent", color: "var(--text3)",
          }}
        >
          Back to today
        </button>
      </div>

      <div className="card">
        <JournalList selectedDate={selectedDate} searchTerm={searchTerm} />
      </div>
    </PageTransition>
  );
}

export default Entries;