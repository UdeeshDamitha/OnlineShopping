import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.scss'
})

export default class SendEmailComponent implements OnInit {
emailForm: FormGroup = new FormGroup({});
submitted = false;
mode : string | undefined;
errorMessages: string[] = [];

isUser: boolean | false | undefined;

  constructor(private authService_:AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder, ){}

  ngOnInit(): void {
   /* this.authService_.checkEmail(this.getEmail).subscribe({ 
      next:(response:any) => {
        this.isUser = true;      
      console.log('BBB',response);
     // this.sharedService.showNotification(true, response.value.title, response.value.message);
    }})*/
    const mode = this.activatedRoute.snapshot.paramMap.get('mode');
    if(mode){
      this.mode=mode;
      console.log(this.mode);
      this.initializeForm();
    }
    
    
  }
initializeForm() {
  this.emailForm = this.formBuilder.group({
    email : ['',[Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]]
  })
}

sendEmail(){
  this.submitted = true;
  this.errorMessages = [];
console.log("ssssssssss", this.emailForm.value.email);
  if(this.emailForm.valid && this.mode){
    if(this.mode.includes('resend-email-confirmation-link')){
      
      this.authService_.resendEmailConfirmationLink(this.emailForm.value.email).subscribe({
        next:(response:any)=>{
          this.router.navigateByUrl('auth/signin');
        },
        error: (error: any) => {
          this.errorMessages = error.error.value?.message || 'Email send fail. Please try again.';
        }
      });
      
    }
   
  }
}

cancel(){
  this.router.navigateByUrl("auth/signin")
}
}