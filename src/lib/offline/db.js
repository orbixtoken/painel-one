// =====================================================
// Arguz Tech - Offline Database (IndexedDB)
// Camada local persistente profissional
// =====================================================

const DB_NAME = 'arguz_one_offline';
const DB_VERSION = 1;

let dbInstance = null;

export function openDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const db = event.target.result;

      // =========================
      // Tabelas locais
      // =========================
      db.createObjectStore('clientes', { keyPath: 'id' });
      db.createObjectStore('produtos', { keyPath: 'id' });

      db.createObjectStore('ordens_pendentes', {
        keyPath: 'temp_id',
        autoIncrement: true
      });

      db.createObjectStore('orcamentos_pendentes', {
        keyPath: 'temp_id',
        autoIncrement: true
      });

      db.createObjectStore('sessao', { keyPath: 'key' });
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onerror = () => reject(request.error);
  });
}

// helpers genéricos
export async function put(storeName, value) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(value);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAll(storeName) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function clear(storeName) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).clear();

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
