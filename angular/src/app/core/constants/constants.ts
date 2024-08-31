const apiUrl = 'http://localhost:5296/api';

export const ApiEndpoint = {
    Auth:{
        Login: apiUrl+'/Account/login',
        Register: apiUrl+'/Account/register',
        RefreshUserToken:'${apiUrl}/Account/refresh-user-token'
    }
};

export const LocalStorage = {
    token:'USER_TOKEN',
    user: 'Full_Name'  
}