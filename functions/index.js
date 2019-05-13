const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const webpush = require("web-push");
const serviceAccount = require("./spotick-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spot-pwa.firebaseio.com"
});

// WEB
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


// ANDROID
exports.androidSendNotifications = functions.database.ref('/posts/{postUid}')
  .onWrite(async (change, context) => {
    const postUid = context.params.postUid;

    console.log('We have a new post UID:', postUid);

    // Get the list of device notification tokens.
    const getDeviceTokensPromise = admin.database().ref('/tokens').once('value');

    // Get the follower profile.
    const getPostPromise = admin.database().ref(`/posts/${postUid}`).once('value');

    // The snapshot to the user's tokens.
    let tokensSnapshot;

    // The array containing all the user's tokens.
    let tokens;

    const results = await Promise.all([getDeviceTokensPromise, getPostPromise]);
    tokensSnapshot = results[0];
    console.log(tokensSnapshot.val());
    const post = results[1].val();

    // Check if there are any device tokens.
    if (!tokensSnapshot.hasChildren()) {
      return console.log('There are no notification tokens to send to.');
    }
    console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');
    console.log('Fetched post', post);

    // Notification details.
    const payload = {
      notification: {
        title: "Nowy post!",
        body: "Na Spotick pojawił się nowy post od " + post.user.name + "!"
      }
    };

    // Listing all tokens as an array.
    tokens = Object.values(tokensSnapshot.val());
    // Send notifications to all tokens.
    const response = await admin.messaging().sendToDevice(tokens, payload);
    // For each message check if there was an error.
    const tokensToRemove = [];
    response.results.forEach((result, index) => {
      const error = result.error;
      if (error) {
        console.error('Failure sending notification to', tokens[index], error);
        // Cleanup the tokens who are not registered anymore.
        if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered') {
          // tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
        }
      }
    });
    return Promise.all(tokensToRemove);
  });