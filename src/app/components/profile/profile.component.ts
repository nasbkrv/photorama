import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserSettings } from 'src/app/services/userSettings';
import { UserdataService } from '../../services/userdata.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [UserdataService]
})

export class ProfileComponent implements OnInit, OnDestroy {
  _userData = {};

  constructor(
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore,
    public authService: AuthService,
    public userService: UserdataService
  ) {

  }
  set userData(value) {
    this._userData = value;
  }
  get userData() {
    return this._userData;
  }
  ngOnInit() {
    this.userService.getLoggedInUserData().subscribe(data => {
      this.userData = data[0];
    })
  }
  ngOnDestroy() {

  }
}
