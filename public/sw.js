//https://karannagupta.com/using-custom-workbox-service-workers-with-create-react-app/

if ('function' === typeof importScripts) {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');
  importScripts('js/idb.js');

  let dbPromise = idb.open('post-store', 1, (db) => {
    if (!db.objectStoreNames.contains('posts')) {
      db.createObjectStore('posts', { keyPath: 'id' })
    }
  });

  /* global workbox */
  if (workbox) {
    console.log('5 Workbox is loaded');
    workbox.setConfig({ debug: false })

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([]);

    /* custom cache rules*/
    workbox.routing.registerNavigationRoute('/index.html', {
      blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
    });

    // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
    workbox.routing.registerRoute(
      /^https:\/\/fonts\.googleapis\.com/,
      new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
      })
    );

    // Cache the underlying font files with a cache-first strategy for 1 year.
    workbox.routing.registerRoute(
      /^https:\/\/fonts\.gstatic\.com/,
      new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new workbox.cacheableResponse.Plugin({
            statuses: [0, 200],
          }),
          new workbox.expiration.Plugin({
            maxAgeSeconds: 60 * 60 * 24 * 365,
            maxEntries: 30,
          }),
        ],
      })
    );

    workbox.routing.registerRoute(
      /index.html/,
      new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'html',
      })
    );

    workbox.routing.registerRoute(
      /\.(?:js|css|html)$/,
      new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'static-resources',
      })
    );

    // workbox.routing.registerRoute(
    //   /.*.firebaseio\.com.*/,
    //   new workbox.strategies.StaleWhileRevalidate({
    //     cacheName: 'posts',
    //   })
    // );

    workbox.routing.registerRoute(
      /^https:\/\/firebasestorage\.googleapis\.com/,
      new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'post-images',
      })
    );

    self.addEventListener('fetch', (event) => {
      const url = 'https://spot-pwa.firebaseio.com/posts';
      if (event.request.url.indexOf(url) > -1) {
        event.respondWith(
          fetch(event.request)
            .then((res) => {
              const cloned = res.clone();
              deletePostsFromIDB('posts', dbPromise)
                .then(() => {
                  return cloned.json()
                })
                .then((data) => {
                  for (let key in data) {
                    savePostsIntoIDB('posts', data[key], dbPromise)
                  }
                })
              return res
            })
            .catch((err) => console.log(err))
        )
      }
    })

    self.addEventListener('notificationclick', (e) => {
      const notification = e.notification;
      const action = e.action;
      console.log(notification);
      if (action === 'confirm') {
        console.log('confirm was chosen')
        notification.close();
      } else {
        console.log(action)
        e.waitUntil(clients.matchAll().then((clis) => {
          let client = clis.find((c) => {
            return c.visibilityState === 'visible'
          })

          if (client !== undefined) {
            client.navigate('https://totoczko.github.io/spotick/')
            client.focus()
          } else {
            clients.openWindow('https://totoczko.github.io/spotick/')
          }
          notification.close()
        }))
      }
    })

    self.addEventListener('push', (event) => {
      console.log('push notification received', event);

      let data = {
        title: 'New!',
        constent: 'New post on Spotick!'
      };
      if (event.data) {
        data = JSON.parse(event.data.text());
      }

      const options = {
        body: data.content,
        icon: 'img/icons/icon-96x96.png',
        vibrate: [100, 50, 200],
        badge: 'img/icons/icon-96x96.png',
        tag: 'new-post',
        renotify: true
      }
      event.waitUntil(
        self.registration.showNotification(data.title, options)
      )

    })

  } else {
    console.log('Workbox could not be loaded. No Offline support');
  }
}

const savePostsIntoIDB = (st, data, dbPromise) => {
  return dbPromise.then((db) => {
    let tx = db.transaction(st, 'readwrite');
    let store = tx.objectStore(st);
    store.put(data);
    return tx.complete;
  })
}

const deletePostsFromIDB = (st, dbPromise) => {
  return dbPromise.then((db) => {
    let tx = db.transaction(st, 'readwrite');
    let store = tx.objectStore(st);
    store.clear();
    return tx.complete;
  })
}

