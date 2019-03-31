const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const webpush = require("web-push");
const serviceAccount = require("./spotick-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spot-pwa.firebaseio.com"
});

exports.sendNotifications = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    webpush.setVapidDetails(
      'mailto:test@test.pl',
      'BCpge7IV7kIBHpMQ1ahqFVC0TzobN3sqkN_C5hk3LTrU5ytxj4o2ozTA_vxU-ZHZW8HW0Ldw9JJPfLX6hg-lPkA',
      '52hq0m6auAORzXwI46Os-a6wyxvKtH5B2-IkVfXn2JE');
    const from = request.body.from;
    const subscriptions = request.body.subscriptions;

    subscriptions.forEach((sub) => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.keys.auth,
          p256dh: sub.keys.p256dh
        }
      };

      webpush.sendNotification(
        pushConfig,
        JSON.stringify({
          title: "Nowy post!",
          content: "Na Spotick pojawił się nowy post od " + from.name + "!",
          openUrl: "/help"
        })
      ).catch((err) => {
        return response.status(500).json({ error: err });
      });

    });

    return response.status(200).json({ message: "Data stored" });

  }).catch((err) => {
    return response.status(500).json({ error: err });
  });

});