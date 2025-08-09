import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { SharedService } from '../../shared.service';
import { Usuarios } from '../../interfaces/Usuario/Usuarios';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepartamentoService } from '../../services/departamento.service';

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
 // para mostrar en la vista
  public departamentoName = '';
  public facultadName = '';

  private departamentoService = inject(DepartamentoService);

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
      this.sharedService.departamento$.subscribe(idDepto => {
      console.log('Header recibe ID de depto:', idDepto);
      if (idDepto > 0) this.loadBreadcrumb(idDepto);
    });

    // 2) Carga inicial por si ya había un valor en localStorage
    const initId = this.sharedService.getDepartamento();
    console.log('Header init ID depto:', initId);
    if (initId > 0) this.loadBreadcrumb(initId);
  }

    private loadBreadcrumb(idDepto: number) {
    this.departamentoService.getDepartamentoFacultad(idDepto)
      .subscribe({
        next: resp => {
          console.log('Respuesta getDepartamentoFacultad:', resp);
          // Adáptalo a la propiedad real de tu API
          const detail = resp.Detalle_Departamento_Facultad
                      || (resp as any).detalle
                      || (resp as any).data;
          this.departamentoName = detail.nombre_departamento;
          this.facultadName    = detail.nombre_facultad;
        },
        error: err => {
          console.error('No pude cargar el breadcrumb:', err);
          this.departamentoName = '';
          this.facultadName    = '';
        }
      });
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
