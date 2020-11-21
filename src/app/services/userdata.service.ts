import { Injectable, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../services/user'
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()

export class UserdataService implements OnInit {
  avatarPath: string;
  uServiceData;
  constructor(
    public db: AngularFirestore,
    public fbStorage: AngularFireStorage,
    public firestore: AngularFirestore,
    private router: Router
  ) {

  }

  getLoggedInUserData() {
    const token = localStorage.getItem('user');
    if(token=='null'){
      return new Observable
    }
    const decodedToken: User = jwtDecode(token);
    const userEmail = decodedToken.email;
    if (token != null) {
      return this.db.collection('users', ref => ref.where('email', '==', userEmail)).valueChanges();
    }
  }
  getSingleUserData(username) {
    return this.db.collection('users').doc(username).valueChanges()
  }
  uploadAvatar(path, uid) {
    const fileRef = this.fbStorage.ref(`/avatars/${uid}`)
    const usersRef = this.firestore.collection('users', ref => ref.where('email', '==', this.uServiceData.email));
    fileRef.put(path).then((res) => {
      fileRef.getDownloadURL().subscribe(url => {
        if (url) {
          usersRef.get().subscribe(data => {
            data.forEach(doc => {
              doc.ref.update({
                avatarUrl: url
              })
            })
          })
        }
      })
    }).catch((err) => {
      alert(err)
    });
  }

  ngOnInit() {

  }
}
