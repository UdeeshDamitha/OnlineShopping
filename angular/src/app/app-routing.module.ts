// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/analytics',
        pathMatch: 'full'
      },
      {
        path: 'analytics',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component')
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/chart & map/core-apex.component')
      },
      {
        path: 'forms',
        loadComponent: () => import('./demo/forms & tables/form-elements/form-elements.component')
      },
      {
        path: 'tables',
        loadComponent: () => import('./demo/forms & tables/tbl-bootstrap/tbl-bootstrap.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/sample-page/sample-page.component')
      }    
    ]
  },
  {
    path: '',
    //path: 'protected', component: GuestComponent, canActivate: [AuthGuard] ,
    component: GuestComponent,    
  
    children: [
      {       
        path: 'auth/signup',
        canActivate: [guestGuard],
        loadComponent: () => import('./pages/authentication/sign-up/sign-up.component')
      },
      {
        path: 'auth/signin',
        canActivate: [guestGuard],
        loadComponent: () => import('./pages/authentication/sign-in/sign-in.component')
      },
      {
        path: 'auth/confirm-email',
        canActivate: [guestGuard],
        //component: ConfirmEmailComponent,
        loadComponent: () => import('./pages/authentication/confirm-email/confirm-email.component')
      },
      {
        path: 'auth/send-email/:mode',
        canActivate: [guestGuard],
        //component: ConfirmEmailComponent,
        loadComponent: () => import('./pages/authentication/send-email/send-email.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
