import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  constructor(
    public afAuth: AuthService
  ) { }

  resendVerifyEmail(){
    this.afAuth.afAuth.currentUser.then(user=>{
      user.sendEmailVerification()
    })
  }
  ngOnInit() {
  }

}
