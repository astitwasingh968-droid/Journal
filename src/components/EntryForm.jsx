import { useState } from "react";
import { db, storage } from "../firebase";
import { ref, push } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { checkGrammar } from "../utils/checkGrammar";
import getSessionId from "../utils/getSessionId";

function EntryForm() {
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("😊 Happy");
  const [errors, setErrors] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const detectSentiment = (text) => {
    const positiveWords = ["happy", "great", "good", "amazing", "love"];
    const negativeWords = ["sad", "bad", "angry", "upset", "hate"];
    let score = 0;
    const lower = text.toLowerCase();
    positiveWords.forEach(w => { if (lower.includes(w)) score++; });
    negativeWords.forEach(w => { if (lower.includes(w)) score--; });
    if (score > 0) return "Positive";
    if (score < 0) return "Negative";
    return "Neutral";
  };

  const applySuggestion = (suggestion, offset, length) => {
    setEntry(entry.substring(0, offset) + suggestion + entry.substring(offset + length));
    setErrors([]);
  };

  const handleCheckGrammar = async () => {
    const result = await checkGrammar(entry);
    setErrors(result);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please select an image."); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB."); return; }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!entry.trim()) { alert("Please write something first."); return; }
    setUploading(true);
    try {
      const sessionId = getSessionId();
      const sentiment = detectSentiment(entry);
      let photoURL = null;
      if (photo) {
        const pRef = storageRef(storage, `photos/${sessionId}/${Date.now()}_${photo.name}`);
        await uploadBytes(pRef, photo);
        photoURL = await getDownloadURL(pRef);
      }
      await push(ref(db, `users/${sessionId}/entries`), {
        text: entry,
        date: new Date().toLocaleString(),
        mood,
        sentiment,
        photoURL: photoURL || null,
      });
      setEntry("");
      setErrors([]);
      setPhoto(null);
      setPhotoPreview(null);
      alert("Entry saved successfully!");
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const words = entry.trim() === "" ? 0 : entry.trim().split(/\s+/).length;

  return (
    <div>
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your thoughts here..."
        style={{
          width: "100%",
          minHeight: "160px",
          fontFamily: "var(--font-serif)",
          fontSize: "14px",
          lineHeight: 1.8,
          resize: "vertical",
          marginBottom: "14px",
        }}
      />

      <div style={{ marginBottom: "14px" }}>
        <span style={{ fontSize: "11px", color: "var(--text3)" }}>
          {words} {words === 1 ? "word" : "words"}
        </span>
      </div>

      <p style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "8px", fontWeight: 500 }}>
        How are you feeling?
      </p>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
        {["😊 Happy", "😔 Sad", "😡 Angry", "😌 Calm", "😴 Tired"].map(m => (
          <button
            key={m}
            onClick={() => setMood(m)}
            style={{
              padding: "6px 14px",
              borderRadius: "99px",
              border: mood === m ? "1px solid var(--purple-border)" : "1px solid var(--border2)",
              background: mood === m ? "var(--purple-muted)" : "transparent",
              color: mood === m ? "var(--lavender)" : "var(--text3)",
              fontSize: "12px",
              transition: "all 0.15s",
            }}
          >{m}</button>
        ))}
      </div>

      <div style={{ height: "1px", background: "var(--border)", marginBottom: "16px" }} />

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={handleCheckGrammar} style={{ fontSize: "12px", padding: "8px 16px" }}>
          Check grammar
        </button>

        <label htmlFor="photo-upload" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "8px 16px", borderRadius: "99px",
          border: "1px solid var(--border2)",
          color: photo ? "var(--purple)" : "var(--text2)",
          cursor: "pointer", fontSize: "12px",
        }}>
          📷 {photo ? "Photo added" : "Attach photo"}
        </label>
        <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />

        <div style={{ flex: 1 }} />

        <button
          onClick={handleSave}
          disabled={uploading}
          style={{
            background: "linear-gradient(135deg, #7c4fe0, #9b6dff)",
            color: "#fff", border: "none",
            padding: "8px 22px", borderRadius: "99px",
            fontWeight: 600, fontSize: "13px",
            opacity: uploading ? 0.6 : 1,
            boxShadow: "0 4px 16px rgba(155,109,255,0.3)",
          }}
        >
          {uploading ? "Saving..." : "Save entry"}
        </button>
      </div>

      {photoPreview && (
        <div style={{ position: "relative", display: "inline-block", marginTop: "12px" }}>
          <img src={photoPreview} alt="preview" style={{
            width: "120px", height: "120px",
            objectFit: "cover", borderRadius: "8px",
            border: "1px solid var(--border2)",
          }} />
          <button
            onClick={() => { setPhoto(null); setPhotoPreview(null); }}
            style={{
              position: "absolute", top: "4px", right: "4px",
              width: "20px", height: "20px",
              background: "rgba(0,0,0,0.7)", color: "#fff",
              border: "none", borderRadius: "50%", fontSize: "10px",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
            }}
          >✕</button>
        </div>
      )}

      {errors.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <p style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Grammar suggestions
          </p>
          {errors.map((err, i) => (
            <div key={i} style={{
              background: "rgba(42, 26, 94, 0.4)",
              border: "1px solid var(--purple-border)",
              borderRadius: "8px", padding: "10px 14px", marginBottom: "8px",
            }}>
              <p style={{ fontSize: "12px", color: "var(--text2)", marginBottom: "6px" }}>
                Incorrect: <span style={{ color: "#df5a5a" }}>"{entry.substring(err.offset, err.offset + err.length)}"</span>
              </p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {err.suggestions.slice(0, 3).map((s, j) => (
                  <button key={j} onClick={() => applySuggestion(s, err.offset, err.length)} style={{
                    padding: "4px 12px", fontSize: "11px", borderRadius: "99px",
                    background: "var(--purple-muted)", border: "1px solid var(--purple-border)", color: "var(--lavender)",
                  }}>{s}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EntryForm;