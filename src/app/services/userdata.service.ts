import { Injectable, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../services/user'
@Injectable()

export class UserdataService implements OnInit {
  userData = {};
  
  constructor(
    public db: AngularFirestore
  ) { }

  getUserData() {
    return this.userData;
  }
 
  getLoggedInUserData() {
    const token = localStorage.getItem('user');
    const decodedToken: User = jwtDecode(token);
    const userEmail = decodedToken.email;
 
    if (token != null) {
      return this.db.collection('users', ref => ref.where('email', '==', userEmail)).valueChanges();
    }
  }

  ngOnInit() {

  }
}
