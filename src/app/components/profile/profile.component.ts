import { Component, Directive, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserdataService } from '../../services/userdata.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { User } from '../../services/user';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [UserdataService, FormsModule]
})

export class ProfileComponent implements OnInit, OnDestroy {
  _userData;
  avatarPath: string;
  subscribtion: Subscription;
  uidQuery: string;
  showSpinner: boolean = true;
  isSameUser: boolean = false;
  
  constructor(
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore,
    public authService: AuthService,
    public userService: UserdataService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscribtion = activatedRoute.params.subscribe((param) => {
      this.uidQuery = param['id'];
      this.ngOnInit()
    })
  }

  set userData(value) {
    this._userData = value;
  }
  get userData() {
    return this._userData;
  }
  hideSpinner(){
    this.showSpinner = false;
  }
  updateUserData(userSettingsForm: NgForm) {
    const usersRef = this.firestore.collection('users', ref => ref.where('email', '==', this.userData.email));
    const formData = userSettingsForm.form.value;

    usersRef.get().subscribe(data => {
      data.forEach(doc => {
        doc.ref.update({
          fullName: formData.fullName,
          email: formData.email,
          age: formData.age,
          location: formData.location,
          socials: {
            facebook: formData.facebook,
            instagram: formData.instagram,
            twitter: formData.twitter,
            youtube: formData.youtube,
            flickr: formData.flickr
          },
          website: formData.website,
          bio: formData.bio
        })
      })
    })
  }
  uploadEvent(event) {
    this.avatarPath = event.target.files[0];
    this.userService.uploadAvatar(this.avatarPath, this.userData.uid);
  }
  ngOnInit() {    
    this.userData = this.userService.getSingleUserData(this.uidQuery).subscribe((data : any) => {
      this.userData = data;
      const token = localStorage.getItem('user');
      const decodedToken: any = jwtDecode(token);
      const authUser = decodedToken.user_id;
  
      if(authUser == data.uid){
        this.isSameUser = true;
      }else{
        this.isSameUser = false;
      }
    })

  }
  ngOnDestroy() {

  }
}
