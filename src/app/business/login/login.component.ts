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

          //  Guardar/eliminar el correo según "Recuerdame"
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
        
        // Revisar si el error indica que debe cambiar la contraseña
        if (error.error?.msg === 'Debe cambiar su contraseña antes de iniciar sesión') {
          this.solicitarCambioContrasena(this.formLogin.value.CORREO_ELECTRONICO);
          return;
        }
      
        // Mostrar mensaje de error genérico solo si no es el caso anterior
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.msg || 'Error desconocido al iniciar sesión',
          confirmButtonColor: '#d33',
        });
      },
      
    });
  }
  
  solicitarCambioContrasena(correoIngresado: string) {
    Swal.fire({
      title: 'Cambio de contraseña',
      html: `
        <div style="position: relative;">
          <input id="new-password" type="password" class="swal2-input" placeholder="Nueva contraseña">
          <button type="button" id="toggle-new-password" class="toggle-password">
            👁️
          </button>
        </div>
        <div style="position: relative;">
          <input id="confirm-password" type="password" class="swal2-input" placeholder="Confirmar contraseña">
          <button type="button" id="toggle-confirm-password" class="toggle-password">
            👁️
          </button>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Cambiar',
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        const toggleNewPass = document.getElementById('toggle-new-password') as HTMLButtonElement;
        const toggleConfirmPass = document.getElementById('toggle-confirm-password') as HTMLButtonElement;
        const newPasswordInput = document.getElementById('new-password') as HTMLInputElement;
        const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
    
        const toggleVisibility = (input: HTMLInputElement, button: HTMLButtonElement) => {
          if (input.type === 'password') {
            input.type = 'text';
            button.textContent = '🙈';
          } else {
            input.type = 'password';
            button.textContent = '👁️';
          }
        };
    
        toggleNewPass.addEventListener('click', () => toggleVisibility(newPasswordInput, toggleNewPass));
        toggleConfirmPass.addEventListener('click', () => toggleVisibility(confirmPasswordInput, toggleConfirmPass));
      },
      preConfirm: () => {
        const newPassword = (document.getElementById('new-password') as HTMLInputElement).value;
        const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement).value;
        if (!newPassword || !confirmPassword) {
          Swal.showValidationMessage('Debe ingresar y confirmar la nueva contraseña');
          return false;
        } else if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('Las contraseñas no coinciden');
          return false;
        }
        return newPassword;
      },
    }).then((result) => {
      if (!result.isConfirmed || !result.value) {
        Swal.fire('Cancelado', 'No se realizó ningún cambio', 'info');
        return;
      }
    
      const nuevoObjeto = { 
        CORREO_ELECTRONICO: correoIngresado, 
        NUEVA_CONTRASEÑA: result.value 
      };
    
      this.usuarioService.CambiarPrimerContrasena(nuevoObjeto).subscribe({
        next: (response) => {
          if (response.success) {
            Swal.fire('Contraseña actualizada', 'Inicia sesión con tu nueva contraseña', 'success')
              .then(() => {
                this.formLogin.reset();
              });
          } else {
            Swal.fire('Error', response.msg, 'error');
          }
        },
        error: (error) => {
          Swal.fire('Error', error.error?.msg || 'No se pudo cambiar la contraseña', 'error');
        },
      });
    });    
  }

  

  recuperarContrasena() {
    this.route.navigate(['/recuperarContra']);
  }
}
