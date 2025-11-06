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
  public enviandoFormulario = false;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarFacultades();
  }

  private inicializarFormulario(): void {
    this.formRegistro = this.fb.group({
      IDFacu: ['', [Validators.required, Validators.min(1)]],
      Nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9\s\-\_\.\(\)]+$/),
        ],
      ],
      Estado: [true, Validators.required],
    });
  }

  private cargarFacultades(): void {
    this.facultadService.facultadget().subscribe({
      next: (data) => {
        if (data?.Lista_Facultad && Array.isArray(data.Lista_Facultad)) {
          this.listaFacultades = data.Lista_Facultad.filter(facultad => 
            facultad && facultad.ID_FACULTAD && facultad.NOMBRE
          );
        } else {
          this.listaFacultades = [];
          console.warn('Estructura de respuesta de facultades inesperada:', data);
        }
        this.cargandoFacultades = false;
      },
      error: (error) => {
        this.cargandoFacultades = false;
        console.error('Error al cargar facultades:', error);
        this.mostrarError(
          'Error al cargar facultades',
          'No se pudieron cargar las facultades. Intenta de nuevo.'
        );
      },
    });
  }

  registrarDepartamento(): void {
    if (this.formRegistro.invalid) {
      this.mostrarAdvertencia(
        'Campos incompletos o inválidos',
        'Por favor verifica que todos los campos estén completos y sean válidos.'
      );
      this.formRegistro.markAllAsTouched();
      return;
    }

    if (this.enviandoFormulario) {
      return; // Evitar múltiples envíos
    }

    this.enviandoFormulario = true;

    const objeto: Registrodepartamento = {
      ID_FACULTAD: Number(this.formRegistro.value.IDFacu),
      NOMBRE: this.formRegistro.value.Nombre.trim().toUpperCase(),
      ESTADO: Boolean(this.formRegistro.value.Estado),
    };

    // Validación adicional antes de enviar
    if (!this.validarDatosAntesDeEnviar(objeto)) {
      this.enviandoFormulario = false;
      return;
    }

    this.departamentoService.registrardepartamento(objeto).subscribe({
      next: (data) => {
        this.enviandoFormulario = false;
        this.mostrarExito(
          'Departamento creado',
          data.msg || 'El departamento se registró correctamente.'
        ).then(() => this.router.navigate(['departamento']));
      },
      error: (error) => {
        this.enviandoFormulario = false;
        const mensajeError = this.obtenerMensajeError(error);
        this.mostrarError('Error al registrar', mensajeError);
      },
    });
  }

  private validarDatosAntesDeEnviar(objeto: Registrodepartamento): boolean {
    // Validar ID de facultad
    if (!objeto.ID_FACULTAD || objeto.ID_FACULTAD <= 0) {
      this.mostrarError('Error de validación', 'Debe seleccionar una facultad válida.');
      return false;
    }

    // Validar que la facultad exista en la lista cargada
    const facultadExiste = this.listaFacultades.some(
      facultad => facultad.ID_FACULTAD === objeto.ID_FACULTAD
    );
    
    if (!facultadExiste) {
      this.mostrarError('Error de validación', 'La facultad seleccionada no es válida.');
      return false;
    }

    // Validar nombre
    const nombreLimpio = objeto.NOMBRE.trim();
    if (!nombreLimpio || nombreLimpio.length < 5) {
      this.mostrarError('Error de validación', 'El nombre debe tener al menos 5 caracteres.');
      return false;
    }

    if (nombreLimpio.length > 100) {
      this.mostrarError('Error de validación', 'El nombre no puede exceder los 100 caracteres.');
      return false;
    }

    return true;
  }

  // Métodos auxiliares para mostrar alertas
  private mostrarExito(titulo: string, mensaje: string): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    });
  }

  private mostrarError(titulo: string, mensaje: string): void {
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    });
  }

  private mostrarAdvertencia(titulo: string, mensaje: string): void {
    Swal.fire({
      icon: 'warning',
      title: titulo,
      text: mensaje,
      confirmButtonColor: '#ffbb33',
      confirmButtonText: 'Entendido'
    });
  }

  private obtenerMensajeError(error: any): string {
    if (error.error?.msg) {
      return error.error.msg;
    }
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'Ocurrió un error al registrar el departamento.';
  }

  // Métodos para acceder a los controles del formulario en la plantilla
  get IDFacu() {
    return this.formRegistro.get('IDFacu');
  }

  get Nombre() {
    return this.formRegistro.get('Nombre');
  }

  get Estado() {
    return this.formRegistro.get('Estado');
  }

  volver(): void {
    this.router.navigate(['departamento']);
  }
}