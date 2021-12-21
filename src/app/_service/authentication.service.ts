import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from './../../environments/environment.prod';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  pendingCred;
  email;
  externalProvider;

  private logStateSubject: BehaviorSubject<boolean>; // if login success, set true (Usage: auth guard)
  private showLoginPageSubject: BehaviorSubject<boolean>; // if login failed, set true (Usage: hide login page until login() is called)

  constructor(private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private zone: NgZone) {

    this.logStateSubject = new BehaviorSubject<boolean>(false);
    this.showLoginPageSubject = new BehaviorSubject<boolean>(false);

    firebase.initializeApp(environment.firebase);

    firebase.auth().onAuthStateChanged((user) => {
      console.log(JSON.stringify(this.getCurrentUser()));
      if (user && user.emailVerified) {
        // User is signed in.
        this.logStateSubject.next(true);
        this.loginRoute();
      } else {
        // No user is signed in.
        this.showLoginPageSubject.next(true);
      }
    });
  }

  // Check login state
  isLoginSuccess(): Observable<boolean> {
    return this.logStateSubject as Observable<boolean>;
  }


  // Show login page if first time login is called or logout
  showLoginPage(): Observable<boolean> {
    return this.showLoginPageSubject as Observable<boolean>;
  }


  // check currentUser
  getCurrentUser(): any {
    return firebase.auth().currentUser;
  }


  /* */
  //   register
  /* */
  registeredEmail(email: string, pwd: string): Promise<any> {
    return new Promise((resolve, rejects) => {
      firebase.auth().createUserWithEmailAndPassword(email, pwd)
      .then(() => {
        this.sendEmailVerification().then(
          (r) => {
            resolve(r);
          },
          (r) => {
            rejects(r);
          }
        );
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        rejects('errorCode: ' + errorCode + ', errorMessage: ' + errorMessage);
      });
    });
  }

  sendEmailVerification(): Promise<any> {
    return new Promise((resolve, rejects) => {
      const currentUser = firebase.auth().currentUser;
      currentUser.sendEmailVerification().then(() => {
        resolve('驗證信寄出');
      }, (error) => {
        rejects('驗證信錯誤: ' + error);
      });
    });
  }


  /* */
  //    loginEmail
  /* */
  emailLogin(email: string, pwd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, pwd)
      .then(() => {
        const isVertify = firebase.auth().currentUser.emailVerified;
        if (isVertify) {
          console.log(JSON.stringify(this.getCurrentUser()));
          resolve('Login successed');
        } else {
          reject('Not vertify');
        }
      })
      .catch((error) => {
        console.log(error.code + ': ' + error.message);
        reject('Login error');
      });
    });
  }


  /* */
  //    Provider login
  /* */
  providerLogin(providerName: string): Promise<string> {
    let provider;
    if (providerName === 'google') {
      provider = new firebase.auth.GoogleAuthProvider();
    } else if (providerName === 'fb') {
      provider = new firebase.auth.FacebookAuthProvider();
    }
    return this.signInPop(provider);
  }


  signInPop(provider: firebase.auth.AuthProvider): Promise<string> {

    return new Promise((resolve, reject) => {

      firebase.auth().signInWithPopup(provider)
      .then(() => {
        resolve('sign in pop successed!');
        this.zone.run(() => {
          this.loginRoute();
        });
      })
      .catch((error) => {
        // An error happened.
        if (error.code === 'auth/account-exists-with-different-credential') {
          this.pendingCred = error.credential;
          this.email = error.email;

          // Get sign-in methods for this email.
          firebase.auth().fetchSignInMethodsForEmail(this.email).then((methods) => {
            console.log('fetchSignInMethodsForEmail Method: ' + methods);
            if (methods[0] !== 'password') {
              this.externalProvider = methods[0];
            }
            const signInReject = { method: methods[0], email: this.email };
            reject(signInReject);
          });
        }
      });

    });
  }



  linkCreditEmail(password) {
      firebase.auth().signInWithEmailAndPassword(this.email, password).then((result) => {
        // !!!  user.linkWithCredential(pendingCred); 改成 result.user.linkWithCredential(pendingCred);
        return result.user.linkWithCredential(this.pendingCred);
      }).then(() => {
        console.log('linked to firebase successed!');
      });
  }



  linkCreditProvider() {
    firebase.auth().signInWithPopup(this.getProviderForProviderId(this.externalProvider)).then((result) => {
      result.user
          .linkAndRetrieveDataWithCredential(this.pendingCred)
          .then((usercred) => {
            console.log('usercred!' + JSON.stringify(usercred));
          });
    });
  }



  getProviderForProviderId(provider): any {
    if (provider === 'google.com') {
      return new firebase.auth.GoogleAuthProvider();
    } else if (provider === 'facebook.com') {
      return new firebase.auth.FacebookAuthProvider();
    }
  }



  /* */
  //    logout
  /* */
  logout() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      console.log('Sign-out successful.');
      this.logStateSubject.next(false);
      this.showLoginPageSubject.next(true);
      this.router.navigate(['/login']);
    }).catch((error) => {
      // An error happened.
      console.log('Sign-out error: ' + error);
    });
  }


  private loginRoute() {
    // get return url from route parameters or default to '/'
    const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
    console.log('loginRoute returnUrl: ' + returnUrl);
    this.logStateSubject.next(true);
    this.router.navigate([returnUrl]);
  }


}
