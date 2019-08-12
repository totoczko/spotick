//https://karannagupta.com/using-custom-workbox-service-workers-with-create-react-app/

if ('function' === typeof importScripts) {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');
  importScripts('js/idb.js');

  let dbPromise = idb.open('post-store', 1, (db) => {
    if (!db.objectStoreNames.contains('posts')) {
      db.createObjectStore('posts', { keyPath: 'data' })
    }
  });

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded');
    workbox.setConfig({ debug: false })

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([
  {
    "url": "img/icons/android-chrome-512x512.png",
    "revision": "ee14056b2f247b0c24b35436e05f4bff"
  },
  {
    "url": "img/icons/favicon.png",
    "revision": "4324d8245d6dd1cb58d179ed5313fadc"
  },
  {
    "url": "img/icons/icon-128x128.png",
    "revision": "c25be1ba2fd6249d9cc54e463a19b8dc"
  },
  {
    "url": "img/icons/icon-144x144.png",
    "revision": "7ce45583d1d5f4c024ade4d9874290fc"
  },
  {
    "url": "img/icons/icon-152x152.png",
    "revision": "6c58e57d7b883b237ca161eb513d69a8"
  },
  {
    "url": "img/icons/icon-192x192.png",
    "revision": "4751e1fbca2165dfc5e45c43ce07ffcb"
  },
  {
    "url": "img/icons/icon-384x384.png",
    "revision": "e933b0150332ba79bc751c8d56e6aa90"
  },
  {
    "url": "img/icons/icon-512x512.png",
    "revision": "1c343d7b194ec6e907d4e88ee68678f2"
  },
  {
    "url": "img/icons/icon-72x72.png",
    "revision": "b1daa0f24a5c29b1dc7e413b6a7b88c2"
  },
  {
    "url": "img/icons/icon-96x96.png",
    "revision": "2c67d4cf71981ee34f171c151da0ff88"
  },
  {
    "url": "index.html",
    "revision": "46136b39a308bae9404a504c1d065f5c"
  },
  {
    "url": "js/idb.js",
    "revision": "ece273ebfe24fa7cb44aa0f5c3fe0aaa"
  },
  {
    "url": "precache-manifest.b99b41d4c697a60921f4571124ab4e66.js",
    "revision": "b99b41d4c697a60921f4571124ab4e66"
  },
  {
    "url": "service-worker.js",
    "revision": "ccb47d91fe07466e8b5a86bc3b3f8720"
  },
  {
    "url": "static/css/main.644302f6.chunk.css",
    "revision": "a3eee45ab498cb7255ce23f3d701b402"
  },
  {
    "url": "static/js/main.4950b380.chunk.js",
    "revision": "1f0e187d1e2cebb210983273ca38da6d"
  },
  {
    "url": "static/js/runtime~main.0f559a56.js",
    "revision": "87c3aa95b5d068eef14d46b378c7d0e7"
  }
]);

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
              if (event.request.url.indexOf('posts.json') > -1) {
                deletePostsFromIDB('posts', dbPromise).then(() => {
                  return cloned.json()
                })
                  .then((data) => {
                    for (let key in data) {
                      savePostsIntoIDB('posts', data[key], dbPromise)
                    }
                  })
              }
              return res
            })
            .catch((err) => console.log(err))
        )
      }
    })

    self.addEventListener('notificationclick', (e) => {
      const notification = e.notification;
      const action = e.action;
      if (action === 'confirm') {
        notification.close();
      } else {
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

