// angular import
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonModule } from '@angular/common';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  providers : [HttpClient],
  imports: [SharedModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export default class SignUpComponent {
  form : FormGroup;
  authService = inject(AuthService);
  router_ = inject(Router);
  submitted = false;
  errorMesseges : string[]=[];

  constructor(private fb:FormBuilder){
    this.form = this.fb.group({
      firstname : new FormControl('',[Validators.required]),
      lastname : new FormControl('',[Validators.required]),
      email : new FormControl('',[Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]),
      password : new FormControl('',[Validators.required, Validators.minLength(6),Validators.maxLength(12) ])
    })
  }

 

  onSubmit(){
    this.submitted = true;
    this.errorMesseges = [];

    if(this.form.valid){

      console.log(this.form.value);

      this.authService.register(this.form.value).subscribe({
        next: (response: any) =>{
          console.log(response);
          this.router_.navigate(["auth/signin"]);
        },
        error: (error: any) => {
          console.error('Registration failed', error);
          this.errorMesseges = error.error.value?.message || 'Registration failed. Please try again.';
        }
      })
      
    }
  }
}
