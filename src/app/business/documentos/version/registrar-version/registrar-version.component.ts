import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VersionService } from '../../../../services/version.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RegistroVersion } from '../../../../interfaces/Documentos/Version/RegistroVersion';
import { jwtDecode } from 'jwt-decode';
import { Usuarios } from '../../../../interfaces/Usuario/Usuarios';
import { UsuariosService } from '../../../../services/usuarios.service';


@Component({
  selector: 'app-registrar-version',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-version.component.html',
  styleUrls: ['./registrar-version.component.css']
})
export class RegistrarVersionComponent implements OnInit {
  private versionService = inject(VersionService);
  private usuariosService = inject(UsuariosService)
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.fromBuild.group({
    ID_USUARIO: ['', Validators.required],
    nombre: ['', Validators.required],
    cambios: [false]
  });

  public listUsuarios: Usuarios[] = [];

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.usuariosget().subscribe({
      next: (data) => {
        this.listUsuarios = data.ListUsuarios || [];
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      }
    });
  }

  registrarVersion() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete los campos requeridos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const objeto: RegistroVersion = {
      ID_USUARIO: this.formRegistro.value.ID_USUARIO,
      NOMBRE: this.formRegistro.value.nombre.toUpperCase(),
      CAMBIOS: this.formRegistro.value.cambios,
      FECHA_ACTU: new Date()
    };

    this.versionService.registrarversion(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Versión creada',
          text: data.msg || 'Versión creada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['version']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.error?.msg || 'Ocurrió un error al registrar la versión.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  volver() {
    this.route.navigate(['version']);
  }
}
