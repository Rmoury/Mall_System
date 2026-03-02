/**
 * shop.js
 * Shop data module — CRUD operations for Shops.
 * Collection: "shops"
 */

const ShopService = (() => {
  const COLLECTION = "shops";

  async function getAll() {
    Logger.info("shop", "Fetching all shops");
    return DEMO_MODE ? MockDB.getAll(COLLECTION) : _firestoreGetAll();
  }

  async function getById(id) {
    Logger.info("shop", "Fetching shop by ID", { id });
    return DEMO_MODE ? MockDB.getById(COLLECTION, id) : _firestoreGetById(id);
  }

  async function getByCategory(category) {
    Logger.info("shop", "Fetching shops by category", { category });
    return DEMO_MODE ? MockDB.query(COLLECTION, "category", "==", category) : _firestoreQuery("category", "==", category);
  }

  async function getByFloor(floor) {
    Logger.info("shop", "Fetching shops by floor", { floor });
    return DEMO_MODE ? MockDB.query(COLLECTION, "floor", "==", floor) : _firestoreQuery("floor", "==", floor);
  }

  async function create(data) {
    Logger.info("shop", "Creating shop", { name: data.name });
    const result = DEMO_MODE ? await MockDB.add(COLLECTION, data) : await _firestoreAdd(data);
    Logger.info("shop", "Shop created", { id: result.id });
    return result;
  }

  async function update(id, data) {
    Logger.info("shop", "Updating shop", { id });
    const result = DEMO_MODE ? await MockDB.update(COLLECTION, id, data) : await _firestoreUpdate(id, data);
    Logger.info("shop", "Shop updated", { id });
    return result;
  }

  async function remove(id) {
    Logger.info("shop", "Deleting shop", { id });
    DEMO_MODE ? await MockDB.delete(COLLECTION, id) : await _firestoreDelete(id);
    Logger.info("shop", "Shop deleted", { id });
  }

  async function search(query) {
    Logger.info("shop", "Searching shops", { query });
    const all = await getAll();
    const q = query.toLowerCase();
    return all.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.floor.toLowerCase().includes(q)
    );
  }

  // ── Firestore helpers (used when Firebase is configured) ──
  async function _firestoreGetAll() {
    const snap = await db.collection(COLLECTION).get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  async function _firestoreGetById(id) {
    const d = await db.collection(COLLECTION).doc(id).get();
    return d.exists ? { id: d.id, ...d.data() } : null;
  }
  async function _firestoreQuery(field, op, val) {
    const snap = await db.collection(COLLECTION).where(field, op, val).get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  async function _firestoreAdd(data) {
    const ref = await db.collection(COLLECTION).add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    return { id: ref.id, ...data };
  }
  async function _firestoreUpdate(id, data) {
    await db.collection(COLLECTION).doc(id).update({ ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
    return { id, ...data };
  }
  async function _firestoreDelete(id) {
    await db.collection(COLLECTION).doc(id).delete();
  }

  return { getAll, getById, getByCategory, getByFloor, create, update, remove, search };
})();
