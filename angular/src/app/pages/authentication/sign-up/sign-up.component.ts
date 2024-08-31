// angular import
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  providers : [HttpClient],
  imports: [SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export default class SignUpComponent {
  form : FormGroup;
  authService = inject(AuthService);
  router_ = inject(Router);

  constructor(private fb:FormBuilder){
    this.form = this.fb.group({
      firstname : new FormControl('',[Validators.required]),
      lastname : new FormControl('',[Validators.required]),
      email : new FormControl('',[Validators.required, Validators.email]),
      password : new FormControl('',[Validators.required])
    })
  }

  onSubmit(){
    if(this.form.valid){
      console.log(this.form.value);

      this.authService.register(this.form.value).subscribe({
        next: (response: any) =>{
          console.log(response);
          this.router_.navigate(["auth/signin"]);
        },
        error: (error: any) => {
          console.error('Registration failed', error);
        }
      })
      /*  this.authservice.register2(this.form.value).subscribe({
          next: (response: any) => {
            console.log(response);
            this.router_.navigate(["auth/signin"]);
          },
          error: (error: any) => {
            console.error('Registration failed', error);
          }
        });*/
    }
  }
}
