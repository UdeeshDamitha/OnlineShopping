import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = (route, state) => {
  const authservice = inject(AuthService);
  const router_ = inject(Router);

  if(authservice.isLoggedIn())
    {
    router_.navigate([""]);
    }
  return true;
};
