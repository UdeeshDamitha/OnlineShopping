import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { error } from 'console';
import { ConfirmEmail } from 'src/app/core/model/common.model';
import { AuthService } from 'src/app/core/services/auth.service';
//import { SharedService } from 'src/app/shared/shared.service';


@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export default class ConfirmEmailComponent implements OnInit {
  authService = inject(AuthService);
  success = false;
  errorMesseges : string[]=[];
  successMessege : string[]=[];

  constructor(private authService_:AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
   // private sharedService: SharedService
  ){}
  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe({
      next: (params:any)=>{
        console.log("AAAA",params.get('token'));
        console.log("URLCC",this.authService.confirmEmail);
        const confirmEmail: ConfirmEmail = {
          token : params.get('token'),
          email : params.get('email'),          
        }
     
       this.authService.confirmEmail(confirmEmail).subscribe({
          next:(response:any) => {
            this.success = true;
            console.log('BBB',response.message);
            console.log('CCC',response.value.message);
            this.successMessege = response.value.message;
           // this.sharedService.showNotification(true, response.value.title, response.value.message);
          }, error:error => {this.success = false;
          // this.sharedService.showNotification(false, "Failed", error.error);
           this.errorMesseges = error.error;
           console.log('CCC',error.error);
          }
        })
      }
    })
  }

  resendEmailConfirmationLink() {
    this.router.navigateByUrl('/auth/send-email/resend-email-confirmation-link');
  }
}
