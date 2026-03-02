/**
 * ui.js
 * Shared UI helper module for SuperMall.
 * Provides: Toasts, Modals, Table builder, Loaders, Confirm dialogs
 */

const UI = (() => {

  // ── Toast Notifications ───────────────────────────────────
  function toast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }

    const t = document.createElement("div");
    t.className = `toast toast-${type}`;
    t.innerHTML = `<span>${message}</span>`;
    container.appendChild(t);
    requestAnimationFrame(() => t.classList.add("toast-show"));

    setTimeout(() => {
      t.classList.remove("toast-show");
      setTimeout(() => t.remove(), 400);
    }, 3500);

    Logger.info("ui", `Toast [${type}]: ${message}`);
  }

  // ── Modal ─────────────────────────────────────────────────
  function modal({ title, body, onConfirm, confirmText = "Confirm", cancelText = "Cancel", danger = false }) {
    const existing = document.getElementById("sm-modal");
    if (existing) existing.remove();

    const m = document.createElement("div");
    m.id = "sm-modal";
    m.className = "modal-overlay";
    m.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" id="modal-close-btn">✕</button>
        </div>
        <div class="modal-body">${body}</div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="modal-cancel">${cancelText}</button>
          <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="modal-confirm">${confirmText}</button>
        </div>
      </div>
    `;
    document.body.appendChild(m);
    requestAnimationFrame(() => m.classList.add("modal-show"));

    const close = () => { m.classList.remove("modal-show"); setTimeout(() => m.remove(), 300); };
    document.getElementById("modal-close-btn").onclick  = close;
    document.getElementById("modal-cancel").onclick     = close;
    document.getElementById("modal-confirm").onclick    = () => { close(); if (onConfirm) onConfirm(); };
    m.addEventListener("click", e => { if (e.target === m) close(); });
  }

  // ── Confirm Dialog ────────────────────────────────────────
  function confirm(message, onConfirm) {
    modal({ title: "Confirm Action", body: `<p>${message}</p>`, onConfirm, confirmText: "Yes, Delete", danger: true });
  }

  // ── Loader ────────────────────────────────────────────────
  function showLoader(containerId = "main-content") {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = `<div class="loader-wrap"><div class="loader"></div><p>Loading...</p></div>`;
  }

  function hideLoader() {} // Content replacement handles this

  // ── Build Table ───────────────────────────────────────────
  /**
   * Renders a data table into a container
   * @param {string} containerId
   * @param {Array}  columns    - [{ key, label, render? }]
   * @param {Array}  rows       - data array
   * @param {Array}  actions    - [{ label, icon, className, onClick }]
   */
  function buildTable(containerId, columns, rows, actions = []) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (rows.length === 0) {
      el.innerHTML = `<div class="empty-state"><span>📭</span><p>No records found.</p></div>`;
      return;
    }

    const headerCells = columns.map(c => `<th>${c.label}</th>`).join("") + (actions.length ? "<th>Actions</th>" : "");
    const bodyRows = rows.map(row => {
      const cells = columns.map(c => {
        const val = c.render ? c.render(row) : (row[c.key] ?? "—");
        return `<td>${val}</td>`;
      }).join("");
      const actionBtns = actions.map(a =>
        `<button class="btn-action ${a.className || ''}" data-id="${row.id}" onclick="(${a.onClick.toString()})(this.dataset.id)">${a.icon || ""} ${a.label}</button>`
      ).join("");
      return `<tr>${cells}${actions.length ? `<td class="actions-cell">${actionBtns}</td>` : ""}</tr>`;
    }).join("");

    el.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>${headerCells}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
    `;
  }

  // ── Build Cards ───────────────────────────────────────────
  function buildCards(containerId, items, renderCard) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (items.length === 0) {
      el.innerHTML = `<div class="empty-state"><span>📭</span><p>No items found.</p></div>`;
      return;
    }
    el.innerHTML = `<div class="card-grid">${items.map(renderCard).join("")}</div>`;
  }

  // ── Badge helper ──────────────────────────────────────────
  function badge(text, type = "default") {
    return `<span class="badge badge-${type}">${text}</span>`;
  }

  // ── Format currency ───────────────────────────────────────
  function currency(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
  }

  // ── Status badge ──────────────────────────────────────────
  function statusBadge(active) {
    return badge(active ? "Active" : "Inactive", active ? "success" : "danger");
  }

  return { toast, modal, confirm, showLoader, buildTable, buildCards, badge, currency, statusBadge };
})();
