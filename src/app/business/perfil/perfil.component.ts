import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { SharedService } from '../../shared.service';
import { Usuarios } from '../../interfaces/Usuario/Usuarios';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export default class PerfilComponent {
  private route = inject(Router);
  private usuarioService = inject(UsuariosService);
  private sharedService = inject(SharedService);
  public verContrasena = false;
  public verContrasena1 = false;

  public usuario: Usuarios | null = null;
  public mostrarCambioContrasena = false;
  public nuevaContrasena: string = '';
  public confirmarContrasena: string = '';
  public errorMensaje: string = '';
  public mostrarModal = false;

  ngOnInit() {
    const correo = this.sharedService.getCorreo();
    if (correo) {
      this.usuarioService.perfil({ email: correo }).subscribe({
        next: (data) => {
          this.usuario = data;
        },
        error: (err) => {
          console.error('Error al cargar el perfil:', err);
        }
      });
    }
  }
  
  dhash() {
    this.route.navigate(['dhashboard']);
  }

  abrirCambioContrasena() {
    this.mostrarCambioContrasena = true;
  }

  cambiarContrasena() {
    if (!this.nuevaContrasena || !this.confirmarContrasena) {
      this.errorMensaje = 'Ambos campos son obligatorios';
      return;
    }
  
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.errorMensaje = 'Las contraseñas no coinciden';
      return;
    }
  
    if (this.usuario) {
      const objeto = {
        CORREO_ELECTRONICO: this.usuario.CORREO_ELECTRONICO,
        NUEVA_CONTRASEÑA: this.nuevaContrasena
      };
  
      this.usuarioService.Cambiarcontraperfil(objeto).subscribe({
        next: (response) => {
          alert('Contraseña actualizada correctamente.');
          this.nuevaContrasena = '';
          this.confirmarContrasena = '';
          this.errorMensaje = '';
          this.mostrarModal = false;
        },
        error: (err) => {
          console.error('Error al actualizar la contraseña:', err);
        }
      });
    }
  }
  
  
}
