import { Injectable, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import firebase from 'firebase/app';
@Injectable()

export class UserdataService implements OnInit {
  avatarPath: string;
  uServiceData;
  uploads;
  downloadUrls;
  uploadPercent;
  constructor(
    public db: AngularFirestore,
    public fbStorage: AngularFireStorage,
    private router: Router
  ) {

  }
  // GET DATA FOR THE CURRENT USER WITH THE TOKEN
  getLoggedInUserData() {
    const token = localStorage.getItem('user');
    if (token == 'null') {
      return new Observable
    }
    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.user_id;
    if (token != null) {
      return this.db.collection('users', ref => ref.where('uid', '==', userId)).valueChanges();
    }
  }
  // GET DATA FOR SINGLE USER
  getSingleUserData(username) {
    return this.db.collection('users').doc(username).valueChanges()
  }

  // UPLOAD AVATAR TO USER ACCOUNT
  uploadAvatar(path, uid) {
    const fileRef = this.fbStorage.ref(`/avatars/${uid}`)
    const usersRef = this.db.collection('users', ref => ref.where('uid', '==', uid));
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
  uploadPhoto(path, uid) {
    let uploadedFiles = [];
    const fileList = path.target.files;
    const storageRef = this.fbStorage;
    const usersRef = this.db.collection('users', ref => ref.where('uid', '==', uid));
    const metadata = {
      customMetadata: {
        'owner': uid
      }
    }
    for (let file of fileList) {
      const fileName = `${Date.now()}_${file.name}`
      storageRef
        .ref(`photos/${fileName}`)
        .put(file, metadata)
        .then(res => {
          uploadedFiles.push(res.state)
          storageRef.ref(`photos/${fileName}`)
            .getDownloadURL().subscribe(url => {
              if (url) {
                usersRef.get().subscribe(data => {
                  data.forEach(doc => {
                    doc.ref.update({
                      photos:
                        firebase.firestore.FieldValue.arrayUnion(url)
                    })
                  })
                })
              }
            })
        })
        .then(state => {
          if (uploadedFiles.length == fileList.length) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: '<span class="text-white">Photos uploaded succesfully</span>',
              showConfirmButton: false,
              timer: 1500,
              background: '#343a40',
            })
          }
        })

    }
  }
  getAllUserPhotos(uid) {
    const userRef = this.db.collection('users', ref => ref.where('uid', '==', uid))
    userRef
      .get()
      .forEach(user => {
        user.docs.forEach(doc => {
          return doc.data().photos;
        })
      })
  }
  getAllUsers() {
    return this.db.collection('users', ref => ref.orderBy('metrics.followers', 'asc')).get();
  }

  ngOnInit() {

  }
}
