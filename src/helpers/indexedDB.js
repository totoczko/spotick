import idb from './idb.js'

let dbPromise = idb.open('post-store', 1, (db) => {
  if (!db.objectStoreNames.contains('posts')) {
    db.createObjectStore('posts', { keyPath: 'data' })
  }
});

export const getPostsFromIDB = (st) => {
  return dbPromise.then((db) => {
    let tx = db.transaction(st, 'readonly');
    let store = tx.objectStore(st);
    return store.getAll()
  })
}

export const getPostFromIDB = (st, id) => {
  return dbPromise.then((db) => {
    let tx = db.transaction(st, 'readonly');
    let store = tx.objectStore(st);
    return store.get(id);
  })
}

export const deletePostsFromIDB = (st) => {
  return dbPromise.then((db) => {
    let tx = db.transaction(st, 'readwrite');
    let store = tx.objectStore(st);
    store.clear();
    return tx.complete;
  })
}

export const deletePostFromIDB = (st, id) => {
  return dbPromise.then((db) => {
    let tx = db.transaction(st, 'readwrite');
    let store = tx.objectStore(st);
    store.delete(id);
    return tx.complete;
  })
}