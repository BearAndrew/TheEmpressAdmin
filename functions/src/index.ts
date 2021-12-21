import * as functions from "firebase-functions";
import * as cors from "cors";
import * as admin from "firebase-admin";

const serviceAccount = require("../service-account-key.json");
const corsHandler = cors({origin: true});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// function callable 可呼叫函式
export const test = functions.https.onRequest((request, response) => {
  console.log("test deploy");
  return corsHandler(request, response, () => {
    return response.status(200).send({test: "測試001"});
  });
});


// function trigger 觸發後台
export const newUser = functions.firestore
    .document("users/{userId}").onCreate((snap, context) => {
      const nowData = snap.data();
      console.log(nowData);

      // get token collection ref
      const adminCollecRef =
      admin.firestore().collection("admin");

      return adminCollecRef.get()
          .then((querySnapshot) => {
            const fcmTokens: any[] = [];
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              fcmTokens.push(doc.data().fcmToken);
            });

            const payload = {
              "data": {
                "body": "使用者名稱: " + nowData.name,
                "title": "有新的使用者",
                "click_action": "http://localhost:4200/",
              },
            };

            return admin.messaging().sendToDevice(fcmTokens, payload)
                .then((response) => {
                  console.log("response : " + response);
                });
          });
    });

