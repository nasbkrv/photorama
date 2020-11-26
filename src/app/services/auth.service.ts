import { Injectable, NgZone, OnDestroy, OnInit } from '@angular/core';
import { User } from "../services/user";
import { UserSettings } from "../services/userSettings";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";

@Injectable()

export class AuthService {

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
          this.router.navigate(['/']);
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
            username: username,
            fullName: fullName,
            email: email,
            age: '',
            location: '',
            photos: [],
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
            },
            website: '',
            bio: '',
            avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/photorama-a622d.appspot.com/o/avatars%2Ficon-user-default.png?alt=media&token=e64728fb-c3b2-4484-a00b-1cfdfd03657c'
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