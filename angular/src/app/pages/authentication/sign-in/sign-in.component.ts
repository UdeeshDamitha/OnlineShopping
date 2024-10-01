// angular import
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';


// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export default class SignInComponent {
  form : FormGroup;
  authService = inject(AuthService);
  errorMesseges : string [] = [];
  submitted = false;

  constructor(private fb:FormBuilder){
    this.form = this.fb.group({
      username : new FormControl('',[Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]),
      password : new FormControl('',[Validators.required, Validators.minLength(6),Validators.maxLength(12) ])
    })
  }


  onSubmit(){
    this.submitted = true;
    this.errorMesseges = [];

    if(this.form.valid){
      this.authService.login(this.form.value).subscribe({
        next: (response) =>{
          console.log(response);
          
        },
        error: (error: any) => {
         console.log('Login failed2', error);
          
          this.errorMesseges = error;
        /*  if (error.error.errors) {
            this.errorMesseges = error;
          } else {
           // this.errorMesseges.push(error.error);
          }*/
        }
      })
    }
  }
  resendEmailConfirmationLink(){}
}
