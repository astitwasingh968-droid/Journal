import MoodChart from "../components/MoodChart";
import StreakTracker from "../components/StreakTracker";
import PageTransition from "../components/PageTransition";
import useStats from "../hooks/useStats";

function Stats() {
  const { streak, totalEntries, activeDays } = useStats();

  return (
    <PageTransition>
      <div className="section-tag">Analytics</div>
      <h2 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(20px, 4vw, 24px)",
        fontWeight: 600, color: "var(--text)", marginBottom: "20px",
      }}>
        Your stats
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        gap: "10px", marginBottom: "16px",
      }}>
        {[
          [streak, "streak"],
          [totalEntries, "entries"],
          [activeDays, "active days"],
        ].map(([num, label]) => (
          <div key={label} className="stat-card">
            <div className="stat-num">{num}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-tag">Mood over time</div>
        <MoodChart />
      </div>

      <div className="card">
        <div className="section-tag">Journaling streak</div>
        <StreakTracker />
      </div>
    </PageTransition>
  );
}

export default Stats;