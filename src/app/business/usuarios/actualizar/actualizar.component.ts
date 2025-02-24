import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar.component.html',
  styleUrl: './actualizar.component.css'
})
export default class ActualizarComponent implements OnInit {
  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private usuarioService = inject(UsuariosService);

  userId: number = 0;
  Usuari: string = '';
  Nombre: string = '';
  Correo: string = '';
  mensajeRespuesta: string = '';

  // Datos originales para comparación
  originalUsuari: string = '';
  originalNombre: string = '';
  originalCorreo: string = '';

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.Correo = params['email'] || '';
      if (this.Correo) {
        this.cargarDatosUsuario();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Correo no proporcionado',
          text: 'No se pudo cargar el usuario porque no se recibió un correo válido.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  cargarDatosUsuario() {
    // Objeto con el email a enviar en el body
    const emailUser = {
      email: this.Correo 
    };

    // Llamada al servicio usando el método perfil
    this.usuarioService.perfil(emailUser).subscribe({
      next: (user) => {
        // Asignar todos los datos del usuario, incluyendo el ID
        this.userId = user.ID_USUARIO;  
        this.Usuari = user.USUARIO;
        this.Nombre = user.NOMBRE_USUARIO;
        this.Correo = user.CORREO_ELECTRONICO;

        // Guardar datos originales para comparación
        this.originalUsuari = user.USUARIO;
        this.originalNombre = user.NOMBRE_USUARIO;
        this.originalCorreo = user.CORREO_ELECTRONICO;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar usuario',
          text: err.error?.msg || 'No se pudo obtener la información del usuario.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  actualizarUsuario() {
    // Verificar si hubo cambios reales sin usar checkboxes
    const cambiosRealizados = (
      this.Usuari !== this.originalUsuari ||
      this.Nombre !== this.originalNombre ||
      this.Correo !== this.originalCorreo
    );

    if (!cambiosRealizados) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin cambios',
        text: 'No realizaste ningún cambio real. ¿Deseas regresar a la lista de usuarios o continuar editando?',
        showCancelButton: true,
        confirmButtonText: 'Regresar',
        cancelButtonText: 'Seguir editando',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#f39c12'
      }).then((result) => {
        if (result.isConfirmed) {
          this.route.navigate(['usuarios']);
        }
      });
      return;
    }

    // Crear un objeto con los campos a actualizar
    const datosActualizados: any = {
      ID_USUARIO: this.userId,
      USUARIO: this.Usuari,
      NOMBRE_USUARIO: this.Nombre,
      CORREO_ELECTRONICO: this.Correo
    };

    this.usuarioService.actualizarUsuario(
      datosActualizados.ID_USUARIO,
      datosActualizados.USUARIO,
      datosActualizados.NOMBRE_USUARIO,
      datosActualizados.CORREO_ELECTRONICO
    ).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: res.msg || 'Usuario actualizado correctamente.',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.route.navigate(['usuarios']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.msg || 'Ocurrió un error al actualizar el usuario.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  volver() {
    this.route.navigate(['usuarios']);
  }
}
