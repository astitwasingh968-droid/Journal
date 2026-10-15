import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

function MemoryToday() {
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    const journalRef = ref(db, "entries");

    onValue(journalRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setMemories([]);
        return;
      }

      const today = new Date();
      const month = today.getMonth();
      const day = today.getDate();

      const matched = Object.keys(data)
        .map((key) => ({
          id: key,
          ...data[key],
        }))
        .filter((item) => {
          const entryDate = new Date(item.date);
          return (
            entryDate.getMonth() === month &&
            entryDate.getDate() === day
          );
        });

      setMemories(matched);
    });
  }, []);

  return (
    <div>
      <h2>On This Day</h2>

      {memories.length === 0 ? (
        <p>No memories today</p>
      ) : (
        memories.map((item) => (
          <div key={item.id}>
            <p>{item.date}</p>
            <p>{item.mood}</p>
            <p>{item.text}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default MemoryToday;