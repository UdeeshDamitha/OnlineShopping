import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation-messages.component.html',
  styleUrl: './validation-messages.component.css'
})
export class ValidationMessagesComponent {
 @Input() errorMessages: string[] | undefined;
}
