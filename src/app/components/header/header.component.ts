import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserdataService } from '../../services/userdata.service';
import { Router, ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  headerData;

  constructor(
    public authService: AuthService,
    public userService: UserdataService,
    public afAuth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { 
    this.afAuth.afAuth.authState.subscribe(user=>{
      if(user){
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
  ngOnInit(){    
    this.userService.getLoggedInUserData().subscribe(data => {      
      this.headerData = data[0];
    })
  }
}
