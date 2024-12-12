import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppStore } from '@client/store/store';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  router: Router = inject(Router);
  appState = inject(AppStore);

  canActivate(): boolean {
    if (this.appState.user.isAuthenticated?.()) {
      return true;
    } else {
      this.router.navigate(['/user']);
      return false;
    }
  }
}
