import { Component, OnInit } from '@angular/core';
import { UserdataService } from '../../services/userdata.service'
@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {
  users: any = [];
  objectKeys = Object.keys;
  showSpinner: boolean = true;

  constructor(
    public userService: UserdataService
  ) {

  }
  hideSpinner() {
    this.showSpinner = false;
  }
  
  ngOnInit() {
    this.userService.getAllUsers().subscribe(data => {
      data.forEach(doc => {
        this.users.push(doc.data())
      });
      // SORT BY FOLLOWERS COUNT DESC
      this.users.sort((a,b)=>{
        return b.metrics.followers.length - a.metrics.followers.length;
      })
    })
  }
}
