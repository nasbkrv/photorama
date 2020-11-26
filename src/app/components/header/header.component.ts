import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserdataService } from '../../services/userdata.service';
import { Router, ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  headerData;
  isEmailVerified: boolean = true;
  filesPath;
  constructor(
    public userService: UserdataService,
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.authService.afAuth.authState.subscribe(user => {
      if (user) {
        this.ngOnInit()
      }
    })
  }

  get isLoggedIn(): boolean {
    let userToken = localStorage.getItem('user');
    if (userToken === 'null') {
      userToken = JSON.parse(userToken)
    }
    return userToken == null ? false : true;
  }
  checkEmailVerify() {
    return this.authService.afAuth
      .currentUser
      .then(user => {
        if (user != null && user.emailVerified) {
          this.isEmailVerified = true;
        }else{
          this.isEmailVerified = false;
        }
      })
  }
  openFileDialog(){
    document.getElementById('photoUpload').click()
  }
  uploadEvent(event) {    
    this.userService.uploadPhoto(event,this.headerData.uid)
  }
  ngOnInit() {
    this.userService.getLoggedInUserData().subscribe(data => {
      this.headerData = data[0];
    })
    this.checkEmailVerify();
  }
}
