import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const authservice = inject(AuthService);
  const router_ = inject(Router);

  if(!authservice.isLoggedIn())
    {
    router_.navigate(["auth/signin"]);
    }
  return true;
};
