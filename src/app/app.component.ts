import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  title = 'app_invitacion_boda';
  isMobile: boolean = false;
  private targetDate = new Date('2024-09-21T16:00:00').getTime();
  private subscription: Subscription = new Subscription;
  public countdown: string = "";

  public days: string = "";
  public hours: string = "";
  public minutes: string = "";
  public seconds: string = "";

  constructor() {}
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());

    this.subscription = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  checkScreenSize() {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    this.isMobile = mediaQuery.matches;
    console.log({ isMobile : this.isMobile });
  }


  redirectToMapSanAntonio() {
    const url = 'https://www.google.com/maps/place/Basilica+San+Antonio+de+Padua/@-6.7738559,-79.8426107,15z/data=!4m6!3m5!1s0x904cef27b4875673:0x6d358ca45f68786c!8m2!3d-6.7738559!4d-79.8426107!16s%2Fg%2F1hc3pdwj_?entry=ttu';
    window.open(url, '_blank');
  }

  redirectToMapCastilloLuna() {
    const url = 'https://www.google.com/maps/place/Castillo+de+Luna+Recepciones/@-6.7961127,-79.881159,15z/data=!4m6!3m5!1s0x904cef98ebd5daaf:0xc7efc06ac5d36946!8m2!3d-6.7961127!4d-79.881159!16s%2Fg%2F11c1psrrd8?entry=ttu';
    window.open(url, '_blank');
  }

  redirectToWhatsApp() {
    const phoneNumber = '+51968238218';
    const message = '¡Feclicidades! Confirmo mi asistencia a la boda';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.countdown = `${days}días | ${hours}hs | ${minutes}min | ${seconds}seg`;

    this.days = `${days}`;
    this.hours = `${hours}`;
    this.minutes = `${minutes}`;
    this.seconds = `${seconds}`;

    if (distance < 0) {
      this.countdown = 'The event has started!';
      this.subscription.unsubscribe();
    }
  }

}
