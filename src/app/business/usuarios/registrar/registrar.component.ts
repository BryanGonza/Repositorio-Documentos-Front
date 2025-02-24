import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { registroUsuario } from '../../../interfaces/Usuario/RegistroUsuario';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css'
})
export default class RegistrarComponent {
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;

  private usuarioService = inject(UsuariosService);
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);

  public fromRegistro: FormGroup = this.fromBuild.group({
    numeroIdentidad: ['', Validators.required],
    Usuario: ['', Validators.required],
    NombreUs: ['', Validators.required],
    Contrasena: ['', [Validators.required]],
    confirmarContrasena: ['', [Validators.required]],
    correo: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
  });

  // Método para alternar visibilidad de la contraseña principal
  togglePasswordVisibility(isVisible: boolean) {
    this.showPassword = isVisible;
  }

  // Método para alternar visibilidad de la contraseña de confirmación
  toggleConfirmPasswordVisibility(isVisible: boolean) {
    this.showConfirmPassword = isVisible;
  }

  // Verifica si las contraseñas coinciden
  get contrasenasCoinciden(): boolean {
    const contrasena = this.fromRegistro.get('Contrasena')?.value;
    const confirmarContrasena = this.fromRegistro.get('confirmarContrasena')?.value;
    return contrasena && confirmarContrasena && contrasena === confirmarContrasena;
  }

  validarContrasenas() {
    if (this.contrasenasCoinciden) {
      this.fromRegistro.get('correo')?.enable();
    } else {
      this.fromRegistro.get('correo')?.disable();
    }
  }

  registrarse() {
    if (this.fromRegistro.invalid || !this.contrasenasCoinciden) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Verifica que los campos estén completos y que las contraseñas coincidan.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const objeto: registroUsuario = {
      NUM_IDENTIDAD: this.fromRegistro.value.numeroIdentidad,
      USUARIO: this.fromRegistro.value.Usuario.toUpperCase(),
      NOMBRE_USUARIO: this.fromRegistro.value.NombreUs.toUpperCase(),
      CONTRASEÑA: this.fromRegistro.value.Contrasena.toUpperCase(),
      CORREO_ELECTRONICO: this.fromRegistro.value.correo.toUpperCase(),
    };

    this.usuarioService.registro(objeto).subscribe({
      next: (data) => {
        if (data.msg.includes("creado correctamente")) {
          Swal.fire({
            icon: 'success',
            title: 'Usuario creado',
            text: data.msg,
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.route.navigate(['usuarios']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: data.msg,
            confirmButtonColor: '#d33',
          });
        }
      },
      error: (error) => {
        console.error('Ocurrió un error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error en el servidor',
          text: error.error?.msg || 'Error desconocido al registrar usuario.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  volver() {
    this.route.navigate(['usuarios']);
  }
}
