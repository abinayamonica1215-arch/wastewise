// Simple localStorage-based mock auth. No backend required.

const USERS_KEY = "wastewise_users";
const SESSION_KEY = "wastewise_session";

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser({ name, email, password, role }) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: "An account with this email already exists." };
  }
  const user = { id: Date.now().toString(), name, email, password, role };
  users.push(user);
  saveUsers(users);
  setSession(user);
  return { success: true, user };
}

export function loginUser({ email, password }) {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    return { success: false, message: "Invalid email or password." };
  }
  setSession(user);
  return { success: true, user };
}

export function setSession(user) {
  const session = { id: user.id, name: user.name, email: user.email, role: user.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}