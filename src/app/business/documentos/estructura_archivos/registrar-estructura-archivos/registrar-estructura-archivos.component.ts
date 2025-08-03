import { Component,inject, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstructuraArchivosService } from '../../../../services/estructura-archivos.service';
import { RegistroEstructuraArchivos } from '../../../../interfaces/Documentos/Estructura_archivos/ResgistroEstructura_archivos';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { DepartamentoService } from '../../../../services/departamento.service';
import { departamento } from '../../../../interfaces/Departamento/Departamento';
import { EstructuraArchivos } from '../../../../interfaces/Documentos/Estructura_archivos/Estructura_archivos';

@Component({
  selector: 'app-registrar-estructura-archivos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-estructura-archivos.component.html',
  styleUrls: ['./registrar-estructura-archivos.component.css']
})
export class RegistrarEstructuraArchivosComponent {
  private estructuraArchivosService = inject(EstructuraArchivosService);
  private departamentoService =inject(DepartamentoService);
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.fromBuild.group({
    idDepartamento: ['', Validators.required],
    nombre: ['', Validators.required],
    ubicacion: ['', Validators.required],
  });

  public listado_departamento: departamento[] = [];

   ngOnInit(): void {
    this.cargarDepartamentos();
  }

  cargarDepartamentos() {
    this.departamentoService.Departamentoget().subscribe({
      next: (data) => {
        this.listado_departamento = data.Listado_Departamentos || [];
      },
      error: (err) => {
        console.error('Error al cargar', err);
      }
    });

  }

  registrarEstructura() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete los campos requeridos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const objeto: RegistroEstructuraArchivos = {
      ID_DEPARTAMENTO: this.formRegistro.value.idDepartamento,
      NOMBRE: this.formRegistro.value.nombre.toUpperCase(),
      UBICACION: this.formRegistro.value.ubicacion.toUpperCase(),
    };

    this.estructuraArchivosService.registrarEstructura(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Versión creada',
          text: data.msg || 'Estructura creada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['/estructura_archivos']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.error?.msg || 'Ocurrió un error al registrar la estructura.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  volver() {
    this.route.navigate(['/estructura_archivos']);
  }
}
