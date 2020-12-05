import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class PhotoramaGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    if (this.authService.isLoggedIn) { 
      return true;
    }else{
      Swal.fire({
        position: 'top-start',
        icon: 'error',
        title: '<span class="text-white">Please login to access this page!</span>',
        showConfirmButton: false,
        timer: 1500,
        background: '#343a40',
        backdrop: false
      });
      this.router.navigate(['/login']);
      return false;
    }
  }
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    return this.canActivate(route, state);
  }

}

