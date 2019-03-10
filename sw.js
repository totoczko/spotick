importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);

    workbox.precaching.precacheAndRoute([]);

    // importScripts(
    //     "/precache-manifest.5683773f26cb2d8ce534cde80cf446ce.js"
    // );

    workbox.clientsClaim();

    /**
     * The workboxSW.precacheAndRoute() method efficiently caches and responds to
     * requests for URLs in the manifest.
     * See https://goo.gl/S9QRab
     */
    self.__precacheManifest = [].concat(self.__precacheManifest || []);
    workbox.precaching.suppressWarnings();
    workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

    workbox.routing.registerNavigationRoute("/index.html", {
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

} else {
    console.log(`Boo! Workbox didn't load 😬`);
}

