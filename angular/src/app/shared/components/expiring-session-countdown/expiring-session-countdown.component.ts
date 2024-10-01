import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription, interval } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-expiring-session-countdown',
  templateUrl: './expiring-session-countdown.component.html',
  styleUrls: ['./expiring-session-countdown.component.css']
})

@Component({
  selector: 'app-expiring-session-countdown',
  standalone: true,
  imports: [],
  templateUrl: './expiring-session-countdown.component.html',
  styleUrl: './expiring-session-countdown.component.scss'
})
export class ExpiringSessionCountdownComponent implements OnInit, OnDestroy {
  modalRef?: BsModalRef;
  targetTime: number = 120 // Countdown time in seconds
  remainingTime: number = this.targetTime;
  displayTime: string = this.formatTime(this.remainingTime);
  countdownSubscription: Subscription | undefined;

  constructor(private sharedSerivce: SharedService,
    private authService: AuthService,
    private bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    this.startCountDown();
  }
  ngOnDestroy(): void {
    this.stopCountdown();
  }
  startCountDown() {
    this.countdownSubscription = interval(1000).subscribe(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.displayTime = this.formatTime(this.remainingTime);
      } else {
        this.stopCountdown();
        this.sharedSerivce.showNotification(false, 'Logged Out', 'You have been logged out due to inactivity');
        this.logout();
      }
    })
  }

  private stopCountdown() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  logout() {
    this.bsModalRef.hide();
    this.authService.logout();
  }

  resumeSession() {
    this.bsModalRef.hide();
    this.authService.refreshUserToken();
  }

}
