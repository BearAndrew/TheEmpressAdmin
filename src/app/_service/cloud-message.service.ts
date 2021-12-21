import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { environment } from './../../environments/environment.prod';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CloudMessageService {
  //收到訊息事件
  currentMessage = new BehaviorSubject(null);
  //Firebase物件
  firebaseApp = null;
  messaging = null;
  fcmToken = null;

  //private _auth: AuthService,private _http: BaseHttpService
  constructor(
    private firestore: AngularFirestore,
    private authenticationService: AuthenticationService) {
    //初始化 Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
    } else {
      firebase.app(); // if already initialized, use that one
    }

    this.messaging = firebase.messaging();
    //Token更新事件
    this.messaging.onTokenRefresh(() => {
      this.messaging.getToken().then((refreshedToken) => {
        console.log(`Token更新觸發:${refreshedToken}`);
        this.updateToken(refreshedToken);

      }).catch((err) => {
        console.log('無法取得更新Token', err);
      });
    });
    //收到訊息事件(前景)
    this.messaging.onMessage((payload) => {
      console.log('收到訊息:', payload);
      this.currentMessage.next(payload);
    });

  }

  //要求同意推播授權
  getPermission() {
    this.messaging.requestPermission()
      .then(() => {
        console.log('允許推播!');
        return this.messaging.getToken();
      })
      .then(token => {
        this.updateToken(token);
      })
      .catch((err) => {
        console.log('不允許推播', err);
      });
  }

  //更新Token
  updateToken(fcmToken) {
    this.fcmToken = fcmToken;
    const uid = this.authenticationService.getCurrentUser().uid;
    this.firestore.collection('admin').doc(uid)
    .set({fcmToken: fcmToken}, {merge: true}).then(() => {
      console.log(`token已寫入:${fcmToken}`);
    });
    console.log(`token已取得:${fcmToken}`);
  }
}
