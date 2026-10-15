import EntryForm from "../components/EntryForm";
import PageTransition from "../components/PageTransition";

function Write() {
  return (
    <PageTransition>
      <div className="section-tag">New entry</div>
      <h2 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(20px, 4vw, 24px)",
        fontWeight: 600, color: "var(--text)", marginBottom: "20px",
      }}>
        Write freely.
      </h2>
      <div className="card">
        <EntryForm />
      </div>
    </PageTransition>
  );
}

export default Write;