/**
 * product.js / offer.js / category.js
 * Combined data services for Products, Offers, and Categories.
 */

// ════════════════════════════════════════════════════════════
//  PRODUCT SERVICE
// ════════════════════════════════════════════════════════════
const ProductService = (() => {
  const C = "products";

  function _fb() { return db.collection(C); }

  async function _all() {
    if (DEMO_MODE) return MockDB.getAll(C);
    const s = await _fb().get();
    return s.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async function getAll()               { Logger.info("product","getAll"); return _all(); }
  async function getById(id)            { Logger.info("product","getById",{id}); return DEMO_MODE ? MockDB.getById(C,id) : (await _fb().doc(id).get()).data(); }
  async function getByShop(shopId)      { Logger.info("product","getByShop",{shopId}); return DEMO_MODE ? MockDB.query(C,"shopId","==",shopId) : (await _fb().where("shopId","==",shopId).get()).docs.map(d=>({id:d.id,...d.data()})); }
  async function getByCategory(cat)     { Logger.info("product","getByCategory",{cat}); return DEMO_MODE ? MockDB.query(C,"category","==",cat) : (await _fb().where("category","==",cat).get()).docs.map(d=>({id:d.id,...d.data()})); }
  async function getFeatured()          { Logger.info("product","getFeatured"); return DEMO_MODE ? MockDB.query(C,"featured","==",true) : (await _fb().where("featured","==",true).get()).docs.map(d=>({id:d.id,...d.data()})); }

  async function create(data) {
    Logger.info("product","create",{name:data.name});
    return DEMO_MODE ? MockDB.add(C,data) : (async()=>{ const r=await _fb().add({...data,createdAt:firebase.firestore.FieldValue.serverTimestamp()}); return{id:r.id,...data}; })();
  }

  async function update(id, data) {
    Logger.info("product","update",{id});
    return DEMO_MODE ? MockDB.update(C,id,data) : _fb().doc(id).update({...data,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
  }

  async function remove(id) {
    Logger.info("product","remove",{id});
    return DEMO_MODE ? MockDB.delete(C,id) : _fb().doc(id).delete();
  }

  async function search(q) {
    const all = await _all();
    const lq = q.toLowerCase();
    return all.filter(p => p.name.toLowerCase().includes(lq) || (p.category||"").toLowerCase().includes(lq));
  }

  /** Compare two products by ID — returns side-by-side diff object */
  async function compare(id1, id2) {
    const [a, b] = await Promise.all([getById(id1), getById(id2)]);
    Logger.info("product","compare",{id1,id2});
    return { a, b };
  }

  return { getAll, getById, getByShop, getByCategory, getFeatured, create, update, remove, search, compare };
})();


// ════════════════════════════════════════════════════════════
//  OFFER SERVICE
// ════════════════════════════════════════════════════════════
const OfferService = (() => {
  const C = "offers";
  function _fb() { return db.collection(C); }

  async function _all() {
    if (DEMO_MODE) return MockDB.getAll(C);
    const s = await _fb().get();
    return s.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async function getAll()           { Logger.info("offer","getAll"); return _all(); }
  async function getActive()        { Logger.info("offer","getActive"); return DEMO_MODE ? MockDB.query(C,"active","==",true) : (await _fb().where("active","==",true).get()).docs.map(d=>({id:d.id,...d.data()})); }
  async function getByShop(shopId)  { Logger.info("offer","getByShop",{shopId}); return DEMO_MODE ? MockDB.query(C,"shopId","==",shopId) : (await _fb().where("shopId","==",shopId).get()).docs.map(d=>({id:d.id,...d.data()})); }

  async function create(data) {
    Logger.info("offer","create",{title:data.title});
    return DEMO_MODE ? MockDB.add(C,data) : (async()=>{ const r=await _fb().add({...data,createdAt:firebase.firestore.FieldValue.serverTimestamp()}); return{id:r.id,...data}; })();
  }

  async function update(id, data) {
    Logger.info("offer","update",{id});
    return DEMO_MODE ? MockDB.update(C,id,data) : _fb().doc(id).update({...data,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
  }

  async function remove(id) {
    Logger.info("offer","remove",{id});
    return DEMO_MODE ? MockDB.delete(C,id) : _fb().doc(id).delete();
  }

  async function toggleActive(id, current) {
    Logger.info("offer","toggleActive",{id,newState:!current});
    return update(id, { active: !current });
  }

  return { getAll, getActive, getByShop, create, update, remove, toggleActive };
})();


// ════════════════════════════════════════════════════════════
//  CATEGORY SERVICE
// ════════════════════════════════════════════════════════════
const CategoryService = (() => {
  const C = "categories";
  function _fb() { return db.collection(C); }

  async function getAll() {
    Logger.info("category","getAll");
    if (DEMO_MODE) return MockDB.getAll(C);
    const s = await _fb().get();
    return s.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async function getByFloor(floor) {
    Logger.info("category","getByFloor",{floor});
    return DEMO_MODE ? MockDB.query(C,"floor","==",floor) : (await _fb().where("floor","==",floor).get()).docs.map(d=>({id:d.id,...d.data()}));
  }

  async function getUniqueFloors() {
    const all = await getAll();
    return [...new Set(all.map(c => c.floor))].sort();
  }

  async function create(data) {
    Logger.info("category","create",{name:data.name});
    return DEMO_MODE ? MockDB.add(C,data) : (async()=>{ const r=await _fb().add(data); return{id:r.id,...data}; })();
  }

  async function update(id, data) {
    Logger.info("category","update",{id});
    return DEMO_MODE ? MockDB.update(C,id,data) : _fb().doc(id).update(data);
  }

  async function remove(id) {
    Logger.info("category","remove",{id});
    return DEMO_MODE ? MockDB.delete(C,id) : _fb().doc(id).delete();
  }

  return { getAll, getByFloor, getUniqueFloors, create, update, remove };
})();
