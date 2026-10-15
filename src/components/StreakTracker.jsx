import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import getSessionId from "../utils/getSessionId";

function StreakTracker() {
  const [entryDates, setEntryDates] = useState(new Set());
  const [streak, setStreak] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [activeDays, setActiveDays] = useState(0);

  useEffect(() => {
    const sessionId = getSessionId();
    const journalRef = ref(db, `users/${sessionId}/entries`);

    onValue(journalRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setEntryDates(new Set());
        setStreak(0);
        setTotalEntries(0);
        setActiveDays(0);
        return;
      }

      const allEntries = Object.values(data);
      const dateStrings = new Set(
        allEntries.map((item) => new Date(item.date).toDateString())
      );

      setEntryDates(dateStrings);
      setTotalEntries(allEntries.length);
      setActiveDays(dateStrings.size);

      let currentStreak = 0;
      let currentDate = new Date();

      while (true) {
        if (dateStrings.has(currentDate.toDateString())) {
          currentStreak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      setStreak(currentStreak);
    });
  }, []);

  const buildGrid = () => {
    const days = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push(d);
    }
    return days;
  };

  const getColor = (date) => {
    if (entryDates.has(date.toDateString())) return "var(--purple)";
    return "var(--bg3)";
  };

  const days = buildGrid();
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const getMonthLabels = () => {
    const labels = [];
    weeks.forEach((week, wi) => {
      const firstDay = week[0];
      if (firstDay.getDate() <= 7) {
        labels.push({ label: months[firstDay.getMonth()], weekIndex: wi });
      }
    });
    return labels;
  };

  const monthLabels = getMonthLabels();
  const CELL = 10;
  const GAP = 3;
  const WEEK_W = CELL + GAP;

  return (
    <div>
      <div style={{ display: "flex", gap: "20px", marginBottom: "16px", flexWrap: "wrap" }}>
        {[
          [streak, "current streak"],
          [activeDays, "active days"],
          [totalEntries, "total entries"],
        ].map(([num, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "22px", fontWeight: 700,
              color: "var(--purple)", fontFamily: "var(--font-serif)",
            }}>{num}</div>
            <div style={{
              fontSize: "10px", color: "var(--text3)",
              marginTop: "2px", fontWeight: 500,
            }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ overflowX: "auto", overflowY: "hidden", paddingBottom: "8px" }}>
        <div style={{ display: "inline-block", minWidth: "max-content" }}>

          <div style={{
            display: "flex", marginBottom: "4px",
            marginLeft: "24px", position: "relative", height: "14px",
          }}>
            {monthLabels.map(({ label, weekIndex }) => (
              <div
                key={label + weekIndex}
                style={{
                  position: "absolute",
                  left: `${weekIndex * WEEK_W}px`,
                  fontSize: "10px", color: "var(--text3)",
                  fontWeight: 500, whiteSpace: "nowrap",
                }}
              >
                {label}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "2px" }}>
            <div style={{
              display: "flex", flexDirection: "column",
              gap: `${GAP}px`, marginRight: "4px",
            }}>
              {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                <div key={i} style={{
                  height: `${CELL}px`, fontSize: "9px",
                  color: "var(--text3)", lineHeight: `${CELL}px`,
                  width: "20px", textAlign: "right",
                }}>{d}</div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: `${GAP}px` }}>
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={day.toDateString()}
                    style={{
                      width: `${CELL}px`, height: `${CELL}px`,
                      borderRadius: "2px",
                      backgroundColor: getColor(day),
                      transition: "transform 0.1s",
                      cursor: "default", flexShrink: 0,
                    }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.5)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  />
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: "5px",
        marginTop: "10px", justifyContent: "flex-end",
      }}>
        <span style={{ fontSize: "10px", color: "var(--text3)" }}>Less</span>
        <div style={{ width: `${CELL}px`, height: `${CELL}px`, borderRadius: "2px", background: "var(--bg3)" }} />
        <div style={{ width: `${CELL}px`, height: `${CELL}px`, borderRadius: "2px", background: "var(--purple-muted)" }} />
        <div style={{ width: `${CELL}px`, height: `${CELL}px`, borderRadius: "2px", background: "var(--purple)" }} />
        <span style={{ fontSize: "10px", color: "var(--text3)" }}>More</span>
      </div>
    </div>
  );
}

export default StreakTracker;