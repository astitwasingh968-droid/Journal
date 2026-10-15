function getSessionId() {
  let id = localStorage.getItem("journal_session_id");
  if (!id) {
    id = "user_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
    localStorage.setItem("journal_session_id", id);
  }
  return id;
}

export default getSessionId;