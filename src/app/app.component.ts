import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app_invitacion_boda';

  isMobile: boolean = false;

  constructor() {}

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize() {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    this.isMobile = mediaQuery.matches;
    console.log({ isMobile : this.isMobile });
  }



}
