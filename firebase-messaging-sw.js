 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here, other Firebase libraries
 // are not available in the service worker.
 importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js');
 // Initialize the Firebase app in the service worker by passing in
 // your app's Firebase config object.
 // https://firebase.google.com/docs/web/setup#config-object
 firebase.initializeApp({
     apiKey: "AIzaSyBnt8_3ZZ5Ecc-ilv5R5G3vxnaGDQ7EFcU",
     authDomain: "api-project-497107177659.firebaseapp.com",
     databaseURL: "https://api-project-497107177659.firebaseio.com",
     projectId: "api-project-497107177659",
     storageBucket: "api-project-497107177659.appspot.com",
     messagingSenderId: "497107177659",
     appId: "1:497107177659:web:d028961ced463cdaf7999e"
 });


 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 // [END initialize_firebase_in_sw]

 if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });
  }

 //#region notifiction點擊事件
 var click_action;

 // 監聽notifiction點擊事件
 self.addEventListener('notificationclick', function(event) {
   var url = click_action;
   event.notification.close();
   event.waitUntil(
     clients.matchAll({
       type: 'window'
     }).then(windowClients => {
       // 如果tab是開著的，就 focus 這個tab
       for (var i = 0; i < windowClients.length; i++) {
         var client = windowClients[i];
         if(client.url === url && 'focus' in client) {
           return client.focus();
         }
       }
       // 如果沒有，就新增tab
       if(clients.openWindow) {
         return clients.openWindow(click_action);
       }
     })
   );
 });
 //#endregion



// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
        icon: '/firebase-logo.png'
    };

    click_action = payload.data.click_action;

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
// [END background_handler]
