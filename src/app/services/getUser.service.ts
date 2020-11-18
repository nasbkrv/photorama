import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { AuthService } from './auth.service';
@Injectable()

export class UserService {
  users: Observable<any>;
  
  constructor(
    public db: AngularFirestore,
    public authService: AuthService,
    public app: AppComponent
  ) {
    
    this.users = this.db.collection('users', ref => ref.where('email', '==', this.userEmail)).valueChanges();
  }
  get userEmail(){
    return this.app.userData.email;
  }
  getUser() {
    return this.users;
  }
}
