import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { SharedService } from '../../../shared.service';
import { Router } from '@angular/router';
import { ResetContrasenaCode } from '../../../interfaces/Usuario/RecuperacionContrasena';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rest-contrasena',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './rest-contrasena.component.html',
  styleUrl: './rest-contrasena.component.css'
})
export default class RestContrasenaComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private usuarioService = inject(UsuariosService);
  private sharedService = inject(SharedService); 
  public route = inject(Router);
  public correo: string = '';

  public fromResetContrasena: FormGroup = this.formBuilder.group({
    codigo: ['', Validators.required],
    ContraNueva: ['', Validators.required]
  });

  ngOnInit() {
    // Obtener el correo desde SharedService
    this.sharedService.correo$.subscribe(correo => {
      this.correo = correo;
      console.log('Correo recibido en RestContrasena:', correo); // Para debug
    });
  }

  ResetContrasena() {
    if (this.fromResetContrasena.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos requeridos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const objeto: ResetContrasenaCode = {
      correoE: this.correo,
      code: this.fromResetContrasena.value.codigo,
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
