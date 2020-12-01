import { Component, Directive, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { UserdataService } from '../../services/userdata.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import jwtDecode from 'jwt-decode';
import firebase from 'firebase/app';
import Swal from 'sweetalert2';

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
  isUserFollowing: boolean = false;
  currentAuthUserId;

  constructor(
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore,
    public authService: AuthService,
    public userService: UserdataService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public storage: AngularFireStorage
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
  hideSpinner() {
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

  followUser(userToFollow) {
    const userRef = this.firestore.collection('users').doc(userToFollow);
    let followUserId = this.userData.uid;
    let currentUserRef = this.firestore.collection('users', ref => ref.where('uid', '==', this.currentAuthUserId));

    userRef.get().subscribe(data => {
      data.ref.update({
        "metrics.followers":
          firebase.firestore.FieldValue.arrayUnion(this.currentAuthUserId)
      })
      this.isUserFollowing = true;
    })
    currentUserRef.get().subscribe(data => {
      data.forEach(doc => {
        doc.ref.update({
          "metrics.following":
            firebase.firestore.FieldValue.arrayUnion(followUserId)
        })
      })
    })
  }
  unfollowUser(userToUnfollow) {
    const userRef = this.firestore.collection('users').doc(userToUnfollow);
    const currentUserRef = this.firestore.collection('users', ref => ref.where('uid', '==', this.currentAuthUserId));

    userRef.get().subscribe(data => {
      data.ref.update({
        "metrics.followers":
          firebase.firestore.FieldValue.arrayRemove(this.currentAuthUserId)
      })
      this.isUserFollowing = false;
    })
    currentUserRef.get().subscribe(data => {
      data.forEach(doc => {
        doc.ref.update({
          "metrics.following":
            firebase.firestore.FieldValue.arrayRemove(userToUnfollow)
        })
      })
    })
  }
  deletePhoto(imageUrl) {
    const photosRef = this.storage.ref(`photos/${imageUrl}`);
    const currentUserRef = this.firestore.collection('users', ref => ref.where('uid', '==', this.currentAuthUserId));

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-1',
        cancelButton: 'btn btn-danger mx-1'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        photosRef
        .delete()
        .toPromise()
        .then((res)=>{

          currentUserRef
          .get()
          .subscribe(data => {
            data.forEach(doc => {
              const photosArr = doc.data().photos;
              const filtered = photosArr.filter((el)=> {return el.path != imageUrl}) 
              
              doc.ref.update({
                "photos":
                  filtered
              })
            })
          }) 
        })
        .then(()=>{
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        })
        .catch(err=>{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err 
          })
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {

        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }
  ngOnInit() {
    this.userData = this.userService.getSingleUserData(this.uidQuery).subscribe((data: any) => {
      this.userData = data;
      this.userData.photos.sort((a,b):any=>{
        return b.generation - a.generation;
      })
      if (this.userData.metrics.followers.includes(this.currentAuthUserId)) {
        this.isUserFollowing = true;
      }
      const token = localStorage.getItem('user');
      const decodedToken: any = jwtDecode(token);
      this.currentAuthUserId = decodedToken.user_id;

      if (this.currentAuthUserId == data.uid) {
        this.isSameUser = true;
      } else {
        this.isSameUser = false;
      }

    })
    this.userService.getLoggedInUserData().subscribe(data => {
      this.userService.uServiceData = data[0];
    })

  }
  ngOnDestroy() {

  }
}
