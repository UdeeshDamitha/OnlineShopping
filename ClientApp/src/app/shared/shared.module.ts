import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { ValidationMessagesComponent } from './components/errors/validation-messages/validation-messages.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NotificationComponent } from './components/modals/notification/notification.component';


@NgModule({
  declarations: [],
  imports: [CommonModule, RouterOutlet, RouterModule, ReactiveFormsModule, HttpClientModule, NotFoundComponent, ValidationMessagesComponent,
    ModalModule.forRoot(), NotificationComponent],
  exports: [RouterModule, ReactiveFormsModule, HttpClientModule, NotFoundComponent, ValidationMessagesComponent]
})
export class SharedModule { }
