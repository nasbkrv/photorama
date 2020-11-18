import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserSettings } from 'src/app/services/userSettings';
import { UserdataService } from '../../services/userdata.service';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [UserdataService]
})

export class ProfileComponent implements OnInit, OnDestroy {
  _userData;
  userSettingsForm;
  constructor(
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore,
    public authService: AuthService,
    public userService: UserdataService,
    private formBuilder: FormBuilder
  ) {
    this.userSettingsForm = this.formBuilder.group({
      fullName: '',
      email: '',
      age: '',
      location: '',
      website: '',
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      flickr: ''
    })
  }
  set userData(value) {
    this._userData = value;
  }
  get userData() {
    return this._userData;
  }
  updateUserData(dataInput) {
    const usersRef = this.firestore.collection('users', ref => ref.where('email', '==', this.userData.email));
    let username;
    usersRef.get().subscribe(data => {
      data.forEach(doc => {
        doc.ref.update({ dataInput })
      })
    })
    this.userSettingsForm.reset();
  }
  ngOnInit() {
    this.userService.getLoggedInUserData().subscribe(data => {
      this.userData = data[0];
    })
  }
  ngOnDestroy() {

  }
}
