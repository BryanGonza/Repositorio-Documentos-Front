import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { SharedService } from '../../../shared.service';
import { Router } from '@angular/router';
import { ResetContrasenaCode } from '../../../interfaces/Usuario/RecuperacionContrasena';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';

/**
 * Validador personalizado que compara 'ContraNueva' y 'ConfirmaContraNueva'
 * Si no coinciden, asigna un error 'mismatch' a 'ConfirmaContraNueva'.
 */
function matchingPasswordsValidator(formGroup: FormGroup) {
  const pass1 = formGroup.get('ContraNueva')?.value;
  const pass2 = formGroup.get('ConfirmaContraNueva')?.value;

  if (pass1 === pass2) {
    // Si coinciden, quita cualquier error previo
    formGroup.get('ConfirmaContraNueva')?.setErrors(null);
    return null;
  } else {
    // Si no coinciden, asigna 'mismatch' a ConfirmaContraNueva
    formGroup.get('ConfirmaContraNueva')?.setErrors({ mismatch: true });
    return { mismatch: true };
  }
}

@Component({
  selector: 'app-rest-contrasena',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './rest-contrasena.component.html',
  styleUrls: ['./rest-contrasena.component.css']
})
export default class RestContrasenaComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private usuarioService = inject(UsuariosService);
  private sharedService = inject(SharedService); 
  public route = inject(Router);
  
  public correo: string = '';

  // Se incluye el nuevo campo ConfirmaContraNueva y se aplica el validador 'matchingPasswordsValidator'
  public fromResetContrasena: FormGroup = this.formBuilder.group({
    codigo: ['', Validators.required],
    ContraNueva: ['', Validators.required],
    ConfirmaContraNueva: ['', Validators.required]
  }, {
    validators: [ matchingPasswordsValidator ]
  });

  ngOnInit() {
    // Obtener el correo desde SharedService
    this.sharedService.correo$.subscribe(correo => {
      this.correo = correo;
      console.log('Correo recibido en RestContrasena:', correo);
    });
  }

  ResetContrasena() {
    // Verificamos que sea válido, incluyendo la validación de contraseñas iguales
    if (this.fromResetContrasena.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos requeridos y verifica que las contraseñas coincidan.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    // Preparar objeto para la petición
    const objeto: ResetContrasenaCode = {
      correoE: this.correo,
      code: this.fromResetContrasena.value.codigo,
      // Convertimos la contraseña en mayúsculas según tu lógica original
      newContrasena: this.fromResetContrasena.value.ContraNueva.toUpperCase()
    };

    this.usuarioService.ResetContrasena(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña Actualizada',
          text: data.msg || 'Tu contraseña ha sido restablecida con éxito.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.volver();
        });
      },
      error: (error) => {
        console.error('Ocurrió un error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.msg || 'Error desconocido al restablecer la contraseña.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  volver() {
    this.route.navigate(['login']);
  }
}
