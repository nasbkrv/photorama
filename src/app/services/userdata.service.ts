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
  async uploadAvatar(path, uid): Promise<any> {
    const fileRef = this.fbStorage.ref(`/avatars/${uid}`)
    const usersRef = this.db.collection('users', ref => ref.where('uid', '==', uid));
    try {
      const res = await fileRef.put(path);
      fileRef.getDownloadURL().subscribe(url => {
        if (url) {
          usersRef.get().subscribe(data => {
            data.forEach(doc => {
              doc.ref.update({
                avatarUrl: url
              });
            });
          });
        }
      });
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: '<span class="text-white">Avagar changed succesfully!</span>',
        showConfirmButton: false,
        timer: 1500,
        background: '#343a40',
      });
    } catch (err) {
      Swal.fire({
        position: 'top-start',
        icon: 'error',
        title: `<span class="text-white">${err}</span>`,
        showConfirmButton: false,
        timer: 1500,
        background: '#343a40',
      });
    }
  }
 
  async uploadPhoto(path, uid): Promise<any> {
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
      if (file.type != 'image/jpeg' && file.type != 'image/png') {
        Swal.fire({
          position: 'top-start',
          icon: 'error',
          title: `<span class="text-white">Invalid file format for file ${file.name}!</span>`,
          showConfirmButton: false,
          timer: 1500,
          background: '#343a40',
        });
        return
      }
      const fileName = `${Date.now()}_${file.name}`
      const res = await storageRef
        .ref(`photos/${fileName}`)
        .put(file, metadata);
      uploadedFiles.push(res.state);

      storageRef
        .ref(`photos/${fileName}`)
        .getDownloadURL()
        .subscribe(url => {
          if (url) {
            usersRef.get().subscribe(data => {
              data.forEach(doc => {
                doc.ref.update({
                  photos: firebase.firestore.FieldValue.arrayUnion({
                    url,
                    path: fileName,
                    timeUploaded: res.metadata.timeCreated,
                    generation: res.metadata.generation,
                  })
                });
              });
            });
          }
        });
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: '<span class="text-white">Photos uploaded succesfully</span>',
        showConfirmButton: false,
        timer: 1500,
        background: '#343a40',
      });
      // if (uploadedFiles.length == fileList.length) {
      //   Swal.fire({
      //     position: 'top-end',
      //     icon: 'success',
      //     title: '<span class="text-white">Photos uploaded succesfully</span>',
      //     showConfirmButton: false,
      //     timer: 1500,
      //     background: '#343a40',
      //   });
      // }

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
