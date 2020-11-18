import { Component, OnInit } from '@angular/core';
import { UserdataService } from './services/userdata.service';

@Component({
  selector: 'app-root',
  template: `
          <!-- header -->
          <app-header></app-header>
          <!-- routes will be rendered here -->
          <router-outlet></router-outlet>

          <!-- footer -->
          <app-footer></app-footer>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  userData: any;

  constructor(
    public uData: UserdataService
  ) { }
  ngOnInit() {
    // this.uData.fetchUserData().then(data => {
    //   data.subscribe(res => { 
    //     this.userData = res[0];
    //    })
    // });
  }
}
