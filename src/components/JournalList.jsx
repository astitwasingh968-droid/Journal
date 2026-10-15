import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, remove, update } from "firebase/database";
import getSessionId from "../utils/getSessionId";

function JournalList({ selectedDate, searchTerm }) {
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editMood, setEditMood] = useState("");

  const sessionId = getSessionId();

  useEffect(() => {
    const journalRef = ref(db, `users/${sessionId}/entries`);
    onValue(journalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedEntries = Object.keys(data).map((key) => ({
          id: key, ...data[key],
        }));
        setEntries(loadedEntries);
      } else {
        setEntries([]);
      }
    });
  }, []);

  const filteredEntries = entries.filter((item) => {
    const sameDate = new Date(item.date).toDateString() === new Date(selectedDate).toDateString();
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());
    return sameDate && matchesSearch;
  });

  const moodAccent = {
    "😊 Happy":  { bg: "#1a1a3d", border: "#4a3f9f", pill: "#9b6dff" },
    "😌 Calm":   { bg: "#0f2a2a", border: "#1f6060", pill: "#4ac8c8" },
    "😴 Tired":  { bg: "#1a1a2e", border: "#2e2e5e", pill: "#7878c8" },
    "😔 Sad":    { bg: "#0f1a2e", border: "#1f3a6e", pill: "#5a8adf" },
    "😡 Angry":  { bg: "#2e0f0f", border: "#6e1f1f", pill: "#df5a5a" },
  };

  const sentimentColor = {
    Positive: { color: "#7acd7a", bg: "#1a3d1a", border: "#1f6e1f" },
    Negative: { color: "#df5a5a", bg: "#3d1a1a", border: "#6e1f1f" },
    Neutral:  { color: "#9b87c8", bg: "#2a1a5e", border: "#2e1f6e" },
  };

  const highlightText = (text, term) => {
    if (!term.trim()) return text;
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} style={{ background: "var(--purple-muted)", color: "var(--purple)", borderRadius: "3px", padding: "0 2px" }}>
          {part}
        </mark>
      ) : part
    );
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this entry?");
    if (!confirmed) return;
    await remove(ref(db, `users/${sessionId}/entries/${id}`));
  };

  const handleEditStart = (item) => {
    setEditingId(item.id);
    setEditText(item.text);
    setEditMood(item.mood);
  };

  const handleEditSave = async (id) => {
    await update(ref(db, `users/${sessionId}/entries/${id}`), {
      text: editText,
      mood: editMood,
    });
    setEditingId(null);
    setEditText("");
    setEditMood("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText("");
    setEditMood("");
  };

  if (filteredEntries.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>✦</div>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 600, color: "var(--text2)", marginBottom: "8px" }}>
          No entries for this day
        </p>
        <p style={{ fontSize: "12px", color: "var(--text3)", lineHeight: 1.7 }}>
          {searchTerm ? `No entries match "${searchTerm}"` : "Nothing written yet. Start capturing your thoughts."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "16px", fontWeight: 500 }}>
        {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"} found
      </p>

      {filteredEntries.map((item) => {
        const accent = moodAccent[item.mood] || moodAccent["😌 Calm"];
        const sentiment = sentimentColor[item.sentiment] || sentimentColor["Neutral"];

        return (
          <div
            key={item.id}
            style={{
              background: accent.bg,
              border: `1px solid ${accent.border}`,
              borderRadius: "12px",
              marginBottom: "14px",
              overflow: "hidden",
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 20px rgba(155,109,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            {editingId === item.id ? (
              <div style={{ padding: "18px 20px" }}>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={4}
                  style={{ marginBottom: "10px" }}
                />
                <select
                  value={editMood}
                  onChange={(e) => setEditMood(e.target.value)}
                  style={{ marginBottom: "12px", width: "auto" }}
                >
                  <option>😊 Happy</option>
                  <option>😔 Sad</option>
                  <option>😡 Angry</option>
                  <option>😌 Calm</option>
                  <option>😴 Tired</option>
                </select>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => handleEditSave(item.id)} style={{
                    background: "var(--purple)", color: "#09080f",
                    border: "none", borderRadius: "99px",
                    padding: "7px 18px", fontWeight: 600, fontSize: "12px",
                  }}>Save</button>
                  <button onClick={handleEditCancel} style={{ padding: "7px 18px", fontSize: "12px" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ height: "3px", background: accent.pill, borderRadius: "12px 12px 0 0" }} />
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", gap: "8px" }}>
                    <div>
                      <p style={{ fontSize: "10px", color: "var(--text3)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                        {item.date}
                      </p>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{
                          display: "inline-block", padding: "3px 10px",
                          borderRadius: "99px", fontSize: "11px", fontWeight: 600,
                          background: "rgba(0,0,0,0.2)", color: accent.pill,
                          border: `1px solid ${accent.border}`,
                        }}>{item.mood}</span>
                        {item.sentiment && (
                          <span style={{
                            display: "inline-block", padding: "3px 10px",
                            borderRadius: "99px", fontSize: "10px", fontWeight: 600,
                            background: sentiment.bg, color: sentiment.color,
                            border: `1px solid ${sentiment.border}`,
                          }}>{item.sentiment}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      <button onClick={() => handleEditStart(item)} style={{
                        fontSize: "11px", padding: "5px 12px", borderRadius: "99px",
                        border: `1px solid ${accent.border}`, background: "transparent", color: "var(--text3)",
                      }}>Edit</button>
                      <button onClick={() => handleDelete(item.id)} style={{
                        fontSize: "11px", padding: "5px 12px", borderRadius: "99px",
                        border: "1px solid #5a2020", background: "transparent", color: "#df5a5a",
                      }}>Delete</button>
                    </div>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-serif)", fontSize: "14px",
                    lineHeight: 1.8, color: "var(--text2)", fontStyle: "italic",
                    marginBottom: item.photoURL ? "14px" : "0",
                  }}>{highlightText(item.text, searchTerm)}</p>
                  {item.photoURL && (
                    <img src={item.photoURL} alt="journal" style={{
                      width: "100%", maxHeight: "220px",
                      objectFit: "cover", borderRadius: "8px",
                      border: `1px solid ${accent.border}`, marginTop: "12px",
                    }} />
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default JournalList;