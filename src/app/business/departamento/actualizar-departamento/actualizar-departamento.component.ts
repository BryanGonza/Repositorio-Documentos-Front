import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartamentoService } from '../../../services/departamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { FacultadService } from '../../../services/facultad.service';

@Component({
  selector: 'app-actualizar-departamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-departamento.component.html',
  styleUrls: ['./actualizar-departamento.component.css']
})
export default class ActualizarDepartamentoComponent implements OnInit {
  private route = inject(Router);
  private departamentoService = inject(DepartamentoService);
  private facultadService = inject(FacultadService);
  private activatedRoute = inject(ActivatedRoute);

  // Listado de facultades para el select
  lista_facultad: any[] = [];
  facultadesCargadas: boolean = false;

  // Datos del formulario
  idDepartamento: number = 0;
  idFacultad: number = 0;
  nombre: string = '';
  estado: boolean = true;
  cargando: boolean = false;

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        this.idDepartamento = this.validarNumeroPositivo(params['iddepa']);
        this.idFacultad = this.validarNumeroPositivo(params['idfacu']);
        this.nombre = this.validarTexto(params['nombre'] || '');

        const estadoParam = params['estado'];
        this.estado = this.validarEstado(estadoParam);

        this.cargarFacultades();
      },
      error: (error) => {
        console.error('Error al cargar parámetros de ruta:', error);
        this.mostrarError('Error al cargar los datos del departamento');
      }
    });
  }

  cargarFacultades(): void {
    this.facultadService.facultadget().subscribe({
      next: (res) => {
        if (res && Array.isArray(res.Lista_Facultad)) {
          this.lista_facultad = res.Lista_Facultad;
        } else {
          this.lista_facultad = [];
          console.warn('Estructura de respuesta de facultades inesperada:', res);
        }
        this.facultadesCargadas = true;
      },
      error: (err) => {
        console.error('Error al obtener facultades:', err);
        this.facultadesCargadas = true;
        this.mostrarAdvertencia('Se cargó la página pero no se pudieron obtener las facultades.');
      }
    });
  }

  actualizarDepartamento(): void {
    if (!this.validarFormulario()) return;

    this.cargando = true;

    this.departamentoService.actualizardepartamento(
      this.idDepartamento,
      this.idFacultad,
      this.nombre.trim(),
      this.estado,
    ).subscribe({
      next: (res) => {
        this.cargando = false;
        this.mostrarExito(res.message || 'Departamento actualizado correctamente.')
          .then(() => this.route.navigate(['departamento']));
      },
      error: (err) => {
        this.cargando = false;
        const mensajeError = this.obtenerMensajeError(err);
        this.mostrarError(mensajeError);
      }
    });
  }

  validarFormulario(): boolean {
    // Validación de ID de departamento
    if (!this.idDepartamento || this.idDepartamento <= 0) {
      this.mostrarError('No se ha especificado un departamento válido a actualizar.');
      return false;
    }

    // Validación de facultad seleccionada
    if (!this.idFacultad || this.idFacultad <= 0) {
      this.mostrarError('Debe seleccionar una facultad válida.');
      return false;
    }

    // Validación de nombre
    const nombreLimpio = this.nombre.trim();
    if (!nombreLimpio) {
      this.mostrarError('El nombre del departamento es requerido.');
      return false;
    }

    if (nombreLimpio.length < 3) {
      this.mostrarError('El nombre del departamento debe tener al menos 3 caracteres.');
      return false;
    }

    if (nombreLimpio.length > 100) {
      this.mostrarError('El nombre del departamento no puede exceder los 100 caracteres.');
      return false;
    }

    // Validación de caracteres no permitidos en nombres
    if (!this.validarCaracteresNombre(nombreLimpio)) {
      this.mostrarError('El nombre contiene caracteres no permitidos.');
      return false;
    }

    return true;
  }

  // Métodos de validación auxiliares
  private validarNumeroPositivo(valor: any): number {
    const numero = Number(valor);
    return isNaN(numero) || numero <= 0 ? 0 : numero;
  }

  private validarTexto(texto: string): string {
    return texto || '';
  }

  private validarEstado(estadoParam: any): boolean {
    if (typeof estadoParam === 'string') {
      return estadoParam.toUpperCase() === 'ACTIVO';
    }
    return Boolean(estadoParam);
  }

  private validarCaracteresNombre(nombre: string): boolean {
    // Permite letras, números, espacios y algunos caracteres especiales comunes
    const regex = /^[a-zA-ZÀ-ÿ0-9\s\-\_\.\(\)ñÑ]+$/;
    return regex.test(nombre);
  }

  // Métodos para mostrar alertas (compatibles con Linux)
  private mostrarExito(mensaje: string): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: 'Actualización exitosa',
      text: mensaje,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    });
  }

  private mostrarError(mensaje: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    });
  }

  private mostrarAdvertencia(mensaje: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: mensaje,
      confirmButtonColor: '#ffbb33',
      confirmButtonText: 'Entendido'
    });
  }

  private obtenerMensajeError(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'Ocurrió un error al actualizar el departamento.';
  }

  volver(): void {
    this.route.navigate(['departamento']);
  }
}