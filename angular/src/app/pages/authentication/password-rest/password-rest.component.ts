import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-password-rest',
  standalone: true,
  imports: [SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './password-rest.component.html',
  styleUrl: './password-rest.component.scss'
})
export class PasswordRestComponent {
  form : FormGroup;  
  authService = inject(AuthService);

  constructor(private fb:FormBuilder){
    this.form = this.fb.group({
      password : new FormControl('',[Validators.required]),
      newPassword : new FormControl('',[Validators.required]),
      newPassword2 : new FormControl('',[Validators.required])
    })
  }
  
  onSubmit(){
    if(this.form.valid){
      console.log(this.form.value);
      this.authService.login(this.form.value).subscribe({
        next: (response) =>{
          console.log(response);
        }
      })
    }
  }
}
