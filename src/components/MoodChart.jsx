import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import getSessionId from "../utils/getSessionId";

const moodScore = {
  "😊 Happy": 5,
  "😌 Calm": 4,
  "😴 Tired": 3,
  "😔 Sad": 2,
  "😡 Angry": 1,
};

const moodLabel = {
  5: "😊 Happy",
  4: "😌 Calm",
  3: "😴 Tired",
  2: "😔 Sad",
  1: "😡 Angry",
};

function MoodChart() {
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("7"); // "7" or "30" days

  useEffect(() => {
    const journalRef = ref(db, `users/${getSessionId()}/entries`);

    onValue(journalRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setChartData([]);
        return;
      }

      const days = parseInt(filter);
      const today = new Date();

      
      const dateRange = Array.from({ length: days }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (days - 1 - i));
        return d.toDateString();
      });

     
      const entriesByDate = {};
      Object.values(data).forEach((item) => {
        const dateStr = new Date(item.date).toDateString();
        if (!entriesByDate[dateStr]) {
          entriesByDate[dateStr] = [];
        }
        entriesByDate[dateStr].push(moodScore[item.mood] || 3);
      });

     
      const formatted = dateRange.map((dateStr) => {
        const scores = entriesByDate[dateStr];
        const avg = scores
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : null;

        const d = new Date(dateStr);
        const label = `${d.getDate()}/${d.getMonth() + 1}`;

        return {
          date: label,
          mood: avg ? parseFloat(avg.toFixed(1)) : null,
        };
      });

      setChartData(formatted);
    });
  }, [filter]);

  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && payload[0].value !== null) {
      const score = Math.round(payload[0].value);
      return (
        <div style={{
          background: "var(--card-bg, #fff)",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "8px 12px",
          fontSize: "13px",
        }}>
          <p style={{ margin: 0, fontWeight: 500 }}>{label}</p>
          <p style={{ margin: 0 }}>{moodLabel[score]}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ margin: 0 }}>Mood Trend</h2>

        
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setFilter("7")}
            style={{
              padding: "4px 12px",
              borderRadius: "99px",
              border: "1px solid #ddd",
              background: filter === "7" ? "#111" : "transparent",
              color: filter === "7" ? "#fff" : "inherit",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            7 days
          </button>
          <button
            onClick={() => setFilter("30")}
            style={{
              padding: "4px 12px",
              borderRadius: "99px",
              border: "1px solid #ddd",
              background: filter === "30" ? "#111" : "transparent",
              color: filter === "30" ? "#fff" : "inherit",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            30 days
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />

          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(v) => moodLabel[v]?.split(" ")[0]}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="mood"
            stroke="#7F77DD"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#7F77DD", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>

      
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
        {Object.entries(moodLabel).reverse().map(([score, label]) => (
          <span key={score} style={{ fontSize: "12px", color: "var(--text-secondary, #666)" }}>
            {label} = {score}
          </span>
        ))}
      </div>
    </div>
  );
}

export default MoodChart;