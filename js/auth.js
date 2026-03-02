/**
 * auth.js
 * Authentication module for SuperMall.
 * Handles: Login, Logout, Session, Role-based guards
 *
 * Roles: 'admin' | 'user'
 * Demo credentials:
 *   Admin: admin@mall.com  / Admin@123
 *   User:  user@mall.com   / User@123
 */

const Auth = (() => {

  const DEMO_USERS = [
    { uid: "admin_001", email: "admin@mall.com", password: "Admin@123", role: "admin", name: "Mall Admin" },
    { uid: "user_001",  email: "user@mall.com",  password: "User@123",  role: "user",  name: "Shopper" }
  ];

  // ── Session helpers ───────────────────────────────────────
  function getSession() {
    try { return JSON.parse(sessionStorage.getItem("supermall_session") || "null"); }
    catch { return null; }
  }

  function setSession(user) {
    sessionStorage.setItem("supermall_session", JSON.stringify(user));
  }

  function clearSession() {
    sessionStorage.removeItem("supermall_session");
  }

  // ── Current user ──────────────────────────────────────────
  function currentUser() {
    return getSession();
  }

  function isLoggedIn() {
    return getSession() !== null;
  }

  function isAdmin() {
    const u = getSession();
    return u && u.role === "admin";
  }

  // ── Login ─────────────────────────────────────────────────
  async function login(email, password) {
    Logger.info("auth", "Login attempt", { email });

    if (DEMO_MODE) {
      // Demo mode: check against hardcoded users
      const user = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (!user) {
        Logger.warn("auth", "Login failed — invalid credentials", { email });
        throw new Error("Invalid email or password.");
      }
      const session = { uid: user.uid, email: user.email, role: user.role, name: user.name };
      setSession(session);
      Logger.info("auth", "Login successful (demo)", { email, role: user.role });
      return session;
    }

    // Firebase mode
    const cred = await auth.signInWithEmailAndPassword(email, password);
    const uid  = cred.user.uid;

    // Fetch role from Firestore
    const snap = await db.collection("users").doc(uid).get();
    const role = snap.exists ? snap.data().role : "user";
    const name = snap.exists ? snap.data().name : email;

    const session = { uid, email, role, name };
    setSession(session);
    Logger.info("auth", "Login successful (firebase)", { email, role });
    return session;
  }

  // ── Logout ────────────────────────────────────────────────
  async function logout() {
    Logger.info("auth", "Logout", { user: getSession()?.email });
    clearSession();
    if (!DEMO_MODE) {
      try { await auth.signOut(); } catch (_) {}
    }
    window.location.href = getRootPath() + "index.html";
  }

  // ── Auth guard ────────────────────────────────────────────
  function requireAuth(requiredRole = null) {
    const user = getSession();
    if (!user) {
      Logger.warn("auth", "Auth guard: not logged in — redirecting");
      window.location.href = getRootPath() + "index.html";
      return false;
    }
    if (requiredRole && user.role !== requiredRole) {
      Logger.warn("auth", `Auth guard: role mismatch (required: ${requiredRole}, got: ${user.role})`);
      window.location.href = getRootPath() + "index.html";
      return false;
    }
    return true;
  }

  // ── Path helper ───────────────────────────────────────────
  function getRootPath() {
    const path = window.location.pathname;
    if (path.includes("/admin/") || path.includes("/user/")) return "../";
    return "./";
  }

  // ── Init nav (inject user info + logout button) ───────────
  function initNav() {
    const user = getSession();
    if (!user) return;

    const navUser = document.getElementById("nav-user");
    if (navUser) navUser.textContent = `👤 ${user.name} (${user.role})`;

    const navLogout = document.getElementById("nav-logout");
    if (navLogout) navLogout.addEventListener("click", () => logout());
  }

  return { login, logout, currentUser, isLoggedIn, isAdmin, requireAuth, initNav };
})();
