/**
 * logger.js
 * Centralized logging module for SuperMall.
 * Every significant action in the app must call Logger.
 *
 * Levels: DEBUG | INFO | WARN | ERROR
 * Logs to: browser console + in-memory log store
 * Usage: Logger.info('auth', 'User logged in', { uid })
 */

const Logger = (() => {
  const LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
  const store  = [];  // In-memory log store (last 200 entries)
  const MAX_STORE = 200;

  // Console color map
  const STYLES = {
    DEBUG: "color:#888;",
    INFO:  "color:#4fc3f7;font-weight:bold;",
    WARN:  "color:#ffb74d;font-weight:bold;",
    ERROR: "color:#ef5350;font-weight:bold;"
  };

  function _log(level, module, message, data = null) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      data
    };

    // Store log
    store.push(entry);
    if (store.length > MAX_STORE) store.shift();

    // Console output
    const prefix = `%c[${level}] [${module}] ${entry.timestamp}`;
    if (data) {
      console.log(prefix, STYLES[level], message, data);
    } else {
      console.log(prefix, STYLES[level], message);
    }

    // Persist last 50 logs to sessionStorage
    try {
      const recent = store.slice(-50);
      sessionStorage.setItem("supermall_logs", JSON.stringify(recent));
    } catch (_) {}
  }

  return {
    debug: (mod, msg, data) => _log("DEBUG", mod, msg, data),
    info:  (mod, msg, data) => _log("INFO",  mod, msg, data),
    warn:  (mod, msg, data) => _log("WARN",  mod, msg, data),
    error: (mod, msg, data) => _log("ERROR", mod, msg, data),
    getLogs: () => [...store],
    clearLogs: () => { store.length = 0; }
  };
})();
