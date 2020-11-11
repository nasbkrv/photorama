import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunityComponent } from './components/community/community.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NewComponent } from './components/new/new.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { PhotoramaGuard } from './guards/photorama.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [PhotoramaGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
  ,
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'community',
    component: CommunityComponent
  },
  {
    path: 'new',
    component: NewComponent
  }
];

@NgModule({
  declarations:[],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
