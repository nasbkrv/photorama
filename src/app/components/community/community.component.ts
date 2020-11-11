import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {
  users = [];
  constructor() {
    this.users = [
      { 
        username: '@nasbkrv',
        avatarUrl:'../../../assets/images/IMG_20180422_101206_263.jpg',
        photos:'420',
        followers:'24022'
      },
      { 
        username: '@nasbkrv2',
        avatarUrl:'../../../assets/images/IMG_20180422_101206_263.jpg',
        photos:'420',
        followers:'24022'
      },
      { 
        username: '@nasbkrv',
        avatarUrl:'../../../assets/images/IMG_20180422_101206_263.jpg',
        photos:'420',
        followers:'24022'
      },
      { 
        username: '@nasbkrv',
        avatarUrl:'../../../assets/images/IMG_20180422_101206_263.jpg',
        photos:'420',
        followers:'24022'
      },
      { 
        username: '@nasbkrv',
        avatarUrl:'../../../assets/images/IMG_20180422_101206_263.jpg',
        photos:'420',
        followers:'24022'
      },
    ]
  }

  ngOnInit(): void {
  }

}
