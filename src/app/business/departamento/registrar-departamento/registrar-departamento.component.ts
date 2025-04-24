import { Component, inject } from '@angular/core';
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
export class RegistrarDepartamentoComponent {
  private DepartamentoService = inject(DepartamentoService);
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);
  private facultadService = inject(FacultadService);
  public listafacu: any[] = [];
  ngOnInit(): void {
    this.facultadService.facultadget().subscribe({
      next: (data) => {
        if (data.Lista_Facultad.length > 0) {
          this.listafacu = data.Lista_Facultad;
        }
      },
      error: (error) => {
        console.error('Error al cargar objetos', error);
      },
    });

  }
  public formRegistro: FormGroup = this.fromBuild.group({
    IDFacu: ['', Validators.required],
    Nombre: ['', Validators.required],
    Estado: [true, Validators.required],
    
  });

  // Método para registrar departamento
  registrarDepartamento() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Verifica que los campos estén completos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const objeto: Registrodepartamento = {
      ID_FACULTAD: this.formRegistro.value.IDFacu,
      NOMBRE: this.formRegistro.value.Nombre,
      ESTADO: this.formRegistro.value.Estado
    };

    this.DepartamentoService.registrardepartamento(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'departamento creada',
          text: data.msg || 'departamento creada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['departamento']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.error?.msg || 'Ocurrió un error al registrar departamento.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  volver() {
    this.route.navigate(['departamento']);
  }
}