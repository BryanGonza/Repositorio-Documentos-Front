import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { lOg } from '../../interfaces/Usuario/Login';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../shared.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export default class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private usuarioService = inject(UsuariosService);
  private sharedService = inject(SharedService);
  private route = inject(Router);
  showPassword: boolean = false; 

  public formLogin: FormGroup = this.formBuilder.group({
    CORREO_ELECTRONICO: ['', [Validators.required, Validators.email]],
    CONTRASEÑA: ['', Validators.required],
    rememberMe: [false], // ✅ Checkbox "Recuérdame"
  });
  ngOnInit() {
    try {
      if (typeof window !== 'undefined' && localStorage) {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
          this.formLogin.patchValue({
            CORREO_ELECTRONICO: rememberedEmail,
            rememberMe: true,
          });
        }
      }
    } catch (error) {
      console.error('Error al acceder a localStorage:', error);
    }
  }

  IniciarSesion() {
    if (this.formLogin.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      return;
    }

    const correoIngresado = this.formLogin.value.CORREO_ELECTRONICO;

    const objeto: lOg = {
      CORREO_ELECTRONICO: correoIngresado,
      CONTRASEÑA: this.formLogin.value.CONTRASEÑA,
    };

    this.usuarioService.login(objeto).subscribe({
      next: (data) => {
        if (data.success === true) {
          if (data.token) {
            localStorage.setItem('token', data.token);
          }

          //  Guardar/eliminar el correo según "Recuérdame"
          try {
            if (typeof window !== 'undefined' && localStorage) {
              if (this.formLogin.value.rememberMe) {
                localStorage.setItem('rememberedEmail', correoIngresado);
              } else {
                localStorage.removeItem('rememberedEmail');
              }
            }
          } catch (error) {
            console.error('Error al guardar/eliminar en localStorage:', error);
          }

          // Almacenar correo electrónico en SharedService
          this.sharedService.setCorreo(correoIngresado);

          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Inicio de sesión exitoso.',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            this.route.navigate(['/dhashboard']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.msg,
            confirmButtonColor: '#d33',
          });
        }
      },

      error: (error) => {
        console.error('Error en inicio de sesión:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.msg || 'Error desconocido al iniciar sesión',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  recuperarContrasena() {
    this.route.navigate(['/recuperarContra']);
  }
}
