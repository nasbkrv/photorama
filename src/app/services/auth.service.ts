import { Injectable, NgZone, OnDestroy, OnInit } from '@angular/core';
import { User } from "../services/user";
import { UserSettings } from "../services/userSettings";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";

@Injectable()

export class AuthService {
  userData: User; // Save logged in user data
  get data(){
    return this.userData;
  }
  set data(value){
    this.userData = value;
  }
  constructor(
    public firestore: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone// NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.data = user;
        user.getIdToken()
          .then(token => {
            localStorage.setItem('user', token);
          })
      } else {
        localStorage.setItem('user', null);
      }
    })
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['profile']);
        });
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Sign up with email/password
  async SignUp(username, fullName, email, password) {
    const usersDbRef = this.firestore.collection('users');
    const checkUserDoc = await usersDbRef.doc(username).get();

    if (!(await checkUserDoc.toPromise()).exists) {
      this.afAuth.createUserWithEmailAndPassword(email, password)
        .then(async (cred) => {
          const data: UserSettings = {
            uid: cred.user.uid,
            fullName: fullName,
            email: email,
            age: '',
            location: '',
            photos: {},
            metrics: {
              followers: [],
              following: []
            },
            socials: {
              facebook: '',
              instagram: '',
              twitter: '',
              youtube: '',
              flickr: '',
            }
          }
          await this.addFsUser(username, data);
          this.SignOut();
          this.router.navigate(['login'])

        }).catch((error) => {
          window.alert(error.message)
        })
    } else {
      window.alert('Username exists')
    }
  }


  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error)
      })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    let userToken = localStorage.getItem('user');
    if (userToken === 'null') {
      userToken = JSON.parse(userToken)
    }
    return userToken == null ? false : true;
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    }
    return userRef.set(userData, {
      merge: true
    })
  }
  async addFsUser(username: string, data: UserSettings) {
    await this.firestore.collection('users').doc(username).set(data)
  }
  // Sign out 
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['']);
    })
  }
}