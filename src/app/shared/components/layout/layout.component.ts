import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf, NgClass, CommonModule, isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import {jwtDecode} from 'jwt-decode';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FooterComponent, RouterOutlet, NgIf, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export default class LayoutComponent implements OnInit, OnDestroy {
  sidebarVisible: boolean = true;
  private tokenExpiryTimeout: any;
  private tokenWarningTimeout: any;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  toggleSidebar() {
    console.log('toggleSidebar en layout');
    this.sidebarVisible = !this.sidebarVisible;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Decodificar el token para obtener el tiempo de expiración
          interface TokenPayload {
            exp: number;
          }
          const decoded = jwtDecode(token) as TokenPayload;
          const currentTime = Math.floor(Date.now() / 1000);
          const secondsToExpiry = decoded.exp - currentTime;

          // Configurar la notificación 5 minutos antes de la expiración
          if (secondsToExpiry > 300) {
            const timeoutToWarn = (secondsToExpiry - 300) * 1000; // convertir a milisegundos
            this.tokenWarningTimeout = setTimeout(() => {
              Swal.fire({
                icon: 'info',
                title: 'Atención',
                text: 'Su sesión expirará en 5 minutos.',
                confirmButtonText: 'OK'
              });
            }, timeoutToWarn);
          }

          // Configurar el cierre automático de sesión cuando expire el token
          this.tokenExpiryTimeout = setTimeout(() => {
            localStorage.removeItem('token');
            Swal.fire({
              icon: 'info',
              title: 'Sesión expirada',
              text: 'Su sesión ha finalizado.',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/login']);
            });
          }, secondsToExpiry * 1000);
        } catch (error) {
          console.error('Error al decodificar el token:', error);
        }
      }
    }
  }

  ngOnDestroy(): void {
    // Limpiar los timeouts al destruir el componente para evitar posibles fugas
    if (this.tokenExpiryTimeout) {
      clearTimeout(this.tokenExpiryTimeout);
    }
    if (this.tokenWarningTimeout) {
      clearTimeout(this.tokenWarningTimeout);
    }
  }
}
