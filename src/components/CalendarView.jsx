import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import getSessionId from "../utils/getSessionId";

function CalendarView({ onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const sessionId = getSessionId();

  useEffect(() => {
    const journalRef = ref(db, `users/${sessionId}/entries`);
    onValue(journalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedEntries = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setEntries(loadedEntries);
      } else {
        setEntries([]);
      }
    });
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  const getMoodForDate = (date) => {
    const found = entries.find(
      (item) => new Date(item.date).toDateString() === date.toDateString()
    );
    return found?.mood ? found.mood.split(" ")[0] : null;
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={({ date }) => {
          const mood = getMoodForDate(date);
          return mood ? <p style={{ fontSize: "10px", margin: 0, textAlign: "center" }}>{mood}</p> : null;
        }}
      />
    </div>
  );
}

export default CalendarView;