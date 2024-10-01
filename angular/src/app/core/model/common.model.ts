export interface User{
    email : string;   
    name : string;
}

export interface LoginPayload{
    username : string;
    password : string;
}

export interface RegisterPayload{
    firstname : string;
    lastname : string;
    email : string;
    password : string;
}

export interface ApiResponse<T>{
    status? : boolean;
    message? : string;
    error? : string;
    jwt? : string;
    data : T;
    firstName : string;
    lastName : string;
}

export interface ConfirmEmail
{
    token: string;
    email: string;
}