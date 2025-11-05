import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartamentoService } from '../../../services/departamento.service';
import { Registrodepartamento } from '../../../interfaces/Departamento/RegistroDepartamento';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FacultadService } from '../../../services/facultad.service';

@Component({
  selector: 'app-registrar-departamento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-departamento.component.html',
  styleUrls: ['./registrar-departamento.component.css']
})
export class RegistrarDepartamentoComponent implements OnInit {

  private departamentoService = inject(DepartamentoService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private facultadService = inject(FacultadService);

  public listaFacultades: any[] = [];
  public formRegistro!: FormGroup;
  public cargandoFacultades = true;

  ngOnInit(): void {
    // Cargar facultades disponibles
    this.facultadService.facultadget().subscribe({
      next: (data) => {
        this.listaFacultades = data?.Lista_Facultad ?? [];
        this.cargandoFacultades = false;
      },
      error: (error) => {
        this.cargandoFacultades = false;
        console.error('Error al cargar facultades', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar facultades',
          text: 'No se pudieron cargar las facultades. Intenta de nuevo.',
          confirmButtonColor: '#d33',
        });
      },
    });

    // Inicializar formulario
    this.formRegistro = this.fb.group({
      IDFacu: ['', Validators.required],
      Nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/),
        ],
      ],
      Estado: [true, Validators.required],
    });
  }

  registrarDepartamento(): void {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos o inválidos',
        text: 'Por favor verifica que todos los campos estén completos y sean válidos.',
        confirmButtonColor: '#3085d6',
      });
      this.formRegistro.markAllAsTouched();
      return;
    }

    const objeto: Registrodepartamento = {
      ID_FACULTAD: this.formRegistro.value.IDFacu,
      NOMBRE: this.formRegistro.value.Nombre.trim().toUpperCase(),
      ESTADO: this.formRegistro.value.Estado,
    };

    this.departamentoService.registrardepartamento(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Departamento creado',
          text: data.msg || 'El departamento se registró correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => this.router.navigate(['departamento']));
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.error?.msg || 'Ocurrió un error al registrar el departamento.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver(): void {
    this.router.navigate(['departamento']);
  }
}
