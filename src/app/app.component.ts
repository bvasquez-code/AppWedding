import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ExcelService } from './service/ExcelService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy,AfterViewInit  {
  
  title = 'app_invitacion_boda';
  isMobile: boolean = false;
  private targetDate = new Date('2024-09-21T16:00:00').getTime();
  private subscription: Subscription = new Subscription;
  public countdown: string = "";

  public days: string = "";
  public hours: string = "";
  public minutes: string = "";
  public seconds: string = "";
  public jsonData: any;
  private id: string | null = '';
  private jsonDataDB: any[] = [];
  public invitationJson : any;
  public invitado : string = "";
  public numInvitados : string = "";


  constructor(
    private excelService : ExcelService,
    private route: ActivatedRoute,
    private el: ElementRef, 
    private renderer: Renderer2
  ) {

  }
  ngAfterViewInit(): void {
    
    this.addVisibleEfect("#img-church");
    this.addVisibleEfect("#img-cheers");
    this.addVisibleEfect("#img-asistencia");
    this.addVisibleEfect("#img-vestido");
    this.addVisibleEfect("#img-camisa");
  }

  addVisibleEfect(htmlselect : string){

    const imagenBoda = this.el.nativeElement.querySelector(htmlselect);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(imagenBoda, 'visible');
        } else {
          this.renderer.removeClass(imagenBoda, 'visible');
        }
      });
    });

    observer.observe(imagenBoda);

  }

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

    this.loadExcelFile();
    this.playMusic();
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
    const message = '¡Hola! soy [nombre]. Confirmo mi asistencia a la boda de Braulio y Claudia para el día 21 de septiembre';
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

  loadExcelFile() {
    this.excelService.readExcelFileFromAssets().subscribe(data => {

      this.route.queryParamMap.subscribe(params => {
        this.id = params.get('id');
      });

      console.log({ id : this.id});
      this.jsonData = data;
      this.parceJson(this.jsonData);

      this.customizeInvitation(this.jsonDataDB,this.id);
      
    }, error => {
      console.error('Error reading Excel file', error);
    });
  }

  parceJson(jsonData : any){

    jsonData.shift();

    for(let item of jsonData){

      let itemJson = {
        invitado	: item[0],
        numInvitados	: item[1],
        codInvitacion	: item[2],
        numCelularConfirmacion : item[3],
        key : item[4],
        aleatorio : item[5]
      };

      this.jsonDataDB.push(itemJson);
    }

    console.log({jsonDataDB : this.jsonDataDB});
  }

  customizeInvitation(jsonDataDB: any[],id : string | null){

    let invitation : any[] = jsonDataDB.filter( e => e.codInvitacion === id);

    // this.invitationJson = invitation;

    if(invitation.length === 1){
      this.invitado = invitation[0].invitado;
      this.numInvitados = invitation[0].numInvitados;
    }
    if(invitation.length === 2){
      this.invitado = `${invitation[0].invitado} y ${invitation[1].invitado}`;
      this.numInvitados = invitation.reduce((acc, item) => acc + item.numInvitados, 0);
    }
    if(invitation.length > 2){
      this.invitado = invitation.reduce((acc, item) => acc + item.invitado, "");
      this.numInvitados = invitation.reduce((acc, item) => acc + item.numInvitados, 0);
    }

    console.log({ invitation : invitation });

  }

  onCopySuccess() {
    alert('Texto copiado exitosamente!');
  }

  onCopyError() {
    alert('Error al copiar el texto.');
  }


  playMusic(): void {
    const audio = this.renderer.createElement('audio');
    this.renderer.setAttribute(audio, 'src', './assets/music/audio.mp3');
    this.renderer.setAttribute(audio, 'autoplay', 'true');
    this.renderer.setAttribute(audio, 'loop', 'true');
    this.renderer.appendChild(document.body, audio);
  }

}
