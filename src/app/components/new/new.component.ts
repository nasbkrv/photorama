import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserdataService } from '../../services/userdata.service';
import firebase from 'firebase/app';
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})

export class NewComponent implements OnInit {
  newPhotos: any = [

  ]
  showSpinner: boolean = true;
  constructor(
    public afStorage: AngularFireStorage,
    public uService: UserdataService,
    public db: AngularFirestore
  ) { }

  async getNewPhotos(): Promise<any> {
    const storageRef = firebase.app().storage('gs://photorama-a622d.appspot.com/').ref();
    const listRef = storageRef.child('photos/');
    const photos = await listRef.list();
    const response = await Promise.all(
      photos.items.map(photo => {
        return Promise.all([photo.getDownloadURL(), photo.getMetadata()]);
      })
    );
    let obj: any = {};
    response.map(arrays => {
      obj = arrays[1];
      obj.url = arrays[0];
      this.newPhotos.push(obj);
    });
    this.newPhotos.map(photo => {

      const userRef = this.db.collection('users', ref => ref.where('uid', '==', photo.customMetadata.owner));
      userRef
        .get()
        .subscribe((user) => {
          user.docs.map((doc) => {
            Object.assign(photo, { username: doc.data().username, avatarUrl: doc.data().avatarUrl})
          });
        })
    })
    this.newPhotos.sort((a, b): any => {
      return b.generation - a.generation;
    });
  }

  hideSpinner() {
    this.showSpinner = false;
  }
  ngOnInit() {
    this.getNewPhotos()
  }
}
