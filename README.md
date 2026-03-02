# Mall_System

# 🏬 SuperMall Web Application
###   Project — HTML, CSS, JS, Firebase

---

## 📁 Project Structure

```
super-mall/
│
├── index.html                   ← Login page (Admin & User)
│
├── admin/
│   ├── dashboard.html           ← Admin dashboard with analytics
│   ├── shops.html               ← Manage shops (CRUD)
│   ├── products.html            ← Manage products (CRUD)
│   ├── offers.html              ← Manage offers (CRUD + toggle)
│   └── categories.html         ← Manage categories & floors (CRUD)
│
├── user/
│   ├── browse.html              ← Browse products (search + category filter)
│   ├── compare.html             ← Compare two products side-by-side
│   └── shop-detail.html        ← View shop + its products + offers
│
├── css/
│   └── style.css               ← Full design system (Navy + Orange theme)
│
├── js/
│   ├── logger.js               ← Centralized logging module
│   ├── firebase-config.js      ← Firebase init + Demo Mode mock DB
│   ├── auth.js                 ← Login, logout, auth guards, roles
│   ├── ui.js                   ← Toast, Modal, Table builder, Cards, Badges
│   ├── shop.js                 ← Shop CRUD service
│   └── data-services.js        ← Product, Offer, Category CRUD services
│
└── README.md                   ← This file
```

---

## 🚀 Quick Start

```bash
# No build tools needed — open index.html directly
open index.html

# Or serve locally
npx serve .
python3 -m http.server 3000
```

---

## 🔐 Demo Credentials

| Role  | Email              | Password   |
|-------|--------------------|------------|
| Admin | admin@mall.com     | Admin@123  |
| User  | user@mall.com      | User@123   |

> The app runs in **DEMO MODE** by default (localStorage as DB). No Firebase setup needed to test.

---

## 🔥 Firebase Setup (Production)

1. Go to https://console.firebase.google.com
2. Create a new project (e.g., "SuperMall")
3. Enable **Authentication → Email/Password**
4. Enable **Firestore Database**
5. Get your config from Project Settings → Web App
6. Replace `firebaseConfig` in `js/firebase-config.js`
7. Create users in Firebase Auth with roles stored in Firestore `users` collection:
   ```json
   { "uid": "...", "email": "...", "role": "admin", "name": "Mall Admin" }
   ```

---

## 📋 System Modules

### Admin Module
| Feature | Page |
|---------|------|
| Dashboard with stats | `admin/dashboard.html` |
| Create/Edit/Delete Shops | `admin/shops.html` |
| Create/Edit/Delete Products | `admin/products.html` |
| Create/Edit/Delete/Toggle Offers | `admin/offers.html` |
| Manage Categories & Floors | `admin/categories.html` |

### User Module
| Feature | Page |
|---------|------|
| Browse products with search + filter | `user/browse.html` |
| View offers strip | `user/browse.html` |
| Shop directory & detail view | `user/shop-detail.html` |
| Compare 2 products (price, features) | `user/compare.html` |

---

## 🏗️ Architecture

### Data Flow
```
User Action
    ↓
logger.js (logs every action)
    ↓
Service Module (shop.js / data-services.js)
    ↓
Firebase (production) OR MockDB/localStorage (demo)
    ↓
ui.js (renders result to DOM)
```

### Module Responsibilities

| Module | Responsibility |
|--------|---------------|
| `logger.js` | Centralized logging (DEBUG/INFO/WARN/ERROR). All significant actions logged. |
| `firebase-config.js` | Firebase init + MockDB fallback for demo mode. Seeds sample data. |
| `auth.js` | Login, logout, session management, role-based auth guards. |
| `ui.js` | Toast notifications, modals, table builder, card builder, badge/currency helpers. |
| `shop.js` | Shop CRUD — getAll, getById, getByFloor, getByCategory, create, update, remove. |
| `data-services.js` | ProductService, OfferService, CategoryService — all CRUD operations. |

---

## 📊 Firestore Collections

| Collection    | Fields |
|---------------|--------|
| `users`       | uid, email, name, role |
| `shops`       | name, category, floor, unit, owner, phone, open, close, description, active |
| `products`    | name, shopId, shopName, category, price, discountPrice, stock, image, description, featured |
| `offers`      | title, shopId, shopName, discount, code, validFrom, validTo, description, active |
| `categories`  | name, icon, floor |

---

## 🧾 Logging

Every action in the app is logged using `Logger`:

```javascript
Logger.info("module", "Action description", { data });
Logger.warn("module", "Warning message");
Logger.error("module", "Error description", error);
```

Logs are stored in:
- Browser console (color-coded by level)
- In-memory store (last 200 entries via `Logger.getLogs()`)
- `sessionStorage` key `supermall_logs` (last 50 entries)

---

## ✅ Requirements Checklist

- [x] Login (Admin + User roles)
- [x] Create / Manage Shop Details
- [x] Manage Offer Details (with toggle active/inactive)
- [x] Manage Category & Floor
- [x] Category Wise Details
- [x] List of Shop Details (with search + filter)
- [x] List Offer Products
- [x] Compare Products Cost & Features
- [x] Filter (by floor, category, shop, status)
- [x] Shop Wise Offers
- [x] Floor Wise Details (in categories page)
- [x] View Shop Details (user shop-detail page)
- [x] Firebase integration (+ demo mode fallback)
- [x] Logging for every action (logger.js)
- [x] Modular code architecture
- [x] Responsive design (mobile + desktop)
- [x] Code comments throughout

---

## 🧪 Test Cases

| Test | Expected Result |
|------|-----------------|
| Login with admin@mall.com / Admin@123 | Redirects to admin/dashboard.html |
| Login with wrong password | Shows error message |
| Add new shop | Shop appears in list immediately |
| Toggle offer active/inactive | Status badge updates in table |
| Search for "Tech" in products | Filters to matching products |
| Compare same product | Shows warning "select different products" |
| Direct URL access without login | Redirects to login page |
| Filter shops by floor | Shows only shops on that floor |

---

*Built for   — Super Mall Web Application Project*
