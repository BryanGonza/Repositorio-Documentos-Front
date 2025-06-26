import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-actualizar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar.component.html',
  styleUrl: './actualizar.component.css',
})
export default class ActualizarComponent implements OnInit {
  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private usuarioService = inject(UsuariosService);
  private RolesService = inject(RolesService);
  
  roles: any[] = [];
  rolSeleccionado: number = 0;
  userId: number = 0;
  Usuari: string = '';
  Nombre: string = '';
  Correo: string = '';
  Contrasena: string = '';
  mensajeRespuesta: string = '';
  rol: string = ''; 
  public actualizarContrasena: boolean = false;

  // Datos originales para comparación
  originalUsuari: string = '';
  originalNombre: string = '';
  originalCorreo: string = '';
  originalRol: number = 0;

  ngOnInit() {
    this.cargarRoles();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.Correo = params['email'] || '';
      if (this.Correo) {
        this.cargarDatosUsuario();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Correo no proporcionado',
          text: 'No se pudo cargar el usuario porque no se recibió un correo válido.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  cargarRoles() {
    this.RolesService.rolesget().subscribe({
      next: (data) => {
        this.roles = data.ListRoles;
      },
      error: (err) => {
        console.error("Error al cargar roles", err);
      }
    });
  }

  cargarDatosUsuario() {
    const emailUser = { email: this.Correo };

    this.usuarioService.perfil(emailUser).subscribe({
      next: (user) => {
        this.userId = user.ID_USUARIO;
        this.Usuari = user.USUARIO;
        this.Nombre = user.NOMBRE_USUARIO;
        this.Correo = user.CORREO_ELECTRONICO;
        this.rolSeleccionado = user.ID_ROL;

        // Guardar datos originales para comparación
        this.originalUsuari = user.USUARIO;
        this.originalNombre = user.NOMBRE_USUARIO;
        this.originalCorreo = user.CORREO_ELECTRONICO;
        this.originalRol = user.ID_ROL; 
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar usuario',
          text: err.error?.msg || 'No se pudo obtener la información del usuario.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  // Validación para campos vacíos
  validarCampoVacio(valor: string, campo: string): boolean {
    if (!valor || valor.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Campo vacío',
        text: `El campo ${campo} no puede estar vacío.`,
        confirmButtonColor: '#d33',
      });
      return false;
    }
    return true;
  }

  // Validación para nombre de usuario (no espacios)
  validarUsuario(usuario: string): boolean {
    if (!this.validarCampoVacio(usuario, 'nombre de usuario')) {
      return false;
    }
    
    if (/\s/.test(usuario)) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre de usuario inválido',
        text: 'El nombre de usuario no puede contener espacios.',
        confirmButtonColor: '#d33',
      });
      return false;
    }
    return true;
  }

  // Validación para nombre completo (solo letras y espacios)
  validarNombre(nombre: string): boolean {
    if (!this.validarCampoVacio(nombre, 'nombre completo')) {
      return false;
    }
    
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regex.test(nombre)) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre inválido',
        text: 'El nombre solo puede contener letras y espacios.',
        confirmButtonColor: '#d33',
      });
      return false;
    }
    return true;
  }

  // Validación para correo electrónico
  validarCorreo(correo: string): boolean {
    if (!this.validarCampoVacio(correo, 'correo electrónico')) {
      return false;
    }
    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(correo)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor ingrese un correo electrónico válido.',
        confirmButtonColor: '#d33',
      });
      return false;
    }
    return true;
  }

  // Validación para contraseña (si se está actualizando)
  validarContrasena(contrasena: string): boolean {
    if (this.actualizarContrasena) {
      if (!this.validarCampoVacio(contrasena, 'contraseña')) {
        return false;
      }
      
      if (contrasena.length < 8) {
        Swal.fire({
          icon: 'error',
          title: 'Contraseña muy corta',
          text: 'La contraseña debe tener al menos 8 caracteres.',
          confirmButtonColor: '#d33',
        });
        return false;
      }
    }
    return true;
  }

  actualizarUsuario() {
    // Validar campos antes de continuar
    if (!this.validarUsuario(this.Usuari) || 
        !this.validarNombre(this.Nombre) || 
        !this.validarCorreo(this.Correo) ||
        !this.validarContrasena(this.Contrasena)) {
      return;
    }

    // Verificar si hubo cambios reales
    const cambiosRealizados =
      this.Usuari !== this.originalUsuari ||
      this.Nombre !== this.originalNombre ||
      this.Correo !== this.originalCorreo ||
      this.rolSeleccionado !== Number(this.originalRol) ||
      (this.actualizarContrasena && this.Contrasena);

    if (!cambiosRealizados) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin cambios',
        text: 'No realizaste ningún cambio real. ¿Deseas regresar a la lista de usuarios o continuar editando?',
        showCancelButton: true,
        confirmButtonText: 'Regresar',
        cancelButtonText: 'Seguir editando',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#f39c12',
      }).then((result) => {
        if (result.isConfirmed) {
          this.route.navigate(['usuarios']);
        }
      });
      return;
    }

    // Crear objeto con los campos a actualizar
    const datosActualizados: any = {
      ID_USUARIO: this.userId,
      USUARIO: this.Usuari,
      NOMBRE_USUARIO: this.Nombre,
      CORREO_ELECTRONICO: this.Correo,
      ID_ROL: this.rolSeleccionado 
    };

    // Solo incluir la contraseña si la checkbox está marcada
    if (this.actualizarContrasena && this.Contrasena) {
      datosActualizados.CONTRASEÑA = this.Contrasena;
    }

    // Enviar la actualización
    this.usuarioService
      .actualizarUsuario(
        datosActualizados.ID_USUARIO,
        datosActualizados.USUARIO,
        datosActualizados.NOMBRE_USUARIO,
        datosActualizados.CORREO_ELECTRONICO,
        datosActualizados.CONTRASEÑA,
        datosActualizados.ID_ROL
      )
      .subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Actualización exitosa',
            text: res.msg || 'Usuario actualizado correctamente.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.route.navigate(['usuarios']);
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: err.error?.msg || 'Ocurrió un error al actualizar el usuario.',
            confirmButtonColor: '#d33',
          });
        },
      });
  }

  public showConfirmPassword: boolean = false;
  
  toggleConfirmPasswordVisibility(isVisible: boolean) {
    this.showConfirmPassword = isVisible;
  }

  volver() {
    this.route.navigate(['usuarios']);
  }
}