const HISTORY_KEY = "wastewise_history";

export function saveHistoryEntry(entry) {
  const history = getHistory();
  history.unshift({ ...entry, id: Date.now().toString(), date: new Date().toISOString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return history;
}

export function getHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}