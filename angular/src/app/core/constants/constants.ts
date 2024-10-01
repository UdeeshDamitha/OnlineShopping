import { HttpClient } from '@angular/common/http';
import { ApiResponse, ConfirmEmail, LoginPayload, RegisterPayload, User } from '../model/common.model';

const apiUrl = 'http://localhost:5296/api';



export const LocalStorage = {
    token:'USER_TOKEN',
    user: 'Full_Name' ,
    email: 'Email' ,    
}

let emailGet = localStorage.getItem(LocalStorage.email);
console.log("ASSS", emailGet);

export const ApiEndpoint = {
    
    Auth:{
        Login: apiUrl+'/Account/login',
        Register: apiUrl+'/Account/register',
        RefreshUserToken:'${apiUrl}/Account/refresh-user-token',
        resetpassword: '${apiUrl}/Account/reset-password',
        forgotpassword: '${apiUrl}/Account/forgot-username-password',
        confirmemail: apiUrl+'/Account/ConfirmEmail-email',
        chekemail: apiUrl+'/Account/chek-email',
        resendemail: apiUrl+'/Account/resend-email-confirmation-link/'+emailGet 
    },

  
};

