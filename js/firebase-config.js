/**
 * firebase-config.js
 * Firebase initialization for SuperMall.
 * ✅ Connected to real Firebase project: supermall-3663d
 */

// ── REAL FIREBASE CONFIG ──────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyA_L1jIBB_BtLLuCPl5--FPLlmKQIKKKJY",
  authDomain: "supermall-3663d.firebaseapp.com",
  projectId: "supermall-3663d",
  storageBucket: "supermall-3663d.firebasestorage.app",
  messagingSenderId: "360488758638",
  appId: "1:360488758638:web:067994473bf8302a46257f",
  measurementId: "G-SZ3NM0PPXB"
};

// ── FIREBASE INIT ─────────────────────────────────────────────
let db = null;
let auth = null;
let DEMO_MODE = false;

try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  auth = firebase.auth();
  Logger.info("firebase-config", "✅ Firebase connected to supermall-3663d");
} catch (e) {
  DEMO_MODE = true;
  Logger.warn("firebase-config", "⚠️ Firebase failed — falling back to DEMO MODE", e.message);
}

// ══════════════════════════════════════════════════════════════
//  DEMO MODE FALLBACK (only used if Firebase fails)
// ══════════════════════════════════════════════════════════════
const MockDB = {
  _read(collection) {
    try { return JSON.parse(localStorage.getItem(`supermall_${collection}`) || "[]"); }
    catch { return []; }
  },
  _write(collection, data) {
    localStorage.setItem(`supermall_${collection}`, JSON.stringify(data));
  },
  async getAll(collection) { return this._read(collection); },
  async getById(collection, id) { return this._read(collection).find(d => d.id === id) || null; },
  async add(collection, data) {
    const items = this._read(collection);
    const id = "id_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    const doc = { ...data, id, createdAt: new Date().toISOString() };
    items.push(doc);
    this._write(collection, items);
    return doc;
  },
  async update(collection, id, data) {
    const items = this._read(collection);
    const idx = items.findIndex(d => d.id === id);
    if (idx === -1) throw new Error(`Doc ${id} not found in ${collection}`);
    items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
    this._write(collection, items);
    return items[idx];
  },
  async delete(collection, id) {
    const items = this._read(collection).filter(d => d.id !== id);
    this._write(collection, items);
  },
  async query(collection, field, op, value) {
    return this._read(collection).filter(item => {
      if (op === "==") return item[field] === value;
      if (op === "!=") return item[field] !== value;
      return true;
    });
  }
};
