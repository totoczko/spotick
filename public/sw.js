// importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.1.1/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);

    workbox.precaching.precacheAndRoute([]);

    importScripts(
        "/precache-manifest.382c71bb3ec4cfa10f59f8ca02c86d20.js"
    );

    workbox.clientsClaim();

    /**
     * The workboxSW.precacheAndRoute() method efficiently caches and responds to
     * requests for URLs in the manifest.
     * See https://goo.gl/S9QRab
     */
    self.__precacheManifest = [].concat(self.__precacheManifest || []);
    workbox.precaching.suppressWarnings();
    workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

    workbox.routing.registerNavigationRoute("./index.html", {
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
        /\.(?:png|gif|jpg|jpeg|svg)$/,
        new workbox.strategies.CacheFirst({
            cacheName: 'images',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
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

    workbox.routing.registerRoute(
        /.*.firebaseio\.com.*/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'posts',
        })
    );

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
    console.log(`Boo! Workbox didn't load 😬`);
}

