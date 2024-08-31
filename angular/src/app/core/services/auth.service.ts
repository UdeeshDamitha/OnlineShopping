import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { register } from 'module';
import { ApiResponse, LoginPayload, RegisterPayload, User } from '../model/common.model';
import { ApiEndpoint, LocalStorage } from '../constants/constants';
import { catchError, map, Observable, throwError } from 'rxjs';
import { error } from 'console';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = signal<boolean>(false);
  router_ = inject(Router);

  constructor(private _http: HttpClient) { 
    if(this.getUserToken()){
      this.isLoggedIn.update(()=>true);
    }
  }

  register(payload :RegisterPayload){
    return this._http.post<ApiResponse<User>>(
      ApiEndpoint.Auth.Register, payload
    );
  }


  login(payload: LoginPayload){
    return this._http.post<ApiResponse<User>>(
     ApiEndpoint.Auth.Login, payload, { withCredentials: true }
    ).pipe(map(response => {
      if(response && response.jwt){
        console.log(response);
        localStorage.setItem(LocalStorage.token, response.jwt);
        localStorage.setItem(LocalStorage.user, response.firstName +' '+ response.lastName);
        this.isLoggedIn.update(()=>true);
        this.router_.navigate([""]);
      }
      return response.data
    }),  
  catchError(error =>{
    console.error('Login fail', error);
    return throwError(() => new Error('Login failed, please try again.'));
  }));
  }

  logout(){
    localStorage.removeItem(LocalStorage.token);
    this.isLoggedIn.update(()=>false);
    this.router_.navigate(["auth/signin"])
  }

  getUserToken(){
    return localStorage.getItem(LocalStorage.token);
  }

  getUserName(){
    return localStorage.getItem(LocalStorage.user);
  }

  refreshUserToken(){
    return this._http.get<ApiResponse<User>>(
      '${ApiEndpoint.Auth.RefreshUserToken}'
    );
  }


}
