import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import getSessionId from "../utils/getSessionId";

function useStats() {
  const [streak, setStreak] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [activeDays, setActiveDays] = useState(0);

  useEffect(() => {
    const sessionId = getSessionId();
    const journalRef = ref(db, `users/${sessionId}/entries`);

    onValue(journalRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setStreak(0);
        setTotalEntries(0);
        setActiveDays(0);
        return;
      }

      const allEntries = Object.values(data);
      setTotalEntries(allEntries.length);

      const uniqueDates = [...new Set(
        allEntries.map(item => new Date(item.date).toDateString())
      )];
      setActiveDays(uniqueDates.length);

      let currentStreak = 0;
      let currentDate = new Date();

      while (true) {
        if (uniqueDates.includes(currentDate.toDateString())) {
          currentStreak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      setStreak(currentStreak);
    });
  }, []);

  return { streak, totalEntries, activeDays };
}

export default useStats;