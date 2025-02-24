import { Component, inject } from '@angular/core';
import { RecuContracontra } from '../../../interfaces/Usuario/RecuperacionContrasena';
import { UsuariosService } from '../../../services/usuarios.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedService } from '../../../shared.service';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperarcontrasena',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './recuperarcontrasena.component.html',
  styleUrl: './recuperarcontrasena.component.css'
})
export default class RecuperarcontrasenaComponent {

  private usuarioService = inject(UsuariosService);
  private route = inject(Router);
  private sharedService = inject(SharedService); 
  public fromBuild = inject(FormBuilder);

  public fromRCC: FormGroup = this.fromBuild.group({
    correo: ['', [Validators.required, Validators.email]],
  });
  
  recuperaXcorreo() {
    if (this.fromRCC.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, ingresa un correo válido.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      return;
    }

    const correoIngresado = this.fromRCC.value.correo;
    const objeto: RecuContracontra = {
      correoE: correoIngresado
    };

    this.usuarioService.recucontraCorre(objeto).subscribe({
      next: (data) => {
        this.sharedService.setCorreo(correoIngresado);

        Swal.fire({
          icon: 'success',
          title: 'Correo Enviado',
          text: data.msg || 'Se ha enviado un correo con las instrucciones.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.ResetContra();
        });
      },

      error: (error) => {
        console.error('Ocurrió un error:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.msg || 'Error desconocido al recuperar contraseña',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  volver() {
    this.route.navigate(['login']); 
  }

  ResetContra() {
    this.route.navigate(['ResetContrasena']);
  }
}
