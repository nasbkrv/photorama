import { Component, NgModule, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
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
    public uService: UserdataService
  ) { }


  getNewPhotos() {
    const storage = firebase.app().storage('gs://photorama-a622d.appspot.com/');
    const storageRef = storage.ref();
    const listRef = storageRef.child('photos/');
    listRef.list({ maxResults: 20 })
      .then(photos => {
        return Promise.all(
          photos.items.map(photo => {
            return Promise.all([photo.getDownloadURL(), photo.getMetadata()])
          })
        )
      }).then(prom => {
        let obj:any = {};
        prom.map(arrays => {
          obj = arrays[1];
          obj.url = arrays[0];
          this.newPhotos.push(obj)
        })
      }).then(res=>{
        console.log(this.newPhotos);
        
        this.newPhotos.sort((a,b):any=>{
          return b.generation - a.generation;
        })
      })
  }
  hideSpinner() {
    this.showSpinner = false;
  }
  ngOnInit() {
    this.getNewPhotos()
  }
}
